# Constellation UI Gallery

Gallery of DX components for Constellation UI for Pega Platform 8.23.

Note: no guarantee is made that this code will run on older versions of the Pega Platform - For older versions, it is recommended to download the correct version of the Custom DX Component builder package @pega/custom-dx-components@XXXX that is supported by your Pega Platform version and create new components using the command line utility 'npm run create'

A complete demo of the application is available at https://pegasystems.github.io/uplus-wss/.

## For developers

To build and compile the application - use the following commands:

### Tools to install

install npm from https://nodejs.org/en/download/
You should have the following versions installed: System node version 18.13.0 and npm version 8.see https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/initialize-project.html

### Project setup

```
npm install
```

### Storybook

```
npm run startStorybook
```

### Compiles and minifies for production

```
npm run buildAllComponents
```

### Publish to a Pega Platform

```
npm run publishAll
```
