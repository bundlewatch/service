const moxios = require('moxios')
const { Installations } = require('./Installations')
const { getInstallationsResponse } = require('./installations.mockdata')
const {
    getInstallationRepositoriesResponse,
} = require('./installations.repositories.mockdata')

describe('github/user/installations', () => {
    const MOCK_ACCESS_TOKEN = 'mock_token'
    const installationApi = new Installations({
        githubUserAccessToken: MOCK_ACCESS_TOKEN,
    })
    it('getInstallations, Returns correct response', async () => {
        moxios.stubRequest('https://api.github.com/user/installations', {
            status: 200,
            response: getInstallationsResponse,
        })

        const installations = await installationApi.getInstallations()
        expect(installations).toEqual([1, 3])
    })

    it('getRepositoriesForInstallation, returns correct response', async () => {
        const mockInstallationId = 1
        moxios.stubRequest(
            `https://api.github.com/user/installations/${mockInstallationId}/repositories`,
            {
                status: 200,
                response: getInstallationRepositoriesResponse,
            },
        )

        const installations = await installationApi.getRepositoriesForInstallation(
            mockInstallationId,
        )
        expect(installations).toEqual(['octocat/Hello-World'])
    })
})
