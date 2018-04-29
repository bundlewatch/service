import dynamoose from 'dynamoose'

const IS_OFFLINE = process.env.IS_OFFLINE
if (IS_OFFLINE === 'true') {
    dynamoose.AWS.config.update({
        accessKeyId: 'YOURKEY',
        secretAccessKey: 'YOURSECRET',
        region: 'us-east-1',
    })
    dynamoose.local()
}

const store = dynamoose.model(
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
            default: model => `${model.repoOwner}/${model.repoName}`,
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

export default store
