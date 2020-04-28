const baseBranchFileDetails = {
    'path/to/removed/file': {
        size: 30,
        compression: 'none',
    },
}
const currentBranchFileDetails = {
    'path/to/errored/file': {
        size: 0,
        maxSize: 50,
        error: 'Failed to compare',
        compression: 'none',
    },
    'path/to/larger/file': {
        size: 60,
        maxSize: 50,
        compression: 'none',
    },
    'path/to/smaller/file': {
        size: 30,
        maxSize: 50,
        compression: 'none',
    },
    'path/to/unbound/file': {
        size: 1024,
        maxSize: null,
        compression: 'none',
    },
}

module.exports = {
    baseBranchFileDetails,
    currentBranchFileDetails,
}
