/*
 * @Author: Mr.Mao
 * @Date: 2021-05-18 15:08:30
 * @LastEditTime: 2021-06-08 16:17:02
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */

/** 定义 RouteMeta 类型 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 完整路径信息 */
    completePath?: string
    /** 路径映射 */
    pathMaps?: string[]
    /** 当前组件是否隐藏(侧边栏) */
    hidden?: boolean
  }
}
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { calculRouterActive, outputRoutes, setDefaultRoutes } from '@/utils/vue-utils'
/** 基本一级路由(登录页, 错误页) */
export const baseRoutes: RouteRecordRaw[] = []
/** 基本多级路由(侧边栏导航页面) */
export const mainRoutes: RouteRecordRaw[] = []
/** 所有路由信息 */
export const allRoutes: RouteRecordRaw[] = [...mainRoutes, ...baseRoutes]

/** 处理 Element-Menu 菜单高亮路径问题 */
calculRouterActive(allRoutes)
/** 处理所有路由默认重定向地址 */
setDefaultRoutes(allRoutes)
/** 输出当前路由权限表 */
outputRoutes(mainRoutes)

/** Vue-Router 路由器 */
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: allRoutes
})

export default router
