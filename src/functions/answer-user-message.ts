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
              Realiza uma query no Postgres para buscar informações sobre as tabelas do banco de dados.

              Só pode realizar operações de busca (SELECT), não é permitido a geração de qualquer operação de escrita.

               Tables:
               """
                  CREATE TABLE reports (
                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                     date TEXT NOT NULL,
                     line TEXT,
                     tag TEXT,
                     problem TEXT NOT NULL,
                     cause TEXT,
                     corrective_action TEXT,
                     preventive_action TEXT,
                     full_report TEXT,
                     original_data JSONB NOT NULL,
                     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                     created_by TEXT
                  );

                  -- Índices
                  CREATE INDEX reports_date_idx ON reports(date);
                  CREATE INDEX reports_line_idx ON reports(line);
                  CREATE INDEX reports_tag_idx ON reports(tag);
                  CREATE INDEX reports_created_at_idx ON reports(created_at);
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
        Você é um assistente de I.A responsável por resopnder dúvidas sobre relatórios de manutenção.

        Inclua na resposta somente o que o usuário pediu, sem nenhum texto adicional.

        O retorno deve ser sempre uma string formatada para whatsapp.
      `.trim(),
      maxSteps: 5
   })
   return { response: answer.text }
}
