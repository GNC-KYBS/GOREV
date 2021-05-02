"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenValidate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TokenValidate = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json('Erişim Engellendi.');
    }
    else {
        const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || 'tokentest');
        console.log(payload);
    }
    next();
};
exports.TokenValidate = TokenValidate;
