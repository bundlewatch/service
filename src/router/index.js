import express from 'express'
import bodyParser from 'body-parser'
import serverless from 'serverless-http'

require('../models/dynamo-db')
import Store from '../models/store'
import generateAccessToken from '../helpers/github/generateAccessToken'

import asyncMiddleware from './middleware/asyncMiddleware'
import protectedMiddleware from './middleware/protectedMiddleware'

function createServerlessApp() {
    const app = express()
    app.disable('x-powered-by')
    // app.use(express.static('public'))
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
    app.post('/store/lookup', protectedMiddleware, (req, res) => {
        const { repoBranch, repoName, repoOwner } = req.body
        Store.get(
            {
                repoBranch,
                repoName,
                repoOwner,
            },
            store => {
                res.json({ fileDetailsByPath: store.fileDetailsByPath })
            },
        )
    })
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

    return serverless(app)
}

export const app = createServerlessApp()
