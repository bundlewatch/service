import analyze from './analyze'
import createURLToResultPage from './resultsPage/createURL'
import getBranchFileDetails from './getBranchFileDetails'
import GitHubService from './github/GitHubService'
import { STATUSES } from './analyze/analyzeFiles'

const getResults = async ({
    bundlewatchServiceHost,
    currentBranchFileDetails,
    baseBranchName,
    repoOwner,
    repoName,
    repoCurrentBranch,
    repoBranchBase,
    commitSha,
}) => {
    const baseBranchFileDetails =
        (await getBranchFileDetails(repoOwner, repoName, baseBranchName)) || {}

    const results = analyze({
        currentBranchFileDetails,
        baseBranchFileDetails,
        baseBranchName,
    })

    const url = await createURLToResultPage({
        results,
        bundlewatchServiceHost,
        repoOwner,
        repoName,
        repoCurrentBranch,
        repoBranchBase,
        commitSha,
    })

    return {
        ...results,
        url,
    }
}

const bundlewatchApi = async ({
    repoOwner,
    repoName,
    repoBranch,
    baseBranchName,
    githubAccessToken,
    commitSha,
    currentBranchFileDetails,
    bundlewatchServiceHost,
}) => {
    const githubService = new GitHubService({
        repoOwner,
        repoName,
        commitSha,
        githubAccessToken,
    })
    await githubService.start({ message: 'Checking bundlewatch...' })

    try {
        const results = await getResults({
            bundlewatchServiceHost,
            currentBranchFileDetails,
            baseBranchName,
            repoOwner,
            repoName,
            repoCurrentBranch: repoBranch,
            repoBranchBase: baseBranchName,
            commitSha,
        })
        if (results.status === STATUSES.FAIL) {
            await githubService.fail({
                message: results.summary,
                url: results.url,
            })

            await Promise.all(
                results.fullResults.map(result => {
                    if (result.status === STATUSES.FAIL) {
                        return githubService.fail({
                            message: result.message,
                            filePath: result.filePath,
                        })
                    }
                    return Promise.resolve()
                }),
            )
        } else {
            // TODO: add warn
            await Promise.all([
                githubService.pass({
                    message: results.summary,
                    url: results.url,
                }),
                // githubService.createIssueComment({
                //     body: 'test issue comment',
                // }),
            ])
        }
        return results
    } catch (e) {
        await githubService.error({
            message: `Unable to analyze, check logs. ${e ? e.messsage : ''}`,
        })
        throw e
    }
}

export default bundlewatchApi
export { STATUSES }
