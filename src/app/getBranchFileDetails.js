const { Store } = require('../models/store')

const getBranchFileDetails = (repoOwner, repoName, repoBranch) => {
    const repo = `${repoOwner}/${repoName}`
    return Store.get({
        repoBranch,
        repo,
    })
}

module.exports = {
    getBranchFileDetails,
}
