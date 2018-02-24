import _ from 'lodash';
import Promise from 'bluebird';
import { Port } from '../../models';
import * as CONSTS from '../../consts';
import errors from '../../lib/errors';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

export function portById(req, res, next, id) {
    return Port.findById(id).then((port) => {
        if (port) {
            req.port = port;
            next();
        } else {
            return res.status(400).send(JSON.stringify(errors.PORT_NOT_FOUND));
        }
    }).catch((err) => {
        logger.error(`PortCtrl::portById() error`, err);
        res.status(500).send(err.toString());
    });
}

export function read(req, res) {
    return res.status(200).json(req.port.toJSON());
}

export async function update(req, res) {
    const { port, body } = req;
    const { name, type } = body;

    try {
        if (name !== undefined && name != null && name != port.name) {
            const existedPort = await Port.findOne({ name });
            if (existedPort) {
                return res.status(400).send(JSON.stringify(errors.PORT_NAME_EXISTED));
            }

            port.name = name;
        }

        if (type !== undefined && type != null) {
            port.type = type;
        }

        const updatedPort = await port.save();

        return res.status(200).json(updatedPort.toJSON());
    } catch (err) {
        logger.error(`PortCtrl::update() error`, err);
        return res.status(500).send(err.toString());
    }
}

export function remove(req, res) {
    return req.port.remove().then(() => {
        return res.status(200).end();
    }).catch((err) => {
        logger.error(`PortCtrl::remove() error`, err);
        return res.status(500).send(err.toString());
    });
}

export function create(req, res) {
    return Port.find({
        name: req.body.name
    }).then((existedPort) => {
        if (existedPort.length === 0) {
            return Port.create({
                name: req.body.name,
                type: req.body.type || CONSTS.PORT_TYPES.REDIS_CHANNEL
            });
        }

        return Promise.reject(JSON.stringify(errors.PORT_NAME_EXISTED));
    })
    .then((port) => {
        return res.status(200).json(port);
    }).catch((err) => {
        logger.error(`PortCtrl::create() error`, err);
        return res.status(500).send(err.toString());
    });
}

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { offset, limit } = pageOption;

    const { type } = req.query;
    const query = _.pickBy({ type }, _.identity);

    // TODO : check param

    try {
        const ports = await Port.find(query)
            .sort({ ts: -1 })
            .limit(limit)
            .skip(offset);

        const count = await Port.count(query);

        return res.status(200).json({
            _metadata: getPageMetadata(pageOption, count),
            ports
        });
    } catch (err) {
        logger.error(`PortCtrl::list() error`, err);
        return res.status(500).send(err.toSTring());
    }
}
