import { Client } from '@elastic/elasticsearch';
import { deepStrictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { DbPool } from './db-pool';
import { UnitOfWork as Self } from './unit-of-work';

class TestModel {
    public id: string;
    public name: string;
}

describe('src/unit-of-work.ts', () => {
    describe('.registerAdd(model: Function, entry: any)', () => {
        it('ok', async () => {
            const self = new Self(null);
            self.registerAdd(TestModel, {
                id: '1',
                name: 'name-1'
            });
            deepStrictEqual(Reflect.get(self, 'm_Items'), [{
                entry: {
                    id: '1',
                    name: 'name-1'
                },
                model: TestModel,
                op: 'index'
            }]);
        });
    });

    describe('.registerRemove(model: Function, entry: any)', () => {
        it('ok', async () => {
            const self = new Self(null);
            self.registerRemove(TestModel, {
                id: '1',
                name: 'name-1'
            });
            deepStrictEqual(Reflect.get(self, 'm_Items'), [{
                entry: {
                    id: '1',
                    name: 'name-1'
                },
                model: TestModel,
                op: 'delete'
            }]);
        });
    });

    describe('.registerSave(model: Function, entry: any)', () => {
        it('ok', async () => {
            const self = new Self(null);
            self.registerSave(TestModel, {
                id: '1',
                name: 'name-1'
            });
            deepStrictEqual(Reflect.get(self, 'm_Items'), [{
                entry: {
                    id: '1',
                    name: 'name-1'
                },
                model: TestModel,
                op: 'update'
            }]);
        });
    });

    describe('.commit()', () => {
        it('ok', async () => {
            const clientMock = new Mock<Client>();
            clientMock.expectReturn(
                r => r.bulk(mockAny, { ignore: [400] }),
                null
            );

            const elasticSearchPoolMock = new Mock<DbPool>({
                get client() {
                    return clientMock.actual;
                }
            });
            elasticSearchPoolMock.expectReturn(
                r => r.getIndex(TestModel),
                'testmodel'
            );

            const self = new Self(elasticSearchPoolMock.actual);
            self.registerAdd(TestModel, {
                id: '1',
                name: 'name-1'
            });

            await self.commit();
        });
    });
});