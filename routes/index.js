/*
FileName : Index.js
Date : 26th Sept 2018
Description : This file consist of list of routes for the APIs
*/

/* DEPENDENCIES */
const express = require('express');
const router = express.Router();
const dbConnection = require('./../config/dbConnection');
const authCtrl = require('./../controllers/authCtrl');
const checkToken = require('./../middlewares/checkToken');
const fileHandler = require('./../helpers/fileHandler');
const hastagCtrl = require('./../controllers/hastagCtrl');


/*****************************
 USERS
 *****************************/

/* Authenticate User */
router.post('/user/login', authCtrl.login);

/* Register new User */
router.post('/user/register', authCtrl.register);

/* Hastag */
router.get('/hastag', hastagCtrl.getTrendingByWoeid);

module.exports = router;