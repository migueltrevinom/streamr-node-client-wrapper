require('dotenv').config();

const API_ROOT = '/api';

const configuration = {
    name: 'API',
    env: process.env.NODE_ENV || 'development',
    streamr: {
      mode: process.env.STREAMR_ENV || 'staging',
      privateKey: process.env.ETH_PRIVATE_KEY,
      MATKey: process.env.MAT_SECRET_KEY,
      staging: {
          users_data_union: process.env.USERS_DATA_UNION_STAGING,
          users_side_chain: process.env.USERS_SIDE_CHAIN_STAGING,
          users_secret_key: process.env.USERS_DATA_UNION_STAGING_SECRET_KEY,
          ambassadors_data_union: process.env.AMBASSADORS_DATA_UNION_STAGING,
          ambassadors_side_chain: process.env.AMBASSADORS_SIDE_CHAIN_STAGING,
          ambassadors_secret_key: process.env.AMBASSADORS_DATA_UNION_STAGING_SECRET_KEY,
      },
      production: {
          users_data_union: process.env.USERS_DATA_UNION_PRODUCTION,
          users_side_chain: process.env.USERS_SIDE_CHAIN_PRODUCTION,
          ambassadors_data_union: process.env.AMBASSADORS_DATA_UNION_PRODUCTION,
          ambassadors_side_chain: process.env.AMBASSADORS_SIDE_CHAIN_PRODUCTION,
      },
    }
};

module.exports = configuration;