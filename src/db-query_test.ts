import { Client } from '@elastic/elasticsearch';
import { deepStrictEqual, strictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { ElasticSearchDbQuery as Self } from './db-query';
import { ElasticSearchPool } from './pool';

class TestModel {
    public id: string;
    public name: string;
}

describe('src/db-query.ts', () => {
    describe('.count(where?: any)', () => {
        it('ok', async () => {
            const clientMock = new Mock<Client>();
            const elasticSearchPoolMock = new Mock<ElasticSearchPool>({
                get client() {
                    return clientMock.actual;
                }
            });

            const expectCount = 1;
            clientMock.expectReturn(
                r => r.count(mockAny),
                {
                    body: {
                        count: expectCount
                    }
                }
            );

            elasticSearchPoolMock.expectReturn(
                r => r.getIndex(TestModel),
                null
            );

            const self = new Self(elasticSearchPoolMock.actual, TestModel);
            const count = await self.count();
            strictEqual(count, expectCount);
        });
    });

    describe('.toArray(v?: Partial<IDbQueryOption<any>>)', () => {
        it('ok', async () => {
            const clientMock = new Mock<Client>();
            const elasticSearchPoolMock = new Mock<ElasticSearchPool>({
                get client() {
                    return clientMock.actual;
                }
            });

            clientMock.expectReturn(
                r => r.search(mockAny),
                {
                    body: {
                        hits: {
                            hits: [
                                {
                                    _source: {
                                        id: "1",
                                        name: "name-1"
                                    }
                                },
                                {
                                    _source: {
                                        id: "2",
                                        name: "name-2"
                                    }
                                }
                            ]
                        }
                    }
                }
            );

            elasticSearchPoolMock.expectReturn(
                r => r.getIndex(TestModel),
                null
            );

            const self = new Self(elasticSearchPoolMock.actual, TestModel);
            const data = await self.toArray();
            deepStrictEqual(data, [
                {
                    id: "1",
                    name: "name-1"
                },
                {
                    id: "2",
                    name: "name-2"
                }
            ]);
        });
    });
});