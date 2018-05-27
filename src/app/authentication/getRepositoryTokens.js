const getRepositoryTokens = async repositories => {
    return repositories.map(repoFullName => {
        // TODO get codes/generate store in DB
        const repoToken = 'test_token'
        return {
            repoFullName,
            repoToken,
        }
    })
}

module.exports = {
    getRepositoryTokens,
}
