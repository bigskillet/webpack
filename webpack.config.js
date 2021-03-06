const path = require('path');
const globby = require('globby');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const files = globby.sync([
  './src/pages/!(_**)/!(_*).twig',
  './src/pages/!(_*).twig'
]);

const pages = files.map((file) =>
  new HtmlWebpackPlugin({
    filename: file.replace('./src/pages/', '').replace('.twig', '.html'),
    template: path.resolve(__dirname, file)
  })
);

module.exports = {
  entry: {
    main: './src/scripts/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: process.env.NODE_ENV == 'production'
      ? 'assets/[name].[contenthash:8].js'
      : 'assets/[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.twig$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              sources: {
                list: [
                  '...',
                  {
                    tag: 'img',
                    attribute: 'data-src',
                    type: 'src'
                  },
                  {
                    tag: 'img',
                    attribute: 'data-srcset',
                    type: 'srcset'
                  }
                ]
              }
            }
          },
          'twig-html-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(svg|png|jpg|woff2|xml|webmanifest)$/,
        type: 'asset/resource',
        generator: {
          filename: process.env.NODE_ENV == 'production'
            ? 'assets/[name].[contenthash:8][ext]'
            : 'assets/[name][ext]'
        }
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    overlay: true,
    open: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/static/**/*',
          to: 'assets/[name][ext]',
          noErrorOnMissing: true
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV == 'production'
        ? 'assets/[name].[contenthash:8].css'
        : 'assets/[name].css'
    }),
    ...pages
  ],
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    },
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              }
            }
          ]
        }
      }),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false
          }
        }
      })
    ]
  }
};
