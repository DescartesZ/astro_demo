---
title: "Vue3使用Axios请求二次封装（包含跨域配置）"
description: "这是一个关于如何使用 Vue3 二次封装 Axios 请求的指南，包含跨域配置。"
author: "DescartesZ"
pubDate: 2024-06-12
tags:
  ["Vue3","Axios","二次封装","跨域配置","前端"]
---
## 一.axios安装与封装
### 1.1 安装
```javascript
npm install axios
```
### 1.2 二次封装
#### 1.引入 axios
```javascript
import axios from 'axios'
```
#### 2.创建axios实例
使用axios对象中的create方法创建实例。可以在创建实例时，配置基础路径、超时响应时间。
```javascript
const request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
  timeout: 5000, //超时的时间
})
```
其中基础路径`import.meta.env.VITE_APP_BASE_API`配置见第二章环境变量配置。
同时，在配置对象中也可配置请求头等，如：
```javascript
headers:{
    "Content-type": "application/json;charset=UTF-8",
    "Host":"weather.cma.cn",
}
```
#### 3.请求拦截
使用request实例，添加请求与响应拦截器。
```javascript
request.interceptors.request.use((config) => {
  // 1.获取用户相关的小仓库:获取仓库内部token,登录成功以后携带给服务器
  //const userStore = useUserStore()
  //if (userStore.token) {
    //config.headers.token = userStore.token
    //config配置对象,headers属性请求头,经常给服务器端携带公共参数
  //}
  
  // 2.也可在此处对是否有token进行拦截
  
  //返回配置对象，必须返回，否则发不出请求
  return config
})
```

#### 4.响应拦截
在此处对返回的响应数据进行处理。
```javascript
request.interceptors.response.use(
  (response) => {
    //成功回调
    //简化数据
    return response.data
    //未简化
   // return Promise.resolve(response.data)
  },
  (error) => {
    //失败回调:处理http网络错误的
    //定义一个变量:存储网络错误信息
    let message = ''
    //http状态码
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'TOKEN过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    //可在此处引入UI进行错误提示
    console.log("报错",message)
    return Promise.reject(error)
  },
)
```
#### 5.完整axios示例
```javascript
// /utils/request.ts

import axios from 'axios'
import useUserStore from '@/store/modules/user'
//创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, 
  timeout: 5000,
})
//请求拦截
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})

//响应拦截
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    let message = ''
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'TOKEN过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    //提示错误信息
    //...
    return Promise.reject(error)
  },
)
//对外暴露
export default request
```
#### 6.API封装示例
```javascript
// api/xxxapi.ts

import request from "../utils/request.ts"
export function getWeather(){
    return request({
        url: "/api/weather/view",
        method: "GET",
    })
}
```
## 二、环境变量配置（vite）
### 2.1 环境变量与.env文件
在vite创建的环境中，使用`.env`开头文件进行配置读取，其中的环境变量可以通过`import.meta.env`以**字符串**形式暴露给客户端源码。
内建变量（任何时候都能直接使用）：
|变量名|类型|说明|
|:--:|:--:|:--:|
|**import.meta.env.MODE**|`string`|应用运行的模式（开发、生产）|
|**import.meta.env.PROD**|`boolean`| 应用是否运行在生产环境（使用 NODE_ENV='production' 运行开发服务器或构建应用时使用 NODE_ENV='production' ）|
|**import.meta.env.DEV**|`boolean`|应用是否运行在开发环境 (永远与 import.meta.env.PROD相反)。|
|**import.meta.env.SSR**|`boolean`|应用是否运行在 server（开发服务器） 上。

**.env**文件命名说明：
|文件名|说明|
|:--:|:--:|
|`.env`|所有情况下都会加载|
|`.env.local`|所有情况下都会加载，但会被 git 忽略|
|`.env.[mode]`|只在指定模式下加载，如：`development`、`production`|
|`.env.[mode].local`|只在指定模式下加载，但会被 git 忽略|

### 2.2 .env文件配置
在配置中，注意使用`VITE_`作为变量的前缀，否则无法暴露给vite处理。
如：
```javascript
VITE_SOME_KEY=123
DB_PASSWORD=foobar

//******************************************************
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```
其中只有 `VITE_SOME_KEY` 会被暴露为 `import.meta.env.VITE_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会。

同时，要注意环境变量的值解析后均为字符串，如上所示，VITE_SOME_KEY 是一个数字，但在解析时会返回一个字符串。布尔类型的环境变量也会发生同样的情况。在代码中使用时，请确保转换为所需的类型。
### 2.3 配置示例
新建 开发环境配置文件`.env.development`、生产环境配置文件`.env.production`。
.env.development
```javascript
#开发环境

# 指定构建模式
VITE_NODE_ENV = development

# 页面title前缀
VUE_APP_TITLE = 开发环境

# 网络请求地址
VITE_API_BASE_URL = '/api'
VITE_SERVE="https://weather.cma.cn"
```
.env.production
```javascript
# 生产环境

# 指定构建模式
VITE_NODE_ENV = production

# 页面title前缀
VUE_APP_TITLE = ''

# 网络请求地址
VITE_API_BASE_URL = '/api'
VITE_SERVE="https://weather.cma.cn"
```

## 三、跨域配置
在`vite.config.ts`/`vite.config.js`文件中进行配置。
```javascript
//vite.config.ts

import { defineConfig, loadEnv } from 'vite';
export default defineConfig(
  ({ command, mode })=>{
  //获取各种环境下的对应的变量
  let env = loadEnv(mode, process.cwd())
  return{
    // ...
    //代理跨域
    server: {
      // open:true,//自动弹出浏览器
      port:"81",//启动端口
      proxy: {
        [env.VITE_API_BASE_URL]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => {
            return path.replace(new RegExp('^' + env.VITE_API_BASE_URL), '')
          },
        },
      },
    },
  }}
)
```
## 参考文档
1. Vue3-axios安装和封装[文章](https://www.cnblogs.com/flyLoong/p/18047401):https://www.cnblogs.com/flyLoong/p/18047401;
2. vue3+vite-配置环境变量env[文章](https://juejin.cn/post/7216239215905521719):https://juejin.cn/post/7216239215905521719;
3. Vite[文档](https://cn.vitejs.dev/guide/env-and-mode.html)-环境变量与环境:https://cn.vitejs.dev/guide/env-and-mode.html;
4. vue3+vite开发中axios使用及跨域问题解决[文章](https://blog.csdn.net/lap2004/article/details/132310639):https://blog.csdn.net/lap2004/article/details/132310639.