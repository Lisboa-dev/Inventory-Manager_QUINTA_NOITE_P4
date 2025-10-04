const tree = await prisma.treeNode.findMany({
  where: { parentId: null }, // Busca os nós raiz
  include: {
    children: true, // Inclui os filhos
  },
});