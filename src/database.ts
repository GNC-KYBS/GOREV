import {Pool} from 'pg'

export const pool= new Pool({
    user:"postgres",
    host:"localhost",
    password:"postgres",
    database:"kutuphane",
    port:5432
});