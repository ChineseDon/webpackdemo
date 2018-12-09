const path = require("path");
const glob = require("glob");
const webpack = require('webpack');
const uglify = require("uglifyjs-webpack-plugin");
const htmlPlugin = require("html-webpack-plugin");
const extractTextPlugin = require("extract-text-webpack-plugin");
const purifyCssPlugin = require("purifycss-webpack");
const copyFilePlugin = require('copy-webpack-plugin');

console.log(encodeURIComponent(process.env.type));
if (process.env.type === "build") {
  var website = {
    publicPath: "https://www.haibingo.com/"
  };
} else {
  var website = {
    publicPath: "http://192.168.1.102:8089/"
  };
}

// webpack 配置文件
module.exports = {
  /* devtool source-map 独立map 包括行 列（打包最慢）    
  cheap-module-source-map  独立 行 不包括列
  eval-source-map 打包速度快 有安全隐患 开发阶段 包括行 列
  cheap-module-eval-source-map  只有列 */
  devtool: "",
  entry: {
    entry: "./src/entry.js",
    jquery: "jquery",
    vue: 'vue'
  },
  // 输出文件
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: website.publicPath // 解决图片引用
  },
  // 相关的js， html， 图片解读
  module: {
    rules: [{
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            },
            "postcss-loader"
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 50,
            outputPath: "images/"
          }
        }]
      },
      {
        test: /\.(html|htm)$/i,
        use: ["html-withimg-loader"]
      },
      {
        test: /\.less$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
              loader: "css-loader"
            },
            {
              loader: "less-loader"
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
              loader: "css-loader"
            },
            {
              loader: "sass-loader"
            }
          ]
        })
      },
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    // webpack热更新
    new webpack.HotModuleReplacementPlugin(),
    // webpack 外部引入包 打包优化
    new webpack.optimize.CommonsChunkPlugin({
      name: ['jquery', 'vue'],
      filename: './assets/js/[name].min.js',
      minChunks: 2 // 最小抽离几个文件
    }),
    // new uglify(),
    new htmlPlugin({
      minify: {
        removeAttributeQuotes: true
      },
      hash: true,
      template: "./src/index.html"
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      Vue: 'vue'
    }),
    new extractTextPlugin("./css/index.css"),
    new purifyCssPlugin({
      paths: glob.sync(path.join(__dirname, "src/*.html"))
    }),
    new webpack.BannerPlugin('***的webpack demo'),
    new copyFilePlugin([{
      from: __dirname + '/src/static',
      to: './static'
    }])
  ],
  // webpack 开发服务
  devServer: {
    contentBase: path.resolve(__dirname, "dist"), //监听地址
    host: "192.168.1.102", // 访问地址
    compress: true, // 服务器压缩
    port: 8089 // 运行端口
  },
  watchOptions: {
    poll: 1000, //监测修改的时间 单位（ms)
    aggregateTimeout: 500,  // 连续保存之间的反应间隔时间，小于500毫秒时，只打包一次
    ignored: /node_modules/,
  }
};
