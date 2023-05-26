import express from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config'

/**
 *
 * @param {express.Request} req
 * @param {*} res
 * @param {*} next
 */
export default (req, res, next) => {
    try {
        const token = req.headers.authorization;

        const payload = jwt.verify(token, process.env.JWT_KEY);

        req.user = { userId: payload.userId, role: payload.role };

        next();
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized',
            error,
        });
    }
};
