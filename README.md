# Constellation DX Components UI Gallery

Constellation's flexible architecture empowers advanced users (professional front-end developers with ReactJS and web technology expertise) to extend the platform. You can achieve this by programmatically combining core Constellation presentational components and leveraging the Constellation DX API to build custom components, known as "Constellation DX components."

This gallery provides a collection of ready-to-use and customizable component. Explore them directly or [delve into the source code](https://github.com/pegasystems/constellation-ui-gallery/tree/master/src/components) for deeper understanding. Use this resource to gain inspiration, best practices, and a solid foundation for implementing custom components.

These components have been tested on Pega '23.1, '24.1, '24.2 and '25.1 and might not run older other versions of the Pega Platform

- Version 1.x and branch release/1.x.x should be used for Pega '23
- Version 2.x and branch release/2.0 should be used for Pega '24.1
- Version 3.x and branch release/3.0 should be used for Pega '24.2
- Version 4.x and branch master should be used for Pega '25.1

Older versions of the Pega Platform have not been tested and are not supported.

A complete demonstration of these Constellation DX components is available at [pegasystems.github.io/constellation-ui-gallery](https://pegasystems.github.io/constellation-ui-gallery/)

Pre-build versions of these components is available as a RAP file that you can import into your Pega application - see [github.com/pegasystems/constellation-ui-gallery/releases](https://github.com/pegasystems/constellation-ui-gallery/releases)

## For developers

To build and compile the application - use the following commands:

### Tools to install

Install npm from [nodejs.org](https://nodejs.org/en/download/)

You should have the following versions installed: System node version 20.x and npm version 10.x.

If you already have [VS Code](https://code.visualstudio.com/) and [Docker](https://docs.docker.com/get-docker/) installed, you can click [here](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/pegasystems/constellation-ui-gallery) to get started. Clicking these links will cause VS Code to automatically install the Dev Containers extension if needed, clone the source code into a container volume, and spin up a dev container for use.

For more details on building Constellation DX components, see [docs.pega.com](https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/initialize-project.html)

Note: Make sure to use `git clone git@github.com:pegasystems/constellation-ui-gallery.git` to download the source code of this repository instead of using the download option. If you download the code, you will not be able to publish the components and you will see the error 'Git needs to be installed' even if you have the git executable installed. This error is generated because you are missing the .git folder. If you face this issue, you can type `git init` to create the missing folder.

### Project setup

```shell
npm install
```

### Storybook

```shell
npm run start
```

### Linting

Make sure to install the recommended VS Code extensions. Before checking code, make sure that no error are reported:

```shell
npm run lint
```

To fix some of the issues:

```shell
npm run fix
```

### Unit testing

For unit test results, you can run:

```shell
npm run test
```

For unit test coverage, you can run:

```shell
npm run coverage
```

The coverage report index.html will be in the 'coverage' folder

### End to End testing

End to end testing is done by loading each stories using playwright as well as running some accessibility testing on these stories. The results of accessibility is similar to the panel in storybook.

To execute the end to end test locally, you need to first build the storybook as static:

```shell
npm run build-storybook
```

Install Playwright (only needed once)

```shell
npx playwright install
```

Serve the site though an http server on port 6006

```shell
serve -port 6006 storybook-static
```

In a separate terminal, run the suite of tests

```shell
npm run test-storybook
```

### Compiles and minifies for production

```shell
npm run buildAllComponents
```

### Publish to a Pega Platform

Install the 'keys' folder provided by the Constellation DX Component builder package and edit the tasks.config.json file with your rulesetName, rulesetVersion, server URL, clientID, user and password

```shell
npm run authenticate
```

Once the authentication is completed - you can publish by running

```shell
npm run publishAll
```

If you are having issues deploying the changes, review the documentation [docs.pega.com constellation DX component CLI references][constellation-dx-cli-references]

[constellation-dx-cli-references]: https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/command-line-references-constellation-dx-components.html
