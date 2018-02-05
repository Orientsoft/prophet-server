import _ from 'lodash';
import * as CONSTS from '../../consts';
import { logger } from '../../lib/logger';
import { ObjectID, MongoClient } from 'mongodb';
import errors from '../../lib/errors';

import config from '../../config';

// rs or mongos connection should work directly with url
// https://docs.mongodb.com/manual/reference/connection-string/
const connect = MongoClient.connect(config.mongoURL);

export async function create(req, res) {
    try {
        const connection = await connect;
        const result = await connection.db('prophet-server').collection(CONSTS.DATA_COLLECTION).insertOne(req.body);
        if (result.insertedCount === 1) {
            return res.status(200).json(result.ops[0]);
        }
        
        return res.status(500).send(JSON.stringify(errors.DATA_NOT_INSERTED));
    }
    catch(err) {
        logger.error(`Failed to create data. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

export async function list(req, res) {
    // no need to support paging

    const { type, structure } = req.query;
    const query = _.pickBy({ type, structure }, _.identity);

    try {
        const connection = await connect;
        const dataList = await connection.db('prophet-server').collection(CONSTS.DATA_COLLECTION).find(query).toArray();
        return res.status(200).json(dataList);
    }
    catch(err) {
        logger.error(`Failed to find data. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

export async function dataById(req, res, next, id) {
    try {
        const connection = await connect;
        const data = await connection.db('prophet-server').collection(CONSTS.DATA_COLLECTION).findOne({ _id: new ObjectID(id) })
        if (data !== undefined && data != null) {
            req.data = data;
            return next();
        }

        return res.status(400).send(JSON.stringify(errors.DATA_NOT_FOUND));
    }
    catch(err) {
        logger.error(`Failed to find data. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

export function read(req, res) {
    return res.status(200).json(req.data);
}

export async function update(req, res) {
    try {
        const { body } = req;
        body._id = new ObjectID(body._id)
        const connection = await connect;
        const result = await connection.db('prophet-server').collection(CONSTS.DATA_COLLECTION).replaceOne({_id: req.data._id}, body);
        if (result.modifiedCount === 1 || result.matchedCount === 1) {
            return res.status(200).json(result.ops[0]);
        }

        return res.status(400).end(JSON.stringify(errors.DATA_NOT_FOUND));
    }
    catch(err) {
        logger.error(`Failed to update data. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}

export async function remove(req, res) {
    try {
        const connection = await connect;
        const result = await connection.db('prophet-server').collection(CONSTS.DATA_COLLECTION).deleteOne({_id: req.data._id});
        if (result.deletedCount === 1) {
            return res.status(200).end();
        }
    
        return res.status(400).end(JSON.stringify(errors.DATA_NOT_FOUND));
    }
    catch(err) {
        logger.error(`Failed to delete data. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}
