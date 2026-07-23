import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/caifu' } as any,
  {
    path: '/caifu',
    name: 'caifu',
    component: () => import('../views/CaifuView.vue'),
    meta: { title: '财富分析', icon: '💰' }
  },
  {
    path: '/ernv',
    name: 'ernv',
    component: () => import('../views/ErnvView.vue'),
    meta: { title: '子女运势', icon: '👶' }
  },
  {
    path: '/jiankang',
    name: 'jiankang',
    component: () => import('../views/JiankangView.vue'),
    meta: { title: '健康分析', icon: '🏥' }
  },
  {
    path: '/liuqin',
    name: 'liuqin',
    component: () => import('../views/LiuqinView.vue'),
    meta: { title: '六亲关系', icon: '👨‍👩‍👧' }
  },
  {
    path: '/qinggan',
    name: 'qinggan',
    component: () => import('../views/QingganView.vue'),
    meta: { title: '婚姻分析', icon: '💑' }
  },
  {
    path: '/shiye',
    name: 'shiye',
    component: () => import('../views/ShiyeView.vue'),
    meta: { title: '职场命理', icon: '💼' }
  },
  {
    path: '/xingge',
    name: 'xingge',
    component: () => import('../views/XinggeView.vue'),
    meta: { title: '性格分析', icon: '🧠' }
  },
  {
    path: '/xueli',
    name: 'xueli',
    component: () => import('../views/XueliView.vue'),
    meta: { title: '学业测评', icon: '📚' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
