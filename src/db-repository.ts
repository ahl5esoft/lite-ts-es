import { ElasticSearchDbQuery } from './db-query';
import { IDbFactory } from './i-db-factory';
import { IDbRepository } from './i-db-repository';
import { ElasticSearchPool } from './pool';
import { ElasticSearchUnitOfWork } from './unit-of-work';

type regiterAction = (model: Function, entry: any) => void;

/**
 * es数据仓库
 */
export class ElasticSearchDbRepository<T> implements IDbRepository<T> {
    /**
     * 是否有事务
     */
    private m_IsTx = true;

    /**
     * 工作单元
     */
    protected get uow() {
        if (!this.m_Uow) {
            this.m_Uow = this.m_DbFactory.uow() as ElasticSearchUnitOfWork;
            this.m_IsTx = false;
        }

        return this.m_Uow;
    }

    /**
     * 构造函数
     * 
     * @param m_Pool 池
     * @param dbFactory 数据库工厂
     * @param uow 工作单元
     * @param model 模型
     */
    public constructor(
        private m_Pool: ElasticSearchPool,
        private m_DbFactory: IDbFactory,
        private m_Uow: ElasticSearchUnitOfWork,
        private m_Model: new () => T
    ) { }

    /**
     * 新增
     * 
     * @param entry 实体
     */
    public async add(entry: T) {
        await this.exec(this.uow.registerAdd, entry);
    }

    /**
     * 删除
     * 
     * @param entry 实体
     */
    public async remove(entry: T) {
        await this.exec(this.uow.registerRemove, entry);
    }

    /**
     * 更新
     * 
     * @param entry 实体
     */
    public async save(entry: T) {
        await this.exec(this.uow.registerSave, entry);
    }

    /**
     * 创建查询对象
     */
    public query() {
        return new ElasticSearchDbQuery(this.m_Pool, this.m_Model);
    }

    /**
     * 执行方法, 如果不存在事务则直接提交
     * 
     * @param action 方法
     * @param entry 实体
     */
    private async exec(action: regiterAction, entry: any) {
        action.bind(this.uow)(this.m_Model, entry);
        if (this.m_IsTx)
            return;

        await this.uow.commit();
    }
}