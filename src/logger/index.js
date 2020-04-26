const stdout = console.log // eslint-disable-line no-console
const stderr = console.error // eslint-disable-line no-console

const debug = (error) => {
    if (process.env.DEBUG) {
        const debugObject = error.response
            ? error.response.data
            : error.response
        stdout(`[DEBUG] ${error.message}`)
        stderr(error)
        try {
            stderr(JSON.stringify(debugObject, undefined, 2))
        } catch (e) {
            // eat it
        }
    }
}

const log = (message) => {
    stdout(message)
}

const info = (message) => {
    stdout(`[INFO] ${message}`)
}

const warn = (message) => {
    stdout(`[WARNING] ${message}`)
}

const error = (messsage, errorStack) => {
    if (errorStack) {
        stdout(errorStack)
    }
    stderr(`[ERROR] ${messsage}`)
}

const fatal = (messsage, errorStack) => {
    if (errorStack) {
        stdout(errorStack)
    }
    stderr(`[FATAL] ${messsage}`)
}

module.exports = {
    debug,
    log,
    info,
    warn,
    error,
    fatal,
}
