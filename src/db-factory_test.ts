import { notStrictEqual } from 'assert';

import { ElasticSearchDbFactory as Self } from './db-factory';

class TestModel { }

describe('src/db-factory.ts', () => {
    describe('.db<T>(model: new () => T, uow?: ElasticSearchUnitOfWork)', () => {
        it('ok', async () => {
            const self = new Self(null, 'test');
            const db = self.db(TestModel);
            notStrictEqual(db, undefined);
        });
    });

    describe('.uow()', () => {
        it('ok', async () => {
            const self = new Self(null, 'test');
            const uow = self.uow();
            notStrictEqual(uow, undefined);
        });
    });
});