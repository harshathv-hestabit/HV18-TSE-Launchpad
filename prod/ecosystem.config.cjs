const env = require("dotenv").config({ path: ".env.prod" });
module.exports = {
  apps : [{
    script: '../src/server.js',
    watch: false,
    env:{
      PORT:env.parsed.PORT,
      DB_URI:env.parsed.DB_URI
    },
    exec_mode: "cluster",
    instances:"1"
  }
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
