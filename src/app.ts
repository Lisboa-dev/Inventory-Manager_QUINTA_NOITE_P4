import express, { Router } from "express";
import { Express, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import userRouter from "./User/router.js";

const app: Express = express();
const port: number = 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`)
});