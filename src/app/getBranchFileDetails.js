import Store from '../models/store'

export default function(repoOwner, repoName, repoBranch) {
    const repo = `${repoOwner}/${repoName}`
    return Store.get({
        repoBranch,
        repo,
    })
}
