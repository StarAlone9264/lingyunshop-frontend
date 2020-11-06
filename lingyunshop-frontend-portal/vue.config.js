// 'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

// const path = require('path')
const webpack = require("webpack");

module.exports = {
    configureWebpack: {
        //支持jquery
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    lintOnSave: false,
    devServer: {
        // Paths
        // assetsSubDirectory: 'static',
        // assetsPublicPath: '/',
        proxy: {
            '/api': {
                // 这里是配置springboot 访问路径 此处8088就是spring boot的端口
                target: "http://localhost:2334",
                // 允许跨域
                chunkOrigins: true,
                pathRewrite: {
                    // 路径重写，使用"/api"代替target.
                    '^/api': ''
                }
            }
        },
        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8083, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        // errorOverlay: true,
        // notifyOnErrors: true,
        /**
         * Source Maps
         */
        // https://webpack.js.org/configuration/devtool/#development
        // devtool: 'cheap-module-eval-source-map',
        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        // cacheBusting: true,
        // cssSourceMap: true
    }
}
