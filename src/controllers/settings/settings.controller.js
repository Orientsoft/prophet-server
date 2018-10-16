import _ from 'lodash';
import { logger } from '../../lib/logger';
import errors from '../../lib/errors';
import config from '../../config';
import * as CONSTS from '../../consts';
import { ObjectID, MongoClient } from 'mongodb';
import User, { RoleType } from '../../models/user';

//先写死，以后从数据库中获取
const menu_data = [
    {
        id: '1',
        icon: 'dashboard',
        name: '系统拓扑',
        route: '/dashboard',
    },
    // {
    //   id: '2',
    //   name: '单数据查询',
    //   icon: 'to-top',
    //   route: '/singlequery',
    // },
    {
        id: '3',
        name: '系统查询',
        icon: 'bar-chart',
        // route: '/systemquery',
    },
    {
        id: '4',
        name: '数据源设置',
        icon: 'database',
        route: '/singleSource',
    },
    {
        id: '5',
        name: '指标设置',
        icon: 'setting',
        route: '/metric',
    },
    {
        id: '6',
        name: '告警设置',
        icon: 'warning',
    },
    {
        id: '7',
        name: '系统设置',
        icon: 'tool',
        route: '/settings',
    },
    {
        id: '8',
        bpid: '6',
        mpid: '6',
        name: '通道',
        icon: 'pause-circle-o',
        route: '/ports',
    },
    {
        id: '9',
        bpid: '6',
        mpid: '6',
        name: '任务',
        icon: 'profile',
        route: '/tasks',
    },
    {
        id: '10',
        bpid: '6',
        mpid: '6',
        name: '流程',
        icon: 'sync',
        route: '/flows',
    },
]

const connect = MongoClient.connect(config.mongoURL);

/**
 * 获取配置菜单
 * @param {*} req 
 * @param {*} res 
 */
export async function menuList(req, res) {
    try {
        const sysQueryMenuId = '3'
        const connection = await connect
        const structureList = await connection.db('prophet-server').collection(CONSTS.STRUCTURE_COLLECTION).find({}).sort({ createdAt: 1 }).toArray()
        const user = await User.findOne({ _id: req.session.userId });

        if (structureList && structureList.length > 0) {
            let startId = parseInt((menu_data[menu_data.length - 1]).id, 10) + 1
            const sysQueryChildMenus = structureList.map((item) => {
                if (user.role === RoleType.DEFAULT && item.owner !== user.id) {
                    return null;
                }
                return { id: startId++, bpid: sysQueryMenuId, mpid: sysQueryMenuId, name: item.name, icon: 'eye-o', route: `/systemquery/${item._id}` };
            }).filter(item => item);
            // console.log(menu_data.concat(sysQueryChildMenus))
            res.status(200).json(menu_data.concat(sysQueryChildMenus));
        } else {
            res.status(200).json(menu_data);
        }
    } catch (err) {
        logger.error(`Failed to fetch menu info. ${err.toString()}`);
        return res.status(500).send(err.toString());
    }
}
