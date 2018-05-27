const dynamoose = require('dynamoose')

const IS_OFFLINE = process.env.IS_OFFLINE
if (IS_OFFLINE === 'true') {
    dynamoose.AWS.config.update({
        accessKeyId: 'YOURKEY',
        secretAccessKey: 'YOURSECRET',
        region: 'us-east-1',
    })
    dynamoose.local()
}
