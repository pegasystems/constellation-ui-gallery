# Constellation DX Components UI Gallery

Constellation's flexible architecture empowers advanced users (professional front-end developers with ReactJS and web technology expertise) to extend the platform. You can achieve this by programmatically combining core Constellation presentational components and leveraging the Constellation DX API to build custom components, known as "Constellation DX components."

This gallery provides a collection of ready-to-use and customizable component. Explore them directly or [delve into the source code](https://github.com/pegasystems/constellation-ui-gallery/tree/master/src/components) for deeper understanding. Use this resource to gain inspiration, best practices, and a solid foundation for implementing custom components.

These components have been tested on Pega 23.1 and might not run on older versions of the platform - For older versions, the recommendation is to download the supported version of the Constellation DX Component builder package @pega/custom-dx-components@XXXX supported by your Pega Platform version and create new components using the command line utility 'npm run create'.

A complete demonstration of these Constellation DX components is available at [pegasystems.github.io/constellation-ui-gallery](https://pegasystems.github.io/constellation-ui-gallery/)

Pre-build versions of these components is available as a RAP file that you can import into your Pega application - see [github.com/pegasystems/constellation-ui-gallery/releases](https://github.com/pegasystems/constellation-ui-gallery/releases)

## For developers

To build and compile the application - use the following commands:

### Tools to install

Install npm from [nodejs.org](https://nodejs.org/en/download/)

You should have the following versions installed: System node version 18.13.0 and npm version 8.

For more details, see [docs.pega.com](https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/initialize-project.html)

### Project setup

```shell
npm install
```

### Storybook

```shell
npm run start
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
