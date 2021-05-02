//src>routes>auth.ts kısmı bunu ifade ediyor.
import {Router} from 'express'
const router=Router();
import {singup,singin,profile,getbook,getbookId,postbook} from '../controllers/index.controller'
//validate token fonk import edildi.
import {TokenValidate} from '../libs/verifyToken'

router.post('/singup',singup);
router.post('/singin',singin);
router.get('/profile',TokenValidate,profile);
router.get("/kutuphane",getbook);
router.get("/kutuphane/:k_isbn",getbookId);
router.post("/kutuphane/kitap",postbook);

export default router;