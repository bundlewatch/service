import bodyParser from 'body-parser'
import bytes from 'bytes'
import express from 'express'
import Joi from 'joi'
import jsonpack from 'jsonpack/main'
import mustacheExpress from 'mustache-express'
import path from 'path'
import serverless from 'serverless-http'

import analyze from '../helpers/analyze'
import Store from '../models/store'
import {
    createStoreSchema,
    githutTokenSchema,
    lookupStoreSchema,
    unpackedJsonSchema,
} from './validators'
import generateAccessToken from '../helpers/github/generateAccessToken'

import asyncMiddleware from './middleware/asyncMiddleware'
import protectedMiddleware from './middleware/protectedMiddleware'

const STATUS = {
    PASS: 'pass',
    WARN: 'warn',
    FAIL: 'fail',
    REMOVED: 'removed',
}

const getMustachePropsFromStatus = status => {
    if (status === STATUS.PASS) {
        return {
            pass: true,
        }
    } else if (status === STATUS.WARN) {
        return {
            warn: true,
        }
    } else if (status === STATUS.FAIL) {
        return {
            fail: true,
        }
    }
    return {
        removed: true,
    }
}

const ROOT_DIR = process.env.IS_OFFLINE ? '.webpack/service/' : ''

function validateEndpoint(req, res, schema) {
    const validation = Joi.validate(req.body, schema)
    if (validation.error) {
        return res.status(422).json({ errors: validation.error })
    }
    return null
}

function getBranchData(repoOwner, repoName, repoBranch) {
    const repo = `${repoOwner}/${repoName}`
    return Store.get({
        repoBranch,
        repo,
    })
}

function createServerlessApp() {
    const app = express()
    app.disable('x-powered-by')
    app.engine('mustache', mustacheExpress())
    app.set('view engine', 'mustache')
    app.set('views', path.join(ROOT_DIR, 'src/views'))
    app.use('/static', express.static(path.join(ROOT_DIR, 'src/static')))
    app.use(bodyParser.json({ strict: false }))
    app.get('/', (req, res) => {
        res.json({ message: 'hello world' })
    })
    app.post(
        '/analyze',
        // TODO protectedMiddleware?
        asyncMiddleware(async (req, res) => {
            // TODO validate req.body
            /* eslint-disable no-unused-vars */
            const {
                repoOwner,
                repoName,
                repoBranch,
                baseBranchName,
                githubAccessToken,
                commitSha,
                currentBranchFileDetails,
            } = req.body
            const baseBranchFileDetails =
                (await getBranchData(repoOwner, repoName, baseBranchName)) || {}

            const result = analyze({
                currentBranchFileDetails,
                baseBranchFileDetails,
                baseBranchName,
            })
            // TODO save in DB and post status to github
            res.status(202).json(result)
            /* eslint-ensable no-unused-vars */
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
            const store = await getBranchData(repoOwner, repoName, repoBranch)
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
            return res.render('setup-github', { token: result })
        }),
    )
    app.get(
        '/results',
        asyncMiddleware(async (req, res) => {
            let { d } = req.query
            const unpacked = jsonpack.unpack(d)
            const validation = Joi.validate(unpacked, unpackedJsonSchema)
            if (validation.error) {
                return res.status(422).json({ errors: validation.error })
            }
            const results = Object.assign(
                {},
                unpacked.results,
                getMustachePropsFromStatus(unpacked.results.status),
            )
            const details = unpacked.details
            details.hasDetails =
                details.repoOwner &&
                details.repoName &&
                details.repoCurrentBranch &&
                details.commitSha

            details.commitShaPretty = details.commitSha
                ? details.commitSha.slice(0, 8)
                : ''
            results.fullResults.map(fileResult => {
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
                        newFileResult.prettyDiffSize = `+${
                            newFileResult.prettyDiffSize
                        }`
                    }
                }

                const barTotalLength = Math.max(
                    fileResult.size,
                    fileResult.maxSize,
                )

                newFileResult.baseBranchSizePercentage = 0
                newFileResult.diffPercentage =
                    newFileResult.size / barTotalLength * 100
                if (fileResult.baseBranchSize) {
                    // When the diff is negative, we need to eat into the baseBranchDiff
                    newFileResult.isDiffNegative = newFileResult.diff < 0
                    const absDiff = Math.abs(newFileResult.diff)

                    const baseBranchSize = newFileResult.isDiffNegative
                        ? fileResult.baseBranchSize - absDiff
                        : fileResult.baseBranchSize
                    newFileResult.baseBranchSizePercentage =
                        baseBranchSize / barTotalLength * 100

                    newFileResult.diffPercentage =
                        absDiff / barTotalLength * 100
                }
                return newFileResult
            })
            results.status = results.status.toUpperCase()
            return res.render('results', { results, details })
        }),
    )

    return serverless(app)
}

export const app = createServerlessApp()
