const { canTokenAccessRepo } = require('../../app/github/canTokenAccessRepo')
const { asyncMiddleware } = require('./asyncMiddleware')

const protectedMiddleware = asyncMiddleware(async (req, res, next) => {
    if (process.env.IS_OFFLINE === 'true') {
        return next()
    }

    const { commitSha, repoName, repoOwner, githubAccessToken } = req.body

    const hasAccess = await canTokenAccessRepo({
        repoOwner,
        repoName,
        commitSha,
        githubAccessToken,
    })
    if (!hasAccess) {
        return res.status(401).json({ error: `Not allowed` })
    }
    if (hasAccess.error) {
        return res.status(500).json({ error: hasAccess.error })
    }

    return next()
})

module.exports = {
    protectedMiddleware,
}
