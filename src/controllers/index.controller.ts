import {Request,Response} from 'express'
import {QueryResult} from 'pg'
import {pool} from '../database'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';


export const singup=async(req:Request,res:Response):Promise<Response>=>{
    const{kullaniciAdi,adSoyad,email,parola}=req.body;
    //girilen parolanın hash şifresi oluşturuldu.
    let hashedPassword = await bcrypt.hash(parola,10);
    console.log(hashedPassword);
    try {
        //üye ekleme işlemi gerçekleşmekte.
        const savedUser:QueryResult=await pool.query(`INSERT INTO uye(u_kad,u_adsoyad,u_email,u_password)  
            VALUES($1,$2,$3,$4) RETURNING u_password`,[kullaniciAdi,adSoyad,email,hashedPassword]);  
            return res.json({
                message:'Kayıt oldunuz.',
                body:{
                    uye:{
                      adSoyad  
                    }
                }
            });
        //token(id oluştur ve onu yap.)
        //const token:string=jwt.sign({u_id: savedUser.u_id},process.env.TOKEN_SECRET || 'tokentest');
        //res.header('auth-token',token).json(savedUser);
    } catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error")
    }
};
export const singin=async(req:Request,res:Response)=>{
    const{email,parola}=req.body;
    try {
        //üye ekleme işlemi gerçekleşmekte.
        const user:QueryResult=await pool.query(`SELECT * FROM uye WHERE u_email=$1`,[req.body.email]);
        //console.log(user.rows[0]);
        const User= user.rows[0]
        console.log(User.u_password);
        if(!user){
            return res.status(400).json("Email yada parola hatalı.");
        }else{
            bcrypt.compare(parola,User.u_password,(err,isMatch)=>{
                if (err) {
                    throw err; 
                }
                if(isMatch){
                    const token:string=jwt.sign({parola:User.u_password},process.env.TOKEN_SECRET ||'tokentest',{
                        expiresIn:60*60*24
                    });
                    //return res.status(200).json(user);
                    return res.header('auth-token',token).json(user);
                }else{
                    return res.status(400).json("Geçersiz parola.");
                }
             });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error")
    }
};
export const profile=async(req:Request,res:Response)=>{
    try {
        const user:QueryResult=await pool.query(`SELECT u_kad,u_adsoyad,u_email FROM uye WHERE u_email=$1`,[req.body.email]);
        if(!user){
            return res.status(404).json('Kullanıcı Bulunmamakta.')
        }
        else{
            res.json(user.rows[0]);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error")
    }
};

//kütüphanede bulunan kitapların bilgisi verilmekte.
export const getbook=async(req:Request,res:Response):Promise<Response>=>{
    try {
        //kitap tablosunda bulunan verileri al.
        const response:QueryResult=await pool.query(`SELECT * FROM kitap`);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error")
    }
}
//seçilen kitabın özelliklerini gösterecek(ISBN).
export const getbookId=async(req:Request,res:Response):Promise<Response>=>{
    const id=req.params.k_isbn
    try {
        //kitap tablosunda id si girilen kitap bilgileri gosterilsin.
        const response:QueryResult=await pool.query(`SELECT * FROM kitap WHERE k_isbn=$1`,[id]);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error")
    }
}
//sepete ekleme işlemi
export const postbook=async(req:Request,res:Response):Promise<Response>=>{
    const {k_isbn,k_ad,k_yazar,k_stok}=req.body;
    console.log(k_ad);
    try {
        //kitap tablosunda adı girilen kitap bilgileri gosterilsin.
        const response:QueryResult=await pool.query(`SELECT FROM kitap WHERE k_ad = $1`,[k_ad]);
        console.log(response.rows.length);
        //return res.status(200).json(response.rows);
        if (response.rows.length>0) {
            //kitap kütüphanede bulunuyor.Stok durumu kontrol edilmeli.
            const stok=response.rows[0];
            console.log(stok.k_stok);
            //stok sayısı gösterilsin.
            if (stok.k_stok == 0) {
                return res.status(200).json("STOKTA BULUNMAMAKTA.")
            }else{
                const response:QueryResult=await pool.query(`INSERT INTO sepet(s_isbn,s_kitapadi,s_kyazari) VALUES($1,$2,$3)`,[k_isbn,k_ad,k_yazar]);
                console.log(response.rows);
                return res.json({
                    message:'Kitap sepete eklenmiştir.',
                    body:{
                        kitap:{
                            k_ad
                        }
                    }
                });
            }
        }else {
            console.log("KİTAP BULUNMAMAKTADIR.")
            return res.status(200).json("KİTAP BULUNMAMAKTADIR.")
        }  
    } catch (error) {
        console.log(error);
        return res.status(200).json("Internal Server error")
    }
}

