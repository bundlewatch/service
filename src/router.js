import express from 'express'
import bodyParser from 'body-parser'
import serverless from 'serverless-http'
require('./models/dynamo-db')
import Store from './models/store'

function createServerlessApp() {
    const app = express()
    app.disable('x-powered-by')
    // app.use(express.static('public'))
    app.use(bodyParser.json({ strict: false }))
    app.get('/', (req, res) => {
        res.json({ message: 'hello world' })
    })
    app.post('/store', (req, res) => {
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
        res.json(newStore)
    })
    app.post('/store/lookup', (req, res) => {
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

    return serverless(app)
}

export const app = createServerlessApp()
