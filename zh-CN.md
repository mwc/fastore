# fastore - v1.0.4 (under MIT)
一个封装 localStorage 及 sessionStorage 的轻量级、快速易用的库。

![Build](https://img.shields.io/badge/build-passing-green.svg)
![Unit Tests](https://img.shields.io/badge/tests-51%20passed-green)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/fastore)
![License](https://img.shields.io/github/license/mwc/fastore)
![Download](https://img.shields.io/npm/dw/fastore)
![Version](https://img.shields.io/npm/v/fastore)
![Star](https://img.shields.io/github/stars/mwc/fastore?style=social)

[English](./README.md) | [简体中文](./zh-CN.md)

## 安装
### npm
```cmd
$ npm install --save-dev fastore
```

### CDN
```cmd
[unpkg]  https://unpkg.com/fastore
```

## 快速指南
fastore 即 fast store 之意，顾名思义，目的是提供一个快速使用本地存储的方式。

`localStorage` 与 `sessionStorage` 两者除了信息过期时间的长短不同之外，两者操作无任何区别。fastore 将 `localStorage` 导出为 `store`，`sessionStorage` 导出为 `session`。

下方示例均使用 `localStorage`（也即 `store`）来举例，`session` 操作亦然。

假设 `localStorage` 已存在如下表格的数据：
| Key | Value |
| - | - |
| userid | meishan001 |
| firstname | 苏 |
| lastname | 轼 |
| nick | 东坡 |
| family | { "wives": ["王朝云", "王弗", "王闰之"], sons: ["苏迈", "苏迨"] } |
| works.shi | ["题西林壁", "饮湖上初晴后雨", "惠崇春江晚景"] |
| works.ci | ["念奴娇·赤壁怀古", "水调歌头·明月几时有", "江城子·乙卯正月二十日夜记梦"] |
| works.zi | ["黄州寒食帖", "江上帖", "治平帖"] |
| works.wen | ["赤壁赋", "策断", "晁错论"] |
| works.hua | ["潇湘竹石图", "枯木怪石图", "偃松图卷"] |

### 1.获得所有的 key/value 对
仅需要不提供任何参数：
``` javascript
import { store } from 'fastore'

let all = store()     // 获得全部键值对
```

对于 `sessionStorage` 而言，唯一不同仅仅是使用时的名称：
``` javascript
import { session } from 'fastore'

let all = session()     // 获得全部键值对
```

> `store` 及 `session` 两者拥有相同的 API 方法，后续示例中，将 `store` 替换为 `session` 即代表使用的是 `sessionStorage`。

### 2. 获取一个值
``` javascript
import { store } from 'fastore'

store('userid')     // meishan001
```

获取多个值
``` javascript
import { store } from 'fastore'

store('firstname, nick')  // { firstname: '苏', nick: '东坡' }
store(['firstname', 'nick'])  // ['苏', '东坡']
```

> 存于 `localStorage` 或 `sessionStorage` 的值均为字符串，fastore 会自动将其值转为对象（使用 `JSON.parse()`）。

### 3.设置一个值
``` javascript
store('nick', '东坡居士')
```

值也可以是一个函数，它将被执行后，将返回值设置为 `key` 的值：
``` javascript
store('nick', (oldValue, index) => {
    return '东坡胖子'
})
```

> fastore 自动序列化传递的值（使用 `JSON.stringify()`），无需自行转换一次。

传递一个对象，可同时设置多个值：
``` javascript
store({ father: '苏洵', borther: '苏辙' })
```

将多个键设置为相同的值：
``` javascript
store('isMan, isLoveEat, isLoveTravel', true)

// 等价于
store(['isMan', 'isLoveEat', 'isLoveTravel'], true)
```

### 4.遍历 localStorage

若仅传递一个 `callback` 函数给 `store`，fastore 将遍历整个 `localStorage` 并传递每一个 `key` 及其对应的`值`给该 callback。

``` javascript
store((key, value, index) => {
    console.log(`${index}: ${key}=${value}`)
})
```

### 5.清空 localStorage
``` javascript
store.clear()
```
> 如果受限在命名空间下，它只会清除隶属该命名空间下的所有 key，详情参看第10节《命名空间》

### 6.获取现存有多少个数据
``` javascript
store.size()
```
> 如果受限在命名空间下，它只会计算隶属该命名空间下的所有 key 的总数，详情参看第10节《命名空间》

### 7.获取全部 key
``` javascript
store.keys()
```
> 如果受限在命名空间下，它只会返回隶属该命名空间下的所有 key，详情参看第10节《命名空间》

### 8.判断 key 是否存在
``` javascript
store.has('address')    // address 是否存在？结果 fasle
store.has('userid, nick')   // userid 及 nick 是否都存在？结果 true
```
> 如果受限在命名空间下，它只会判断隶属该命名空间范围内的 key 是否存在，详情参看第10节《命名空间》

### 9.移除指定 key-value
``` javascript
store.remove('address')
store.remove('address, nick')   // 同时移除多个键值
```
> 如果受限在命名空间下，它只会移除隶属该命名空间下的键值，详情参看第10节《命名空间》

### 10.命名空间
``` javascript
let works = store.namespace('works')

// ns 是 namespace 的速写形式
// let works = store.ns('works')

works('wen') // 获取 'works.wen' 的值
```

命名空间一般用于项目间或团队间隔离之用，目的是避免命名冲突。

一般命名空间使用点号 `.` 作为分隔，例如： `com.oa.workflow`。

如果使用了命名空间，所有操作将受限在命名空间下。
譬如添加一个新的项：

``` javascript
let works = store.namespace('works')

works('weiqi', '9段')
```

works 的用法与 `store` 一致，它有 `store` 全部相同的方法。
works 的 `keys()` 也只会返回 works 命名空间的全部键名（键名不包含命名空间前缀）：

``` javascript
let works = store.namespace('works')

works.keys()    // ['shi', 'ci', 'zi', 'wen', 'hua']
works.size()    // 5
store.size()    // 10
```

其余的 `size`、`has`、`clear`、`remove` 函数均受限在命名空间下操作：

``` javascript
let works = store.namespace('works')

works.has('nick')      // false
```

#### 层级分隔符

命名空间默认的层级分隔符为 `.`，在使用多层级命名空间的情况下，层级分隔符用于划分层级关系。
如需修改命名空间分隔符，可通过 `store.namespace` 的第2个（可选）参数给出：

``` javascript
import { store } from 'fastore'

// 创建 works 命名空间，并使用 '#' 作为分隔符
let works = store.namespace('works', '#')

works('shi')    // 获取 `works#shi` 的值
works('ci')     // 获取 `works#ci` 的值
```

除了默认的 `.` 外，推荐的命名空间层级分隔符有：`#`、`/`、`-`、 `|`。

> 命名空间层级分隔符不允许使用 `空白字符`、`数字`或`字母`。

#### 多级命名空间

命名空间不限制层级数量，允许在已有的命名空间的基础上，肆意创建多级命名空间：

``` javascript
import { store } from 'fastore'

let works = store.ns('works')
let others = works.ns('others') // 命名空间为：works.others

others('qin')   // 获取 `works.others.qin` 的值
others('kongfu') // 获取 `works.others.kongfu` 的值
```

如你仅需访问 `works.others` 命名空间，则直接使用该命名空间即可：

``` javascript
import { store } from 'fastore'

// 直接使用命名空间 works.others
let others = store.ns('works.others')

others('kongfu')
```

### Storage 事件

你可以通过监听 `Storage` 事件，以知悉 `store` 中数据项已发生变化。创建、更新或删除数据项时，均能收到通知（但对已存在的键进行赋值则不会触发此事件）。

```javascript
import { store } from 'fastore'

store.on(event => {
    // 当有任意 key 被创建、更新或删除时，这个 handler 将会被执行
})
```

> `event` 参数的详情，可参看本节末尾表格。

监听 API 还支持只监听某一个或几个你所关心的 key，其余则忽略处理：`store.on(keys, handler)` ：

```javascript
import { store } from 'fastore'

store.on('nick, firstname', event => {
    // 仅 nick 或 firstname 的值发生变化时，这个 handler 才会被执行
})
```

keys 参数可以是字符串，也可以是数组。

> 请注意：store 在同一页面内发生的变化不会触发 `Storage` 事件。不同域名的 store 均各不相同，而相同域名下，在其他页面中更改了 store 的数据项，当前页面才会接收到 `Storage` 事件。

如果你的站点仅有一个页面，它永远不会触发 `Storage` 事件，但是有一个技巧可以使得 `Storage` 事件得以触发，即在当前页面内嵌一个 `iframe`，在其内部对 `Storage` 进行修改。

`session` 则被限制在当前页面会话内有效，当前页面内的修改 `sessionStorage` 会触发 `Storage` 事件。

因为 `Storage` 是不分 `localStorage` 或 `sessionStorage` 的，因此很容易混淆及造成误解，fastore 会判断和分开它们各自的 `Storage` 事件进行响应处理，如 `session` 触发的 `Storage` 事件，仅会调用 `session` 来监听的 `handler`，即便 `session` 及 `store` 同时监听了 `Storage` 事件，fastore 能识别哪个变化来自 `session` 还是 `store`，从而调用相应的处理器。

如果受限在命名空间下，则仅支持监听该命名空间下的 key：

```javascript
import { store } from 'fastore'

let works = store.namespace('works')

works.on(event => {
    // 仅 workds 命名空间下的值发生变化时，这个 handler 才会被执行
})

// 同时支持过滤关注的 key
works.on('shi, ci', event => { ... })
```

### Storage 事件参数

| 名称 | 类型 | 说明 |
| - | - | - |
| key | string | 该属性代表被修改的键值。当被clear()方法清除之后该属性值为null。（只读），如受限在命名空间下，它不会展示命名空间前缀 |
| namespace | string | key 所在的命名空间 |
| oldValue | string | 该属性代表修改前的原值。在设置新键值对时由于没有原始值，该属性值为 null。（只读） |
| newValue | string | 该属性代表修改后的新值。当被clear()方法清理后或者该键值对被移除，newValue 的值为 null 。（只读） |
| url | string | key 发生改变的对象所在文档的URL地址。（只读）|

## 测试与构建

### 单元测试

```cmd
$ npm run test
```

Watch Test
```cmd
$ npm run test-watch
```

### 构建

```cmd
$ npm run build
```