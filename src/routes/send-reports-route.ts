import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { subscribeToEvent } from '../functions/subscribe-to-event'
import { createReport } from '../functions/create-report'

const sendReportsSchema = z.object({
   date: z.string(),
   line: z.string().optional(),
   tag: z.string().optional(),
   problem: z.string(),
   cause: z.string().optional(),
   correctiveAction: z.string().optional(),
   preventiveAction: z.string().optional(),
   fullReport: z.string(),
})

export const sendReportsRoute: FastifyPluginAsyncZod = async app => {
   app.post(
      '/reports',
      {
         schema: {
            summary: 'Send reports',
            tags: ['reports'],
            operationId: 'sendReports',
            body: sendReportsSchema,
            response: {
               201: z.object({ reportId: z.string() }),
            },
         },
      },
      async (request, reply) => {
         const { date, line, tag, problem, cause, correctiveAction, preventiveAction, fullReport } = request.body

         const { reportId } = await createReport({
            date,
            line,
            tag,
            problem,
            cause,
            correctiveAction,
            preventiveAction,
            fullReport,
            originalData: request.body
         })

         return reply.status(201).send({ reportId })
      }
   )
}
