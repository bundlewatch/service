const axios = require('axios')

const logger = require('../../../logger')
const { getEnv } = require('../../getEnv')

const generateUserAccessTokenWithCode = code => {
    const clientId = getEnv('GITHUB_APP_CLIENT_ID')
    const clientSecret = getEnv('GITHUB_APP_CLIENT_SECRET')

    return axios({
        method: 'POST',
        url: 'https://github.com/login/oauth/access_token',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
        },
        data: {
            code,
            client_id: clientId,
            client_secret: clientSecret,
        },
        timeout: 10000,
    }).then(response => {
        if (response.data.error) {
            logger.debug(response.data)
            throw new Error(response.data.error)
        }

        if (response.data.access_token) {
            logger.debug(`Token: ${response.data.access_token}`)
            return response.data.access_token
        }

        logger.debug(response)
        throw new Error('Could not get token')
    })
}

module.exports = {
    generateUserAccessTokenWithCode,
}
