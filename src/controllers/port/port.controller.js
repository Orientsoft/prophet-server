import Promise from 'bluebird';
import { Port } from '../../models';
import * as CONSTS from '../../consts';
import { errors } from '../../lib/errors';

export function portById(req, rex, next, id) {
    return Port.findById(id).then((port) => {
        if (port) {
            req.port = port;
            next();
        } else {
            return res.status(400).send(JSON.stringify(errors.PORT_NOT_FOUND));
        }
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
}

export function read(req, res) {
    return res.status(200).json(req.port.toJSON());
}

export function update(req, res) {
    const { port, body } = req;
    const { name, type } = body;

    let namePromise = Promise.resolve();
    if (name !== undefined && name != null && name != '') {
        namePromise = Port.find({
            name
        }).then((existedPort) => {
            if (!existedPort) {
                port.set({ name });
                return Promise.resolve();
            }

            return Promise.reject(new Error(errors.PORT_NAME_EXISTED));
        });
    }

    if (type !== undefined && type != null) {
        port.set({ type });
    }

    return namePromise.then(() => {
        return port.save();
    }).then((updatedPort) => {
        return res.status(200).json(updatedPort.toJSON());
    }).catch((err) => {
        return res.status(500).send(err.toString());
    });
}

export function remove(req, res) {
    return req.port.remove().then(() => {
        return res.status(200).end();
    }).catch((err) => {
        return res.status(500).send(err.toString());
    });
}

export function create(req, res) {
    return Port.find({
        name: req.body.name
    }).then((existedPort) => {
        if (!existedPort) {
            return Port.create({
                name: req.body.name,
                type: req.body.type || CONSTS.PORT_TYPE.REDIS_PUBSUB
            });
        } else {
            return Promise.reject(errors.PORT_NAME_EXISTED);
        }
    })
    .then((port) => {
        return res.status(200).json(port);
    }).catch((err) => {
        return res.status(500).send(err.toString());
    });
}

export function list(req, res) {
    const page = Number(req.query.page) || 0;
    const pageSize = Math.min(CONSTS.MIN_PAGE_SIZE,
        Math.max(CONSTS.MAX_PAGE_SIZE,
        Number(req.query.pageSize) || CONSTS.DEFAULT_PAGE_SIZE)
    );

    const { source, code, level } = req.query;
    // TODO : check param

    return Status.find({
        source,
        code,
        level
    })
    .sort({ ts: -1 })
    .limit(pageSize)
    .skip(page * pageSize)
    .then((statusList) => {
        return res.status(200).json(statusList);
    })
    .catch((err) => {
        return res.status(500).send(err.toSTring());
    });
}
