import Joi from 'joi';
import express from 'express';

/**
 * @param {Joi.Schema} schema
 * @param {string} redirectPath
 */
export const genValidator = (schema) => {
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    return (req, res, next) => {
        const result = schema.validate(req.body);

        if (result.error) {
            return res.status(400).json({ message: "Pleace check your information and try again" })
        }

        next();
    };
};
