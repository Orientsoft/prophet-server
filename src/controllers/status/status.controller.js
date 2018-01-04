import { Status } from '../../models';
import * as CONSTS from '../../consts';

export function create(req, res) {
    return Status.create({
        source: req.body.source,
        code: req.body.code || CONSTS.STATUS_CODE.HEART_BEAT,
        level: req.body.level || CONSTS.STATUS_LEVEL.DEBUG,
        content: req.body.content || ''
    }).then((status) => {
        return res.status(200).json(status.toJSON());
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
        return res.status(200).json(statusList.map((status) => { return status.toJSON(); }));
    })
    .catch((err) => {
        return res.status(500).send(err.toSTring());
    });
}
