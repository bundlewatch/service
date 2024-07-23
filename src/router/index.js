const bodyParser = require('body-parser')
const bytes = require('bytes')
const express = require('express')
const jsonpack = require('jsonpack/main')
const mustacheExpress = require('mustache-express')
const serverless = require('serverless-http')

const { Store } = require('../models/store')
const {
    analyzeSchema,
    createStoreSchema,
    githutTokenSchema,
    lookupStoreSchema,
    unpackedJsonSchema,
} = require('./validators')
const { generateAccessToken } = require('../app/github/generateAccessToken')
const { asyncMiddleware } = require('./middleware/asyncMiddleware')
const { bundlewatchAsync, STATUSES } = require('../app')
const { protectedMiddleware } = require('./middleware/protectedMiddleware')
const { getBranchFileDetails } = require('../app/getBranchFileDetails')

const getMustachePropsFromStatus = (status) => {
    if (status === STATUSES.PASS) {
        return {
            pass: true,
        }
    }
    if (status === STATUSES.WARN) {
        return {
            warn: true,
        }
    }
    if (status === STATUSES.FAIL) {
        return {
            fail: true,
        }
    }
    return {
        removed: true,
    }
}

function validateEndpoint(req, res, schema) {
    const validation = schema.validate(req.body)
    if (validation.error) {
        return res.status(422).json({ errors: validation.error })
    }
    return null
}

function createServerlessApp() {
    const app = express()
    app.disable('x-powered-by')
    app.engine('mustache', mustacheExpress())
    app.set('view engine', 'mustache')
    app.set('views', 'src/views')
    app.use('/static', express.static('src/static'))
    app.use(bodyParser.json({ strict: false }))
    app.get('/', (req, res) => {
        res.json({ message: 'hello world' })
    })
    app.post(
        '/analyze',
        protectedMiddleware,
        asyncMiddleware(async (req, res) => {
            const errorStatus = validateEndpoint(req, res, analyzeSchema)
            if (errorStatus) {
                res.status(errorStatus).send()
                return
            }

            await bundlewatchAsync(req.body)
            res.sendStatus(202)
        }),
    )
    app.post(
        '/store',
        protectedMiddleware,
        asyncMiddleware(async (req, res) => {
            const errorStatus = validateEndpoint(req, res, createStoreSchema)
            if (errorStatus) return errorStatus
            const {
                commitSha,
                fileDetailsByPath,
                repoBranch,
                repoName,
                repoOwner,
            } = req.body

            const newStore = new Store({
                commitSha,
                fileDetailsByPath,
                repoBranch,
                repoName,
                repoOwner,
                timestamp: Date.now(),
            })
            newStore.save()
            return res.json(newStore)
        }),
    )
    app.post(
        '/store/lookup',
        protectedMiddleware,
        asyncMiddleware(async (req, res) => {
            const errorStatus = validateEndpoint(req, res, lookupStoreSchema)
            if (errorStatus) return errorStatus
            const { repoBranch, repoName, repoOwner } = req.body
            const store = await getBranchFileDetails(
                repoOwner,
                repoName,
                repoBranch,
            )
            if (!store) {
                return res.status(404).send()
            }
            return res.json({ fileDetailsByPath: store.fileDetailsByPath })
        }),
    )
    app.get(
        '/setup-github',
        asyncMiddleware(async (req, res) => {
            const errorStatus = validateEndpoint(req, res, githutTokenSchema)
            if (errorStatus) return errorStatus
            if (errorStatus) return errorStatus
            const { code } = req.query
            let result
            if (code) {
                result = await generateAccessToken(code)
                if (result.error) {
                    return res.status(500).json({
                        error: result.error,
                    })
                }
            }
            return res.render('setup-github', {
                token: result,
                clientId: process.env.GITHUB_CLIENT_ID,
            })
        }),
    )
    app.get(
        '/results',
        asyncMiddleware(async (req, res) => {
            let { d } = req.query
            const unpacked = jsonpack.unpack(d)
            const validation = unpackedJsonSchema.validate(unpacked)
            if (validation.error) {
                return res.status(422).json({ errors: validation.error })
            }
            const results = {
                ...unpacked.results,
                ...getMustachePropsFromStatus(unpacked.results.status),
            }
            const details = unpacked.details
            details.hasDetails =
                details.repoOwner &&
                details.repoName &&
                details.repoCurrentBranch &&
                details.commitSha

            details.commitShaPretty = details.commitSha
                ? details.commitSha.slice(0, 8)
                : ''
            results.fullResults.map((fileResult) => {
                const newFileResult = Object.assign(
                    fileResult,
                    getMustachePropsFromStatus(fileResult.status),
                )
                newFileResult.prettySize = bytes(fileResult.size)
                newFileResult.prettyMaxSize = bytes(fileResult.maxSize)
                if (fileResult.baseBranchSize) {
                    newFileResult.diff =
                        fileResult.size - fileResult.baseBranchSize
                    newFileResult.prettyDiffSize = bytes(newFileResult.diff)
                    if (newFileResult.diff > 0) {
                        newFileResult.prettyDiffSize = `+${newFileResult.prettyDiffSize}`
                    }
                }

                const barTotalLength = Math.max(
                    fileResult.size,
                    fileResult.maxSize,
                )

                newFileResult.baseBranchSizePercentage = 0
                newFileResult.diffPercentage =
                    (newFileResult.size / barTotalLength) * 100
                if (fileResult.baseBranchSize) {
                    // When the diff is negative, we need to eat into the baseBranchDiff
                    newFileResult.isDiffNegative = newFileResult.diff < 0
                    const absDiff = Math.abs(newFileResult.diff)

                    const baseBranchSize = newFileResult.isDiffNegative
                        ? fileResult.baseBranchSize - absDiff
                        : fileResult.baseBranchSize
                    newFileResult.baseBranchSizePercentage =
                        (baseBranchSize / barTotalLength) * 100

                    newFileResult.diffPercentage =
                        (absDiff / barTotalLength) * 100
                }
                return newFileResult
            })
            results.status = results.status.toUpperCase()
            return res.render('results', {
                results,
                details,
                serverCommitSha: process.env.GIT_SHA1,
            })
        }),
    )

    return serverless(app)
}

const app = createServerlessApp()

module.exports = {
    app,
}
