---
title: "【JS】JS处理大小端数据"
description: "这是一个关于如何使用 JS 处理大小端数据的指南。"
author: "DescartesZ"
pubDate: 2023-11-01
tags:
  ["大小端数据","JS",字符操作","类型转化"]
---
## 1.转大端处理
```javascript
/**
 * 转大端处理（两位）
 * @param {number[]} decimalArray
 * 传入十进制数组
 * @returns {number} 大端处理后的结果
 */
function convertToBigEndian(decimalArray) {
	// console.log("接收", decimalArray);
	if (decimalArray.length > 0) {
		// 使用map()方法将十进制数组转换为十六进制数组。
		const hexArray = decimalArray.map((num) => num.toString(16));
		// 使用reverse()方法反转十六进制数组
		const reversedHexArray = hexArray.reverse();
		// 使用map()方法和模板字符串或join()方法来拼接十六进制字符串
		let hexString = reversedHexArray.map((hex) => {
			hex = hex.padStart(2, 0);
			return hex;
		}).join('');

		// console.log("dataStr", hexString);
		return parseInt(hexString, 16);
	} else {
		let emptyString = '';
		return emptyString;
	}
}
```

## 2.转小端处理
```javascript
/**
* 转小端处理（两位）
* @param {string} data
* 传入十六进制数据
* @returns {string[]} 小端处理后的数据
*/
function convertToLittleEndian(data) {
    let outData = [];
	if (data.length % 2 === 1) {
	   data = '0' + data;
	}
	 // 使用for循环从后往前遍历字符串，避免使用额外的临时变量
	 for (let i = data.length - 2; i >= 0; i -= 2) {
	   outData.push(data.substring(i, i + 2));
	 }
	 // 使用while循环来确保输出数组的长度为2，避免使用固定的for循环次数
	 while (outData.length < 2) {
	   outData.push('00');
	 }
	 return outData;
}
```

## 3.测试代码
```javascript
	function spliceDataTest() {
		// 模拟数据
		let num = 65535
		let len = num.toString(16)
		let lowData = convertToLittleEndian(len)
        console.log("小端十六进制数组",lowData)
		let newLow = []
		for (let i in lowData) {
			newLow.push(parseInt(lowData[i], 16))
		}
		let highData = convertToBigEndian(newLow)
        console.log("大端十进制数据",highData)
	}

    function convertToLittleEndian(){...}
    function convertToBigEndian(){...}
```