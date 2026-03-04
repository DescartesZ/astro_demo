---
title: "AntV X6使用Vue组件作为渲染节点"
description: "这是一个关于如何使用 AntV X6 实现自定义 Vue 组件作为渲染节点的指南。"
author: "DescartesZ"
pubDate: 2025-03-07
tags:
  ["AntV X6","可视化", "Vue", "前端"]
---
## 1.使用依赖
```
npm install @antv/x6 --save
npm install @antv/x6-vue-shape --save
```
下述代码使用Vue2技术栈，若使用Vue3则直接参考[「AntV」X6 自定义vue节点(vue3)](https://www.yuque.com/sxd_panda/antv/vue-node) https://www.yuque.com/sxd_panda/antv/vue-node
## 2.节点组件
> **要点：**
> - 使用`inject`注入AntV X6父组件中的依赖 `getNode`；
> - 使用`this.getNode()`可以获取/监听，父组件在节点上配置的数据。
> 
```html
<!-- branch.vue -->
<template>
  <div>
      {{ name }}
  </div>
</template>
<script>
export default {
  inject: ["getNode"],
  data() {
    return {
      name: '',
    }
  },
  mounted() {
    const node = this.getNode();
    this.name = node.data.name;
    
    // 监听数据
    node.on('change:data',({current})=>{
    	console.log("监听父组件改变的数据",current)
    })
  }
}
</script>
```
## 3.父组件（使用节点渲染）
```html
<template>
  <div>
    <div id="container" />
  </div>
</template>
<script>
// 引入 AntV X6 库
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'

// 引入2中的子组件
import branch from './branch.vue'
// 制作组件节点
register({
  shape: 'branch-node',
  width: 100,
  height: 100,
  component: branch,
})
export default {
	mounted() {
    this.initGraph()
 	 },
	methods: {
		initGraph() {
			const width = window.innerWidth
	     	const height = window.innerHeight
			// 初始化 Graph 对象
	     	const graph = new Graph({
	        container: document.getElementById('container'), // 容器元素
	        width: width, // 设置宽度为屏幕宽度
	        height: height, // 设置高度为屏幕高度
	        interacting: {
	          nodeMovable: false, // 可拖拽节点
	          edgeMovable: false // 可拖拽边
	        },
	        connecting: {
	          connectionPoint: 'anchor'// 连接中心锚点
	        }
	      })
	      // 创建组件节点
	      const branchNode = graph.addNode({
	        x: 950,
	        y: 240,
	        shape: 'branch-node',
	        data: {
	          name: '组件节点名称'
	        },
	      })
		}
  }
}
</script>
```
>Vue3方法参考：[「AntV」X6 自定义vue节点(vue3)](https://www.yuque.com/sxd_panda/antv/vue-node) https://www.yuque.com/sxd_panda/antv/vue-node

## 参考地址
1.[AntV X6结合Vue组件渲染节点，并与节点组件进行双向的数据交互.](https://blog.csdn.net/qq_25439417/article/details/130908672)
2.[Ant X6指南踩坑指南.](https://www.yuque.com/sxd_panda/antv/x6)