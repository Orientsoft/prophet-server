import Promise from 'bluebird';
import { Flow } from '../../models';
import * as CONSTS from '../../consts';
import { errors } from '../../lib/errors';

export function flowById(req, rex, next, id) {
    return Flow.findById(id).then((flow) => {
        if (flow) {
            req.flow = flow;
            next();
        } else {
            return res.status(400).send(JSON.stringify(errors.FLOW_NOT_FOUND));
        }
    }).catch((err) => {
        res.status(500).send(err.toString());
    });
}

export function read(req, res) {
    return res.status(200).json(req.flow.toJSON());
}

export function update(req, res) {
    const { flow, body } = req;
    const { name } = body;

    let namePromise = Promise.resolve();
    if (name !== undefined && name != null && name != '') {
        namePromise = Flow.find({ name }).then((existedFlow) => {
            if (!existedFlow) {
                flow.set({ name });
                return Promise.resolve();
            }

            return Promise.reject(new Error(errors.FLOW_NAME_EXISTED));
        });
    }

    return namePromise.then(() => {
        return port.save();
    }).then((updatedPort) => {
        return res.status(200).json(updatedPort.toJSON());
    }).catch((err) => {
        return res.status(500).send(err.toString());
    });;
}

export function remove(req, res) {
    return req.flow.remove().then(() => {
        return res.status(200).end();
    }).catch((err) => {
        return res.status(500).send(err.toString());
    });
}

export function create(req, res) {
    return Flow.find({
        name: req.body.name
    }).then((existedFlow) => {
        if (!existedFlow) {
            return Flow.create({
                name: req.body.name,
                tasks: req.body.tasks || []
            });
        } else {
            return Promise.reject(errors.FLOW_NAME_EXISTED);
        }
    })
    .then((flow) => {
        return res.status(200).json(flow);
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

    const { name } = req.query;
    // TODO : check param

    return Status.find({
        name
    })
    .sort({ ts: -1 })
    .limit(pageSize)
    .skip(page * pageSize)
    .then((flows) => {
        return res.status(200).json(flows);
    })
    .catch((err) => {
        return res.status(500).send(err.toSTring());
    });
}
