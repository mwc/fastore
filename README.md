# fastore - v1.0.2 (under MIT)
一个封装 localStorage 及 sessionStorage 的轻量级、快速易用的库。

[English](./readme.md) | [简体中文](./zh-CN.md)

## Install
### npm
```cmd
$ npm install --save-dev fastore
```

### CDN
```cmd
[unpkg]  https://unpkg.com/fastore
```

## Quick Start
fastore 即 fast store 之意，顾名思义，目的是提供一个快速应用的本地存储方式。

localStorage 与 sessionStorage 两者除了信息保存时间的长短不同之外，其操作无任何区别。下方均使用 localStorage 来举例，session 操作亦然。

假设 localStorage 已存在如下表格的数据：
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

### 获得所有的 key/value 对
仅需要不提供任何参数：
``` javascript
import { store } from 'fastore'

let all = store()     // 获得全部键值对
```

### 1. 获取一个值
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

> 存于 localStorage 的值均为字符串，fastore 会自动将其值转为对象（使用 JSON.parse()）。

### 2.设置一个值
``` javascript
store('nick', '东坡居士')
```

值也可以是一个函数，它将被执行后，将返回值设置为 key 的值：
``` javascript
store('nick', (oldValue, index) => {
    return '东坡胖子'
})
```

> fastore 自动序列化上述该对象。此外，对于数字、布尔值等会自动转换，无需自行转换一次。

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

### 3.遍历 localStorage

若仅传递一个 callback 函数给 store，fastore 将遍历整个 localStorage 并传递每一个 key 及其对应的值给该 callback。

``` javascript
store((key, value, index) => {
    console.log(`${index}: ${key}=${value}`)
})
```

### 4.清空 localStorage
``` javascript
store.clear()
```

### 5.获取现存有多少个数据
``` javascript
store.size()
```

### 6.获取全部 key
``` javascript
store.keys()
```

### 7.判断 key 是否存在
``` javascript
store.has('address')    // 返回 true/fasle
```

### 8.移除指定 key-value
``` javascript
store.remove('address')
```

### 9.命名空间
``` javascript
let works = store.namespace('works')

// ns 是 namespace 的速写形式
// let works = store.ns('works')

works('wen') // 获取 'works.wen' 的值
```

命名空间一般用于项目间或团队间隔离之用，目的是避免命名冲突。

一般命名空间使用点号 `.` 作为分隔，利如： `com.oa.workflow`。

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

> 命名空间层级分隔符不允许使用 `空白字符`、数字或字母。

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

## Tests and Build

### Unit tests

```cmd
$ npm run test
```

Watch Test
```cmd
$ npm run test-watch
```

### Build

```cmd
$ npm run build
```