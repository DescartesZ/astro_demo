---
title: "【JS进制处理】使用UTF-8字符编码，中英文数字与十六进制字符的互转处理"
description: "这是一个关于如何使用 JS 处理UTF-8字符编码，中英文数字与十六进制字符的互转处理的指南。"
author: "DescartesZ"
pubDate: 2024-09-20
tags:
  ["进制处理","UTF-8","十六进制"]
---

## 使用UTF-8字符编码的转化处理
在与设备交互的过程中，时有需要传输中文或中文混合英文数字的需求，此时若直接使用转十六进制的方法转化会存在英文数字空占一位00字节的情况，且中文需要4字节。但使用UTF-8字符编码进行处理，中文只需要3个字节，英文数字仅1个字节，节省了大量空间且互转更加便捷。
### 1.中英文数字混合字符 转 十六进制字符串
```javascript
function mixStrtoHex(str, bit) {
	let hex = '';
	// 将字符串编码为UTF-8
	const utf8Bytes = new TextEncoder().encode(str);
	for (let byte of utf8Bytes) {
		// 将每个字节转换为十六进制
		hex += byte.toString(16).padStart(2, '0');
	}

	let hexStr = hex.toUpperCase(); // 转为大写

	// 不满足位数的向右边补位0
	if (bit !== 0) {
		hexStr = hexStr.padEnd(bit * 2, '0');
	}

	return hexStr;
}
```
### 2.十六进制字符串 转 显示字符
```javascript
function mixHextoStr(hex) {
	let str = '';
	for (let i = 0; i < hex.length; i += 2) {
		// 每两个十六进制字符转换为一个字节
		const byte = parseInt(hex.substr(i, 2), 16);
		str += String.fromCharCode(byte);
	}
	// 使用TextDecoder将字节解码为UTF-8字符串
	const utf8Bytes = new Uint8Array(str.split('').map(char => char.charCodeAt(0)));
	return new TextDecoder().decode(utf8Bytes);
}
```
### 3.Demo
```javascript
// 示例
const originalString = "你好Abc123";
const hexString = mixStrtoHex(originalString);
console.log("字符串转十六进制:", hexString);
const convertedString = mixHextoStr(hexString);
console.log("十六进制转字符串:", convertedString);
```

### 4.Uniapp环境下特殊处理
在uniapp环境中运行在Android系统上时，无法直接使用`TextDecoder()`、`TextEncoder()`，解决方案如下：
1.引入`text-decoding`依赖
```javascript
npm install text-decoding
```
2.js中引入
```javascript
import { TextEncoder, TextDecoder } from 'text-decoding'
```
或在main.js中挂载到全局
```javascript
import { TextEncoder, TextDecoder } from 'text-decoding'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
```