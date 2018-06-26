import dotenv from 'dotenv';
dotenv.config()

const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/src',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      V2_PG_2: JSON.stringify(process.env.REACT_APP_V2_PG_2),
      V3_PG_2: JSON.stringify(process.env.REACT_APP_V3_PG_2),
      V2_PG: JSON.stringify(process.env.REACT_APP_V2_PG),
      V3_PG: JSON.stringify(process.env.REACT_APP_V3_PG)
    })
  ]
}