import request from './axiosconfig'
export function getRequest(uri, params) {
    return request({
        url: uri,
        method: 'get',
        header: ("ACCESS-CONTROL-ALLOW-ORIGIN:*"),
        params: params
    })
}

export function postRequest(uri, params) {
    return request({
        url: uri,
        method: 'post',
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        data: params
    })
}

export function deleteRequest(uri, params) {
    return request({
        url: uri,
        method: 'delete',
        params: params
    })
}

export function putRequest(uri, params) {
    return request({
        url: uri,
        method: 'put',
        data: params
    })
}