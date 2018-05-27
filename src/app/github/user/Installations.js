const axios = require('axios')

class Installations {
    constructor({ githubUserAccessToken }) {
        this.githubUserAccessToken = githubUserAccessToken
    }

    getInstallations() {
        return axios({
            method: 'GET',
            url: `https://api.github.com/installations`,
            responseType: 'json',
            timeout: 3000,
            headers: {
                Authorization: `token ${this.githubUserAccessToken}`,
            },
        }).then(response => {
            const installationIds = response.data.installations.map(
                installation => {
                    return installation.id
                },
            )
            return installationIds
        })
    }

    getRepositoriesForInstallation(installationId) {
        return axios({
            method: 'GET',
            url: `https://api.github.com/installations/${installationId}/repositories`,
            responseType: 'json',
            timeout: 3000,
            headers: {
                Authorization: `token ${this.githubUserAccessToken}`,
            },
        }).then(response => {
            const repoFullNames = response.data.repositories.map(repo => {
                return repo.full_name
            })
            return repoFullNames
        })
    }
}

module.exports = {
    Installations,
}
