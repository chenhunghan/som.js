var path = require('path');
module.exports = {
    entry: './src/som.js',
    output: {
        path: __dirname,
        filename: 'som.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader'
            }
        ]
    }
};