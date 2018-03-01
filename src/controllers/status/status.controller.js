import _ from 'lodash';
import { Status } from '../../models';
import * as CONSTS from '../../consts';
import { logger } from '../../lib/logger';
import { getPageOption, getPageMetadata } from '../../lib/utils';

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

export async function list(req, res) {
    const pageOption = getPageOption(req);
    const { offset, limit } = pageOption;

    const { source, code, level } = req.query;
    const query = _.pickBy({ source, code, level }, _.identity);

    try {
        const statusList = await Status.find(query)
            .sort({ _id: -1 })
            .limit(limit)
            .skip(offset);

        const count = await Status.count(query);

        return res.status(200).json({
            _metadata: getPageMetadata(pageOption, count),
            statusList: statusList.map((status) => status.toJSON())
        });
    } catch (err) {
        logger.error(`StatusCtrl::list() error`, err);
        return res.status(500).send(err.toString());
    }
}
