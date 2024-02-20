# Known Issues

If you encountered issue with `npm install` exited with the following

```
[4949 ms] Start: Run in container: /bin/sh -c npm install
npm notice
npm notice New minor version of npm available! 10.2.3 -> 10.4.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.4.0
npm notice Run npm install -g npm@10.4.0 to update!
npm notice
[121068 ms] postCreateCommand failed with exit code 1. Skipping any further user-provided commands.
```

you are most probably behind a proxy / corporate network. To resolve this issue:

1. Open in a new browser tab `https://registry.npmjs.org/`
2. Follow [here](https://www.howtogeek.com/292076/how-do-you-view-ssl-certificate-details-in-google-chrome/) to get Root CA and click on `Export` to extract certificate content
3. Copy and paste the content inside `root_ca.crt` that should be created under `.devcontainer/`
4. add the following env variable to map Root CA into the container

```json
    [...]
  "remoteEnv": {
    [...]
    "NODE_EXTRA_CA_CERTS": ".devcontainer/root_ca.crt"
  },
    [...]
```

5. In VS Code `cmd/ctrl` + `shift` + `p` and select the **Dev Containers: Rebuild and Reopen in container** command to rebuild and open container.

References:

- [Issue with self signed certificates when installing extensions](https://github.com/microsoft/vscode-remote-release/issues/2987)
- [Self signed SSL Certificate support for DevContainers](https://github.com/microsoft/vscode-remote-release/issues/6092)
