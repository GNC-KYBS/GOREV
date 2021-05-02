"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src>routes>auth.ts kısmı bunu ifade ediyor.
const express_1 = require("express");
const router = express_1.Router();
const index_controller_1 = require("../controllers/index.controller");
//validate token fonk import edildi.
const verifyToken_1 = require("../libs/verifyToken");
router.post('/singup', index_controller_1.singup);
router.post('/singin', index_controller_1.singin);
router.get('/profile', verifyToken_1.TokenValidate, index_controller_1.profile);
router.get("/kutuphane", index_controller_1.getbook);
router.get("/kutuphane/:k_isbn", index_controller_1.getbookId);
router.post("/kutuphane/kitap", index_controller_1.postbook);
exports.default = router;
