import { DbFactoryBase } from './db-factory-base';
import { ElasticSearchDbQuery } from './db-query';
import { DbRepositoryBase } from './db-repository-base';
import { ElasticSearchPool } from './pool';
import { UnitOfWorkRepositoryBase } from './unit-of-work-repository-base';

/**
 * es数据仓库
 */
export class ElasticSearchDbRepository<T> extends DbRepositoryBase<T> {
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
        dbFactory: DbFactoryBase,
        uow: UnitOfWorkRepositoryBase,
        model: new () => T
    ) {
        super(dbFactory, model, uow);
    }

    /**
     * 创建查询对象
     */
    public query() {
        return new ElasticSearchDbQuery(this.m_Pool, this.model);
    }
}