const { ProductCatalogProductSetsBatch } = require('facebook-nodejs-business-sdk')

require('dotenv').config()

module.exports = {
  reactStrictMode: true,
  env:{
    FACEBOOK_APP_ID : process.env.FACEBOOK_APP_ID
  },
}
