const { analyzeFiles } = require('.')
const {
    currentBranchFileDetails,
    baseBranchFileDetails,
} = require('./analyzeFiles.mockdata')

describe('analyzeFiles', () => {
    it('analyses files correctly', () => {
        expect(
            analyzeFiles({
                baseBranchName: 'master',
                baseBranchFileDetails,
                currentBranchFileDetails,
            }),
        ).toMatchSnapshot()
    })
})
