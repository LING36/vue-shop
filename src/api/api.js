/**
 * api请求模块
 * */
import request from '@/utils/request'

// 登录-----------------------------------

// 1、用户登录
export const login = data => {
  return request({
    method: 'POST', // 请求方式
    url: 'login', // 请求路径（接口路径）
    // data用来设置 POST 请求头
    data // 请求参数
  })
}

// 权限管理---------------------------------------

// 1、左侧菜单
export const menus = () => {
  return request({
    method: 'GET', // 请求方式
    url: 'menus' // 请求路径（接口路径）
    // data用来设置 POST 请求头
    // data // 请求参数
  })
}

// 用户管理---------------------------------------

// 1、用户数据列表
export const users = params => {
  return request({
    method: 'GET', // 请求方式
    url: 'users', // 请求路径（接口路径）
    // data用来设置 POST 请求头
    params // 请求参数
  })
}

// 2、修改用户状态
export const putState = (id, type) => {
  return request({
    method: 'PUT', // 请求方式
    url: `users/${id}/state/${type}` // 请求路径（接口路径）
    // data用来设置 POST 请求头
    // params // 请求参数
  })
}

// 3、添加用户
export const addUser = data => {
  return request({
    method: 'POST', // 请求方式
    url: 'users', // 请求路径（接口路径）
    data
  })
}

// 4、根据 ID 查询用户信息
export const userInfo = id => {
  return request({
    method: 'GET', // 请求方式
    url: `users/${id}` // 请求路径（接口路径）
  })
}

// 5、编辑用户提交
export const editUserInfo = data => {
  return request({
    method: 'PUT', // 请求方式
    url: `users/${data.id}`, // 请求路径（接口路径）
    data
  })
}

// 5、删除单个用户
export const deleteUser = id => {
  return request({
    method: 'DELETE', // 请求方式
    url: `users/${id}` // 请求路径（接口路径）
  })
}
