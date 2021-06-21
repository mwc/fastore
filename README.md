# fastore
A localStorage and sessionStorage wrapper, lightweight, fast, simple to use.

## 浏览器兼容性

- Chrome 5+
- Microsoft Edge 12+
- Firefox 3.5+
- Internet Explorer 8+
- Opera 10.5+
- Safari 4+

- WebView Android 37+
- Chrome Android 18+
- Firefox Android 6+
- Opera Android 11+
- Safari on iOS 3.2+
- Samsung Internet 1.0+

## 基本使用

### 获取值

### 设置值

## 命名空间

根据业务将系统划分多个子系统或子模块，每个子模块或子系统可能由不同团队开发，他们很可能都会使用本地存储（localStorage），这将极其容易引起本地存储的键名冲突。

命名空间正是解决这个问题的办法，通过命名空间来约束其操作的范围。

> 因为实际上程序可以随意访问得到 localStorage 任意键值。
> 故此这种办法仍然是一种弱约束力的办法，需要通过类似团队制度的形式强制执行。

可通过 `store.namespace()` 来创建命名空间：

``` javascript
import { store } from 'fastore'

// 创建 user 命名空间
let user = store.namespace('user')

user('name')   // 获取 user.name 的值
user('age')   // 获取 user.age 的值
```

### 层级分隔符

命名空间默认的层级分隔符为 `.`，在使用多层级命名空间的情况下，层级分隔符用于划分层级关系。
如需修改命名空间分隔符，可通过 `store.namespace` 的第2个（可选）参数给出：

``` javascript
import { store } from 'fastore'

// 创建 user 命名空间，并使用 '#' 作为分隔符
let user = store.namespace('user', '#')

user('name')   // 获取 user#name 的值
user('age')   // 获取 user#age 的值
```

除了默认的 `.` 外，推荐的命名空间层级分隔符有：`#`、`/`、`-`、 `|`。

> 命名空间层级分隔符不允许使用 `空白字符`、数字或字母。

### 多级命名空间

命名空间不限制层级数量，允许在已有的命名空间的基础上，肆意创建多级命名空间：

``` javascript
import { store } from 'fastore'

let user = store.namespace('user')
let contact = user.namespace('contact')     // 命名空间为：user.contact

contact('phone')        // 获取 user.contact.phone 的值
contact('address')      // 获取 user.contact.address 的值
```

如你仅需访问 `user.contact` 命名空间，则直接使用该命名空间即可：

``` javascript
import { store } from 'fastore'

// 直接使用命名空间 user.contact
let contact = store.namespace('user.contact')

contact('phone')        // 获取 user.contact.phone 的值
contact('address')      // 获取 user.contact.address 的值
```

事实上，`let contact = store.namespace('user.contact')` 等价于

``` javascript
let user = store.namespace('user')
let contact = user.namespace('contact')
```
