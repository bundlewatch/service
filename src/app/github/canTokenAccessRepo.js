/* eslint-disable no-console */

const axios = require('axios')

const canTokenAccessRepo = ({
    repoOwner,
    repoName,
    commitSha,
    githubAccessToken,
}) => {
    // TODO: clean this up
    if (!repoOwner) {
        console.log(`[WARNING] No repoOwner supplied`)
        return Promise.resolve(false)
    }
    if (!repoName) {
        console.log(`[WARNING] No repoName supplied`)
        return Promise.resolve(false)
    }
    if (!commitSha) {
        console.log(`[WARNING] No commitSha supplied`)
        return Promise.resolve(false)
    }
    if (!githubAccessToken) {
        console.log(`[WARNING] No githubAccessToken supplied`)
        return Promise.resolve(false)
    }

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/statuses/${commitSha}`
    return axios({
        method: 'GET',
        url,
        headers: {
            Authorization: `token ${githubAccessToken}`,
        },
        timeout: 5000,
    })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            if (error.response) {
                console.error(
                    `GitHubService HTTP_${error.response.status} :: ${
                        error.response.data ? error.response.data.message : ''
                    }`,
                    error,
                )
                return false
            }
            throw error
        })
}

module.exports = {
    canTokenAccessRepo,
}
