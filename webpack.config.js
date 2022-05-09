const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./src/js/index.js"),
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "bundle.js",
    // clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    watchFiles: ["src/*.html", "src/css/*.css"],
    hot: true,
    compress: false,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      inject: "body",
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!.git',
      ],
    }),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
    ],
  },
};
