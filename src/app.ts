import express, { Router } from "express";
import { Express, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import userRouter from "./User/router";
import  loteRouter  from "./Lote/router";
import  produtoRouter  from "./Produto/router";
import  generoRouter  from "./Genero/router";
import { authenticateToken } from "./middlewares/JWT/authMiddleware.js";


const app: Express = express();
const port: number = 3000;
const prisma = new PrismaClient();

app.use(express.json());

//app.use('/')
app.use('/users', userRouter);
app.use('/lotes', authenticateToken, loteRouter);
app.use('/produtos', authenticateToken, produtoRouter);
app.use('/generos', authenticateToken, generoRouter);


app.listen(port, () => {
    console.log(`A API subiu na porta ${port}, o endereço é http://localhost:${port}`)
});