const axios = require('axios')

const logger = require('../../../logger')

const env = process.env

const generateUserAccessTokenWithCode = code => {
    // TODO move this into something where we cna do getEnv to ensure its working
    if (!env.GITHUB_CLIENT_ID) {
        logger.error('Missing github client id')
    }

    if (!env.GITHUB_CLIENT_SECRET) {
        logger.error('Missing github client secret')
    }

    return axios({
        method: 'POST',
        url: 'https://github.com/login/oauth/access_token',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
        },
        data: {
            code,
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
        },
        timeout: 10000,
    }).then(response => {
        if (response.data.access_token) {
            return response.data.access_token
        }

        return {
            error: response.data.error_description
                ? response.data.error_description
                : response.data,
        }
    })
}

module.exports = {
    generateUserAccessTokenWithCode,
}
