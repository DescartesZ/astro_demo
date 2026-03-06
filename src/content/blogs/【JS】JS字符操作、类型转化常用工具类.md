---
title: "【JS】JS字符操作、类型转化常用工具类"
description: "这是一个关于如何使用 JS 字符操作、类型转化常用工具类的指南。"
author: "DescartesZ"
pubDate: 2023-11-16
tags:
  ["类型转化","JS","字符操作","常用工具类"]
---
# 【JS】JS字符操作、类型转化常用工具类
```javascript

export default class PMQTPTools {

    /**
         *
     * utf8字符串转16进制字符串
     * @utf8string 输入原始字符串
     * @return 对象{转换的字节总数, 16进制字符串}
     *
     * demo
     *   let str = 'utf8字符串';
     *   const {writeSizes, hexString} = PMQTPTools.writeUTF8(str);
     *   console.log(writeSizes, hexString);
         *
     */
    static writeUTF8 (utf8string) {
        let ret = {writeSizes:0, hexString:''};

        const {byteSizes, decimalBytes} = this.transToUTF8(utf8string);

        ret.writeSizes = byteSizes;
        ret.hexString = this.decimalBytesToHexString(decimalBytes);

        return ret;
    }


    /**
         *
     * utf8字符串转16进制字符数组
     * @utf8string 输入原始字符串
     * @return 对象{转换的字节总数, 固定2位格式的16进制字符串数组}
     *
     * demo
     *   let str = 'utf8字符串';
     *   const {sizes, bytes} = PMQTPTools.bytesUTF8(str);
     *   console.log(sizes, bytes);
         *
     */
    static hexBytesUTF8 (utf8string) {
        let ret = {sizes:0, bytes:[]};

        const {byteSizes, decimalBytes} = this.transToUTF8(utf8string);

        ret.sizes = byteSizes;
        ret.bytes = this.decimalBytesToHexBytes(decimalBytes);

        return ret;
    }


    /**
         *
     * utf8字符串转十进制字符数组
     * @utf8string 输入原始字符串
     * @return 对象{转换的字节总数, 10进制字节数组}
     *
     * demo
     *   let str = 'utf8字符串';
     *   const {byteSizes, decimalBytes} = PMQTPTools.transToUTF8(str);
     *   console.log(byteSizes, decimalBytes);
         *
     */
    static transToUTF8 (utf8string) {
        let ret = {byteSizes:0, decimalBytes:[]};

        let  byteSize = 0;
        let  back = [];

        for (let i = 0; i < utf8string.length; i++) {

             let code = utf8string.charCodeAt(i);
             if (0x00 <= code && code <= 0x7f) {
                 byteSize += 1;
                 back.push(code);
             } else if (0x80 <= code && code <= 0x7ff) {
                 byteSize += 2;
                 back.push((192 | (31 & (code >> 6))));
                 back.push((128 | (63 & code)))
             } else if ((0x800 <= code && code <= 0xd7ff)
                 || (0xe000 <= code && code <= 0xffff)) {
                 byteSize += 3;
                 back.push((224 | (15 & (code >> 12))));
                 back.push((128 | (63 & (code >> 6))));
                 back.push((128 | (63 & code)))
             }
        }

        for (let i = 0; i < back.length; i++) {
            back[i] &= 0xff;
        }

        ret.byteSizes = byteSize;
        ret.decimalBytes = back;

        return ret;
    }


     /**
            *
      * 16进制字符串转utf8字符串
      * @hexString 输入原始字符串
      * @return 对象{转换的字节总数, utf8字符串}
      *
      * demo
      *   const {readSizes, utf8String} = PMQTPTools.readUTF8('75746638e5ad97e7aca6e4b8b2');
      *   console.log(readSizes, utf8String);
            *
      */
     static readUTF8 (hexString) {
        let ret = {readSizes:0, utf8String:''};
                const {utf8Sizes, utf8Bytes} = this.transFromUTF8(hexString);

                ret.readSizes = utf8Sizes;
        ret.utf8String = utf8Bytes.join('');

        return ret;
     }


         /**
            *
            * 16进制字符串转utf8字符数组
            * @hexString 输入原始16进制字符串
            * @return 对象{转换的字节总数, utf8字符数组}
            *
            * demo
            *   const {utf8Sizes, utf8Bytes} = PMQTPTools.transFromUTF8('75746638e5ad97e7aca6e4b8b2');
            *   console.log(utf8Sizes, utf8Bytes);
            *
            */
         static transFromUTF8 (hexString) {

                let ret = {utf8Sizes:0, utf8Bytes:[]};

                let back = [];
                const array = this.hexStringToDecimalBytes(hexString);
                ret.utf8Sizes = array.length;

                for (let i = 0; i < array.length; i++) {

                        const one = array[i].toString(2);
                        const v = one.match(/^1+?(?=0)/);

                        if (v && one.length == 8) {

                                let bytesLength = v[0].length;
                                let store = array[i].toString(2).slice(7 - bytesLength);

                                for (let st = 1; st < bytesLength; st++) {
                                        store += array[st + i].toString(2).slice(2);
                                }

                                back.push(String.fromCharCode(parseInt(store, 2)));
                                i += bytesLength - 1;
                        } else {
                                back.push(String.fromCharCode(array[i]));
                        }
                }
                ret.utf8Bytes = back;

                return ret;
         }


    /**
         *
     * 写UTF16字符串
     * @param pValue 原始字符串
         *
     */
    static writeUTF16 (pValue) {
        pValue.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
    }


    /***
         *
     * 读取UTF16字符串
     * @param pValue UTF16字节码
         *
     */
    static ReadUTF16 (pValue) {
         unescape(pValue.replace(/&#x/g,'%u').replace(/\\u/g,'%u').replace(/;/g,''));
    }


    /**
         *
     * uint8转8位二进制字节码
     * @byte 单字节数字
     * @return 字符串 形如：'10001100'
         *
     */
    static uint8ToByteString(byte) {
        let ret = [];

        const string = byte.toString(2);
        for (let i = string.length; 8 - i > 0; i++){
            ret.push('0');
        }
        ret.push(string.substr(-8));

        return ret.join('');
    }


        /**
         *
     * uint16转16位二进制字节码
     * @number 数字number
     * @return 字符串 形如：'1000110010001100'
         *
     */
    static uint16ToByteString(number) {
        let ret = [];

        const string = number.toString(2);
        for (let i = string.length; 16 - i > 0; i++){
            ret.push('0');
        }
                ret.push(string.substr(-16));

        return ret.join('');
    }


        /**
         *
     * uint32转32位二进制字节码
     * @number 数字number
     * @return 字符串 形如：'10001100100011001000110010001100'
         *
     */
    static uint32ToByteString(number) {
        let ret = [];

        const string = number.toString(2);
        for (let i = string.length; 32 - i > 0; i++){
            ret.push('0');
        }
                ret.push(string.substr(-32));

        return ret.join('');
    }


    /**
         *
     * uint8转16进制字节码
     * @number 单字节数字number
     * @return 字符串 形如：'FF'
         *
     */
    static uint8ToHexString(number) {
        let ret = [];

        let string = '0';
        if (typeof number === 'string'){
                        const { hexString } = PMQTPTools.writeUTF8(number);
                        string = hexString.substr(0, 2);
                } else {
                        string = number.toString(16);
                }

        const length = string.length;

        if(length == 1)
        {
           ret.push(0);
           ret.push(string);
        } else {
            ret.push(string.substr(-2));
        }

        return ret.join('');
    }


        /**
         *
     * 16位整数转16进制字节码
     * @number 数字number
     * @return 字符串 形如：'FFFFFFFF'
         *
     */
    static uint16ToHexString(number) {
        let ret = [];

                let string = '0';
        if (typeof number === 'string'){
                        const { hexString } = PMQTPTools.writeUTF8(number);
                        string = hexString.substr(0, 2);
                } else {
                        string = number.toString(16);
                }

        const length = string.length;

                for (let i = length; 4 - i > 0; i++){
            ret.push('0');
        }

                if(length <= 4)
        {
           ret.push(string);
        } else {
            ret.push(string.substr(-4));
        }

        return ret.join('');
    }


        /**
         *
     * 32位整数转16进制字节码
     * @number 数字number
     * @return 字符串 形如：'FFFFFFFF'
         *
     */
    static uint32ToHexString(number) {
        let ret = [];

                let string = '0';
        if (typeof number === 'string'){
                        const { hexString } = PMQTPTools.writeUTF8(number);
                        string = hexString.substr(0, 2);
                } else {
                        string = number.toString(16);
                }

        const length = string.length;

                for (let i = length; 8 - i > 0; i++){
            ret.push('0');
        }

                if(length <= 8)
        {
           ret.push(string);
        } else {
            ret.push(string.substr(-8));
        }

        return ret.join('');
    }


    /**
         *
     * 十进制字节数组转十六进制字符串
     * @bytes 字节数组 bytes[]
     * @return 字符串 形如：'ff00fffe...'
         *
     */
    static decimalBytesToHexString(bytes){
        let ret = [];

        for(let data of  bytes)
        {
           let tmp = data.toString(16);

           if(tmp.length == 1)
           {
               tmp = "0" + tmp;
           }

           ret.push(tmp)
        }

        return ret.join('');
    }


        /**
         *
     * 十进制字符数组转换十六进制字符数组
     * @decimalbytes 字节数组 bytes[0,1]
     * @return 字节数组 bytes[00,01]
         *
     */
    static decimalBytesToHexBytes(decimalbytes){
        let ret = [];

        for(let data of  decimalbytes)
        {
           let tmp = data.toString(16);

           if(tmp.length == 1)
           {
               tmp = "0" + tmp;
           }

           ret.push(tmp)
        }

        return ret;
    }


    /**
         *
     * 十六进制字符串转十进制字节数组
     * @hexString 字节数组 形如：'ff00fffe...'
     * @return 字节数组 bytes[]
         *
         * demo
         *
         *  const ret = PMQTPTools.hexStringToDecimalBytes('75746638e5ad97e7aca6e4b8b2');
         *  console.log(ret); // [ 117, 116, 102, 56, 229, 173, 151, 231, 172, 166, 228, 184, 178 ]
         *
     */
    static hexStringToDecimalBytes(hexString){
        let ret = [];

        let pos = 0;
        let length = hexString.length;

        if(length % 2 != 0)
        {
           return null;
        }

        length /= 2;
        for(let i = 0; i < length; i++)
        {
           let s = hexString.substr(pos, 2);
           let v = parseInt(s, 16);
           ret.push(v);

           pos += 2;
        }

        return ret;
    }



        /**
         *
         * 十六进制字符串转十六进制字节数组
         *
         * @string 字节数组 形如：'75746638e5ad97e7aca6e4b8b2'
         * @return 字节数组 bytes[]
         *
         * demo
         *
         *  const ret = PMQTPTools.hexStringToHexBytes('75746638e5ad97e7aca6e4b8b2');
         *  console.log(ret); // [ '75','74','66','38','e5','ad','97','e7','ac','a6','e4','b8','b2' ]
         *
         */
    static hexStringToHexBytes(hexString){
        let ret = [];

        let pos = 0;
        let length = hexString.length;

        if(length % 2 != 0)
        {
           return null;
        }

        length /= 2;
        for(let i = 0; i < length; i++)
        {
           let s = hexString.substr(pos, 2);
           ret.push(s);

           pos += 2;
        }

        return ret;
    }


        /**
         *
     * 写消息体属性
     * @attribute 对象 {remain, slice, codec}
     *
     * @return 单字节数字number
     *
     * demo
     *
     *  import {
     *     PMQTPStack,
     *     PMQTPAttribute,
     *     PMQTPTools,
     *  } from '../../PMQTP/PMQTPPacket'
     *
     *  let attribute =  new PMQTPAttribute();
     *  attribute.remain = '000';
     *  attribute.slice = '1';
     *  attribute.codec = '0000';
     *
     *  let ret = PMQTPTools.writeAttribute(attribute);
     *  console.log(PMQTPTools.uint8ToByteString(ret));
     *
     *  or
     *
     *  let attribute =  new PMQTPAttribute();
     *  attribute.setState({remain:'000',slice:'1',codec:'1100'});
     *
     *  let ret = PMQTPTools.writeAttribute(attribute);
     *  console.log(PMQTPTools.uint8ToByteString(ret));
         *
     */
     static writeAttribute = (attribute) => {
        let sign = [];

        const {remain, slice, codec} = attribute;
        sign.push('0b');
        sign.push(remain);
        sign.push(slice);
        sign.push(codec);

        return Number(sign.join(''));
    }


    /**
         *
     * 读消息体属性
     * @number 单字节数字number
     * @return 对象 {remain, slice, codec}
     *
     * demo
     *
     *  import {
     *     PMQTPStack,
     *     PMQTPAttribute,
     *     PMQTPTools,
     *  } from '../../PMQTP/PMQTPPacket'
     *
     *  let attribute =  new PMQTPAttribute();
     *  attribute.remain = '000';
     *  attribute.slice = '1';
     *  attribute.codec = '0000';
     *
     *  let ret = PMQTPTools.writeAttribute(attribute);
     *  console.log(PMQTPTools.uint8ToByteString(ret));
     *
     *  const {remain, slice, codec} = PMQTPTools.readAttribute(ret);
     *  console.log(remain, slice, codec);
         *
     */
     static readAttribute = (number) => {
        let ret = {remain:0, slice:0, codec:0};

        const string = PMQTPTools.uint8ToByteString(number);
        ret.remain = string.substring(0,3);
        ret.slice = string.substring(3,4);
        ret.codec = string.substring(4,8);

        return ret;
    }


        /**
         *
         * 标准CRC16校验码
         * @decimalBytes 输入十进制的字节数组
         * @return  返回uint16的数字
         *
         * demo
         *    const {decimalBytes} = PMQTPTools.transToUTF8('123456789');
         *      let crc = PMQTPTools.crc16(decimalBytes);
         *      hexCRC = PMQTPTools.uint16ToHexString(crc);
         *      console.log(hexCRC); // 29b1
         *
         */
         static crc16(decimalBytes) {
                let crc = 0xFFFF;

                let tabccitt = [];
                for (let i = 0; i < 256; i++) {

                        let ccitt = 0;
                        let c  = i << 8;

                        for (let j = 0; j < 8; j++) {

                                if ((ccitt ^ c) & 0x8000){
                                        ccitt = (ccitt << 1) ^ 0x1021;
                                }
                                else{
                                        ccitt =  ccitt << 1;
                                }

                                c = c << 1;
                        }

                        tabccitt.push(this.uint16ToHexString(ccitt));
                }

                for (let number of decimalBytes) {

                    const sc = 0x00FF & number;
                    const index = (0xFFFF) & ((crc >>> 8) ^ sc);

                    const n = Number.parseInt(tabccitt[index], 16);
                    crc = (0xFFFF) & ((0xFFFF) &(crc << 8)) ^ ((0xFFFF) & n);
                }

                return crc;
        }

}
```
