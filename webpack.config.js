var path = require("path");
var webpack = require("webpack");

var PATHS = {
  entryPoint: path.resolve(__dirname, "src/indexmin.ts"),
  dist: path.resolve(__dirname, "dist"),
};

var config = {
  // These are the entry point of our library. We tell webpack to use
  // the name we assign later, when creating the bundle. We also use
  // the name to filter the second entry point for applying code
  // minification via UglifyJS
  entry: {
    cotter: [PATHS.entryPoint],
    "cotter.min": [PATHS.entryPoint],
  },
  // The output defines how and where we want the bundles. The special
  // value `[name]` in `filename` tell Webpack to use the name we defined above.
  // We target a UMD and name it MyLib. When including the bundle in the browser
  // it will be accessible at `window.MyLib`
  output: {
    path: PATHS.dist,
    filename: "[name].js",
    libraryTarget: "umd",
    library: "Cotter",
    umdNamedDefine: true,
  },
  // Add resolve for `tsx` and `ts` files, otherwise Webpack would
  // only look for common JavaScript file extension (.js)
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  // Activate source maps for the bundles in order to preserve the original
  // source when the user debugs the application
  devtool: "source-map",

  optimization: {
    minimize: true, //Update this to true or false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
