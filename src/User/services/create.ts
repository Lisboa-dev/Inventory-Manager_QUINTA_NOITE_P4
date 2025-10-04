import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criando um nó raiz
  const root = await prisma.treeNode.create({
    data: {
      name: 'Raiz',
    },
  });

  // Criando nós filhos
  const child1 = await prisma.treeNode.create({
    data: {
      name: 'Filho 1',
      parentId: root.id,
    },
  });

  const child2 = await prisma.treeNode.create({
    data: {
      name: 'Filho 2',
      parentId: root.id,
    },
  });

  console.log({ root, child1, child2 });
}

