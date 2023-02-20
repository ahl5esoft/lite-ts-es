import { IUnitOfWork } from './i-unit-of-work';
import { ElasticSearchPool } from './pool';

/**
 * 操作项
 */
interface IOperationItem {
    /**
     * 实体
     */
    entry: any;
    /**
     * 模型
     */
    model: Function;
    /**
     * 操作
     */
    op: 'delete' | 'index' | 'update';
}

/**
 * es工作单元
 */
export class ElasticSearchUnitOfWork implements IUnitOfWork {
    /**
     * 提交后函数
     */
    private m_AfterAction: { [key: string]: () => Promise<void>; } = {};

    /**
     * 项数组
     */
    private m_Items: IOperationItem[] = [];

    /**
     * 构造函数
     * 
     * @param m_Pool 池
     */
    public constructor(
        private m_Pool: ElasticSearchPool
    ) { }

    /**
     * 注册新增
     * 
     * @param model 模型
     * @param entry 
     */
    public registerAdd(model: Function, entry: any) {
        this.m_Items.push({
            entry: entry,
            model: model,
            op: 'index',
        });
    }

    /**
     * 注册提交后函数
     * 
     * @param action 函数
     * @param key 键
     */
    public registerAfter(action: () => Promise<void>, key?: string) {
        key ??= `key-${Object.keys(this.m_AfterAction).length}`;
        this.m_AfterAction[key] = action;
    }

    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerRemove(model: Function, entry: any) {
        this.m_Items.push({
            entry: entry,
            model: model,
            op: 'delete',
        });
    }

    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerSave(model: Function, entry: any) {
        this.m_Items.push({
            entry: entry,
            model: model,
            op: 'update',
        });
    }

    /**
     * 提交
     */
    public async commit() {
        try {
            const operations = [];
            for (const r of this.m_Items) {
                const index = await this.m_Pool.getIndex(r.model);
                const opEntry = {
                    _id: r.entry.id,
                    _index: index,
                };
                if (r.op == 'index') {
                    operations.push({
                        [r.op]: opEntry
                    }, r.entry);
                } else if (r.op == 'delete') {
                    operations.push({
                        [r.op]: opEntry
                    });
                } else {
                    operations.push({
                        delete: opEntry
                    }, {
                        index: opEntry
                    }, r.entry);
                }
            }
            this.m_Items = [];

            await this.m_Pool.client.bulk({
                body: operations,
                refresh: true
            }, {
                ignore: [400]
            });
        } finally {
            const tasks = Object.values(this.m_AfterAction).map(r => {
                return r();
            });
            await Promise.all(tasks);
        }
    }
}