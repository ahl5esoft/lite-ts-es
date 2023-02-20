import { IDbQuery } from './i-db-query';

export interface IDbRepository<T> {
    /**
     * 新增
     * 
     * @param entry 实体
     */
    add(entry: T): Promise<void>;

    /**
     * 删除
     * 
     * @param entry 实体
     */
    remove(entry: T): Promise<void>;

    /**
     * 更新
     * 
     * @param entry 实体
     */
    save(entry: T): Promise<void>;

    /**
     * 创建查询对象
     */
    query(): IDbQuery<T>;
}