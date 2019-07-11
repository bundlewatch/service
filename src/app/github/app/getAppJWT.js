const fs = require('fs')
const jwt = require('jsonwebtoken')

const PRIVATE_KEY_PATH = 'github-key.pem'
const TEN_MINUTES = 10 * 60
const GITHUB_APP_IDENTIFIER = 12145

const getAppJWT = () => {
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH)
    const nowSeconds = Date.now() / 1000
    const issuedAt = nowSeconds
    const expiration = nowSeconds + TEN_MINUTES
    const token = jwt.encode(
        {
            iat: issuedAt,
            exp: expiration,
            iss: GITHUB_APP_IDENTIFIER,
        },
        privateKey,
        'RS256',
    )
    return token
}

module.exports = getAppJWT
