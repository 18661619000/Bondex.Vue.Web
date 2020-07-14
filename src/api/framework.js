import request from '@/utils/request'

const frameworkApiBase = 'http://frameworkapi.bondex.com.cn:8000/Api/'

const frameworkApi = {
  user: {
    getUserByEmail: frameworkApiBase + 'User/GetUserByEmail'
  }
}

/**
 * 根据邮箱获取操作信息
 * parameter: {
 *     email: ''
 * }
 * @param parameter
 * @returns {*}
 */
export function getUserByEmail (email) {
  return request({
    url: frameworkApi.user.getUserByEmail,
    params: { email: email },
    method: 'get'
  })
}
