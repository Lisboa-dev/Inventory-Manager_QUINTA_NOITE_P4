/*
  Warnings:

  - A unique constraint covering the columns `[barCode]` on the table `Produto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Produto_barCode_key" ON "Produto"("barCode");
