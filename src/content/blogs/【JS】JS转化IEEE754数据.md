---
title: "JS转化IEEE754数据"
description: "这是一个关于如何使用 JS 转化IEEE754数据的指南。"
author: "DescartesZ"
pubDate: 2024-04-01
tags:
  ["IEEE754","JS","进制转换","浮点数"]
---

## 1.什么是IEEE754？

IEEE754 浮点数：简读+案例=秒懂_ieee754浮点数的计算-[CSDN博客](https://blog.csdn.net/weixin_47713503/article/details/108699001)

## 2.将十六进制的IEEE754数据转化为十进制数据
```js
// console.log(getIee754Value("42F66B85", false, 2));//123.21


/**
 * 转化十六进制的IEEE754标准数据为十进制浮点型数据
 * @param {String} hexString 十六进制字符串
 * @param {Boolean} change 是否高低位互换
 * @param {number} decimalNum 小数位
 */
export function getIee754Value(hexString, change = false, decimalNum = 2) {
	if (hexString === "00000000") {
		return '0.00';
	}
	if (change) {
		hexString = hexString.substring(4, 8) + hexString.substring(0, 4);
	}
	let bytes = hexStringToBytes(hexString);
	return bytesToFloat(bytes, decimalNum);
}

/**
 * 字节数组转float
 * 采用IEEE 754标准
 */
function bytesToFloat(bytes, decimalNum) {
	//获取 字节数组转化成的16进制字符串
	let binaryStr = bytesToBinaryStr(bytes);
	//符号位S
	let s = parseInt(binaryStr.substring(0, 1));
	//指数位E
	let e = parseInt(binaryStr.substring(1, 9), 2);
	//位数M
	let M = binaryStr.substring(9);
	let m = 0,
		a, b;
	for (let i = 0; i < M.length; i++) {
		a = parseInt(M.charAt(i));
		b = Math.pow(2, i + 1);
		m = m + (a / b);
	}
	let f = ((Math.pow(-1, s)) * (1 + m) * (Math.pow(2, (e - 127))));
	return f.toFixed(decimalNum);
}

/**
 * 将字节数组转换成16进制字符串
 */
function bytesToBinaryStr(bytes) {
	let binaryStr = "";
	for (let i = 0; i < bytes.length; i++) {
		let str = (bytes[i] & 0xFF).toString(2);
		str = "00000000".substring(str.length) + str;
		binaryStr += str;
	}
	return binaryStr;
}

/**
 * 将十六进制字符串转换为字节数组
 */
function hexStringToBytes(hexString) {
	let bytes = [];
	for (let i = 0; i < hexString.length; i += 2) {
		bytes.push(parseInt(hexString.substr(i, 2), 16));
	}
	return bytes;
}
​```