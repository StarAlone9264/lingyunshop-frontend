import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/views/Index.vue'),
        meta: {title: '首页',auth: true}
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home.vue'),
        meta: {title: '首页',auth: true}
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue'),
        meta: {title: '登陆'}
    },
    {
        path: '/commodity/brand',
        name: 'brand',
        component: () => import('@/views/commodity/brand.vue'),
        meta: {title: '品牌',auth: true}
    },
    {
        path: '/commodity/specification',
        name: 'specification',
        component: () => import('@/views/commodity/specification.vue'),
        meta: {title: '规格管理',auth: true}
    },
    {
        path: '/commodity/type_template',
        name: 'type_template',
        component: () => import('@/views/commodity/type_template.vue'),
        meta: {title: '模板管理',auth: true}
    },
    {
        path: '/commodity/item_cat',
        name: 'item_cat',
        component: () => import('@/views/commodity/item_cat.vue'),
        meta: {title: '商品分类管理',auth: true}
    },
    {
        path: '/seller/add',
        name: 'add',
        component: () => import('@/views/seller/add.vue'),
        meta: {title: '商家入驻',auth: true}
    },
    {
        path: '/seller/list',
        name: 'list',
        component: () => import('@/views/seller/list.vue'),
        meta: {title: '商家管理',auth: true}
    },
    {
        path: '/seller/review',
        name: 'review',
        component: () => import('@/views/seller/review.vue'),
        meta: {title: '商家审核',auth: true}
    },
]
const router = new Router({
    mode: 'history',
    routes,
})
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (to.matched.some(m => m.meta.auth)) {
        if (window.localStorage.isLogin === '1') {
            next()
        } else{
            next({path: '/login'})
            Vue.prototype.$message.warning('检测到您还未登录,请登录后操作！')
        }
    } else {
        next()
    }
})
export default router

