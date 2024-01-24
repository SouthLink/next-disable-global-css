function withDisableNextJsGlobalCss({ ...nextConfig }) {
  return Object.assign({}, nextConfig, {
    /**
     * @param {import('webpack').Configuration} config
     * @param {*} options
     * @returns {import('webpack').Configuration}
     */
    webpack(config, options) {
      // disable css-module in Next.js v13 + ( pages directory )
      config.module.rules.forEach((rule) => {
        const { oneOf } = rule;
        if (oneOf) {
          oneOf.forEach((one) => {
            if (!`${one.issuer?.and}`.includes("_app")) return;
            one.issuer.and = [path.resolve(__dirname)];
          });
        }
      });

      // disable css-module in Next.js v14 +  ( app directory )
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf = rule.oneOf.filter((item) => {
            if (
              item?.use?.loader === "error-loader" &&
              item?.use?.options?.reason?.includes("Global CSS")
            ) {
              return false;
            }
            return true;
          });
        }
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}

module.exports = withDisableNextJsGlobalCss;