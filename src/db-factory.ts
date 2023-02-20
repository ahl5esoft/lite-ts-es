import { ClientOptions } from '@elastic/elasticsearch';
import { DbFactoryBase } from 'lite-ts-db';

import { DbRepository } from './db-repository';
import { DbPool } from './db-pool';
import { UnitOfWork } from './unit-of-work';

/**
 * es数据库工厂
 */
export class ElasticSearchDbFactory extends DbFactoryBase {
    /**
     * es池
     */
    private m_Pool: DbPool;

    /**
     * 构造函数
     * 
     * @param cfg 配置
     * @param project 项目
     */
    public constructor(
        cfg: ClientOptions,
        project: string,
    ) {
        super();

        this.m_Pool = new DbPool(cfg, project);
    }

    /**
     * 创建数据库仓库
     * 
     * @param model 模型
     * @param uow 工作单元
     */
    public db<T>(model: new () => T, uow?: UnitOfWork) {
        return new DbRepository(this, model, this.m_Pool, uow);
    }

    /**
     * 创建工作单元
     */
    public uow() {
        return new UnitOfWork(this.m_Pool);
    }
}