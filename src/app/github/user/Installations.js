const axios = require('axios')

const logger = require('../../../logger')

class Installations {
    constructor({ githubUserAccessToken }) {
        this.githubUserAccessToken = githubUserAccessToken
    }

    getInstallations() {
        return axios({
            method: 'GET',
            url: `https://api.github.com/installations`,
            responseType: 'json',
            timeout: 5000,
            headers: {
                Authorization: `token ${this.githubUserAccessToken}`,
            },
        })
            .then(response => {
                const installationIds = response.data.installations.map(
                    installation => {
                        return installation.id
                    },
                )
                return installationIds
            })
            .catch(error => {
                if (error) {
                    logger.error(
                        ` HTTP_${error.response.status} :: ${
                            error.response.data
                                ? error.response.data.message
                                : ''
                        }`,
                        error.response.data.errors,
                    )
                    return []
                }
                throw error
            })
    }

    getRepositoriesForInstallation(installationId) {
        return axios({
            method: 'GET',
            url: `https://api.github.com/installations/${installationId}/repositories`,
            responseType: 'json',
            timeout: 5000,
            headers: {
                Authorization: `token ${this.githubUserAccessToken}`,
            },
        })
            .then(response => {
                const repoFullNames = response.data.repositories.map(repo => {
                    return repo.full_name
                })
                return repoFullNames
            })
            .catch(error => {
                if (error) {
                    logger.error(
                        ` HTTP_${error.response.status} :: ${
                            error.response.data
                                ? error.response.data.message
                                : ''
                        }`,
                        error.response.data.errors,
                    )
                    return []
                }
                throw error
            })
    }
}

module.exports = Installations
