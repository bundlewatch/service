/* eslint-disable no-console */

import axios from 'axios'

const canTokenAccessRepo = ({
    repoOwner,
    repoName,
    commitSha,
    githubAccessToken,
}) => {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/statuses/${commitSha}`
    return axios({
        method: 'GET',
        url,
        headers: {
            Authorization: `token ${githubAccessToken}`,
        },
    })
        .then(response => {
            return response.data
        })
        .catch(error => {
            if (error.response) {
                console.error(
                    `GitHubService HTTP_${error.response.status} :: ${
                        error.response.data ? error.response.data.message : ''
                    }`,
                )
                return false
            }
            throw error
        })
}

export default canTokenAccessRepo
