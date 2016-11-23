var webpack = require('webpack');

module.exports = {
    
	entry: {
        beforeAngular	: "./client_src/js/beforeAngular.js",
        main			: "./client_src/js/main.js"
    },
    output: {
        filename		: "[name].entry.js"
    },

	devtool: "#inline-source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015']
                }
            },
			{ test: /\.css$/,    					loader: "style-loader!css-loader" 	},
			{ test: /\/jquery.js$/,     			loader: 'script-loader'    	      	},
			{ test: /\/w2ui.min.js$/,     			loader: 'script-loader'    	      	},
			{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 	loader: "file" },
			{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, 	loader: "file" },
			{ test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,	loader: "file" },
			{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 	loader: "file" },
			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 	loader: "file" },
        ]
    },

    plugins: [
//        new webpack.optimize.UglifyJsPlugin({
//            compress: {
//                warnings: false
//            }
//        })
    ]
};
