const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const schema = Joi.object({
    body: Joi.string()
        .min(3)
        .max(120)
        .required(),

    villa: Joi.objectId()
        .required(),
    score: Joi.number()
        .valid(1, 2, 3, 4, 5)
        .required()
});

module.exports = schema;

