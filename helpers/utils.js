/*
FileName : utils.js
Date : 2nd Aug 2018
Description : This file consist of utility functions
*/

const bcrypt = require('bcryptjs');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const request = require('request')

/* Generate hash for password */
module.exports.generatePasswordHash = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
};

/* Compare password hash */
module.exports.comparePassword = async (originalPass, passToMatch) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(originalPass, passToMatch, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

module.exports.generateToken = async () => {
  console.log("sssssss")
  return new Promise((resolve, reject) => {
    console.log("aasasa")
    const oauth = OAuth({
      consumer: {
        key: process.env['CONSUMER_KEY'],
        secret: process.env['CONSUMER_SECRETE']
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64')
      },
    });

    const request_data = {
      url: 'https://api.twitter.com/1/statuses/update.json?include_entities=true',
      method: 'POST',
      data: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' },
    };

    // Note: The token is optional for some requests
    const token = {
      key: process.env['TOKEN'],
      secret: process.env['TOKEN_SECRETE']
    };
    request(
      {
          url: request_data.url,
          method: request_data.method,
          form: oauth.authorize(request_data, token),
      },
      function(error, response, body) {
          // Process your data here
          console.log("abc")
          if(error){
            reject(error)
          }else{
            resolve(body);
          }
      }
  )
    
});



  
}
