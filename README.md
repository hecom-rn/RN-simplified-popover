# rn-simplified-popover

[![npm version](https://img.shields.io/npm/v/@hecom/rn-simplified-popover.svg)](https://www.npmjs.com/package/@hecom/rn-simplified-popover)
[![Build Status](https://travis-ci.org/hecom-rn/rn-simplified-popover.svg?branch=master)](https://travis-ci.org/hecom-rn/rn-simplified-popover)

## ReactNative气泡组件

![examplePng](https://github.com/hecom-rn/rn-simplified-popover/blob/master/example/example.png)


## 使用方法可以参考示例程序

# 属性说明
|属性名|类型|默认值|说明|是否必填|
|-----|----|----|-----|---|
|isVisible|boolean|false|组件是否展示|是|
|displayArea|Rect|window|背景区域大小|是|
|arrowSize|Size|Size(10, 5)|三角大小|否|
|placement|string|'auto'|位置(可传参数：'top','bottom','left','right')|否|
|fromRect|Rect|{ x: 0, y: 0, width: 0, height: 0 }|三角所指位置|是|
|onClose|func|() => { }|关闭回调|是|


Rect类型
```
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
```

Size类型
```
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
```

