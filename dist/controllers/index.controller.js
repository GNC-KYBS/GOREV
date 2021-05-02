"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postbook = exports.getbookId = exports.getbook = exports.profile = exports.singin = exports.singup = void 0;
const database_1 = require("../database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const singup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { kullaniciAdi, adSoyad, email, parola } = req.body;
    //girilen parolanın hash şifresi oluşturuldu.
    let hashedPassword = yield bcryptjs_1.default.hash(parola, 10);
    console.log(hashedPassword);
    try {
        //üye ekleme işlemi gerçekleşmekte.
        const savedUser = yield database_1.pool.query(`INSERT INTO uye(u_kad,u_adsoyad,u_email,u_password)  
            VALUES($1,$2,$3,$4) RETURNING u_password`, [kullaniciAdi, adSoyad, email, hashedPassword]);
        return res.json({
            message: 'Kayıt oldunuz.',
            body: {
                uye: {
                    adSoyad
                }
            }
        });
        //token(id oluştur ve onu yap.)
        //const token:string=jwt.sign({u_id: savedUser.u_id},process.env.TOKEN_SECRET || 'tokentest');
        //res.header('auth-token',token).json(savedUser);
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error");
    }
});
exports.singup = singup;
const singin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, parola } = req.body;
    try {
        //üye ekleme işlemi gerçekleşmekte.
        const user = yield database_1.pool.query(`SELECT * FROM uye WHERE u_email=$1`, [req.body.email]);
        //console.log(user.rows[0]);
        const User = user.rows[0];
        console.log(User.u_password);
        if (!user) {
            return res.status(400).json("Email yada parola hatalı.");
        }
        else {
            bcryptjs_1.default.compare(parola, User.u_password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    const token = jsonwebtoken_1.default.sign({ parola: User.u_password }, process.env.TOKEN_SECRET || 'tokentest', {
                        expiresIn: 60 * 60 * 24
                    });
                    //return res.status(200).json(user);
                    return res.header('auth-token', token).json(user);
                }
                else {
                    return res.status(400).json("Geçersiz parola.");
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error");
    }
});
exports.singin = singin;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield database_1.pool.query(`SELECT u_kad,u_adsoyad,u_email FROM uye WHERE u_email=$1`, [req.body.email]);
        if (!user) {
            return res.status(404).json('Kullanıcı Bulunmamakta.');
        }
        else {
            res.json(user.rows[0]);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error");
    }
});
exports.profile = profile;
//kütüphanede bulunan kitapların bilgisi verilmekte.
const getbook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //kitap tablosunda bulunan verileri al.
        const response = yield database_1.pool.query(`SELECT * FROM kitap`);
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error");
    }
});
exports.getbook = getbook;
//seçilen kitabın özelliklerini gösterecek(ISBN).
const getbookId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.k_isbn;
    try {
        //kitap tablosunda id si girilen kitap bilgileri gosterilsin.
        const response = yield database_1.pool.query(`SELECT * FROM kitap WHERE k_isbn=$1`, [id]);
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error");
    }
});
exports.getbookId = getbookId;
//sepete ekleme işlemi
const postbook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { k_isbn, k_ad, k_yazar, k_stok } = req.body;
    console.log(k_ad);
    try {
        //kitap tablosunda adı girilen kitap bilgileri gosterilsin.
        const response = yield database_1.pool.query(`SELECT FROM kitap WHERE k_ad = $1`, [k_ad]);
        console.log(response.rows.length);
        //return res.status(200).json(response.rows);
        if (response.rows.length > 0) {
            //kitap kütüphanede bulunuyor.Stok durumu kontrol edilmeli.
            const stok = response.rows[0];
            console.log(stok.k_stok);
            //stok sayısı gösterilsin.
            if (stok.k_stok == 0) {
                return res.status(200).json("STOKTA BULUNMAMAKTA.");
            }
            else {
                const response = yield database_1.pool.query(`INSERT INTO sepet(s_isbn,s_kitapadi,s_kyazari) VALUES($1,$2,$3)`, [k_isbn, k_ad, k_yazar]);
                console.log(response.rows);
                return res.json({
                    message: 'Kitap sepete eklenmiştir.',
                    body: {
                        kitap: {
                            k_ad
                        }
                    }
                });
            }
        }
        else {
            console.log("KİTAP BULUNMAMAKTADIR.");
            return res.status(200).json("KİTAP BULUNMAMAKTADIR.");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error");
    }
});
exports.postbook = postbook;
