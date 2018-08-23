import _ from 'lodash';
import * as CONSTS from '../../consts';
import { logger } from '../../lib/logger';
import { ObjectID, MongoClient } from 'mongodb';
import errors from '../../lib/errors';
import User, { RoleType } from '../../models/user';
import config from '../../config';



//先写死 treedata , 稍后重构时从数据库中获取
const treeData = [{
    name: '银行核心系统',
    level: 0,
    data: [],
    children: [
        {
            name: '应用系统',
            level: 1,
            data: [],
            children: [
                {
                    name: '业务日志',
                    level: 2,
                    hosts: [],
                    children: []
                },
            ],
        }, {
            name: '负载均衡器',
            level: 1,
            data: [],
            children: [
                {
                    name: 'Nginx',
                    level: 2,
                    hosts: [],
                },
                {
                    name: 'Apache',
                    level: 2,
                    hosts: [],
                },
            ],
        },
        {
            name: '中间件',
            level: 1,
            data: [],
            children: [
                {
                    name: 'Tuxedo',
                    level: 2,
                    data: [],
                    hosts: [],
                },
                {
                    name: 'WebLogic',
                    level: 2,
                    data: [],
                    hosts: [],
                },
                {
                    name: 'JBOSS',
                    level: 2,
                    data: [],
                    hosts: [],
                },
                {
                    name: 'Tomcat',
                    level: 2,
                    data: [],
                    hosts: [],
                },

            ],
        },
        {
            name: '数据库',
            level: 1,
            data: [],
            children: [
                {
                    name: 'Oracle',
                    level: 2,
                    data: [],
                    hosts: [],
                },
                {
                    name: 'MySQL',
                    level: 2,
                    data: [],
                    hosts: [],
                },

            ],
        },
        {
            name: '操作系统',
            level: 1,
            data: [],
            children: [
                {
                    name: 'AIX',
                    level: 2,
                    data: [],
                    hosts: [],
                },
                {
                    name: 'Linux',
                    level: 2,
                    data: [],
                    hosts: [],
                },

            ],
        },
        {
            name: '网络',
            level: 1,
            data: [],
            children: [
                {
                    name: 'NPM',
                    level: 2,
                    data: [],
                    hosts: [],
                },
                {
                    name: 'SNMP',
                    level: 2,
                    data: [],
                    hosts: [],
                },

            ],
        },
    ],
}]

const metaTreeData = treeData[0]

// rs or mongos connection should work directly with url
// https://docs.mongodb.com/manual/reference/connection-string/
const connect = MongoClient.connect(config.mongoURL);

/**
 * 创建结构
 * @param {*} req 
 * @param {*} res 
 */
export async function create(req, res) {
    try {
        const connection = await connect;
        const user = await User.findOne({ _id: req.session.userId });
        req.body.createdAt = req.body.updatedAt = new Date()

        const result = await connection.db('prophet-server').collection(CONSTS.STRUCTURE_COLLECTION).insertOne(Object.assign(req.body, {
            owner: user.id,
        }));
        if (result.insertedCount === 1) {
            return res.status(200).json(result.ops[0]);
        }

        return res.status(500).send(JSON.stringify(errors.DATA_NOT_INSERTED));
    }
    catch (err) {
        logger.error(`Failed to create structure. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

/**
 * 获取结构列表
 * @param {*} req 
 * @param {*} res 
 */
export async function structrueList(req, res) {
    const user = await User.findOne({ _id: req.session.userId });
    try {
        const connection = await connect;
        const data = {}
        if (user.role === RoleType.DEFAULT) {
            data.owner = user.id;
        }
        const structureList = await connection.db('prophet-server').collection(CONSTS.STRUCTURE_COLLECTION).find(data).sort({ createdAt: 1 }).toArray();
        return res.status(200).json(structureList);
    }
    catch (err) {
        logger.error(`Failed to find structures. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}
/**
 * 根据ID获取单个结构
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {*} id 
 */
export async function getStructureById(req, res, next, id) {
    try {
        const connection = await connect;
        const data = await connection.db('prophet-server').collection(CONSTS.STRUCTURE_COLLECTION).findOne({
            _id: new ObjectID(id),
        })
        if (data !== undefined && data != null) {
            req.data = data;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.DATA_NOT_FOUND));
    }
    catch (err) {
        logger.error(`Failed to find structure. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

export function read(req, res) {
    return res.status(200).json(req.data);
}
/**
 * 根据ID更新结构
 * @param {*} req 
 * @param {*} res 
 */
export async function update(req, res) {
    try {
        const { body } = req;
        body._id = new ObjectID(body._id)
        body.createdAt = new Date(body.createdAt)
        body.updatedAt = new Date()
        const connection = await connect;
        const result = await connection.db('prophet-server').collection(CONSTS.STRUCTURE_COLLECTION).replaceOne({ _id: req.data._id }, body);
        if (result.modifiedCount === 1 || result.matchedCount === 1) {
            return res.status(200).json(result.ops[0]);
        }

        return res.status(400).end(JSON.stringify(errors.DATA_NOT_FOUND));
    }
    catch (err) {
        logger.error(`Failed to update structure. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}
/**
 * 根据ID删除结构
 * @param {*} req 
 * @param {*} res 
 */
export async function remove(req, res) {
    try {
        const connection = await connect;
        const result = await connection.db('prophet-server').collection(CONSTS.STRUCTURE_COLLECTION).deleteOne({ _id: req.data._id });
        if (result.deletedCount === 1) {
            return res.status(200).end();
        }

        return res.status(400).end(JSON.stringify(errors.DATA_NOT_FOUND));
    }
    catch (err) {
        logger.error(`Failed to delete structure. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

/**
 * 获取"元树"
 * @param {*} req 
 * @param {*} res 
 */
export async function structrueMetaData(req, res) {
    try {

        res.status(200).json(metaTreeData)

    }
    catch (err) {
        logger.error(`Failed to fetch meta structure info. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}