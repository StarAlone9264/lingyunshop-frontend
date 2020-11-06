import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index.vue'),
        meta: {title: '首页',auth: true}
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search.vue'),
        meta: {title: '商品搜索',auth: true}
    }
]
const router = new Router({
    mode: 'history',
    routes,
})
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
export default router

