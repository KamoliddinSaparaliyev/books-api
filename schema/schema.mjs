import Joi from "joi";

export const userRegisterSchema = Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).required()
})

export const userLoginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).required()
})
export const bookSchema = Joi.object({
    title: Joi.string().min(1).required(),
    authorId: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
})
export const authorsCreateSchema = Joi.object({
    name: Joi.string().min(1).required(),
})
