/**
 * 用户相关请求模块
 * */
import request from '@/utils/request'

// 用户登录
export const login = data => {
    return request({
        method: 'POST', // 请求方式
        url: 'login', // 请求路径（接口路径）
        // data用来设置 POST 请求头
        data // 请求参数
    })
}