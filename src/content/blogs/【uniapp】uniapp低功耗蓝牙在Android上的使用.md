---
title: "uniapp低功耗蓝牙在Android上的使用"
description: "这是一个关于如何使用 uniapp 低功耗蓝牙在 Android 环境上的使用的指南。"
author: "DescartesZ"
pubDate: 2024-06-03
tags:
  ["uniapp","低功耗蓝牙","Android","长文"]
---
# uni-app低功耗蓝牙在Android上的使用
主要使用uniapp提供的低功耗蓝牙[API](https://uniapp.dcloud.net.cn/api/system/ble.html)进行hooks封装。
在使用时，注意Android版本必须5.1以上。

## 一.主要API初步封装（bluetooth.js）
### 1.1 初始化蓝牙模块（uni.openBluetoothAdapter(OBJECT)）
该接口是使用低功耗蓝牙相关API必须调用的一个接口，若未先调用此接口，将会返回代码为10000的报错；

```javascript
// 初始化蓝牙模块
export function initBluetooth() {
	return new Promise((resolve, reject) => {
		uni.openBluetoothAdapter({
			success(res) {
				console.log('初始化蓝牙成功', res);
				resolve(res)
			},
			fail(err) {
				console.log('初始化蓝牙失败', err);
				reject(err)
			}
		});
	});
}
```
**注意：**
在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用此接口会返回代码10001的错误，表示手机蓝牙功能不可用。

### 1.2 获取蓝牙适配器状态（uni.getBluetoothAdapterState(OBJECT)）
```javascript
// 获取蓝牙模块状态
export function getBluetoothAdapterState() {
	return new Promise((resolve, reject) => {
		uni.getBluetoothAdapterState({
			success: (res) => {
				console.log('获取本机蓝牙适配器状态', res);
				resolve(res)
			},
			fail(err) {
				console.log('获取本机蓝牙适配器状态', err);
				reject(err)
			}
		})
	});
}
```
**返回数据**

|属性|类型|说明|
|:--------:|:--------:|:--------:|
|discovering|boolean|是否正在搜索设备|
available|boolean|蓝牙适配器是否可用|

### 1.3 关闭蓝牙模块（uni.closeBluetoothAdapter(OBJECT)）
调用该方法将断开所有已建立的连接并释放系统资源。建议在使用蓝牙流程后，与 uni.openBluetoothAdapter 成对调用。
```javascript
// 关闭蓝牙模块
export function closeBluetooth() {
	return new Promise((resolve, reject) => {
		uni.closeBluetoothAdapter({
			success(res) {
				console.log('关闭蓝牙成功', res);
				resolve(res)
			},
			fail(err) {
				console.log('关闭蓝牙失败', err);
				reject(err)
			}
		})
	})
}
```
### 1.4 开启搜索蓝牙设备（uni.startBluetoothDevicesDiscovery(OBJECT)）
开始搜寻附近的蓝牙外围设备。此操作比较耗费系统资源，请在搜索并连接到设备后调用 uni.stopBluetoothDevicesDiscovery 方法停止搜索。
```javascript
/**
 * 启动蓝牙设备搜索
 * @param {Object} params 参数
 */
export function startBluetoothSearch(params) {
	return new Promise((resolve, reject) => {
		uni.startBluetoothDevicesDiscovery({
			...params,
			success: (res) => {
				console.log('开启蓝牙搜索成功', res);
				resolve(res);
			},
			fail: (err) => {
				console.log('开启蓝牙搜索失败', err);
				reject(err);
			}
		})
	});
}
```
**传入参数params说明（全都非必填）**
| 属性| 类型 |默认值|说明|
|:------:| :------:|:------:|:------:|
services|`Array<String>`	||要搜索的蓝牙设备主 service 的 uuid 列表。某些蓝牙设备会广播自己的主 service 的 uuid。如果设置此参数，则只搜索广播包有对应 uuid 的主服务的蓝牙设备。建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。
allowDuplicatesKey|`boolean`|false|是否允许重复上报同一设备。如果允许重复上报，则 uni.onBlueToothDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同。
interval|`number`|0|上报设备的间隔。0 表示找到新设备立即上报，其他数值根据传入的间隔上报。
powerLevel|`string`|medium|扫描模式，越高扫描越快，也越耗电，仅安卓支持。low：低，medium：中，high：高。仅京东小程序支持

**注意**
App 端目前仅支持发现ble蓝牙设备

### 1.5 关闭搜索蓝牙设备（uni.stopBluetoothDevicesDiscovery(OBJECT)）
停止搜寻附近的蓝牙外围设备。已经找到需要的蓝牙设备并不需要继续搜索时，调用该接口停止蓝牙搜索。

```javascript
// 关闭蓝牙设备搜素
export function closeBluetoothSearch() {
	return new Promise((resolve, reject) => {
		uni.stopBluetoothDevicesDiscovery({
			success: (res) => {
				console.log('关闭蓝牙搜索成功', res);
				resolve(res);
			},
			fail: (err) => {
				console.log('关闭蓝牙搜索失败', err);
				reject(err);
			}
		});
	});
}
```

### 1.6 连接低功耗蓝牙设备（uni.createBLEConnection(OBJECT)）

```javascript
/**
 * 连接 BLE 设备
 * @param {String} deviceId 设备ID
 */
export function connectBleById(deviceId, timeout = 10000) {
	return new Promise((resolve, reject) => {
		uni.createBLEConnection({
			deviceId,
			timeout,
			success(res) {
				console.log('连接成功', res);
				resolve(res);
			},
			fail(err) {
				console.log('连接失败', err);
				resolve(err)
			}
		})
	})
}
```
**传入参数params说明（除deviceId必填外，为非必填，且默认值为空）**
| 属性| 类型 |说明|
|:------:| :------:|:------:|
timeout|`number`	|超时时间，单位ms，不填表示不会超时，京东小程序不支持

**注意**
- 若APP在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作。
- 请保证尽量成对的调用 createBLEConnection 和 closeBLEConnection 接口。安卓如果多次调用 createBLEConnection 创建连接，有可能导致系统持有同一设备多个连接的实例，导致调用 closeBLEConnection 的时候并不能真正的断开与设备的连接。
- 蓝牙连接随时可能断开，建议监听 uni.onBLEConnectionStateChange 回调事件，当蓝牙设备断开时按需执行重连操作。
- 若对未连接的设备或已断开连接的设备调用数据读写操作的接口，会返回 10006 错误，建议进行重连操作。

### 1.7 断开低功耗设备蓝牙（uni.closeBLEConnection(OBJECT)）
```javascript
/**
 * 断开连接 BLE 设备
 * @param {String} deviceId 设备ID
 */
export function closeConnectBleById(deviceId) {
	return new Promise((resolve, reject) => {
		uni.closeBLEConnection({
			deviceId,
			success(res) {
				console.log('断开连接成功', res);
				resolve(res)
			},
			fail(err) {
				console.error('断开连接失败', err)
				reject(err)
			}
		})
	})
}
```
### 1.8 设置蓝牙最大传输单元（uni.setBLEMTU(OBJECT)）
```javascript
/**
 * 设置蓝牙最大传输单元
 * 
 * @param {String} deviceId 设备ID
 * @param {Number} mtu 最大传输单元(22,512) 区间内，单位 bytes
 */
export function setBLEMTU(deviceId, mtu) {
	return new Promise((resolve, reject) => {
		uni.setBLEMTU({
			deviceId,
			mtu,
			success(res) {
				console.log('设置MTU成功', res);
				resolve(res);
			},
			fail(err) {
				console.log('设置MTU失败', err);
				reject(err)
			}
		})
	})
}
```
**传入参数说明**
|属性|类型|说明|
|:--:|:--:|:--:|
deviceId|`string`|用于区分设备的 id
mtu|`number`|最大传输单元(22,512) 区间内，单位 bytes

**注意**
- 该接口必须在 uni.createBLEConnection()调用成功后调用。
- mtu 设置范围是 (22,512)，具体参数应由设备端进行确认。

### 1.9 获取蓝牙设备服务（uni.getBLEDeviceServices(OBJECT)）
```javascript
/**
 * 获取服务
 * @param {String} deviceId 设备地址
 */
export function getServices(deviceId) {
	return new Promise((resolve, reject) => {
		uni.getBLEDeviceServices({
			deviceId,
			success(res) {
				console.log('获取服务成功', res)
				resolve(res)
			},
			fail(err) {
				console.error('获取服务失败', err)
				reject(err)
			}
		})
	})
}
```
**返回结果`res.services`说明**
|属性|类型|说明|
|:--:|:--:|:--:|
|uuid|`string`|蓝牙设备服务的 uuid
|isPrimary|`boolean`|该服务是否为主服务

**注意**
要想使用读、写、监听等操作，必须先按序获取相应的特征值与服务值，否则无法正常进行相关操作。

### 1.10 获取特征值（uni.getBLEDeviceCharacteristics(OBJECT)）
特征值属于服务值的一种子集，因此获取特征值前必须要先获得服务值。
```javascript
/**
 * 获取特征值
 * @param {String} deviceId 设备地址
 * @param {String} serviceId 服务ID
 */
export function getBLEDeviceCharacteristics(deviceId, serviceId) {
	return new Promise((resolve, reject) => {
		uni.getBLEDeviceCharacteristics({
			deviceId,
			serviceId,
			success(res) {
				console.log('获取特征值成功', res)
				resolve(res)
			},
			fail(err) {
				console.error('获取特征值失败', err)
				reject(err)
			}
		})
	})
}
```
**传入参数说明**
传入的两个参数均必填
|属性|类型|说明|
|:--:|:--:|:--:|
deviceId|`string`|蓝牙设备id（设备地址）
serviceId|`string`|蓝牙服务UUID

**返回参数`res.characteristics `结构**
|属性|类型|说明|
|:--:|:--:|:--:|
uuid|`string`|蓝牙设备特征值的 UUID
properties|`Object`|该特征值支持的操作类型

**参数`properties`结构**
|属性|类型|说明|
|:--:|:--:|:--:|
read|`boolean`|该特征值是否支持 read 操作
**write**|`boolean`|该特征值是否支持 write操作
**notify**|`boolean`|该特征值是否支持 notify操作（监听）
indicate|`boolean`|该特征值是否支持 indicate 操作

### 1.11 向低功耗蓝牙设备写入数据（uni.writeBLECharacteristicValue(OBJECT)）
在使用这个接口前，设备的特征值必须支持 write，且要获取成功， 才可以成功调用该接口。
```javascript
/**
 * 向低功耗蓝牙设备特征值中写入二进制数据
 * @param {Object} deviceId 设备地址 serviceId 服务ID characteristicId 特征ID
 * @param {ArrayBuffer} value 蓝牙设备特征值对应的二进制值
 */
export function writeBLECharacteristicValue({
	deviceId,
	serviceId,
	characteristicId
}, value) {
	return new Promise((resolve) => {
		uni.writeBLECharacteristicValue({
			deviceId,
			serviceId,
			characteristicId,
			value,
			success(res) {
				console.log('写入二进制数据成功', res)
				resolve(res)
			},
			fail(err) {
				console.error('写入二进制数据失败', err)
				resolve(err)
			}
		})
	});
}
```
**传入参数说明**
|属性|类型|说明|
|:--:|:--:|:--:|
deviceId|`string`|蓝牙设备 id
serviceId|`string`|蓝牙特征值对应**服务**的 UUID
characteristicId|`string`|蓝牙特征值的 UUID
value|`ArrayBuffer`|蓝牙设备特征值对应的**二进制值**

### 1.12读取蓝牙设备的二进制数据值（uni.readBLECharacteristicValue(OBJECT)）
该接口不太常用，若需使用，则设备的特征值必须要支持read。
```javascript
/**
 * 读取低功耗蓝牙设备的特征值的二进制数据值
 * 
 * @param {Object} deviceId 设备地址 serviceId 服务ID characteristicId 特征ID
 */
export function readBLECharacteristicValue({
	deviceId,
	serviceId,
	characteristicId
}) {
	return new Promise((resolve, reject) => {
		uni.readBLECharacteristicValue({
			deviceId,
			serviceId,
			characteristicId,
			success(res) {
				console.log('读取二进制数据成功', res)
				resolve(res)
			},
			fail(err) {
				console.error('读取二进制数据失败', err)
				reject(err)
			}
		})
	});
}
```
**传入参数说明**
同**1.11**读取数据的传入参数。

### 1.13 开启蓝牙设备发出的数据的监听功能（uni.notifyBLECharacteristicValueChange(OBJECT)）
uniapp官方 称为：启用低功耗蓝牙设备特征值变化时的 notify 功能。
**注意**
- 须设备的特征值支持 notify 或者 indicate 才可以成功调用。
- 须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件。
- 订阅操作成功后需要设备主动更新特征值的 value，才会触发 uni.onBLECharacteristicValueChange 回调。
- 安卓平台上，在调用 notifyBLECharacteristicValueChange 成功后，立即调用writeBLECharacteristicValue 接口，在部分机型上会发生 10008 系统错误。
```javascript
/**
 * 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
 * 
 * @param {Object} deviceId 设备地址 serviceId 服务ID characteristicId 特征ID
 */
export function notifyBLECharacteristicValueChange({
	deviceId,
	serviceId,
	characteristicId
}) {
	return new Promise((resolve, reject) => {
		uni.notifyBLECharacteristicValueChange({
			deviceId,
			serviceId,
			characteristicId,
			state: true,
			success(res) {
				console.log('订阅特征值成功', res)
				resolve(res)
			},
			fail(err) {
				console.error('订阅特征值失败', err)
				reject(err)
			}
		})
	});
}
```
**传入参数说明**
同**1.11**读取数据的传入参数，其中state为是否启用notify，默认设置为true，设置为false没任何效果（初步判断是官方缺陷）。
### 1.14 监听数据返回（uni.onBLECharacteristicValueChange()）
使用该接口前，必须先调用1.13中的uni.notifyBLECharacteristicValueChange()接口，否则接收不到相关数据。
```javascript
// 特征值变化监听
	const listenCharacteristicValueChange = () => {
		console.log('开始监听');
		openlListen.value = true
		uni.onBLECharacteristicValueChange(res => {
			const value = Ab2Hex(res.value);
			console.log("监听结果：", res, value);
			uni.$emit('updateMCU', value);

		}).catch(err => {
			openlListen.value = false
		});
```
**注意**
- uniapp官方在处理该接口时存在问题，无对应的关闭监听操作，如果启动多个监听操作会导致数据污染以及无法判断所需要的数据。因此，全局范围内容只能够启动一个监听操作，无蓝牙相关操作时建议直接关闭蓝牙适配器。
- 建议使用`uni.$emit()`方法抛出相关返回数据，在所需页面中再使用，`uni.$once()`或`uni.$on()`对相关数据进行接收，且接收后及时使用`uni.$off()`关闭。

**返回数据说明**
|属性|类型|说明|
|:--:|:--:|:--:|
deviceId|`string`|蓝牙设备 id
serviceId|`string`|蓝牙特征值对应服务的 UUID
characteristicId|`string`|蓝牙特征值的 UUID
value|`ArrayBuffer`|特征值最新的值

### 1.15 报错代码清单
|错误码|错误信息|说明|
|:--:|:--:|:--:|
0|ok|正常
10000|not init|未初始化蓝牙适配器
10001|not available|当前蓝牙适配器不可用
10002|no device|没有找到指定设备
10003|connection fail|连接失败
10004|no service|没有找到指定服务
10005|no characteristic|没有找到指定特征值
10006|no connection|当前连接已断开
10007|property not support|当前特征值不支持此操作
10008|system error|其余所有系统上报的异常
10009|system not support|Android 系统特有，系统版本低于 4.3 不支持 BLE
10010|already connect|已连接
10011|need pin|配对设备需要配对码
10012|operate time out|连接超时
10013|invalid_data|连接 deviceId 为空或者是格式不正确

___

## 二、封装hooks主要方法（index.js）
对低功耗蓝牙API进行封装后，再封装一个hooks对相关逻辑进行处理，在hooks中需要设计部分业务需要的方法，大致如下：
| 方法名| 参数	| 说明		|
| ---- | ---- | ---- |
|	openBluetooth		|	——		|	开启蓝牙	|
|	searchBluetooth		|	——			|	开始搜索蓝牙设备，需结合 `listenBluetoothFound` 方法监听搜索蓝牙	|
|	getBluetoothStatus		|	——	|	获取蓝牙状态，返回 `{ available: Boolean, discovering: Boolean }`, `available` 表示蓝牙是否可用，`discovering` 表示是否启用蓝牙搜索	|
|	listenBluetoothFound	|	——		|	监听搜索蓝牙		|
|	stopBluetooth		|	——	|	停止搜索|
|	listenConnectStatus	|	——				|	监听蓝牙连接状态		|
|	listenCharacteristicValueChange	|	——			|	监听蓝牙特征值变化	|
|	notifyCharacteristicValueChange|	`async ( { deviceId, serviceId, characteristicId })`, 第一个参数包含设备ID, 服务ID, 特征值ID|订阅蓝牙特征值变化|
|	connectBluetooth|	`async (id, mtu)`, `id` 为蓝牙设备ID, `mtu` 为蓝牙写入的字节大小		|	连接蓝牙，连接成功后延时 1s 后调用 `getServicesInfo` 方法		|
|	closeBluetoothConnection	|	`async (id)`, `id` 为蓝牙设备ID	|	关闭连接蓝牙			|
|	getServicesInfo|	`async (id)`, `id` 为蓝牙设备ID		|	获取服务值和对应的特征值数据	|
|	writeBluetooth	|	`async ( { deviceId, serviceId, characteristicId }, value, type = "Json")`, 第一个参数包含设备ID, 服务ID, 特征值ID, 第二个参数为写入的值，第三个参数为数据类型，可选值为 `['Hex', 'Json']`	|	写入蓝牙数据			|
|	readBluetooth	|	`async ( { deviceId, serviceId, characteristicId })`, 第一个参数包含设备ID, 服务ID, 特征值ID|	读取蓝牙数据		|
|	closeBluetooth		|	——	|关闭蓝牙功能


主模块设计为：
```javascript
export function useBluetooth() {
...
return {
	...
	}
}
```
下面罗列部分重点方法。

代码块约定：
- 主模块之外的参数另起一个代码块置前。
- 默认引入一章节中的所有API。
### 2.1 搜索低功耗蓝牙设备
```javascript
// 定时搜索
const searchInterval = ref();
// 设备连接状态
export const isConnected = ref(false);
// 设备蓝牙数据
export const devicesData = ref([]);
// 当前蓝牙项
export const conectedDevice = ref({});
// 定时搜索时长
const searchDurationTime = 5000;
```
蓝牙搜索前，需要开启搜索设备监听
```javascript
// 蓝牙监听
	const listenBluetoothFound = () => {
		uni.onBluetoothDeviceFound(
			res => {
				res.devices.forEach(v => {
					const _device = devicesData.value.find(item => item.deviceId === v.deviceId);
					// 设备名称不为空
					if (!_device && v.name !== '') {
						devicesData.value.push({
							...v,
							connected: false
						});
						devicesData.value = _.orderBy(devicesData.value, ['RSSI'], ['desc']);
						console.log("devicesData.value", devicesData.value);
					}
				});
			}
		);
	}
```

蓝牙搜索时，逻辑上需要先检查相关的适配器是否已开启，另需附加一个定时器处理进行重试操作。
```javascript
	// 蓝牙搜索
	const searchBluetooth = async () => {
		try {
			// 清除计时器
			if (searchInterval.value) clearInterval(searchInterval.value);
			// 获取蓝牙状态
			const _status = await getBluetoothStatus();
			// 蓝牙适配器是否可用
			if (_status.available) {
				// 是否正在搜索中
				if (_status.discovering) return;

				// 开启蓝牙监听时加入已连接设备
				if (isConnected.value && devicesData.value.length === 0) {
					devicesData.value.push(conectedDevice.value);
				}
				// 开始搜索蓝牙设备
				await startBluetoothSearch();
			} else {
				// 初始化蓝牙
				await initBluetooth();
				// 搜索蓝牙
				searchBluetooth();
			}
		} catch (err) {
			// 清除计时器
			if (searchInterval.value) clearInterval(searchInterval.value);
			// 开启定时器
			searchInterval.value = setInterval(() => {
				searchBluetooth();
			}, searchDurationTime);
		}
	}

```
### 2.2 处理搜索到的低功耗蓝牙设备数据
设置全局的蓝牙设备列表、连接设备id（mac地址）、搜索设备值
```javascript
import {
	computed
} from 'vue';
// 设备蓝牙数据
export const devicesData = ref([]);
// 设备搜索值
export const searchValue = ref('');
// 设备 ID
export const deviceId = ref('');
```
搜索设备方法，使用了computed属性监听连接设备的id（mac地址）变化，触发相应的列表处理。
```javascript
	// 检索的设备数据
	const filterDevicesData = computed(() => {
		// 获取连接过的设备数据
		const connectedDevices = getConnectedDevices();
		// 监测连接状态
		!!deviceId.value;
		// 监听连接状态
		connectedDevices.map(item => {
			item.connected = item.deviceId === deviceId.value;
		});
		const connectedDeviceIds = connectedDevices.map(item => item.deviceId);
		// 移除显示的已连接设备数据
		const _filterConnectedDevices = devicesData.value.filter(item => !connectedDeviceIds.includes(item
			.deviceId));
		return _filterConnectedDevices.filter(item => item.name && item.name.includes(searchValue.value));
	});
	
	// 获取已连接的数据
	const getConnectedDevices = (len = 3) => {
		const _connectedStorage = uni.getStorageSync('connectedDevices') || '[]';
		const _connectedDevices = JSON.parse(_connectedStorage);
		return _connectedDevices.slice(0, len);
	}
```
### 2.3 连接蓝牙
连接蓝牙时，需要注意是否存在已连接设备，若存在则需要先断开已连接设备再连接新设备，否则会造成功能异常。
```javascript
	// 连接蓝牙设备
	const connectBluetooth = async (id, mtu) => {
		try {
			// 监测是否存在上次连接设备
			if (deviceId.value ) {
				try {
					// 确认后打开蓝牙
					const isConfirm = await toggleDeviceModal();
					if (isConfirm) {
						// 断开蓝牙连接
						uni.showLoading({
							title: '处理中',
							mask: true
						});
						// 关闭断开成功连接提示，防止影响 uni.showLoading 失效
						isTipForDisconnected.value = false;
						const res = await closeConnectBleById(deviceId.value);
						uni.hideLoading();
					} else {
						console.log("取消断开")
						return;
					}
				} catch (err) {
					errorCodeTip(err.code);
					return;
				}
			}
			// 连接设备
			uni.showLoading({
				title: '连接设备中',
				mask: true
			});
			const res = await connectBleById(id);
			// 设备状态改变
			devicesData.value.forEach(item => {
				if (item.deviceId === id) {
					// 当前连接设备数据
					deviceId.value = id;
					conectedDevice.value = item;
				}
			});
			uni.hideLoading();
			// 设置蓝牙最大传输单元
			await setBLEMTU(id, mtu);
			// 订阅特征值变化并建立监听
			notifyBLEChangeTime.value = 0
			notifyBluetoothcharacteristicChange();
			return res
		} catch (err) {
			errorCodeTip(err.code);
		}
	}
	// 切换设备弹窗
	const toggleDeviceModal = () => {
		return new Promise((resolve, reject) => {
			uni.showModal({
				title: "提示",
				content:"已存在蓝牙连接，是否进行切换蓝牙设备?",
				confirmText:"确定",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						resolve(true);
					}
					if (res.cancel) {
						resolve(false);
					}
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	}
	
	// 订阅特征值变化，并建立监听，失败重连
	const notifyBluetoothcharacteristicChange = async () => {
		// 订阅消息
		let notify = await notifyCharacteristicValueChange({
			deviceId: deviceId.value,
			serviceId: serviceUuid.value,
			characteristicId: readUuid.value
		});
		
		notifyBLEChangeTime.value++
		if (notify.errMsg == "notifyBLECharacteristicValueChange:ok") {
			notifyBLEStatus.value = true;
			// 监听消息
			if (!openlListen.value) {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '成功获取特征值',
						duration: 2000
					});
				listenCharacteristicValueChange();
			}
		} else {
			if (notifyBLEChangeTime.value > 50) {
				uni.hideLoading();
				uni.showToast({
					icon: 'none',
					title: t("bluetooth.notifyCharateristicFail"),
					duration: 2000
				});
				return false
			}
			setTimeout(() => {
				if (deviceId.value) {
					notifyBluetoothcharacteristicChange(update)
				} else {
					uni.hideLoading();
				}
			}, 200)
		}
	}
```
### 2.4 写入蓝牙数据
低功耗蓝牙的传输能力有限，因此需要注意每次传输的数据长度以及每包数据直接的传输间隔。
```javascript
// 写入操作
	const writeBluetooth = async ({
		deviceId,
		serviceId,
		characteristicId
	}, value) => {
		//延迟函数
		const Delayed = function(ms, callback) {
			return new Promise(function(Resolve, Peject) {
				setTimeout(function() {
					Resolve(callback);
				}, ms);
			});
		};
		try {
			// 处理待传入蓝牙的数据
			let rawValue = '...';
			let writeValue = null;
			// 写入数据转化,仅使用十六进制字符串转arraybuffer格式
			writeValue = Hex2Ab(rawValue);
			// 分包写入
			// 设置每包最大写入字节，根据具体协议调整长度
			let maxByte = 230;
			let length = writeValue.byteLength;
			let count = Math.ceil(length / maxByte);
			for (let i = 0; i < count; i++) {
				//对writeValue进行分包，最大不超过maxByte
				let TempBuffer;
				if (((i + 1) * maxByte) < length) {
					TempBuffer = writeValue.slice(i * maxByte, (i + 1) * maxByte);
				} else {
					TempBuffer = writeValue.slice(i * maxByte, length);
				};
				Delayed(200).then(() => { //延迟200ms
					//写入设备
					const res = writeBLECharacteristicValue({
						deviceId,
						serviceId,
						characteristicId
					}, TempBuffer);
				});
			};
		} catch (err) {
			console.log('==== err :', err);
			errorCodeTip(err.code);
		}
	}
```
### 2.5 读取蓝牙数据
在实际开发场景中，由于蓝牙终端的设计原因，较少使用本方法进行读取。
```javascript
	// 读取操作
	const readBluetooth = async ({
		deviceId,
		serviceId,
		characteristicId
	}) => {
		try {
			const res = await readBLECharacteristicValue({
				deviceId,
				serviceId,
				characteristicId
			});
			return res;
		} catch (err) {
			errorCodeTip(err.code);
		}
	}
```
常用的方法是对所获取的特征值变化进行监听，监听数据后抛出即可。该方法需要在写入前调用，以免错过设备端返回数据。
```javascript
const listenCharacteristicValueChange = () => {
		console.log('开始监听');
		openlListen.value = true
		uni.onBLECharacteristicValueChange(res => {
			const value = Ab2Hex(res.value);
			console.log("监听结果：", res, value);
			uni.$emit('updateMCU', value);

		}).catch(err => {
			openlListen.value = false
		});
	}
```
___
## 三、部分注意事项
### 3.1 监听搜索设备方法
uniapp提供的搜索蓝牙设备API`uni.onBluetoothDeviceFound()`无对应的停止或销毁方法，因此需要将其挂载到`App.vue`文件中供全局使用。
```javascript
<script>
 	import { useBluetooth } from "@/hooks/useBluetooth/index.js";
 	export default {
 		onLaunch: function() {
 			const { listenBluetoothFound} = useBluetooth();
 			// 开启蓝牙监听
 			listenBluetoothFound();
 		},
 	}
 </script>
```
同理，其提供的特征值变化监听方法`uni.onBLECharacteristicValueChange()`也存在同样的问题，没有与之对应的停止或销毁方法，因此在使用该方法时，需要注意每连接一次低功耗蓝牙设备只能开启一次监听。
### 3.2 获取蓝牙服务值与特征值
由于相关连接机制问题，在成功连接到低功耗蓝牙设备后，需要延时一秒以上再获取服务值与特征值，否则无法正常获取到服务值。另外，服务值并非一次就能够获取成功，需要设置重试机制轮询获取服务值。
在实际调试场景中，如果在真机调试中刷新了页面，导致了服务值一直获取失败，需要检查蓝牙设备是否被手机系统蓝牙连接，如手机系统未提示，则可通过开关蓝牙并重启应用解决类似问题。
### 3.3 API支持范围
1.相关API只能支持低功耗蓝牙；
2.搜索时也只能搜索到低功耗蓝牙设备；
3.MTU的设置只能支持Android5.1以上。
___
## 参考文档
1. uniapp蓝牙部分参数[方法文档](https://uniapp.dcloud.net.cn/api/system/ble.html)： https://uniapp.dcloud.net.cn/api/system/ble.html