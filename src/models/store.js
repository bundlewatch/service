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
        repoBranch: {
            type: String,
            rangeKey: true,
        },
        repoName: {
            type: String,
        },
        repoOwner: {
            type: String,
            hashKey: true,
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
        create: true, // Create table in DB, if it does not exist,
        update: false, // Update remote indexes if they do not match local index structure
        waitForActive: true, // Wait for table to be created before trying to use it
        waitForActiveTimeout: 30000, // wait 3 minutes for table to activate
    },
)

export default store
