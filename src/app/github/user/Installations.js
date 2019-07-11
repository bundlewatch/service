const axios = require('axios')

const logger = require('../../../logger')

class Installations {
    constructor({ githubUserAccessToken }) {
        this.githubUserAccessToken = githubUserAccessToken
    }

    getInstallations() {
        return axios({
            method: 'GET',
            url: `https://api.github.com/user/installations`,
            responseType: 'json',
            timeout: 3000,
            headers: {
                Accept: `application/vnd.github.machine-man-preview+json`,
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
                logger.debug(error)
                throw error
            })
    }

    getRepositoriesForInstallation(installationId) {
        return axios({
            method: 'GET',
            url: `https://api.github.com/user/installations/${installationId}/repositories`,
            responseType: 'json',
            timeout: 3000,
            headers: {
                Accept: `application/vnd.github.machine-man-preview+json`,
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
                logger.debug(error)
                throw error
            })
    }
}

module.exports = {
    Installations,
}
