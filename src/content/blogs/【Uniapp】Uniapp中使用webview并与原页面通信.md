---
title: "Uniapp中使用webview并与原页面通信"
description: "这是一个关于如何在 Uniapp 中使用 webview 并与原页面通信的指南。"
author: "DescartesZ"
pubDate: 2025-03-17
tags: ["webview","Uniapp"]
---

## 1.接收数据
主要使用`@message`与`@onPostMessage`接收原页面数据，且两个方法只能在APP中使用，其他平台均不支持。
```html
<web-view style="z-index: 1;" :src="webViewUrl+'appview'" @onPostMessage="htmlMessage" @message="htmlMessage">
</web-view>
```

```javascript
/**
 * 接收页面返回参数
 * @param {Object} item
 */
htmlMessage(item) {
	console.log('收到的消息', item)
	let data = item.detail
	...
},
```

## 2.发送数据（调用原页面方法）
发送数据时，主要使用`evalJS()`方法，且注意**需要要页面渲染完毕后** 执行，否则会报错。
```javascript
/**
 * 向目标页面发送参数(调用原页面数据)
 */
handleSendData() {
	// 当使用$parent未获取到节点数据时，直接使用$scope
	// let currentWebview = this.$parent.$scope.$getAppWebview()
	// let wv = currentWebview.children()[0];
	let currentWebview = this.$scope.$getAppWebview()
	let wv = currentWebview.children()[0]
	// 参数
	let data = {
		id: [所需参数],
		selectType: [所需参数],
	}
	//getWebviewData()方法必须存在webview引用的页面中，否则无法调用
	wv.evalJS((`getWebviewData(${JSON.stringify(data)})`));
},
```

## 3.动态修改webview样式
```javascript
/**
 * 修改样式
 */
handleChangeStyle(){
	let currentWebview = this.$scope.$getAppWebview()
	let wv = currentWebview.children()[0]
	wv.setStyle({ //设置web-view距离顶部的距离以及自己的高度，单位为px
		top: 170, //此处是距离顶部的高度，应该是你页面的头部
		height: 500, //webview的高度
	})
},
```
