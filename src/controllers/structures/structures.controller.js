import _ from 'lodash';
import { logger } from '../../lib/logger';
import errors from '../../lib/errors';



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
          children: [
            {
              name: 'tploader',
              level: 3,
              children: [{
                name: '192.168.1.100',
                level: 4
              },{
                name: '192.168.1.101',
                level: 4
              },{
                name: '192.168.1.101',
                level: 4
              }]
            }
          ]
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

/**
 * 获取结构列表
 * @param {*} req 
 * @param {*} res 
 */
export async function structrueList(req, res) {
  try {
   
    res.status(200).json(treeData)

  }
  catch(err) {
    logger.error(`Failed to fetch structures info. ${err.toString()}`);
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
  catch(err) {
    logger.error(`Failed to fetch meta structure info. ${err.toString()}`);
    return res.status(500).send(err.toString());
  }
}