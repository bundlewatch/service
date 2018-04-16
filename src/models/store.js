import dynamoose from 'dynamoose'

const store = dynamoose.model('Store', {
    repo: {
        type: String,
    },
    sha: {
        type: String,
    },
    files: {
        type: Array,
    },
})

export default store
