import { wrapper } from '../src/storage.js'
import { assert } from 'chai'

function mock() {
    let data = {
        google_experiment_mod36: '409',
        google_experiment_mod53: '369',
        google_experiment_mod44: '76',
        google_adsense_settings: '{"ca-pub-261179":["ca-pub-261179",[[1]],[]]}',
        google_ama_config: '["BODY",2,["10px","10px",true],[4],null,[]]',
        menus: '["home", "product", "about"]',
        taskTracker: '1606631394371',
        'banner.common_survey_banner.embargoed_until': '1614175638052',
        'banner.plus_banner_v1.chance': 'false',
        'banner.read': 'null',
        'banner.developer_needs.embargoed_until': '1604298638318',
        userid: 'fe22143f657e8cc',
    }

    let APIs = {
        length: 0,
        getItem(key) { return this[key] },
        setItem(key, value) {
            if (!(key in this)) this.length += 1
            this[key] = String(value)
        },
        removeItem(key) {
            if (key in this) {
                this.length -= 1
                delete this[key]
            }
        },
        clear() {
            Object.keys(this).forEach(key => {
                if (key != 'length') {
                    delete this[key]
                }
            })

            this.length = 0
        }
    }

    let target = Object.setPrototypeOf(data, APIs)
    target.__proto__.length = Object.keys(target).length
    return wrapper(target)
}

