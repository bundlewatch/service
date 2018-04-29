import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import serverless from 'serverless-http'
import mustacheExpress from 'mustache-express'
import jsonpack from 'jsonpack/main'
import bytes from 'bytes'

import Store from '../models/store'
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
        '/store',
        protectedMiddleware,
        asyncMiddleware(async (req, res) => {
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
            const { repoBranch, repoName, repoOwner } = req.body
            const store = await Store.get({
                repoBranch,
                repoName,
                repoOwner,
            })
            if (!store) {
                res.status(404).send()
            }
            res.json({ fileDetailsByPath: store.fileDetailsByPath })
        }),
    )
    app.get(
        '/github-token',
        asyncMiddleware(async (req, res) => {
            const { code } = req.query
            if (!code) {
                res.status(400).json({ message: `No code` })
                return
            }

            const result = await generateAccessToken(code)
            if (result.error) {
                res.status(500).json({
                    error: result.error,
                })
                return
            }

            res.json({
                token: result,
            })
        }),
    )
    app.get(
        '/results',
        asyncMiddleware(async (req, res) => {
            let { d } = req.query
            const unpacked = jsonpack.unpack(d)
            const results = Object.assign(
                {},
                unpacked.results,
                getMustachePropsFromStatus(unpacked.results.status),
            )
            const details = unpacked.details

            details.commitShaPretty = details.commitSha.slice(0, 8)
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

                newFileResult.barTotalLength = Math.max(
                    fileResult.size,
                    fileResult.maxSize,
                )
                newFileResult.baseBranchSizePercentage =
                    fileResult.baseBranchSize /
                    newFileResult.barTotalLength *
                    100
                newFileResult.diffPercentage =
                    Math.abs(newFileResult.diff) /
                    newFileResult.barTotalLength *
                    100
                newFileResult.remainingPercentage =
                    100 -
                    newFileResult.baseBranchSizePercentage -
                    newFileResult.diffPercentage
                return newFileResult
            })
            results.status = results.status.toUpperCase()
            res.render('results', { results, details })
        }),
    )

    return serverless(app)
}

export const app = createServerlessApp()
