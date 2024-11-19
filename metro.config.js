const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const defaultModuleResolver = getDefaultConfig(__dirname).resolver.resolveRequest;
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    // your other option here
    // ...
    resolver: {
      resolveRequest: (context, moduleName, platform) => {
        try {
          return context.resolveRequest(context, moduleName, platform);
        } catch (error) {
          console.warn('\n1️⃣ context.resolveRequest cannot resolve: ', moduleName);
        }

        try {
          const resolution = require.resolve(moduleName, {
            paths: [path.dirname(context.originModulePath), ...config.resolver.nodeModulesPaths],
          });

          if (path.isAbsolute(resolution)) {
            return {
              filePath: resolution,
              type: 'sourceFile',
            };
          }
        } catch (error) {
          console.warn('\n2️⃣ require.resolve cannot resolve: ', moduleName);
        }

        try {
          return defaultModuleResolver(context, moduleName, platform);
        } catch (error) {
          console.warn('\n3️⃣ defaultModuleResolver cannot resolve: ', moduleName);
        }

        try {
          return {
            filePath: require.resolve(moduleName),
            type: 'sourceFile',
          };
        } catch (error) {
          console.warn('\n4️⃣ require.resolve cannot resolve: ', moduleName);
        }

        try {
          const resolution = getDefaultConfig(require.resolve(moduleName)).resolver?.resolveRequest;
          return resolution(context, moduleName, platform);
        } catch (error) {
          console.warn('\n5️⃣ getDefaultConfig cannot resolve: ', moduleName);
        }
      },
    },
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
