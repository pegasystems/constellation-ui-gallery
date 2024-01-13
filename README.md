# Constellation UI Gallery

This project is used to provide a gallery of Custom DX components for Constellation UI.

These components are tested on Pega Platform 23.1 and might not run on older versions of the Pega Platform - For older versions, it is recommended to download the supported version of the Custom DX Component builder package @pega/custom-dx-components@XXXX for your Pega Platform version and create new components using the command line utility 'npm run create'.

A complete demo of the application is available at https://pegasystems.github.io/constellation-ui-gallery/

Pre-build versions of these components is available as a RAP file that you can import into your Pega application - see https://github.com/pegasystems/constellation-ui-gallery/releases

## For developers

To build and compile the application - use the following commands:

### Tools to install

Install npm from https://nodejs.org/en/download/

You should have the following versions installed: System node version 18.13.0 and npm version 8.

For more details, see https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/initialize-project.html

### Project setup

```
npm install
```

### Storybook

```
npm run start
```

### Compiles and minifies for production

```
npm run buildAllComponents
```

### Publish to a Pega Platform

Install the 'keys' folder provided by the Custom DX Component builder package and edit the tasks.config.json file with your rulesetName, rulesetVersion, server URL, clientID, user and password

```
npm run authenticate
```

Once the authentication is completed - you can publish by running

```
npm run publishAll
```

If you are having issues deploying the changing, review the documentation https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/command-line-references-constellation-dx-components.html
