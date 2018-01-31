import _ from 'lodash';
import * as CONSTS from '../../consts';
import { logger } from '../../lib/logger';
// import { ObjectID, MongoClient } from 'mongodb';
import errors from '../../lib/errors';
import config from '../../config';
import qs from 'qs'

//如下数据暂时写死, 以后重构时，从数据库获取
const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
  DEFAULT: {
    visit: ['1', '2', '3'],     //这里的数字，和前端 router id 匹配
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    role: EnumRoleType.DEVELOPER,
  },
}
const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: userPermission.ADMIN,
  }, {
    id: 1,
    username: 'guest',
    password: 'guest',
    permissions: userPermission.DEFAULT,
  }
] 
/**
 * 用户登陆
 * @param {*} req 
 * @param {*} res 
 */
export async function login(req, res) {
  try {
    
    const { username, password } = req.body
    const user = adminUsers.filter(item => item.username === username)

    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie(CONSTS.USER_COOKIE_TOKEN_KEY, JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      })
      res.json({ success: true, message: 'Ok' })
    } else {
      res.status(400).end()
    }

  }
  catch(err) {
      logger.error(`Failed to login. ${err.toString()}`);
      return res.status(500).send(err.toString());
  }
}

/**
 * 获取登陆用户信息
 * @param {*} req 
 * @param {*} res 
 */
export async function info(req, res) {
  try {
    
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    const user = {}
    if (!cookies[CONSTS.USER_COOKIE_TOKEN_KEY]) {
      res.status(200).send({ message: 'Not Login' })
      return
    }
    const token = JSON.parse(cookies[CONSTS.USER_COOKIE_TOKEN_KEY])
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.filter(_ => _.id === token.id)
      if (userItem.length > 0) {
        user.permissions = userItem[0].permissions
        user.username = userItem[0].username
        user.id = userItem[0].id
      }
    }
    response.user = user
    return res.json(response);

  }
  catch(err) {
      logger.error(`Failed to fetch user info. ${err.toString()}`);
      return res.status(500).send(err.toString());
  }
}

/**
 * 用户登出
 * @param {*} req 
 * @param {*} res 
 */
export async function logout(req, res) {
  try {
    
    res.clearCookie(CONSTS.USER_COOKIE_TOKEN_KEY)
    res.status(200).end()

  }
  catch(err) {
      logger.error(`Failed to logout. ${err.toString()}`);
      return res.status(500).send(err.toString());
  }
}
