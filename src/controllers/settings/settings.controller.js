import _ from 'lodash';
import { logger } from '../../lib/logger';
import errors from '../../lib/errors';

//先写死，以后从数据库中获取
const menu_data = [
  {
    id: '1',
    icon: 'dashboard',
    name: '系统拓扑',
    route: '/dashboard',
  },
  {
    id: '2',
    name: '单数据查询',
    icon: 'to-top',
    route: '/singlequery',
  },
  {
    id: '3',
    name: '系统查询',
    icon: 'share-alt',
    route: '/systemquery',
  },
  {
    id: '4',
    name: '数据源设置',
    icon: 'fork',
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
    name: '系统设置',
    icon: 'tool',
    route: '/settings',
  },
]

/**
 * 获取配置菜单
 * @param {*} req 
 * @param {*} res 
 */
export async function menuList(req, res) {
  try {
   
    res.status(200).json(menu_data)

  }
  catch(err) {
    logger.error(`Failed to fetch menu info. ${err.toString()}`);
    return res.status(500).send(err.toString());
  }
}