describe('storage', function () {
    let store

    beforeEach(function () {
        store = mock()
    })

    describe('constructor', function () {
        it('has no any parameters', function () {
            assert.deepEqual(
                store(),
                {
                    google_experiment_mod36: 409,
                    google_experiment_mod53: 369,
                    google_experiment_mod44: 76,
                    google_adsense_settings: { "ca-pub-261179": ["ca-pub-261179", [[1]], []] },
                    google_ama_config: ["BODY", 2, ["10px", "10px", true], [4], null, []],
                    menus: ["home", "product", "about"],
                    taskTracker: 1606631394371,
                    'banner.common_survey_banner.embargoed_until': 1614175638052,
                    'banner.plus_banner_v1.chance': false,
                    'banner.read': null,
                    'banner.developer_needs.embargoed_until': 1604298638318,
                    userid: 'fe22143f657e8cc',
                }
            )
        })

        it('only one parameter of function type', function () {
            let compare = {}

            store((key, value, index) => compare[key] = value)
            assert.deepEqual(compare, {
                google_experiment_mod36: 409,
                google_experiment_mod53: 369,
                google_experiment_mod44: 76,
                google_adsense_settings: { "ca-pub-261179": ["ca-pub-261179", [[1]], []] },
                google_ama_config: ["BODY", 2, ["10px", "10px", true], [4], null, []],
                menus: ["home", "product", "about"],
                taskTracker: 1606631394371,
                'banner.common_survey_banner.embargoed_until': 1614175638052,
                'banner.plus_banner_v1.chance': false,
                'banner.read': null,
                'banner.developer_needs.embargoed_until': 1604298638318,
                userid: 'fe22143f657e8cc',
            })
        })

        describe('#get', function () {
            it('#get: one key', function () {
                assert.equal(store('userid'), 'fe22143f657e8cc')
            })

            it('#get: more than one key(return object)', function () {
                assert.deepEqual(
                    store('google_experiment_mod36, google_experiment_mod53'),
                    { google_experiment_mod36: 409, google_experiment_mod53: 369 }
                )
            })

            it('#get: more than one key(return array)', function () {
                assert.deepEqual(
                    store(['userid', 'taskTracker']),
                    ['fe22143f657e8cc', 1606631394371]
                )
            })

            it('#get: return number', function () {
                assert.equal(store('google_experiment_mod36'), 409)
            })

            it('#get: return object', function () {
                assert.deepEqual(
                    store('google_adsense_settings'),
                    { "ca-pub-261179": ["ca-pub-261179", [[1]], []] }
                )
            })

            it('#get: return array', function () {
                assert.deepEqual(store('menus'), ["home", "product", "about"])
            })
        })

        describe('#set', function () {
            it('#set: provides an object to set multiple values', function () {
                store({ a: 10, b: 20 })

                assert.equal(store('a'), 10)
                assert.equal(store('b'), 20)
                assert.deepEqual(store('a,b'), { a: 10, b: 20 })
                assert.equal(store.size(), 14)
            })

            it('#set: normal, key = value', function () {
                store('address', 'Beijing 135')
                assert.equal(store('address'), 'Beijing 135')
            })

            it('#set: value is function, key = () => { }', function () {
                store('address', (oldValue) => 'Beijing 666')
                assert.equal(store('address'), 'Beijing 666')
            })

            it('#set: multiple keys are set to the same value, ("k1,k2,k3", value)', function () {
                store('address, location', 'Beijing 888')
                assert.equal(store('location'), 'Beijing 888')
                assert.equal(store('address'), 'Beijing 888')
            })

            it('#set: multiple keys are set to the same value, (["k1", "k2", "k3"], value)', function () {
                store(['address', 'location'], 'Beijing 888')
                assert.equal(store('location'), 'Beijing 888')
                assert.equal(store('address'), 'Beijing 888')
            })
        })
    })

    describe('constructor(under namespace)', function () {
        it('has no any parameters', function () {
            let banner = store.namespace('banner')

            assert.deepEqual(
                banner(),
                {
                    'common_survey_banner.embargoed_until': 1614175638052,
                    'plus_banner_v1.chance': false,
                    'read': null,
                    'developer_needs.embargoed_until': 1604298638318,
                }
            )
        })

        it('only one parameter of function type', function () {
            let banner = store.namespace('banner')
            let compare = {}

            banner((key, value, index) => compare[key] = value)
            assert.deepEqual(compare, {
                'common_survey_banner.embargoed_until': 1614175638052,
                'plus_banner_v1.chance': false,
                'read': null,
                'developer_needs.embargoed_until': 1604298638318,
            })
        })

        describe('#get', function () {
            it('#get: one key', function () {
                let banner = store.namespace('banner')
                assert.equal(banner('common_survey_banner.embargoed_until'), '1614175638052')
            })

            it('#get: more than one key(return object)', function () {
                let banner = store.namespace('banner')

                assert.deepEqual(
                    banner('plus_banner_v1.chance, read'),
                    { 'plus_banner_v1.chance': false, read: null }
                )
            })

            it('#get: more than one key(return array)', function () {
                let banner = store.namespace('banner')

                assert.deepEqual(
                    banner(['common_survey_banner.embargoed_until', 'developer_needs.embargoed_until']),
                    [1614175638052, 1604298638318]
                )
            })

            it('#get: return number', function () {
                let banner = store.namespace('banner')
                assert.equal(banner('developer_needs.embargoed_until'), 1604298638318)
            })

            it('#get: return object', function () {
                let banner = store.namespace('banner')

                assert.deepEqual(
                    banner('common_survey_banner.embargoed_until, developer_needs.embargoed_until'),
                    {
                        "common_survey_banner.embargoed_until": 1614175638052,
                        "developer_needs.embargoed_until": 1604298638318
                    }
                )
            })
        })

        describe('#set', function () {
            it('#set: provides an object to set multiple values', function () {
                let banner = store.namespace('banner')
                banner({ a: 10, b: 20 })

                assert.equal(store('banner.a'), 10)
                assert.equal(store('banner.b'), 20)
                assert.deepEqual(banner('a,b'), { a: 10, b: 20 })
            })

            it('#set: normal, key = value', function () {
                let banner = store.namespace('banner')

                banner('address', 'Beijing 135')
                assert.equal(store('banner.address', 'Beijing 135'))
            })

            it('#set: value is function, key = () => { }', function () {
                let banner = store.namespace('banner')

                banner('address', (oldValue) => 'Beijing 666')
                assert.equal(store('banner.address', 'Beijing 666'))
            })

            it('#set: multiple keys are set to the same value, ("k1,k2,k3", value)', function () {
                let banner = store.namespace('banner')
                banner('address, location', 'Beijing 888')
                assert.equal(store('banner.location', 'Beijing 888'))
                assert.equal(store('banner.address', 'Beijing 888'))
            })

            it('#set: multiple keys are set to the same value, (["k1", "k2", "k3"], value)', function () {
                let banner = store.namespace('banner')

                banner(['address', 'location'], 'Beijing 888')
                assert.equal(store('banner.location', 'Beijing 888'))
                assert.equal(store('banner.address', 'Beijing 888'))
            })
        })
    })

    describe('methods', function () {
        describe('#get', function () {
            it('#get: one key', function () {
                assert.equal(store.get('userid'), 'fe22143f657e8cc')
            })

            it('#get: more than one key(return object)', function () {
                assert.deepEqual(
                    store.get('google_experiment_mod36, google_experiment_mod53'),
                    { google_experiment_mod36: 409, google_experiment_mod53: 369 }
                )
            })

            it('#get: more than one key(return array)', function () {
                assert.deepEqual(
                    store.get(['userid', 'taskTracker']),
                    ['fe22143f657e8cc', 1606631394371]
                )
            })

            it('#get: return number', function () {
                assert.equal(store.get('google_experiment_mod36'), 409)
            })

            it('#get: return object', function () {
                assert.deepEqual(
                    store.get('google_adsense_settings'),
                    { "ca-pub-261179": ["ca-pub-261179", [[1]], []] }
                )
            })

            it('#get: return array', function () {
                assert.deepEqual(store.get('menus'), ["home", "product", "about"])
            })
        })

        describe('#set', function () {
            it('#set: provides an object to set multiple values', function () {
                store.set({ a: 10, b: 20 })

                assert.equal(store('a'), 10)
                assert.equal(store('b'), 20)
                assert.deepEqual(store('a,b'), { a: 10, b: 20 })
                assert.equal(store.size(), 14)
            })

            it('#set: normal, key = value', function () {
                store.set('address', 'Beijing 135')
                assert.equal(store('address'), 'Beijing 135')
            })

            it('#set: value is function, key = () => { }', function () {
                store.set('address', (oldValue) => 'Beijing 666')
                assert.equal(store('address'), 'Beijing 666')
            })

            it('#set: multiple keys are set to the same value, ("k1,k2,k3", value)', function () {
                store.set('address, location', 'Beijing 888')
                assert.equal(store('location'), 'Beijing 888')
                assert.equal(store('address'), 'Beijing 888')
            })

            it('#set: multiple keys are set to the same value, (["k1", "k2", "k3"], value)', function () {
                store.set(['address', 'location'], 'Beijing 888')
                assert.equal(store('location'), 'Beijing 888')
                assert.equal(store('address'), 'Beijing 888')
            })
        })

        describe('#size', function () {
            it('#size', function () {
                assert.equal(store.size(), 12)
            })

            it('#size (under namespace)', function () {
                let banner = store.namespace('banner')
                assert.equal(banner.size(), 4)
            })
        })

        describe('#keys', function () {
            it('#keys', function () {
                assert.deepEqual(
                    store.keys(),
                    [
                        'google_experiment_mod36',
                        'google_experiment_mod53',
                        'google_experiment_mod44',
                        'google_adsense_settings',
                        'google_ama_config',
                        'menus',
                        'taskTracker',
                        'banner.common_survey_banner.embargoed_until',
                        'banner.plus_banner_v1.chance',
                        'banner.read',
                        'banner.developer_needs.embargoed_until',
                        'userid'
                    ]
                )
            })

            it('#keys (under namespace)', function () {
                let banner = store.namespace('banner')

                assert.deepEqual(
                    banner.keys(),
                    [
                        'common_survey_banner.embargoed_until',
                        'plus_banner_v1.chance',
                        'read',
                        'developer_needs.embargoed_until',
                    ]
                )
            })
        })

        describe('#has', function () {
            it('#has', function () {
                assert.equal(store.has('userid'), true)
                assert.equal(store.has('just'), false)
            })

            it('#has (under namespace)', function () {
                let banner = store.ns('banner')

                assert.equal(banner.has('read'), true)
                assert.equal(banner.has('userid'), false)
            })
        })

        describe('#clear', function () {
            it('#clear', function () {
                store.clear()

                assert.equal(store.size(), 0)
            })

            it('#clear (under namespace)', function () {
                let banner = store.ns('banner')

                banner.clear()
                assert.equal(banner.size(), 0)
                assert.equal(store.size(), 8)
            })
        })

        it('#remove', function () {
            store.remove('menus')

            assert.notExists(store('menus'))
            assert.equal(store.has('menus'), false)
            assert.equal(store.size(), 11)

            store.remove('taskTracker, google_experiment_mod36')
            assert.equal(store.has('taskTracker'), false)
            assert.equal(store.has('google_experiment_mod36'), false)
            assert.equal(store.size(), 9)
        })

        it('#namespace/#ns', function () {
            let google = store.ns('google', '_')
            let google_experiment = store.ns('google_experiment', '_')

            assert.equal(google.size(), 5)
            assert.equal(
                google.has('experiment_mod36, experiment_mod53, experiment_mod44, adsense_settings, ama_config'),
                true
            )

            assert.equal(google_experiment.size(), 3)
            assert.equal(google_experiment.has('mod36, mod53, mod44'), true)
        })
    })
})
