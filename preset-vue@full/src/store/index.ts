/*
 * @Author: Mr.Mao
 * @Date: 2021-05-18 15:43:17
 * @LastEditTime: 2021-06-08 16:18:53
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */

import { createStore, Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import common from './modules/common'

/** Vuex 数据管理 */
const store = createStore({
  modules: { common, user },
  plugins: [createPersistedState()]
}) as Store<StoreType>

/** 完整数据管理类型 */
type StoreType = {
  user: typeof user.state
  common: typeof common.state
}

/** 覆盖 useStore 类型 */
declare module 'vuex' {
  export function useStore<S = StoreType>(): Store<S>
}

export default store
