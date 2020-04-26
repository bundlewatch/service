require('./dynamo-db')
const dynamoose = require('dynamoose')

const Store = dynamoose.model(
    process.env.STORE_TABLE,
    new dynamoose.Schema({
        commitSha: {
            type: String,
        },
        fileDetailsByPath: {
            type: Object,
        },
        repo: {
            type: String,
            hashKey: true,
            default: (model) => `${model.repoOwner}/${model.repoName}`,
        },
        repoBranch: {
            type: String,
            rangeKey: true,
        },
        repoName: {
            type: String,
        },
        repoOwner: {
            type: String,
        },
        timestamp: {
            type: String,
            index: {
                secondary: true,
                hashKey: 'repoOwner',
            },
        },
    }),
    {
        create: true,
        update: false,
        waitForActive: true,
        waitForActiveTimeout: 30000,
    },
)

module.exports = {
    Store,
}
