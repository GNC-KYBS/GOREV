import express from 'express'
import indexRoutes from "./routes/index"
const app=express();

import dotenv from 'dotenv'
dotenv.config();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes
app.use('/api/auth',indexRoutes);

//listen
app.listen(3000,()=>{
    console.log("Server on port",3000);
});