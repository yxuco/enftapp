# Sample frontend of dApp for NFT contract

Create a [React](https://reactjs.org) app for [sample NFT contract](https://github.com/yxuco/enft), which uses [MetaMask](https://metamask.io/) and [ethers.js](https://docs.ethers.io/v5/) to connect to the Ethereum network.

Similar approach also applies to development of frontend dApp using [Vue](https://vuejs.org/).

## Create project

Install `yarn` which is similar to `npm`, but required to generate frontend project by using [create-eth-app](https://github.com/paulrberg/create-eth-app).

```bash
npm install -g yarn
```

Create `react` app for dApp:

```bash
mkdir frontend
cd frontend
yarn create eth-app enftapp
```

The generated [README.md](./README-gen.md) describes commands for build and start the frontend project `enftapp`, e.g., to start the app, enter

```bash
cd entfapp
yarn react-app:start
```

## Add application logic to interact with NFT contract

We use [ethers.js](https://docs.ethers.io/v5/) to interact with ethereum via [MetaMask](https://metamask.io/).  So, install the dependency:

```bash
cd packages/react-app
yarn add ethers
```

[Install MetaMask for Chrome](https://metamask.io/download.html), and create an account for testing.

Add ABI defintion of the [sample contract](https://github.com/yxuco/enft), i.e., [enft.json](./packages/contracts/src/abis/enft.json), which is extracted from the contract build result in `artifacts/contracts/ENFT.sol/ENFT.json` if the contract is built using [hardhat](https://hardhat.org).

Add the reference and deployed address of the contract to [abis.js](./packages/contracts/src/abis.js) and [addresses.js](./packages/contracts/src/addresses.js).

Edit [App.js](./packages/react-app/src/App.js) to add required application logic.  Add stylesheet [App.css](./packages/react-app/src/App.css) if necessary.

Edit styles of other visual components in [index.js](./packages/react-app/src/components/index.js).

## Use Vue.js instead of react

Alternatively, to develop UI using [Vue.js](https://vuejs.org/), you can create the project using command:

```bash
yarn create eth-app enftapp --framework vue
```

## Use indexed query in dApp

The generated [README.md](./README-gen.md) includes instructions to setup `subgraph` by using [thegraph.com](https://thegraph.com/docs), and so you can use index for query.  The generated project contains required templates, although the subgraph feature is not used by this sample.

## Note: setup Visual Studio Code

Add `code` path to `PATH`, so you can type `code` in commandline to launch vscode.  In VS Code, open the Command Palette(`Command+Shift+P`), type `shell command` to find and execute `Shell Command: Install 'code' command in PATH`.

Use `Prettier+` plugin to format react source code.  The default js formatter does not work well for `react-app`.  I installed the `Prettier+` plugin, and open the `Settings`(`Command+,`), and click the link `Edit in settings.json`, change the `javascript` to use the following settings.

```json
    "[javascript]": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "svipas.prettier-plus"
    },
```
