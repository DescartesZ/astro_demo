---
title: "微前端之qiankun+vue3简易示例"
description: "这是一个关于如何使用 qiankun 实现微前端架构的指南。"
author: "DescartesZ"
pubDate: 2025-11-07
tags:
  ["qiankun", "Vue", "微前端"]
---

当新项目中存在老技术栈或跨技术栈（如Vue与React）项目，且需要进行整合或新功能开发时，微前端将是选型中的一个重要方案，其中iframe或许会成为第一个想到的解决方案，但iframe存在一些比较影响体验的问题，比如每次进入子应用时需重新加载资源、UI 不同步，DOM 结构不共享。
此时，qiankun将成为备选的解决方案之一。
## 1.什么是qiankun
[qiankun](https://qiankun.umijs.org/zh/guide) 是一个基于 single-spa 的微前端实现库，旨在帮助开发人员能更简单、无痛的构建一个生产可用微前端架构系统。其核心设计理念为简单、解耦/技术栈无关，在开发工程中主应用与微（子）应用都能做到与技术栈无关，且能够将大型应用拆解成若干可自治的松耦合微应用，同时，对用户而言使用qiankun如同使用 jQuery 库一般简单，能够快速完成应用的微前端改造。
>  **qiankun特性**
>- 📦 基于 single-spa 封装，提供了更加开箱即用的 API。
>- 📱 技术栈无关，任意技术栈的应用均可 使用/接入，不论是 React/Vue/Angular/JQuery 还是其他等框架。
>- 💪 HTML Entry 接入方式，让你接入微应用像使用 iframe 一样简单。
>- 🛡​ 样式隔离，确保微应用之间样式互相不干扰。
>- 🧳 JS 沙箱，确保微应用之间 全局变量/事件 不冲突。
>- ⚡️ 资源预加载，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度。
>- 🔌 umi 插件，提供了 @umijs/plugin-qiankun 供 umi 应用一键切换成微前端架构系统。
## 2.qiankun简易示例
主要技术栈：qiankun+vue3+vite+vue-router
主应用main-vue：vue3+vite+history路由模式
子应用sub-test-vue：vue3+vite+history路由模式
子应用sub-test-vue2：vue2+webpack+hash路由模式
### 2.1.主应用 main-vue 操作
#### 2.1.1安装qiankun与子应用信息配置
主应用中直接安装qiankun即可:
```js
npm i qiankun -S
```
主应用在根目录的src文件夹内创建一个config.js文件，对子应用信息进行配置：
```js
// src/config.js
export default {
    // 子应用列表
    subApps: [
        // 可放置多个
        {
            name: 'sub-test-vue', // 子应用名称，跟package.json一致
            entry: '//localhost:8101', // 子应用入口，本地环境下指定端口
            container: '#sub-container', // 挂载子应用的dom
            activeRule: '/app/sub-test-vue', // 路由匹配规则
            props: {} // 主应用与子应用通信传值
        },
        // 可放置多个
        {
            name: 'sub-test-vue2', 
            entry: '//localhost:8102', 
            container: '#sub-container', 
            activeRule: '/app/sub-test-vue2', 
            props: {} 
        },
    ]
}
```
>**注意**：实际部署时需调整上述配置中的`entry`数据，部署后需将其改为子应用的入口文件，如：`entry: '/sub-test-vue/index.html'`，或一步到位，将其配置为形如：`entry: process.env.NODE_ENV === 'development' ? '//localhost:8101': '/sub-test-vue/index.html'`。

>**同样的**，需注意`activeRule`也需匹配主应用在服务器上部署的路径，因为主应用是history路由模式，所以activeRule需要完全匹配。

主应用在目录utils内创建一个qiankun.js的公共方法文件，对qiankun进行操作：
```js
//src/utils/qiankun.js
import { addGlobalUncaughtErrorHandler, registerMicroApps } from 'qiankun'
import config from '@/config'
const { subApps } = config
export function registerApps() {
  try {
    registerMicroApps(subApps, {
      beforeLoad: [
        app => {
          console.log('before load', app)
        }
      ],
      beforeMount: [
        app => {
          console.log('before mount', app)
        }
      ],
      afterUnmount: [
        app => {
          console.log('before unmount', app)
        }
      ],
      singular: false,//可选，是否为单实例场景，单实例指的是同一时间只会渲染一个微应用。默认为 true。
      sandbox: { strictStyleIsolation: true }// 开启沙箱样式隔离。默认为 true
    })
  } catch (err) {
    console.log("qiankun error",err)
  }
  addGlobalUncaughtErrorHandler((event) => {
    console.log("全局打印事件", event)
  })
}
```
#### 2.1.2主应用中子应用挂载相关配置
在components文件夹下创建一个空组件SubContainer.vue，供子应用在路由上进行绑定，并可启动qiankun：
```html
<!-- src/components/SubContainer.vue -->
<template></template>
<script>
import { start } from 'qiankun';
import { registerApps } from '@/utils/qiankun';
export default {
  mounted() {
    if (!window.qiankunStarted) {
      window.qiankunStarted = true;
      registerApps();
      start({
        sandbox: {
          experimentalStyleIsolation: true, // 样式隔离
        },
      });
    }
  },
};
</script>
```
创建一个可供子应用DOM挂载的元素，选择在你的layout文件内，放置一个块级元素` <div id="sub-container"></div>`在` <router-view></ router-view>`外围，避免该DOM元素在切换路由时被销毁。
以简单的layout/index.vue为例：
```html
<!-- src/layout/index.vue -->
<template>
  <div class="page">
    <div class="page_left">
      <left></left>
    </div>
    <div class="page_right">
      <!-- 子应用DOM挂载 -->
      <div id="sub-container"></div>
      
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>
```

**注意：** 此处 **易踩坑**，若将上述的空组件SubContainer.vue创建为一个带有子应用DOM挂载id（#sub-container）的组件，形如：
```html
<template>
  <div id="sub-container"></div>
</template>
 ...
```
此时，项目内**未使用**layout或多级菜单，直接在App.vue内使用` <router-link to="/app/sub-test-vue/home">子应用</router-link>`跳转子应用时，能够正常显示加载子应用。

但若使用如上述方法进行处理带有自定义layout或多级菜单的项目时，则可能在加载出子应用后切换到主应用产生报错 `TypeError: Cannot read properties of null (reading 'parentNode')`。这个错误大概率是因为 qiankun 在卸载子应用时，试图从DOM里移除“已不存在的挂载点”，因为此时挂载DOM的组件已被 Vue Router 切换，导致DOM不存在，从而导致了qiankun找不到该容器。
#### 2.1.3主应用中子应用路由配置
在router文件夹下，创建路由文件routers.js，当路由使用history模式时，需要通配所有路由路径，如下：
```js
//src/router/routers.js
import layout from '@/layout/index.vue'
const routes = [
  {
    path: '',
    redirect: { name: 'home' },
    meta: { title: '首页' },
    component: layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/index.vue')
      },
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        // history模式需要通配所有路由，详见vue-router文档
        path: '/app/sub-test-vue/:pathMatch(.*)*',
        name: 'sub-test-vue',
        meta: {},
        component: () => import('@/components/SubContainer.vue')
      },
       {
        path: '/app/sub-test-vue2/',
        name: 'sub-test-vue2',
        meta: {},
        component: () => import('@/components/SubContainer.vue')
      }
    ]
  }
]
export default routes
```
路由主文件为：
```js
//src/router/index.js
import {
  createRouter,
  createWebHistory
} from 'vue-router'
import routes from './routers';

const router = createRouter({
  history: createWebHistory(
    import.meta.env.MODE === 'production' ? '/main/' : '/'
  ),
  routes
})
export default router
```
至此，主应用配置完毕，待子应用配置完毕后再补充相关路由。
### 2.2子应用 sub-test-vue（Vue3） 操作
#### 2.2.1安装qiankun与子应用项目配置
Vue3子应用中需安装`vite-plugin-qiankun`:
```js
npm i vite-plugin-qiankun --save-dev
```
项目中的配置文件`vite.config.js`需要进行修改，注意在引入qiankun插件时必须保持传入名称`sub-test-vue`与主应用一致，如下：
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/sub-test-vue/' : '/',
  plugins: [
    vue(),
    // 此处名称必须和主应用中的子应用信息一直
    qiankun("sub-test-vue", {
      useDevMode: true
    })
  ],
  server: {
    port: 8101,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": '*'
    }
  }
})
```
#### 2.2.2子应用路由与生命周期配置
以下代码中的`routes .js`文件如**2.1.3主应用中子应用路由配置**中所示的路由相同。此时，在主应用中亦可加入子应用路由数据以便集中统一管理主子应用路由。但在子应用中，必须将相关页面进行注册，如下：
```js
//src/router/routers.js
const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../view/home/index.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../view/test/index.vue')
  }
]
export default routes
```
由于在Vue3环境下使用了`history`的路由模式，此时需要修改路由文件匹配子应用的入口规则，使用`qiankunWindow.__POWERED_BY_QIANKUN__`对当前是否为微应用状态进行判断，若为微应用状态时，使用新入口`/app/sub-test-vue/`，此入口与后续主应用配置子应用路由有关联。修改如下：
```js
//src/router/index.js
import {
  createRouter,
  createWebHistory
} from 'vue-router'
import routes from './routers'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const router = createRouter({
  history: createWebHistory(
    qiankunWindow.__POWERED_BY_QIANKUN__
      ? '/app/sub-test-vue/'
      : '/'
  ),
  routes
})
export default router
```
在src目录下的`main.js`文件中对子应用的qiankun生命周期进行添加，如下：
```js
// src/main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
let app=null;
const render = (container) => {
    app = createApp(App)
    app
        .use(router)
        .mount(container ? container.querySelector('#app') : '#app')
}
const initQiankun = () => {
    renderWithQiankun({
        mount(props) {
        	console.log('子应用加载')
            const { container } = props
            render(container)
        },
        bootstrap() { },
        unmount() {
            console.log('子应用卸载')
            app.unmount()
        }
    })
}
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQiankun() : render()
```
当子应用按上述操作处理后，直接启动该项目。
此时主应用中可使用`router.push()`方法或`<router-link to="/app/sub-test-vue/home">`对子应用页面进行路由跳转，以上述子应用注册的路由为例，可供主应用访问的路径有：
```js
const routes = ref([
  {
    path: '/app/sub-test-vue/home',
    name: 'sub-test-vue-home',
  },
  {
    path: '/app/sub-test-vue/test',
    name: 'sub-test-vue-test',
  },
]);
```
其中`/app/sub-test-vue`为子应用路由入口，`/home`与`/test`为子应用中注册的路由路径，两者拼接则可在主应用中对子应用内容进行访问。
效果如下：
![实现效果](https://i-blog.csdnimg.cn/direct/83a05937b4b64e31bbb07c527938ac36.png)


### 2.3.子应用 sub-test-vue2（Vue2） 操作
vue2环境下，部分配置与Vue3不同，主要差异操作如下：
 1. main.js配置
	先在src目录下创建public-path.js文件，如下：
	```js
	// src/public-path.js
	if (window.__POWERED_BY_QIANKUN__) {
	    // eslint-disable-next-line no-undef
	    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
	}
	```
	main.js修改如下：
	```js
	import Vue from 'vue'
	import App from './App.vue'
	import router from './router'
	import store from './store'
	import './public-path'
	
	Vue.config.productionTip = false
	let instance = null
	function render(props = {}) {
	  const { container } = props
	  instance = new Vue({
	    router,
	    store,
	    render: h => h(App)
	  }).$mount(container ? container.querySelector('#app') : '#app')
	}
	
	if (!window.__POWERED_BY_QIANKUN__) {
	  render();
	}
	
	export async function bootstrap() {
	  console.log('[vue] vue app bootstraped')
	}
	export async function mount(props) {
	  console.log('[vue] props from main framework', props);
	  render(props)
	}
	export async function unmount() {
	  instance.$destroy()
	  instance.$el.innerHTML = ''
	  instance = null
	}
	```
2. vue.config.js配置
	配置如下：
	```js
	const { name } = require('./package')
	module.exports = {
	  devServer: {
	    port: 8102,
	    headers: {
	      'Access-Control-Allow-Origin': '*',
	    },
	  },
	  configureWebpack: {
	    output: {
	      library: `${name}-[name]`,
	      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
	      jsonpFunction: `webpackJsonp_${name}`,
	    },
	  },
	}
	```
## 3.易踩坑点（持续更新）
>[qiankun官网](https://qiankun.umijs.org/zh/faq)给出了常见的踩坑点，可自行查看，https://qiankun.umijs.org/zh/faq。
### 3.1子应用切换时警告：
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9577a340446643c1b60da8273e6e6159.png)
出现上述警告时，可在主应用路由配置中增加：
```js
router.beforeEach((to, from, next) => {
  if (!window.history.state.current) window.history.state.current = to.fullPath
  if (!window.history.state.back) window.history.state.back = from.fullPath
  // 手动修改history的state
  return next()
})
```
### 3.2  TypeError: Cannot read properties of null (reading 'parentNode')
从子应用切回主应用时出现该报错，对应方法如下：
qiankun@2.x 开始要求：容器节点必须始终存在于 DOM，且不能被 Vue/React 切换掉。
做法：把挂载点做成 “静态”节点，放到 Layout.vue 最外层，永远不被` <router-view> `销毁。
1. 修改主应用 src/layout/Layout.vue
	```html
	<template>
	  <div class="layout">
	    <Menu />
	    <main class="right">
	      <!-- 子应用挂载点，生命周期内一直存在 -->
	      <div id="subapp-container" style="height:100%"></div>
	      <!-- 主应用自己的页面（如果有） -->
	      <router-view v-if="$route.meta.keepAlive" />
	    </main>
	  </div>
	</template>
	```
2. 路由表不再销毁该节点
	```js
	// src/router.js
	import Layout from '@/layout/Layout.vue'
	const routes: RouteRecordRaw[] = [
	  {
	    path: '/',
	    component: Layout,
	    children: [
	      /* 所有子应用路由都指向一个空组件，保证 Layout 不被销毁 */
	      {
	        path: '/sub-app',
	        component: () => import('@/views/Empty.vue'), // 文件里只 <template></template>
	        children: [
	          { path: 'page1', component: () => import('@/views/Empty.vue') },
	          { path: 'page2', component: () => import('@/views/Empty.vue') }
	        ]
	      }
	    ]
	  }
	]
	```
3. 子应用 unmount 里不要手动移除根节点
	只调用 instance.unmount() 即可，**不要写**：
	```js
	// ❌ 千万别写
	document.getElementById('app')?.remove()
	```
4. 在 registerMicroApps 里加 singular: false 和严格的 sandbox 配置，防止节点污染：
	```js
		registerMicroApps([...], {
	  singular: false,
	  sandbox: { strictStyleIsolation: true }
	})
	```
### 3.3 主应用中访问子应用时，静态资源加载失败
由于从主应用中访问子应用时，静态资源会默认以主应用地址进行访问，当主应用不存在相应的静态资源时会加载失败。
此时可借助`vue.config.js/vite.config`配置中的`publicPath`静态资源路径设置，将其设置为绝对地址即可，部署后为部署地址，本地调试时为本地地址。以Vue2项目为例，形如：
```js
module.exports = {
    // 设置静态资源访问路径为绝对路径
    publicPath:'http://192.168.14.88:8082/',
    ...
}
```
>若上述方法无效，有一救急方法：将子应用中的静态资源迁移至主应用再打包，但必须保证所有资源名称与路径不重复。

## 参考文档
1. [qiankun：vue3 + vite从开发到部署实现微前端](https://juejin.cn/post/7216536069285429285?searchId=2025110715350736066DDDB0D27B838C19);
2. [微前端 qiankun 子应用静态资源路径404问题解决方案](https://juejin.cn/post/7110624436633468935);
3. [用微前端 qiankun 接入十几个子应用后，我遇到了这些问题](https://cloud.tencent.com/developer/article/2372542);
4. [[微前端][vue3 + vite + qiankun] 使用详解](https://juejin.cn/post/7486465253816991780);
5. [qiankun官网](https://qiankun.umijs.org/zh).