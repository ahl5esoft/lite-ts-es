import { ClientOptions } from '@elastic/elasticsearch';
import { strictEqual } from 'assert';

import { DbPool as Self } from './db-pool';

const cfg: ClientOptions = {
    node: 'http://localhost:9200',
};

class TestModel {
    public id: string;
    public name: string;
}

describe('src/pool.ts', () => {
    describe('.getIndex(model: Function)', () => {
        it('ok', async () => {
            const project = 'lite-ts-es';
            const self = new Self(cfg, project);
            const index = await self.getIndex(TestModel);
            strictEqual(index, `${project}.${TestModel.name.toLowerCase()}`);
        });
    });
});