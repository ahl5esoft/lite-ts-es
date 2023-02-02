# ElasticSearch DbFactory

![Version](https://img.shields.io/badge/version-7.0.0-green.svg)

v7.x 分支支持 elasticsearch 7.10.0 版本

## 安装

```
npm install lite-ts-es@7.0.0
```

### Node.js 支持

Node.js 需要 `v14` 版本以上

## 使用

```typescript
import { ElasticSearchDbFactory } from 'lite-ts-es';

class TestModel {
    public id: string;
    public name: string;
}

async function main() {
    const dbFactory = new ElasticSearchDbFactory({
        node: 'http://localhost:9200'
    }, 'project-name');

    // 添加数据
    await dbFactory.db(TestModel).add({
        id: 'id-1',
        name: 'name 1'
    });

    // 更新数据
    await dbFactory.db(TestModel).save({
        id: 'id-1',
        name: 'name 1 save'
    });

    // 删除数据
    await dbFactory.db(TestModel).remove({
        id: 'id-1',
    } as TestModel);

    // 查询数据
    await dbFactory.db(TestModel).query().toArray({
        where: {
            query: {
                match: {
                    name: 'name'
                }
            }
        },
        order: ['id'], // 根据 id 正序
        orderByDesc: ['id'], // 根据 id 倒序
        skip: 0, // 跳过多少条数据, 默认为 0 
        take: 100, // 获取多少条数据, 默认为 elasticsearch 的默认值
    });
}
```
