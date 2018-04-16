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
        const { repo, sha, files } = req.body
        const newStore = new Store({
            repo,
            sha,
            files,
        })
        newStore.save()
        res.json({ message: 'hello world' })
    })

    return serverless(app)
}

export const app = createServerlessApp()
