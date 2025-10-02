import express from "express";
import { Express, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const app: Express = express();
const port: number = 3000;
const prisma = new PrismaClient();

app.use(express.json());


app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`)
});