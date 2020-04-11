<div align="center">
  <a href="https://bundlewatch.io">
    <img src="https://cdn.rawgit.com/bundlewatch/bundlewatch.io/master/docs/_assets/logo-large.svg" height="100px">
  </a>
  <br>
  <br>

[![bundlewatch][bundlewatch]][bundlewatch-url]
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors)

[![deps][deps]][deps-url]
[![dev-deps][dev-deps]][dev-deps-url]
[![builds][builds]][builds-url]
[![test][test]][test-url]
<br>
<a href="https://github.com/bundlewatch/service/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/bundlewatch/service.svg">
</a>
<a href="https://github.com/bundlewatch/service/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/bundlewatch.svg">
</a>

  <br>

  <h1>BundleWatch</h1>
  <p>
    BundleWatch checks file sizes, ensuring bundled browser assets don't jump in file size. <br />
    Sharp increases in BundleWatch can signal that something is wrong - adding a package that bloats the slug, a wrong import, or forgetting to minify.
  </p>
</div>

## This repo is the BundleWatch Service, for storing and computing BundleWatch data.
The BundleWatch CLI app and Node API is at https://github.com/bundlewatch/bundlewatch

The BundleWatch.io documentation site is at https://github.com/bundlewatch/bundlewatch.io

## How to set up your own instance

1. Configure CI
    - Use the [existing CircleCI config](https://github.com/bundlewatch/service/blob/master/.circleci/config.yml), or configure an equivalent.
      - [GitHub Actions example](https://github.com/GoProperly/bundlewatch-service/blob/master/.github/workflows/deploy.yml)
    - I [disabled use of coveralls](https://github.com/GoProperly/bundlewatch-service/commit/7aef7538c55f2d26a9779555830d57105d001713) in `JEST_ARGS` in `Makefile` since it is a third-party service that requires additional setup

1. Create a GitHub OAuth application
    - For a GitHub Organization: https://github.com/organizations/<ORG>/settings/applications/new
    - Personal: https://github.com/settings/applications/new
    - Set the "Authorization callback URL" to e.g. https://bundlewatch.example.org/setup-github
    - Make note of client ID and client secret

1. Configure environment variables in CI:
    - AWS credentials for serverless deploy:
      - `AWS_ACCESS_KEY_ID`
      - `AWS_SECRET_ACCESS_KEY`
    - GitHub OAuth application client secret:
      - `GITHUB_CLIENT_SECRET`

1. Customize `serverless.yml`
    ```
    custom:
      githubClientId:
        prod: '<GitHub OAuth application client ID>'
      customDomain:
        domainName: bundlewatch.example.org
    ```

## Contributors

Thanks goes to these wonderful people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://jakebolam.com"><img src="https://avatars2.githubusercontent.com/u/3534236?v=4" width="100px;" alt="Jake Bolam"/><br /><sub><b>Jake Bolam</b></sub></a><br /><a href="https://github.com/bundlewatch/service/commits?author=jakebolam" title="Code">💻</a></td>
    <td align="center"><a href="https://opensource.tophat.com"><img src="https://avatars0.githubusercontent.com/u/6020693?v=4" width="100px;" alt="Shouvik DCosta"/><br /><sub><b>Shouvik DCosta</b></sub></a><br /><a href="https://github.com/bundlewatch/service/commits?author=sdcosta" title="Code">💻</a></td>
    <td align="center"><a href="http://www.tylerbenning.com"><img src="https://avatars2.githubusercontent.com/u/7265547?v=4" width="100px;" alt="Tyler Benning"/><br /><sub><b>Tyler Benning</b></sub></a><br /><a href="#design-tbenning" title="Design">🎨</a></td>
    <td align="center"><a href="http://www.6ixsushi.com"><img src="https://avatars3.githubusercontent.com/u/20323414?v=4" width="100px;" alt="Leila Rosenthal"/><br /><sub><b>Leila Rosenthal</b></sub></a><br /><a href="https://github.com/bundlewatch/service/commits?author=leilarosenthal" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/francoiscampbell"><img src="https://avatars3.githubusercontent.com/u/3876970?v=4" width="100px;" alt="Francois Campbell"/><br /><sub><b>Francois Campbell</b></sub></a><br /><a href="https://github.com/bundlewatch/service/commits?author=francoiscampbell" title="Code">💻</a></td>
    <td align="center"><a href="http://emmanuel.ogbizi.com"><img src="https://avatars0.githubusercontent.com/u/2528959?v=4" width="100px;" alt="Emmanuel Ogbizi"/><br /><sub><b>Emmanuel Ogbizi</b></sub></a><br /><a href="#security-iamogbz" title="Security">🛡️</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Want to Help? Become a Contributor
Contributions of any kind are welcome! [Join us on Slack](https://join.slack.com/t/bundlewatch/shared_invite/enQtMzUwNjYxNTMwMzcyLWE5NGI4MzZjMjM4MTRlYzllOTMwYzIzZWNjM2MyMjBmMzNjNGM0ZGVhODc2YjFkNzIwMzNkYjk3NzE0MjZkOTc) and start contributing.

[bundlewatch]: https://img.shields.io/badge/bundle-watched-blue.svg
[bundlewatch-url]: https://bundlewatch.io

[deps]: https://david-dm.org/bundlewatch/service/status.svg
[deps-url]: https://david-dm.org/bundlewatch/service

[dev-deps]: https://david-dm.org/bundlewatch/service/dev-status.svg
[dev-deps-url]: https://david-dm.org/bundlewatch/service?type=dev

[test]: https://coveralls.io/repos/github/bundlewatch/service/badge.svg?branch=master
[test-url]: https://coveralls.io/github/bundlewatch/service?branch=master

[builds]: https://img.shields.io/circleci/project/github/bundlewatch/service/master.svg
[builds-url]: https://circleci.com/gh/bundlewatch/service

[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key

