---
title: "【Vue3】常见BUG收录，持续更新..."
description: "这是一个关于Vue3常见BUG收录的记录，持续更新..."
author: "DescartesZ"
pubDate: 2024-12-19
tags:
  ["Vue","BUG","持续更新"]
---
##  一、Vue3切换页面后页面不渲染问题其一
在Vue3环境下，页面A在`<template>`标签内对一级根节点`<div>...</div>`注释，进入A页面后跳转至B页面，全部页面不渲染。
出现错误的页面代码如下：
```html
<template>
	<!--<div>注释内容</div> -->
	<div>正常内容</div>
</template>
```
此时需要将注释内容<b>删除</b>，页面才能正常渲染。
___

## 二、Vue3+Ts 报错`Did you mean to enable the 'allowJs' option`
项目以Vite + Vue3 + Ts进行初始化后，项目中存在使用Js的情况直接进行打包时，会产生报错：
```js
error TS6504: File 'F:/XXX/src/components/XXXView.vue.js' is a JavaScript file. Did you mean to enable the 'allowJs' option?
  The file is in the program because:
    Root file specified for compilation
```
此时需要在` tsconfig.json` 的 `compilerOptions` 中添加 `allowJs: true`：
```js
{
  "compilerOptions": {
    "allowJs": true,
    "noImplicitAny": false  // 可选，避免 JS 文件中的隐式 any 报错
    ...
  }
}
```
### 附加情况
#### 1.存在空页面时，也需处理TypeScript 脚本块：
```html
<template>
  <router-view />
</template>

<script setup lang="ts">
// 即使为空也要加上，否则会被视为 JS 文件
</script>
```
#### 2.跳过类型检查直接打包（临时方案）
如果你使用 Vite，可以跳过 vue-tsc 的类型检查直接打包：
```bash
// 不执行 type-check，直接 build
npm run build-only
```
或者在 `package.json` 中修改：
```json
{
  "scripts": {
    "build": "vite build",  // 去掉 vue-tsc --noEmit
    "build-only": "vite build"
  }
}
```