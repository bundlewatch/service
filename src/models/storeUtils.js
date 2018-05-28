const { Store } = require('./store')

const getBranchFileDetails = (repoOwner, repoName, repoBranch) => {
    const repo = `${repoOwner}/${repoName}`
    return Store.get({
        repoBranch,
        repo,
    })
}

const getRepoToken = repoFullName => {
    return Store.get({
        repo: repoFullName,
    })
}

const saveRepoToken = repoFullName => {
    return Promise.resolve()
    // return Store.get({
    //     repo: repoFullName,
    // })
}

module.exports = {
    getBranchFileDetails,
    getRepoToken,
    saveRepoToken,
}
