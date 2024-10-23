const path = require("node:path");

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

      // Disabled error reporting by next.js about pure selection
      // Configure CSS Modules for better control over styling
      // This section modifies the webpack configuration to customize CSS Modules behavior
      const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      ?.oneOf.filter((rule) => Array.isArray(rule.use));

      if (rules) {
        rules.forEach((rule) => {
          rule.use.forEach((moduleLoader) => {
            if (
              moduleLoader.loader?.includes('css-loader') &&
              !moduleLoader.loader.includes('postcss-loader') &&
              typeof moduleLoader.options.modules === 'object'
            ) {
              moduleLoader.options = {
                ...moduleLoader.options,
                modules: {
                  ...moduleLoader.options.modules,
                  mode: 'local', // Keep CSS Modules functionality
                  auto: true, // Automatically detect whether to use CSS Modules
                  exportGlobals: true, // Allow exporting global styles
                },
              };
            }
          });
        });
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}

module.exports = withDisableNextJsGlobalCss;