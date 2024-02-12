const express = require('express');
const router = express.Router()

const controller = require('./controller')

router
    .route("/start")
    .post(controller.auth)
router
    .route("/auth")
    .post(controller.auth)
router
    .route("/authCode")
    .post(controller.authCode)
router
    .route("/login")
    .get(controller.login)
router
    .route("/getme")
    .get(controller.getme)

module.exports = router