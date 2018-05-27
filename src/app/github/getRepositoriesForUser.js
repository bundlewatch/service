const {
    generateUserAccessTokenWithCode,
} = require('./user/generateUserAccessTokenWithCode')
const { Installations } = require('./user/Installations')

const getRepositoriesForUser = async code => {
    const githubUserAccessToken = await generateUserAccessTokenWithCode(code)
    const installationService = new Installations({ githubUserAccessToken })
    const installations = await installationService.getInstallations()
    const repositories = []
    const repoFetchPromises = installations.map(installationId => {
        return installationService
            .getRepositoriesForInstallation(installationId)
            .then(installationRepos => {
                installationRepos.forEach(repo => {
                    repositories.push(repo)
                })
            })
    })
    await Promise.all(repoFetchPromises)
    return repositories
}

module.exports = {
    getRepositoriesForUser,
}
