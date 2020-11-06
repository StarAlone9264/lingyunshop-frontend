import axios from 'axios'
import QS from 'qs'
import {url_host} from './apiconst'

/*
  @ 创建自定义axios实例
*/
const instance_ax = axios.create({
    baseURL: url_host,
    headers: {
        // 'token': Cookies.get('token')
        // 'token': '123456789'
    },
    timeout: 10000
})

/*
  @ request 请求拦截器=>请求发出前处理
*/
instance_ax.interceptors.request.use(
    config => {
        //动态设置请求头
        // config.headers.token = Cookies.get('token');
        // config.headers.token = '1234567';
        if (config.method === 'post' || config.method === 'put') {
            //post请求时，序列化入参
            config.data = JSON.stringify(config.data);
        }
        return config;
    }, error => {
        // 接口返回失败
        console.log(error.response);
        Promise.reject(error.response);
    }
)

/*
  @ request 响应拦截器=>处理响应数据
*/
instance_ax.interceptors.response.use(
    response => {
        return Promise.resolve(response);
    },
    error => {
        // //请求失败，这个地方可以根据error.response.status统一处理一些界面逻辑，比如status为401未登录,可以进行重定向
        // router.replace({
        //     path: '/login',
        //     query: { redirect: router.currentRoute.fullPath }
        //    });
        return Promise.reject(error.response);
    }
)

export default instance_ax;