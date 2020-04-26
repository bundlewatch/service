const axios = require('axios')

const env = process.env

const generateAccessToken = (code) => {
    if (process.env.IS_OFFLINE) {
        return Promise.resolve('adfas923n44a8c5c282342sadhjfgdhjag10df0df')
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
    })
        .then((response) => {
            if (response.data.access_token) {
                return response.data.access_token
            }

            return {
                error: response.data.error_description
                    ? response.data.error_description
                    : response.data,
            }
        })
        .catch((error) => {
            console.error(error) // eslint-disable-line no-console
            return {
                error: error.response.status || error.message,
            }
        })
}

module.exports = {
    generateAccessToken,
}
