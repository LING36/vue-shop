/**
 * 基于axios封装的请求模块
 * 安装：npm i axios
 */
// 引入
import axios from 'axios'

// 创建一个axios实例，说白了就是复制了一个axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/' // 请求的基础路径

    // 定义后端返回的原始数据处理
    // 参数data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
    // transformResponse: [function (data) {
    //     // axios 默认在内部使用 JSON.parse 来转换处理原始数据

    //     // 后端返回的数据可能不是 JSON 格式字符串
    //     // 如果不是的话，那么 JSONbig.parse 调用就会报错
    //     // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    //     try {
    //         // 如果转换成功
    //         return JSONbig.parse(data)
    //     } catch (err) {
    //         // 如果转换失败
    //         return data
    //     }
    // }]
})

// 导出请求方法
export default request
// 谁要使用谁就加载 request 模块
// import request from 'request.js'