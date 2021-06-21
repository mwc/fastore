/*!
 * fastore.js
 * 
 * Copyright (C) mwc@foxmail.com
 */

export function wrapper(storage, ns = '', separator) {
    function pickupNS(space) {
        space = String(space).trim()

        return space ? space + separator : ''
    }

    function verifySeparator(sptor) {
        if (typeof sptor != 'string') {
            sptor = '.'
        } else if (sptor.length != 1) {
            throw new Error('The separator can only be one character.')
        } else if (/[\s,a-zA-Z0-9]/.test(sptor)) {
            throw new Error('The separator should not be comma, numbers, whitespace or letters.')
        }

        return sptor
    }

    function keys(iterator) {
        let ks = Object.keys(storage)

        if (ns) {
            ks = ks.filter(key => key.startsWith(ns)).map(key => key.replace(ns, ''))
        }

        if (typeof iterator == 'function') {
            ks.forEach(iterator)
        }

        return ks
    }

    function parse(val) {
        try { return JSON.parse(val) } catch (e) { return val }
    }

    function parseValue(ks) {
        switch (ks.length) {
            case 0: break
            case 1: return parse(storage.getItem(ns + ks[0]))
            default: return all(ks)
        }
    }

    function all(ks = keys()) {
        return ks.reduce((props, key) => {
            props[key] = parseValue([key])

            return props
        }, {})
    }

    function validKey(k) {
        return k != '' && /[\s,]/.test(k) == false
    }

    function parseKeys(ks) {
        if (!Array.isArray(ks)) {
            ks = String(ks).split(/\s+|,/g)
        }

        return ks.filter(k => validKey('' + k))
    }

    function stringify(val, oldValue, index) {
        return JSON.stringify(typeof val == 'function' ? val(oldValue, index) : val)
    }

    function has(ks) {
        return parseKeys(ks).reduce((_, k) => {
            return storage.hasOwnProperty(ns + k)
        }, false)
    }

    function size() {
        return ns ? keys().length : storage.length
    }

    function clear() {
        if (ns) {
            keys().forEach(k => storage.removeItem(ns + k))
        } else {
            storage.clear()
        }
    }

    function remove(ks) {
        parseKeys(ks).forEach(k => storage.removeItem(ns + k))
    }

    function namespace(section, char = separator) {
        let space = ns ? ns + section : section

        return wrapper(storage, space, char)
    }

    function once(ks, handler) {
        return on(ks, handler, true)
    }

    function on(ks, handler, once = false) {
        const off = () => removeEventListener('storage', handler)

        if (typeof ks == 'function') {
            handler = ks
            ks = ''
        }

        if (typeof handler != 'function') {
            throw new TypeError('The storage event handler must be a function.')
        }

        addEventListener('storage', event => {
            const { key, newValue, oldValue, url, storageArea } = event

            if (key.startsWith(ns)) {
                ks = parseKeys(ks)
                key = key.replace(ns, '')

                if (ks.length == 0 || ks.includes(key)) {
                    let e = {
                        ns,
                        key,
                        storageArea,
                        newValue: parse(newValue),
                        oldValue: parse(oldValue),
                        url: url || event.uri,
                        namespace: ns,
                    }

                    if (handler(e) === false || once) {
                        off()
                    }
                }
            }
        })

        return off
    }

    function get(ks) {
        if (Array.isArray(ks)) {
            return parseKeys(ks).map(k => parseValue([k]))
        } else {
            return parseValue(parseKeys(ks))
        }
    }

    function set(ks, val) {
        if (typeof ks == 'object' && !Array.isArray(ks)) {
            return Object.keys(ks).forEach(k => set(k, ks[k]))
        }

        parseKeys(ks).forEach((k, index) => {
            storage.setItem(ns + k, stringify(val, get(k), index))
        })
    }

    function accessor(key, val) {
        switch (typeof key) {
            case 'null':
            case 'undefined': return all()
            case 'function': return keys((k, index) => key(k, get(k), index))
            case 'object': if (!Array.isArray(key)) return set(key)
            default: return val != undefined ? set(key, val) : get(key)
        }
    }

    separator = verifySeparator(separator)
    ns = pickupNS(ns)

    const APIs = { keys, has, size, clear, remove, get, set, on, once, namespace, ns: namespace }

    return Object.assign(accessor, APIs)
}

export const session = wrapper(global['sessionStorage'])
export const store = wrapper(global['localStorage'])