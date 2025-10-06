import express, { Express } from "express";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

export const setupSwagger = (app: Express) => {
  const swaggerPath = path.join(process.cwd(), "src", "docs", "swagger.json");
  let swaggerDocument: any = {};

  try {
    const raw = fs.readFileSync(swaggerPath, { encoding: "utf-8" });
    swaggerDocument = JSON.parse(raw);
  } catch (err) {
    console.error("Não foi possível carregar swagger.json:", err);
  }

  // JSON puro
  app.get('/docs.json', (_req, res) => {
    res.json(swaggerDocument);
  });

  // Interface Swagger
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
