/*
FileName : authCtrl.js
Date : 2nd Aug 2018
Description : This file consist of functions related to user's authentication
*/

/* DEPENDENCIES */
const { SetResponse, RequestErrorMsg, ErrMessages, ApiResponse } = require('./../helpers/common');
const jwt = require('jsonwebtoken');
const userModel = require('./../models/usersModel');
const utils = require('./../helpers/utils');
const ObjectId = require('mongoose').Types.ObjectId;

/* Authenticate user */
module.exports.login = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  /* Check body params */
  if (!req.body.email || !req.body.password) {
    SetResponse(rcResponse, 400, RequestErrorMsg('InvalidParams', req, null), false);
    httpStatus = 400;
    return res.status(httpStatus).send(rcResponse);
  }

  try {
    /* Check if email exists */
    const findUser = await userModel.findOne({ email: req.body.email }).lean().exec();
    if (findUser) {
      /* Compare password */
      const comparePassword = await utils.comparePassword(req.body.password, findUser.password);

      if (comparePassword) {
        /* Password matched */
        const encodedData = {
          userId: findUser._id,
          role: findUser.role
        };
        // generate accessToken using JWT
        const token = jwt.sign(encodedData, process.env['SECRET']);

        const userObj = {
          _id: findUser._id,
          role: findUser.role,
          name: findUser.name,
          email: findUser.email,
          phone: findUser.phone,
          token: token
        };
        rcResponse.data = userObj;
      } else {
        SetResponse(rcResponse, 403, RequestErrorMsg('InvalidPassword', req, null), false);
        httpStatus = 403;
        return res.status(httpStatus).send(rcResponse);
      }
    } else {
      SetResponse(rcResponse, 403, RequestErrorMsg('InvalidPassword', req, null), false);
      httpStatus = 403;
      return res.status(httpStatus).send(rcResponse);
    }
  } catch (err) {
    SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
    httpStatus = 500;
  }
  return res.status(httpStatus).send(rcResponse);
};

/* Register user */
module.exports.register = async (req, res) => {
  /* Contruct response object */
  let rcResponse = new ApiResponse();
  let httpStatus = 200;

  /* Check body params */
  if (!req.body.email || !req.body.password || !req.body.name || !req.body.phone || !req.body.type) {
    SetResponse(rcResponse, 400, RequestErrorMsg('InvalidParams', req, null), false);
    httpStatus = 400;
    return res.status(httpStatus).send(rcResponse);
  }

  /* Check admin Key, if it's Admin user */
  if (parseInt(req.body.type) === 1 && req.body.adminKey !== process.env['ADMIN_KEY']) {
    SetResponse(rcResponse, 401, RequestErrorMsg('InvalidAdminKey', req, null), false);
    httpStatus = 401;
    return res.status(httpStatus).send(rcResponse);
  }

  try {
    const passHash = await utils.generatePasswordHash(req.body.password);
    const userObj = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: passHash,
      role: parseInt(req.body.type)
    };

    const createUser = await userModel.create(userObj);

    const encodedData = {
      userId: createUser._id,
      role: createUser.role
    };
    // generate accessToken using JWT
    const token = jwt.sign(encodedData, process.env['SECRET']);

    rcResponse.data = { _id: createUser._id, role: createUser.role, name: createUser.name, email: createUser.email, phone: createUser.phone, token: token };
  } catch (err) {
    if (err.code === 11000) {
      SetResponse(rcResponse, 400, RequestErrorMsg('EmailExists', req, null), false);
      httpStatus = 400;
    } else {
      SetResponse(rcResponse, 500, RequestErrorMsg(null, req, err), false);
      httpStatus = 500;
    }
  }
  return res.status(httpStatus).send(rcResponse);
};

