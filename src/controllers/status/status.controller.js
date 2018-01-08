import _ from 'lodash';
import { Status } from '../../models';
import * as CONSTS from '../../consts';
import { logger } from '../../lib/logger';

export function create(req, res) {
    return Status.create({
        source: req.body.source,
        code: req.body.code || CONSTS.STATUS_CODE.HEART_BEAT,
        level: req.body.level || CONSTS.STATUS_LEVEL.DEBUG,
        content: req.body.content || ''
    }).then((status) => {
        return res.status(200).json(status.toJSON());
    }).catch((err) => {
        logger.error(`StatusCtrl::create() error`, err);
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
    const query = _.pickBy({ source, code, level }, _.identity);
    // TODO : check param

    return Status.find(query)
    .sort({ ts: -1 })
    .limit(pageSize)
    .skip(page * pageSize)
    .then((statusList) => {
        console.log(statusList)
        return res.status(200).json(statusList);
    })
    .catch((err) => {
        logger.error(`StatusCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    });
}
