/*
 * @Author: Mr.Mao
 * @LastEditors: Mr.Mao
 * @Date: 2021-02-24 18:18:59
 * @LastEditTime: 2021-06-08 16:21:18
 * @Description:
 * @任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { StoreOptions, Store } from 'vuex'
import { RouteRecordRaw } from 'vue-router'
import { Component, h, render } from 'vue'

/**
 * 新增动态类型的vuex模块
 * @param store
 * @returns store
 */
export const createModule = <S>(store: StoreOptions<S>) => store as Store<S>

/**
 * 递归处理路由高亮信息
 * @param routes 当前路由列表
 * @param upperPath 上层路由路径
 */
export const calculRouterActive = (routes: RouteRecordRaw[], upperPath?: string) => {
  let pathMaps: string[] = []
  const recursion = (routes: RouteRecordRaw[], upperPath?: string) => {
    for (const i in routes) {
      const route = routes[i]
      // 拼接路由绝对路径
      const completePath = upperPath
        ? `${upperPath == '/' ? '/' : upperPath + '/'}${route.path}`
        : route.path
      // 记录路由路径信息
      pathMaps.push(completePath)

      // 添加路由路径信息
      if (route.meta) {
        route.meta.pathMaps = pathMaps
        route.meta.completePath = completePath
      } else {
        route.meta = { pathMaps, completePath }
      }

      // 再次递归
      if (Array.isArray(route.children)) {
        recursion(route.children, completePath)
      } else {
        pathMaps = []
      }
    }
  }
  recursion(routes, upperPath)
}

/**
 * 递归输出当前路由权限表
 * @param routes 当前路由列表
 */
export const outputRoutes = (routes: RouteRecordRaw[]) => {
  const recursion = (rs: RouteRecordRaw[]) => {
    return rs.map((route) => {
      const newRoute: any = {
        name: route.meta?.title as string
      }
      if (route.children) {
        newRoute.children = recursion(route.children)
      }
      return newRoute
    })
  }
  // console.log(JSON.stringify(recursion(routes)))
}

/**
 * 递归对比路由权限表, 返回路由列表
 * @param baseRoutes 基本路由
 * @param surfaceRoutes 对比路由信息
 * @returns 比较路由列表
 */
export const compareRoutes = (
  baseRoutes: RouteRecordRaw[] = [],
  surfaceRoutes: RouteRecordRaw[] = []
) => {
  const filterRoutes = baseRoutes.filter((brte) => {
    const srte = surfaceRoutes.find((v) => brte.meta?.title === (v as any).title)
    if (brte.children && brte.children?.length > 0) {
      brte.children = compareRoutes(brte.children, srte?.children)
    }
    return srte
  })
  return filterRoutes
}

/**
 * 递归设置默认重定向地址
 * @param routes 当前路由表
 * @param upperPath 上层路由路径
 */
export const setDefaultRoutes = (routes: RouteRecordRaw[] = [], upperPath?: string) => {
  // 二层递归获取子项拼接路径
  const getChildrenCompletePath = (route: RouteRecordRaw): string => {
    if (route?.children) {
      if (route.path == '/') {
        return getChildrenCompletePath(route.children[0])
      }
      return `${route.path}/${getChildrenCompletePath(route.children[0])}`
    }
    return route.path
  }
  routes.forEach((route) => {
    if (!(route.children && route.children.length > 0)) {
      return false
    }
    // 当前完整地址
    const completePath = upperPath
      ? `${upperPath == '/' ? '' : upperPath + '/'}${route.path}`
      : route.path
    // 当前拼接符
    const splic = route.path === '/' ? '' : '/'
    route.redirect = `${completePath}${splic}${getChildrenCompletePath(route.children[0])}`
    // 再次递归设置重定向地址
    setDefaultRoutes(route.children, completePath)
  })
}

/**
 * 设置当前路由表默认路由路径 / => 第一路径
 */
export const setDefaultHomeRoute = (routes: RouteRecordRaw[] = []) => {
  const existHomeRoute = routes.some((v) => v.path === '/')
  if (existHomeRoute) return false
  routes.unshift({ path: '/', redirect: routes[0].path })
}

/**
 * 渲染组件实例
 * @param Constructor 组件
 * @param props 组件参数
 * @returns 组件实例
 */
export const renderInstance = <T = Component>(Constructor: T, props: Record<string, any>) => {
  // 组件消失时, 移除当前实例
  props.onVanish = () => {
    render(null, container)
  }
  // 创建虚拟节点
  const container = document.createElement('div')
  const vnode = h(Constructor, props)
  // 渲染组件
  render(vnode, container)
  if (container.firstElementChild) {
    document.body.appendChild(container.firstElementChild)
  }
  // 这里不需要调用 document.body.removeChild(container.firstElementChild)
  // 因为调用 render(null, container) 为我们完成了这项工作
  return vnode.component
}
