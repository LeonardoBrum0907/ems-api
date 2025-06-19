import { db, pg } from '../drizzle/client'
import { generateText, tool } from 'ai'
import { groq } from '../ai/groq'
import z from 'zod'

interface AnswerUserMessageParams {
   message: string
}

export async function answerUserMessage({
   message,
}: AnswerUserMessageParams) {
   const answer = await generateText({
      model: groq,
      prompt: message,
      tools: {
         postgres: tool({
            description: `
              Realiza uma query no Postgres para buscar informaçõe sobre as tabelas do banco de dados.

              Só pode realizar operações de busca (SELECT), não é permitido a geração de qualquer operação de escrita.

               Tables:
               """
                  CREATE TABLE subscriptions (
                     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                     name text NOT NULL,
                     email text NOT NULL UNIQUE,
                     created_at timestamp NOT NULL DEFAULT now()
                  )
               """
               
               Todas operações devem retornar um máximo de 50 itens.
            `.trim(),
            parameters: z.object({
               query: z.string().describe('A query do Postgres a ser executada'),
               params: z.array(z.string()).describe('Os parâmetros da query')
            }),
            execute: async ({ query, params }) => {
               console.log(query, params)
               const result = await pg.unsafe(query, params)

               return JSON.stringify(result)
            }
         })
      },
      system: `
        Você é um assistente de I.A responsável por resopnder dúvidas sobre um evento de programação.

        Inclua na resposta somente o que o usuário pediu, sem nenhum texto adicional.

        O retorno deve ser sempre em markdown (sem incluir \`\`\`	no inicio ou no final).
      `.trim(),
      maxSteps: 5
   })
   return { response: answer.text }
}
