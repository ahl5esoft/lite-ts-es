import { IDbQueryOption } from './i-db-query-option';
import { IDbQuery } from './i-db-query';
import { ElasticSearchPool } from './pool';

export class ElasticSearchDbQuery<T> implements IDbQuery<T> {
    public constructor(
        private m_Pool: ElasticSearchPool,
        private m_Model: new () => T
    ) { }

    public async count(where?: any) {
        const res = await this.m_Pool.client.count({
            body: where,
            index: await this.m_Pool.getIndex(this.m_Model)
        });
        return res.body.count || 0;
    }

    public async toArray(v?: Partial<IDbQueryOption<any>>) {
        v ??= {};
        v.order ??= [];
        v.orderByDesc ??= [];

        const sorts = [];
        for (const r of v.order)
            sorts.push([r, 'asc']);
        for (const r of v.orderByDesc)
            sorts.push([r, 'desc']);

        const res = await this.m_Pool.client.search({
            from: v.skip || 0,
            index: await this.m_Pool.getIndex(this.m_Model),
            body: v.where,
            size: v.take,
            sort: sorts,
        });
        return res.body.hits.hits.map(r => r._source as T);
    }
}