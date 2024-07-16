const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const villaModel = require('./../villas/model');
const commentModel = require('./../comment/model');
const userVilla = require('./../user-villa/model');
const joi = require("./../../validator/villaValidator");
// const validator = require("email-validator");
const { func } = require('joi');

exports.add = async (req, res) => {
    try {
        const { title, finished, address, step, cover, coordinates, aboutVilla, capacity, facility, price, rules } = req.body

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json(validator.error.details)

        if (coordinates) {
            const ifDUPLC = await villaModel.findOne({ coordinates })
            if (ifDUPLC) return res.status(409).json({ statusCode: 409, message: "this location is already exist" })
        }

        const coverFiles = []

        if (req.files != undefined) {
            const covers = req.files;
            covers.forEach(i => coverFiles.push(i.filename))
        }
        if (coverFiles != 0) {
            if (coverFiles.length < 3) return res.status(406).json({ statusCode: 406, message: "The minimum number of photos is 3" })
        }

        const newVilla = await villaModel.create({
            user: req.user._id,
            title,
            cover: coverFiles,
            address,
            coordinates,
            aboutVilla,
            capacity,
            facility,
            price,
            rules,
            step,
            finished
        })

        const create = await userVilla.create({
            user: req.user._id,
            villa: newVilla._id,
        })

        return res.status(200).json({ statusCode: 200, message: "Succ !", villa: newVilla })

        // async function addnewvilla() {
        //     if (coordinates == undefined) {
        //         const newVilla = await villaModel.create({
        //             user: req.user._id,
        //             title,
        //             cover,
        //             address,
        //             coordinates,
        //             aboutVilla,
        //             capacity,
        //             facility,
        //             price,
        //             rules,
        //             step,
        //             finished
        //         })

        //         const create = await userVilla.create({
        //             user: req.user._id,
        //             villa: newVilla._id,
        //         })

        //         return res.status(200).json({ statusCode: 200, message: "Succ !", villa: newVilla })
        //     }
        //     const ifDUPLC = await villaModel.findOne({ coordinates })
        //     if (ifDUPLC) return res.status(409).json({ statusCode: 422, message: "this location is already exist" })

        //     const covers = req.files;
        //     const coverFiles = []
        //     covers.forEach(i => coverFiles.push(i.filename))

        //     const newVilla = await villaModel.create({
        //         user: req.user._id,
        //         title,
        //         cover,
        //         address,
        //         coordinates,
        //         aboutVilla,
        //         capacity,
        //         facility,
        //         price,
        //         rules,
        //         step,
        //         finished
        //     })

        //     const create = await userVilla.create({
        //         user: req.user._id,
        //         villa: newVilla._id,
        //     })

        //     return res.status(200).json({ statusCode: 200, message: "Succ !", villa: newVilla })
        // }

        // const checkExists = await userVilla.find({ user: req.user._id }).sort({ _id: -1 }).lean()
        // if (!checkExists[0]) {
        //     return addnewvilla()
        // } else {
        //     const findvilla = await villaModel.findOne({ _id: checkExists[0].villa })
        //     if (findvilla.finished == true) {
        //         return addnewvilla()
        //     }


        //     const newVilla = await villaModel.updateOne({ _id: checkExists[0].villa }, {
        //         user: req.user._id,
        //         title,
        //         cover,
        //         address,
        //         coordinates,
        //         aboutVilla,
        //         capacity,
        //         facility,
        //         price,
        //         rules,
        //         step,
        //         finished
        //     })

        //     return res.status(200).json({ statusCode: 200, message: "Succ Updated!", villa: newVilla })
        // }

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.update = async (req, res) => {
    try {
        const id = req.params.id

        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ statusCode: 400, error: 'Invalid Object Id' })

        const findVilla = await villaModel.findOne({ _id: id }).lean()
        if (!findVilla) return res.status(401).json({ statusCode: 401, error: 'no villa found with this id' })

        const { title, finished, address, step, cover, coordinates, aboutVilla, capacity, facility, price, rules } = req.body

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json(validator.error.details)


        const coverFiles = []

        if (req.files != undefined) {
            const covers = req.files;
            covers.forEach(i => coverFiles.push(i.filename))
        }
        if (coverFiles != 0) {
            if (coverFiles.length < 3) return res.status(406).json({ statusCode: 406, message: "The minimum number of photos is 3" })
        }
        const newVilla = await villaModel.updateOne({ _id: id }, {
            user: req.user._id,
            title,
            cover: coverFiles,
            address,
            coordinates,
            aboutVilla,
            capacity,
            facility,
            price,
            rules,
            step,
            finished
        })

        const findUpdatedVilla = await villaModel.findOne({ _id: id }).lean()

        return res.status(200).json({ statusCode: 200, message: "Succ !", villa: findUpdatedVilla })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.getAll = async (req, res) => {
    try {
        const villas = await villaModel.find({})
            .populate("user", "firstName lastName role")
            .sort({ _id: -1 })
            .lean()
        if (villas.length == 0) return res.status(404).json({ statusCode: 404, message: "there is no villa!" })

        return res.status(200).json({ statusCode: 200, villas: villas })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.getOne = async (req, res) => {
    try {
        const id = req.params.id
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ error: 'Invalid Object Id' })

        const villa = await villaModel.findOne({ _id: id })
            .populate("user", "firstName lastName role")
            .sort({ _id: -1 })
            .lean()
        if (villa.length == 0) return res.status(404).json({ statusCode: 404, message: "villa not found 404 ! " })



        // const comments = await commentModel.find({ villa: id, isAccept: 1 })
        //     .populate("villa", "_id title")
        //     .populate("creator", "UserName")
        //     .sort({ _id: -1 })
        //     .lean();

        // let orderedComment = []

        // comments.forEach(mainComment => {
        //     comments.forEach(answerComment => {

        //         if (String(mainComment._id) == String(answerComment.mainCommentID)) {

        //             orderedComment.push({
        //                 ...mainComment,
        //                 villa: answerComment.villa.title,
        //                 creator: answerComment.creator.UserName,
        //                 answerComment
        //             })
        //         }
        //     })
        // })


        // const noAnswerComments = await commentModel.find({ villa: id, isAnswer: 0, haveAnswer: 0 })
        //     .populate("villa", "_id title")
        //     .populate("creator", "UserName")
        //     .sort({ _id: -1 })
        //     .lean();

        // noAnswerComments.forEach(i => orderedComment.push({ ...i }))

        // return res.status(200).json({ villa, comments: orderedComment })
        return res.status(200).json({ statusCode: 200, villa })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.myVillas = async (req, res) => {
    try {
        const user = req.user
        const villa = await villaModel.find({ user: user._id }).lean()
        if (villa.length == 0) return res.status(404).json({ statusCode: 404, message: "You have`t add villa yet` " })

        return res.status(200).json({ statusCode: 200, villa })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.getFacility = async (req, res) => {
    try {
        const facility = {
            facility: {
                furniture: {
                    title: "مبلمان",
                    placeHolder: "",
                    icon: "",
                    id: 1
                },
                fridge: {
                    title: "یخچال",
                    placeHolder: "",
                    icon: "",
                    id: 2
                },
                tv: {
                    title: "تلویزیون",
                    placeHolder: "",
                    icon: "",
                    id: 3
                },
                diningTable: {
                    title: " میز نهارخوری",
                    placeHolder: "",
                    icon: "",
                    id: 4
                },
                heatingSystem: {
                    title: " سیستم گرمایشی",
                    placeHolder: "",
                    icon: "",
                    id: 5
                },
                coolingSystem: {
                    title: " سیستم سرمایش",
                    placeHolder: "",
                    icon: "",
                    id: 6
                },
                parking: {
                    title: "پارکینگ",
                    placeHolder: "",
                    icon: "",
                    id: 7
                },
                Eightball: {
                    title: "بیلیارد",
                    placeHolder: "",
                    icon: "",
                    id: 8
                },
                wifi: {
                    title: " wifi اینترنت",
                    placeHolder: "",
                    icon: "",
                    id: 9
                },
                toilet: {
                    title: " توالت فرهنگی",
                    placeHolder: "",
                    icon: "",
                    id: 10
                },
                pool: {
                    title: "استخر",
                    placeHolder: "",
                    icon: "",
                    id: 11
                }
            },
            sanitaryFacilities: {
                changeThePillow: {
                    title: " تعویض رو بالشتی و رو تختی",
                    icon: "",
                    id: 1
                },
                changeTheBedsheet: {
                    title: " تعویض ملحفه",
                    icon: "",
                    id: 2
                },
                chargingToiletPaper: {
                    title: " شارژ کاغد توالت",
                    icon: "",
                    id: 3
                },
                dishSoap: {
                    title: " مایع ظرفشویی",
                    icon: "",
                    id: 4
                },
                chargingDishSoap: {
                    title: " شارژ مایع دستشویی با صابون",
                    icon: "",
                    id: 5
                },
                antiseptics: {
                    title: " مواد ضدعفونی کننده",
                    icon: "",
                    id: 6
                }
            }
        }
        return res.status(200).json({ statusCode: 200, facility })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ statusCode: 400, error: 'Invalid Object Id' })

        const villa = await villaModel.findOneAndDelete({ _id: id })
        if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa Not Found 404 ! " })

        // const deleteComment = await commentModel.deleteMany({ villa: id })
        const removeuservilla = await userVilla.findOneAndDelete({ villa: id })


        return res.status(200).json({ statusCode: 200, message: "Succ !" })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}

