const path = require("path");
const merge = require("webpack-merge");

module.exports = env => {
  const isDevBuild = !(env && env.prod);

  // Configuration in common to both client-side and server-side bundles.
  let sharedConfig = {
    mode: isDevBuild ? "development" : "production",
    optimization: {
      minimize: !isDevBuild,
      usedExports: isDevBuild
    },
    stats: { modules: false },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".jpg", ".css"]
    },
    output: {
      filename: "[name].js",
      publicPath: "dist/" // Webpack dev middleware, if enabled, handles requests for this URL prefix.
    },
    module: {
      rules: [
        {
          test: /\.js(x?)$/,
          include: /ClientApp/,
          use: [
            {
              loader: "babel-loader"
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: ["url-loader"]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    }
  };

  if (isDevBuild) {
    // Change config for development build.
    sharedConfig = {
      ...sharedConfig,
      devtool: "eval-source-map"
    };
  }

  // Configuration for client-side bundle suitable for running in browsers.
  const clientBundleOutputDir = "./wwwroot/dist";
  const clientBundleConfig = merge(sharedConfig, {
    entry: { "main-client": "./ClientApp/boot-client.js" },
    output: { path: path.join(__dirname, clientBundleOutputDir) }
  });

  // Configuration for server-side (prerendering) bundle suitable for running in Node.
  const serverBundleConfig = merge(sharedConfig, {
    resolve: { mainFields: ["main"] },
    entry: { "main-server": "./ClientApp/boot-server.js" },
    output: {
      libraryTarget: "commonjs",
      path: path.join(__dirname, "./ClientApp/dist")
    },
    target: "node"
  });

  return [clientBundleConfig, serverBundleConfig];
};
