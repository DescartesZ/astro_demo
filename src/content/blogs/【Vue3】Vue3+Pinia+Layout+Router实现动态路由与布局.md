---
title: "Vue3+Pinia+Layout+Router实现动态路由与布局"
description: "这是一个关于如何使用 Vue3+Pinia+Layout+Router 实现动态路由与布局的指南。"
author: "DescartesZ"
pubDate: 2024-06-17
tags:
  ["Vue3","Pinia","Layout", "Router","模板","前端","长文"]
---
Vue3中可使用js也可使用ts，在文章中约定创建ts文件等同于创建js文件。
## 一、Pinia
pinia[快速入门](https://blog.csdn.net/qq_45020145/article/details/136351271?spm=1001.2014.3001.5502)
### 1.1 创建Pinia实例并挂载
在src目录下创建store文件夹，同时在store文件下创建`store.ts`文件。
```javascript
// store.ts
import { createPinia } from 'pinia';
// 创建实例
const pinia = createPinia();
export default pinia;
```
在`main.ts`（节选）中
```javascript
import pinia from './store/store.ts';
// 同时引入 pinia持久化插件 npm i pinia-plugin-persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
```
### 1.2 创建状态管理器
在store文件下创建`index.ts`文件。
```javascript
import { defineStore } from 'pinia';
import utils from '../utils/utils';
export const useStore = defineStore("myStore",{
   	// 开启数据持久化
   	// 方式一：
    persist:true,
    // 方式二：
    // persist: {
    //     // 指定持久化的key
    //     key: 'my-route-key',
    //     // 指定要持久化的数据
    //     paths: ['route'],
    //    // 指定持久化的存储方式，默认 localStorage
    //     storage: sessionStorage,
    // },
    state:()=>{
        return {
            // 路由数据
            route:[],
            routeNameList:[]
        }
    },
    getters:{
        
    },
    actions:{
        addRouter(list:any){
            // debugger
            list.map((item:any)=>{
                if(item.url){
                    item.component = utils._getViews(`${item.url}`,"one");
                }
                if(item.children){
                    item.children.map((items:any)=>{
                        items.component = utils._getViews(`${items.url}`,"two")
                    });
                }
            });
            this.route = list;
            console.log("设置路由数据",this.route)
            let nameList :string[] = []
            list.forEach((item:any) => {
                if(!item.children){
                    nameList.push(item.path)
                }else{
                    item.children.forEach((items:any)=>{
                        nameList.push(items.path)
                        if(items.children){
                            items.children.forEach((itemsC:any)=>{
                                nameList.push(itemsC.path)
                            })
                        }
                    })
                }
            });
            this.routeNameList = nameList
        }
    },
})
```
上述代码中，在utils中的函数_getViews():
```javascript
/**
 * 获取Component的方法
 * @param view 路径
 * @param type 路由层数 目前只兼容二级路由
 */
const _getViews = (view: any, type: any) => {
  // console.log("接收",view)
  let res;
  let modules: any;
  if (type == "one") {
    modules = import.meta.glob("../view/*.vue");
  } else {
    modules = import.meta.glob("../view/**/index.vue");
  }
  for (const path in modules) {
    const dir =
      type == "one"
        ? path.split("view")[1].split(".vue")[0]
        : path.split("view/")[1].split("/index.vue")[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  // console.log("返回数据",res)
  return res;
};
```
## 二、Layout布局
在src目录下创建layout文件夹，同时在layout下创建`index.vue`文件。
布局各有千秋，主要使用`<router-view>`对路由页面进行呈现。
```html
<template>
  <div class="page">
    <div class="page_left">
      <!-- 菜单栏 -->
      <MenuSax></MenuSax>
    </div>
     <!-- 顶部导航 -->
    <headNav></headNav>
    <div class="page_right">
    	<!-- 路由切换页面 -->
      <router-view v-slot="{ Component, route }">
        <transition
          name="fade-transform"
          mode="out-in"
        >
          <keep-alive>
            <component
              :is="Component"
              :key="route.path"
            />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>
```

## 三、Vue Router 路由
### 3.1 安装
```javascript
npm install vue-router
```
### 3.2 创建路由器实例
在src目录下创建router文件夹，同时在router下创建`index.ts`文件。
```javascript
// index.js
import { createRouter,createWebHistory } from 'vue-router';
import layout from '../layout/index.vue';
import { routerData } from '../utils/router.ts';
import pinia from '../store/store.ts';
import { useStore } from '../store/index.ts';

const store = useStore(pinia);
store.addRouter(routerData);

// 路由数据
let routes = [
	// 地址重定向
    {
        path:"/",
        redirect:"/login",
    },
    // 需要使用layout布局的路由页面
    {
        path:"/index",
        component: layout,
        children: [...store.route],
    },
    // 不需要layout布局的页面
    {
        id: "2",
        path: "/login",
        name: "login",
        component: () => import("../view/login.vue"),
    },
    {
        id: "404",
        path: "/404",
        name: "404",
        component: () => import("../view/404/404.vue"),
    },
];

// 路由
const router = createRouter({
    history:createWebHistory(),
    routes,
    // 刷新时，滚动条位置还原
    scrollBehavior: () => ({ left: 0, top: 0 })
})
export default router;
```
### 3.3 路由守卫
```javascript
// 放置在 export default router 前

router.beforeEach((to,from,next)=>{
	// 可设置一个pinia方法存储用户信息
    let userInfo = useRole();
    console.log("进入路由守卫",to,from,next);
    // 当用户登录状态未未登录时，进制跳转到 to.path 页面，强制跳转登录页
    if((!userInfo.isLogin)&&to.path!='/login'){
        console.log("禁止",to);
        next({path:"/login",replace:true,force:true});
    }else{
    	// 获取跳转目标页是否在路由表中，否则直接跳转到404页面
        let includesPath = useStore().routeNameList.includes(to.path);
        if(!includesPath&&to.path!='/404'&&to.path!='/login'){
            next({path:"/404",replace:false,force:true})
        }else{
            next();
        }
    }
})
```
### 3.4 本地配置的路由表示例
```javascript
// utils/router.ts
export const routerData = [
  {
    id: '1-1',
    path: '/index',
    name: 'index',
    icon: 'bx-home-smile',
    meta: {
      title: '首页',
    },
    url: '/index',
  },
  {
    path: '/user',
    name: 'user',
    id: '1-2',
    icon: 'bx-shield-minus',
    meta: {
      title: '账号管理',
    },
    children: [
      {
        path: '/userInfo',
        name: 'userInfo',
        icon: 'bx-id-card',
        id: '1-2-1',
        meta: {
          title: '个人中心',
        },
        url: 'user/info',
      },
      // 此处路由存在三级路由，其他至多只有二级
      // 需特殊处理，为第三级嵌套路由提供展示区域，详见 第四章 多层路由嵌套。
      {
        path: '/userSet',
        name: 'userSet',
        icon: 'bx-shield-plus',
        id: '1-2-2',
        meta: {
          title: '设置',
        },
        url: 'user/set',
        // component:() => import("../view/user/set/index.vue"),
        children:[
          {
            path: '/userSet-Menu',
            name: 'userSet-Menu',
            icon: 'bx-shield-plus',
            id: '1-2-2-1',
            meta: {
              title: '设置嵌套',
            },
            url: 'user/set/child',
            // 相关方法只兼容二级路由，因此第三级路由需收到配置component
            component:() => import("../view/user/set/child/index.vue"),
          }
        ]
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    id: '2-2',
    meta: {
      title: '系统管理',
    },
    icon: 'bxl-mongodb',
    children: [
      {
        path: '/adminInfo',
        name: 'adminInfo',
        icon: 'bx-rocket',
        id: '2-2-1',
        meta: {
          title: '系统信息',
        },
        url: 'admin/info',
      },
      {
        path: '/adminSet',
        name: 'adminSet',
        icon: 'bxs-cog',
        id: '2-2-2',
        meta: {
          title: '系统设置',
        },
        url: 'admin/set',
        disable:true
      },
    ],
  },
];
```

### 3.5 多层路由嵌套示例
在`view/user/set/index.vue`页面中需要放置一个`<router-view>`展示嵌套路由页面。
```html
<template>
  <div>
    用户设置页
    <vs-button @click="getPage">
      嵌套
    </vs-button>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const getPage= () => {
  router.push("/userSet-Menu");
};
</script>
```

## 参考文档
1. Vue3 + Vite + Router + Pinia + Layout 实现动态路由[文章](https://blog.csdn.net/weixin_44258422/article/details/131534656):https://blog.csdn.net/weixin_44258422/article/details/131534656；
2. Vue Router [文档](https://router.vuejs.org/zh/guide/)：https://router.vuejs.org/zh/guide/；
3. vue3+pinia+vuerouter4动态路由菜单[文章](https://blog.csdn.net/demoren/article/details/126807424)：https://blog.csdn.net/demoren/article/details/126807424。
