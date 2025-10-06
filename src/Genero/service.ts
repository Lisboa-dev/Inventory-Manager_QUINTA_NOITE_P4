import { Prisma, PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { NotFoundError, ServiceError } from "./utils/errorClass"

const prisma = new PrismaClient();
class generoService {

  async list(uuId: string) {
    const userLogadoId = await prisma.user.findUnique({ where: { uuid: uuId } });

    if (!userLogadoId) {
        throw new Error("Usuário não encontrado");
    }
    
    const data = await prisma.genero.findMany({
            where: { usuarioId: userLogadoId.id },
            orderBy: { nome: 'asc' }
        });

    return data;
  }








  async getById(uuId: string, genreId: number) {

    const userLogadoId =  await prisma.user.findUnique({ where: { uuid: uuId } });
    
   if(!userLogadoId){
    throw new Error("Usuário não encontrado");
   }

   const data= await prisma.genero.findFirst({
            where: {
                id: genreId,
                usuarioId: userLogadoId.id
            },
            include: {
                node: true,     // Inclui o pai direto
                children: true, // Inclui os filhos diretos
            }
        });

        return data
   }







  async create(uuId: string, genre: string, father?: number) {
    const userLogadoId = await prisma.user.findUnique({ where: { uuid: uuId } });
    if (!userLogadoId) {
        throw new Error("Usuário não encontrado");
    }
    try {
                const data: Prisma.GeneroCreateInput = {
                    nome: genre,
                    usuario: {
                        connect: { id: userLogadoId.id}
                    }
                };
    
                // Se um pai (father) foi fornecido, conecta a relação
                if (father) {
                    // Opcional: Verificar se o nó pai existe e pertence ao mesmo usuário
                    const parentNode = await prisma.genero.findFirst({
                        where: { id: father, usuarioId: userLogadoId.id }
                    });
                    if (!parentNode) {
                        return ({ error: "O setor pai não foi encontrado ou não pertence a você." });
                    }
                    data.node = {
                        connect: { id: father }
                    };
                }
    
                const novoGenero = await prisma.genero.create({ data });
                return novoGenero;
    
            } catch (error) {
                console.error(error);
                return({ error: "Não foi possível criar o setor." });
            }
  } 






  async update(uuId: string, data: JsonObject) {
    const userLogadoId = await prisma.user.findUnique({ where: { uuid: uuId } });
    const { id, nome, father } = data as { id: number; nome?: string; father?: number | null };

    if (!userLogadoId) {
        throw new Error("Usuário não encontrado");
    }

    try {
                const data: Prisma.GeneroUpdateInput = {};
                if (nome) data.nome = nome;
    
                // Lógica para mover o nó na árvore
                if (father !== undefined) {
                    if (father === null) {
                        // Mover para a raiz (tornar-se um nó sem pai)
                        data.node = { disconnect: true };
                    } else {
                        // Mover para um novo pai
                        // Opcional: verificar se o novo pai existe e não cria um loop
                        data.node = { connect: { id: father } };
                    }
                }
    
                const generoAtualizado = await prisma.genero.update({
                    where: {
                        id: id,
                        usuarioId: userLogadoId.id
                    },
                    data: data
                });
    
                return generoAtualizado;
            } catch (error) {
                // Erro comum: o registro a ser atualizado não foi encontrado (ou não pertence ao usuário)
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                    return ({ error: "Setor não encontrado." });
                }
                console.error(error);
                return{ error: "Não foi possível atualizar o setor." };
            }
  }




// src/services/GeneroService.ts

        /**
         * Deleta um gênero, movendo seus lotes e subsetores para o gênero pai.
         * @param usuarioUuid O UUID do usuário que está realizando a operação.
         * @param generoId O ID do gênero a ser deletado.
         * @throws {NotFoundError} Se o usuário ou o gênero não forem encontrados.
         * @throws {ServiceError} Se ocorrer um erro durante a transação.
         */

  async delete(usuarioUuid: string, generoId: number) {
 
  
            // 1. Encontrar o usuário pelo UUID
            const userLogado = await prisma.user.findUnique({ where: { uuid: usuarioUuid } });
            if (!userLogado) {
            throw new NotFoundError("Usuário não encontrado");
            }
            const usuarioId = userLogado.id;

            // 2. Encontrar o gênero a ser deletado e suas dependências
            const genreToDelete = await prisma.genero.findUnique({
            where: { id: generoId, usuarioId },
            select: {
                father: true, // ID do pai
                children: { select: { id: true } },
                lotes: { select: { id: true } },
            },
            });

            if (!genreToDelete) {
            throw new NotFoundError("Setor não encontrado ou não pertence a este usuário.");
            }

            // 3. Executar a lógica de movimentação e exclusão dentro de uma transação
            try {
            await prisma.$transaction(async (tx) => {
                // 3.1. Mover os lotes para o gênero pai (se houver)
                if (genreToDelete.lotes.length > 0) {
                    if (genreToDelete.father != null) {
                        const loteIds = genreToDelete.lotes.map((lote) => lote.id);
                        await tx.lote.updateMany({
                            where: { id: { in: loteIds } },
                            data: { genreId: genreToDelete.father }, // Assumindo que o campo é 'generoId'
                        });
                 }else{
                    // Se não houver pai, podemos optar por definir os lotes como sem gênero (null) ou lidar de outra forma
                   return ({ error: "O setor não possui um setor pai para mover os lotes." });
                 }
                }

                // 3.2. Mover os subsetores (children) para o gênero pai
                if (genreToDelete.children.length > 0) {
                const childrenIds = genreToDelete.children.map((child) => child.id);
                await tx.genero.updateMany({
                    where: { id: { in: childrenIds } },
                    data: { father: genreToDelete.father },
                });
                }

                // 3.3. Finalmente, deletar o gênero
                await tx.genero.delete({
                where: { id: generoId, usuarioId },
                });
            });
            } catch (error) {
            // Se o erro for conhecido (ex: registro não existe mais), podemos refinar
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError("Erro de concorrência: O setor foi deletado por outra operação.");
            }
            // Lançar um erro genérico para outros problemas na transação
            throw new ServiceError("Não foi possível deletar o setor devido a um erro interno.");
            }
        };


    };
  

  
export default new generoService;