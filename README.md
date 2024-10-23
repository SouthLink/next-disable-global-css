# next-disable-global-css

> [Next.js](https://nextjs.org/)

v1.0.5 Added support for disabling error reporting for the next.js pure selector!

```
Syntax error: Selector "#head h3, h1" is not pure (pure selectors must contain at least one local class or id)
```


Next.js does not support [global css](https://nextjs.org/docs/messages/css-global) in directories other than pages/_app.js, and the latest version of Next.js v14 does not support the introduction of global styles in the node_module package

## Compatiblilty:

* Next 14.0+
* Next 13.0+ 

compatiblilty ( next.js pages directory or next.js app directory )

## Install

```sh
yarn add next-disable-global-css

npm i next-disable-global-css

pnpm install next-disable-global-css
```

## Usage

```js
// next.config.js
const withDisableGlobalCss = require("next-disable-global-css");

const nextConfig = {
  // ...
}

module.exports = withDisableGlobalCss(nextConfig);
```