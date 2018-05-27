const moxios = require('moxios')

beforeEach(() => {
    moxios.install()
})

afterEach(() => {
    moxios.uninstall()
})
