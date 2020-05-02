# d2l-polaris

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui/polaris.svg)](https://www.npmjs.org/package/@brightspace-ui/polaris)
[![Dependabot badge](https://flat.badgen.net/dependabot/BrightspaceUI/polaris?icon=dependabot)](https://app.dependabot.com/)
[![Build status](https://travis-ci.com/@brightspace-ui/polaris.svg?branch=master)](https://travis-ci.com/@brightspace-ui/polaris)

prototype

## Installation

To install from NPM:

```shell
npm install @brightspace-ui/polaris
```

## Usage

```html
<script type="module">
    import '@brightspace-ui/polaris/polaris.js';
</script>
<d2l-polaris>My element</d2l-polaris>
```

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Running the demos

To start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo page and tests:

```shell
npm start
```

### Testing

To lint:

```shell
npm run lint
```

To run local unit tests:

```shell
npm run test:local
```

To run both linting and unit tests:

```shell
npm test
```

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version and create a tag.
