const getEnv = key => {
    const value = process.env[key]
    if (
        !value ||
        value.length === 0 ||
        value == 'undefined' || // eslint-disable-line eqeqeq
        value == 'null' // eslint-disable-line eqeqeq
    ) {
        throw new Error(`Env var ${key} is missing`)
    }
    return value
}

module.exports = {
    getEnv,
}
