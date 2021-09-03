const lodashMerge = require('lodash.merge')
const lzString = require('lz-string')
const { shortenURL } = require('./shortenURL')

const createURL = async ({
    results,
    bundlewatchServiceHost,
    repoOwner,
    repoName,
    repoCurrentBranch,
    repoBranchBase,
    commitSha,
}) => {
    const strippedResultsForURL = lodashMerge({}, results)
    strippedResultsForURL.fullResults.map((result) => {
        const strippedResult = result
        delete strippedResult.message
        return strippedResult
    })

    const urlResultData = lzString.compressToEncodedURIComponent(
        JSON.stringify({
            details: {
                repoOwner,
                repoName,
                repoCurrentBranch,
                repoBranchBase,
                commitSha,
            },
            results: strippedResultsForURL,
        }),
    )
    const longURL = `${bundlewatchServiceHost}/results?d=${urlResultData}`
    return shortenURL(longURL)
}

module.exports = {
    createURL,
}
