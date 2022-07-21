import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('../layout/index.vue'),
        children: [
            {
                path: 'home',
                component: () => import('../views/home/index.vue'),
                hidden: true,
                meta: { title: '首页'}
            },
            {
                path: 'about',
                component: () => import('@/vue/views/about/index.vue'),
                hidden: true,
                meta: {
                    title: '关于'
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;