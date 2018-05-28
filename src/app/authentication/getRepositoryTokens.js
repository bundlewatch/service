const uuid = require('uuid')

const { getRepoToken, saveRepoToken } = require('../../models/storeUtils')

const getTokenForRepo = async repoFullName => {
    const details = await getRepoToken(repoFullName)
    let token = details.token
    if (!token) {
        token = uuid.v4()
        await saveRepoToken(repoFullName)
    }
    return token
}


const getRepositoryTokens = async repositories => {
    return repositories.map(async repoFullName => {
        const repoToken = await getTokenForRepo(repoFullName)
        return {
            repoFullName,
            repoToken,
        }
    })
}

module.exports = {
    getRepositoryTokens,
}
