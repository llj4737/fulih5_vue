import axios from "./index";

/**
 * 登录
 * @param {*} data 
 */
export const login = data => (
  axios({ url: '/api/user/login', data, method: 'post' })
)
/**
 * 注册
 * @param {*} data 
 */
export const register = data => (
  axios({ url: '/api/user/register', data, method: 'post' })
)
/**
 * 获取任务
 * @param {*} url 
 */
export const getTask = url => (
  axios({ url })
)
/**
 * 完成任务
 * @param {*} data 
 */
export const finishTask = data => (
  axios({ url: '/api/task/finishTask', data, method: 'post' })
)
/**
 * 抽奖信息
 * @param {*} url 
 */
export const lottery = url => (
  axios({ url })
)
/**
 * 完成抽奖
 * @param {*} data 
 */
export const finishLottery = data => (
  axios({ url: '/api/task/finishLottery', data, method: 'post' })
)