import axios from 'axios'

const env = process.env

const generateAccessToken = code =>
    axios({
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
    })
        .then(response => {
            if (response.data.access_token) {
                return response.data.access_token
            }

            return {
                error: response.data.error_description
                    ? response.data.error_description
                    : response.data,
            }
        })
        .catch(response => {
            return {
                error: response.status,
            }
        })

export default generateAccessToken
