// src/app.ts
import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import userRouter from "./User/router";
import loteRouter from "./Lote/router";
import produtoRouter from "./Produto/router";
import generoRouter from "./Genero/router";
import { authenticateToken } from "./middlewares/JWT/authMiddleware.js";


import { setupSwagger } from "./swagger";

const app: Express = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.json());

// Configuração do Swagger
setupSwagger(app);


// Permitir apenas o domínio do front-end hospedado no Vercel
app.use(cors({
  origin: process.env.CLIENT_DOMAIN || 'http://localhost:3001',
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rotas
app.use('/users', userRouter);
app.use('/lotes', authenticateToken, loteRouter);
app.use('/produtos', authenticateToken, produtoRouter);
app.use('/generos', authenticateToken, generoRouter);

app.listen(port, () => {
    console.log(`A API subiu na porta ${port}, endereço: http://localhost:${port}`);
});
