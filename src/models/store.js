import dynamoose from 'dynamoose'

const store = dynamoose.model('Store', {
    commitSha: {
        type: String,
    },
    fileDetailsByPath: {
        type: Object,
    },
    repoBranch: {
        type: String,
    },
    repoName: {
        type: String,
    },
    repoOwner: {
        type: String,
    },
    timestamp: {
        type: Date,
    },
})

export default store
