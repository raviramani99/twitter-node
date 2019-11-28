/*
FileName : authCtrl.js
Date : 2nd Aug 2018
Description : This file consist of functions related to user's authentication
*/

/* DEPENDENCIES */
const { SetResponse, RequestErrorMsg, ErrMessages, ApiResponse } = require('./../helpers/common');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const request = require('request')
const jwt = require('jsonwebtoken');
const utils = require('./../helpers/utils');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getTrendingByWoeid = async (req, res) => {
    /* Contruct response object */
    let rcResponse = new ApiResponse();
    let httpStatus = 200;

    try {
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
            url: 'https://api.twitter.com/1.1/statuses/update.json?include_entities=true',
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
            function (error, response, body) {
                // Process your data here
                console.log("abc", body)
                // if(error){
                //   reject(error)
                // }else{
                //   resolve(body);
                // }
            }
        )
        // let token = await utils.generateToken;
        // console.log(token);
        // request(
        //     {
        //         url: request_data.url,
        //         method: request_data.method,
        //         form: request_data.data,
        //         headers: utils.generateToken
        //     },
        //     function (error, response, body) {
        //         // Process your data here
        //     }
        // )
        console.log('try block');
    } catch (err) {
        console.log(err);
        SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
        httpStatus = 500;
    }
    return res.status(httpStatus).send(rcResponse);
};

