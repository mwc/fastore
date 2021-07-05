# fastore - v1.0.6 (under MIT)
A light-weight package of `localStorage` and `sessionStorage` 

![Build](https://img.shields.io/badge/build-passing-green.svg)
![Unit Tests](https://img.shields.io/badge/tests-51%20passed-green)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/fastore)
![License](https://img.shields.io/github/license/mwc/fastore)
![Download](https://img.shields.io/npm/dw/fastore)
![Version](https://img.shields.io/npm/v/fastore)
![Star](https://img.shields.io/github/stars/mwc/fastore?style=social)

[English](./README.md) | [简体中文](./zh-CN.md)

## Install

#### NPM

```javascript
$ npm install --save-dev fastore
```

#### CDN

```java
[unpkg]  https://unpkg.com/fastore
```

## Quick Start

**fastore** is **fast store** in short. The library intends to provide a convenient way to access local storage.

There is no difference between `localStorage` and `sessionStorage` except for the expiration periods. **fastore** `localStorage` is exported as `store`, and `sessionStorage` is exported as `session`。

Examples below use `localStorage`, aka `store`. `session` works the same.

Providing there was such table stored in `localStorage`：

| Key       | Value                                                        |
| --------- | ------------------------------------------------------------ |
| userid    | meishan001                                                   |
| firstname | 苏                                                           |
| lastname  | 轼                                                           |
| nick      | 东坡                                                         |
| family    | { "wives": ["王朝云", "王弗", "王闰之"], sons: ["苏迈", "苏迨"] } |
| works.shi | ["题西林壁", "饮湖上初晴后雨", "惠崇春江晚景"]               |
| works.ci  | ["念奴娇·赤壁怀古", "水调歌头·明月几时有", "江城子·乙卯正月二十日夜记梦"] |
| works.zi  | ["黄州寒食帖", "江上帖", "治平帖"]                           |
| works.wen | ["赤壁赋", "策断", "晁错论"]                                 |
| works.hua | ["潇湘竹石图", "枯木怪石图", "偃松图卷"]                     |

### 1. Access all Key-Value Pairs

No arguments provided.

``` javascript
import { store } from 'fastore'

let all = store()     // return all key-value pairs using store()

// {
//   userid: 'meishan001',
//   firstname: '苏',
//   ...
//   "works.hua": '["潇湘竹石图", "枯木怪石图", "偃松图卷"]'
// }
```

In the case of `sessionStorage`, just use `session()` function：
``` javascript
import { session } from 'fastore'

let all = session()     // return all key-value pairs using session()
```

> `store` and `session` shares the same API. If you replace `store` with `session` in the code below, it will still work.

### 2. Access a Single Value
``` javascript
import { store } from 'fastore'

store('userid')     // meishan001
```

#### Multiple Values：

``` javascript
import { store } from 'fastore'

store('firstname, nick')  // { firstname: '苏', nick: '东坡' }
store(['firstname', 'nick'])  // ['苏', '东坡']
```

If you pass in an array of keys, it will return you an array of values.

> Values stored in `localStorage` or `sessionStorage` are *Strings*. **Fastore** automatically converts those values into *Object* behind the scene using `JSON.parse()`

### 3. Assign a Value
``` javascript
store('nick', '东坡居士')
```

The first argument of `store()` is `key`, the second is the value you set (it can also be a function). Once being executed, `store()` will return the value of `key`.

``` javascript
store('nick', (oldValue, index) => {
    return '东坡胖子'
})
```

> **Fastore**  automatically stringifies its arguments using `JSON.stringify()`. 

If you want to set multiple values, you can pass in an *Object*:

``` javascript
store({ father: '苏洵', borther: '苏辙' })
```

You can also assign multiple keys with the same value: 

``` javascript
store('isMan, isLoveEat, isLoveTravel', true)

// Alternative
store(['isMan', 'isLoveEat', 'isLoveTravel'], true)
```

### 4. Iterate localStorage

If you pass a `callback` function to `store()`, **fastore** will iterate the whole `localStorage` and invoke the `callback` once, receiving each key-value pair as argument.

``` javascript
store((key, value, index) => {
    console.log(`${index}: ${key}=${value}`)
})
```

### 5.Clear localStorage
``` javascript
store.clear()
```
> If scoped to namespace, it only clears keys under the current namespace. See more details in section 10. Namespace.

### 6.Access Storage Size
``` javascript
store.size()
```
> If scoped to namespace, it only counts the number of keys under the current namespace. See more details in section 10. Namespace.

### 7.Access All keys
``` javascript
store.keys()
```
> If scoped to namespace, it only returns keys under the current namespace. See more details in section 10. Namespace.

### 8. Check Presence of Key(s)
``` javascript
store.has('address')    // check if address exists？ fasle
store.has('userid, nick')   // check if both userid and nick exist？ true
```
> If scoped to namespace, it only checks keys under the current namespace. See more details in section 10. Namespace.

### 9. Remove Key-Value Pair
``` javascript
store.remove('address')
store.remove('address, nick')   // remove multiple key-values pairs
```
> If scoped to namespace, it only removes keys under the current namespace. See more details in section 10. Namespace.

### 10.Namespace
``` javascript
let works = store.namespace('works')

// ns is short for namespace
// let works = store.ns('works')

works('wen') // access value 'works.wen'
```

Namespace is used to isolate different contexts during app development in avoidance of repeated `key`s(eg. multiple keys with the same name, referring to different values) in our case.. It usually uses `.` as a divider.(eg. `com.oa.workflow`)

> There is nothing special about namespace because it merely represents the name of a key.

If you decide to use namespace, further code will be scoped to the defined namespace.

For example, you want to add a new item:

``` javascript
let works = store.namespace('works') // a namespace called 'works'

works('weiqi', '9段')   // works.weiqi = '9段'
```

`works` is just like `store` for it inherits all of`store`'s methods.

`.keys()` in this case will return all names of keys under the namespace, `works`(the key names will not include namespace name as prefix)

``` javascript
let works = store.namespace('works')

works.keys()    // ['shi', 'ci', 'zi', 'wen', 'hua']
works.size()    // 5
store.size()    // 10
```

Likewise, `size`、`has`、`clear`、`remove` are also scoped to namespace：

``` javascript
let works = store.namespace('works')

works.has('nick')      // false
```

#### Divider of Multiple-level Namespace

The default divider of namespace is `.`

When there are nested namespaces, `.` will be used to indicate the hierarchy.

You can customize the divider by passing the desired divider to `store.namespace` as the second argument.

``` javascript
import { store } from 'fastore'

// Initiate 'works' namespace, using # as divider
let works = store.namespace('works', '#')

works('shi')    // Access value of `works#shi` 
works('ci')     // Access value of  `works#ci` 
```

You may also use：`#`、`/`、`-`、 `|`。

> The divider cannot be `space`, `numbers` or `letters`.

#### Multiple-level Namespace

There is no limit to the number of nested namespaces. You can nest as many namespaces as you want.

``` javascript
import { store } from 'fastore'

let works = store.ns('works')
let others = works.ns('others') // namespace：works.others

others('qin')   // Access value of  `works.others.qin` 
others('kongfu') // Access value of  `works.others.kongfu` 
```

If you need to access one of the nested namespaces, you can do it without writing a string of namespaces:

``` javascript
import { store } from 'fastore'

//  works.others
let others = store.ns('works.others')

others('kongfu')
```

### 11.Storage Events

You can monitor `Storage` events to detect changes in `store`.

You will be notified when creating, updating, or deleting data, but assigning a new value to existing key does not trigger such events. 

```javascript
import { store } from 'fastore'

store.on(event => {
    // handler will not be executed until keys are created, updated or deleted
})
```

> Refer to the table at the bottom for details of `event`

You can also monitor one or several keys of interest, using`store.on(keys, handler)` ：

```javascript
import { store } from 'fastore'

store.on('nick, firstname', event => {
  	// once nick or firstname is changed, the callback is executioned
})
```

keys (the first argument of `store.on`) can be a string or an array.

> If changes in `store` happen on the same page, it does not trigger `Storage` events.
>
> Different websites have different store. However, on the same website, current page does not receive `Storage` event, until other pages change `store`

If your website is single-page, `Storage` will never to triggered.

BUT, here is a trick: you can embed `iframe` on the current page, and modify `Storage` inside `iframe`

`session`, however, must be on the current page. Any changes on `sessionStorage`on the current page will trigger `Storage` events.

`Storage` can't distinguish `localStorage` from `sessionStorage` so sometimes things get confusing. 

**fastore** can tell them apart to respond to `Storage` respectively.

For example, a `Storage` event triggered by `session` requires a `handler` on `session`. Even if both `session` and `store` monitor the same `Storage` event, **fastore** can tell them apart, and use the corresponding handlers.。

If scoped to namespaces, only  keys under the specified namespace are monitored.

```javascript
import { store } from 'fastore'

let works = store.namespace('works')

works.on(event => {
    // handler will not be executed until values under current namespace change
})

// 同时支持过滤关注的 key
works.on('shi, ci', event => { ... })
```

### Storage Event Parameters

| 名称      | 类型   | 说明                                                         |
| --------- | ------ | ------------------------------------------------------------ |
| key       | string | Modified key. If the value is cleared using `clear()`, key is value. If scoped to namespace, it will not show namespace as prefix. (read only) |
| namespace | string | namespace where key locates. (read only)                     |
| oldValue  | string | original value before updates.  If there is no original value when setting up new values, oldValue is null. (read only) |
| newValue  | string | new value after updates. If value is removed or `clear()`, newValue becomes null. (read only) |
| url       | string | Url address where key is changed. (read only)                |

## Test & Build

### Unit Test

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