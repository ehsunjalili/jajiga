const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const addAvatarMiddleware = require('./../../middlewares/addAvatarMiddleware')

router
    .route("/getAll")
    .get(authMiddleware, controller.getAll)
router
    .route("/get/:phone")
    .get(authMiddleware, controller.getOne)
router
    .route("/remove/:phone")
    .delete(authMiddleware, controller.delete)
router
    .route("/setAvatar")
    .put(authMiddleware, addAvatarMiddleware.single("avatar"), controller.setAvatar)
router
    .route("/changeName")
    .put(authMiddleware, controller.changeName)
router
    .route("/promotion/:phone")
    .put(authMiddleware, controller.promotion)
router
    .route("/demotion/:phone")
    .put(authMiddleware, controller.demotion)
router
    .route("/changePassword")
    .put(authMiddleware, controller.changePassword)
router
    .route("/forgetPassword")
    .post(authMiddleware, controller.forgetPassword)
router
    .route("/forgetPasswordCode")
    .put(authMiddleware, controller.forgetPasswordConfirmCode)
router
    .route("/forgetPasswordCode")
    .put(authMiddleware, controller.forgetPasswordConfirmCode)


module.exports = router