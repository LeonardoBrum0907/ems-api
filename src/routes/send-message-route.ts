import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { subscribeToEvent } from '../functions/subscribe-to-event'
import { answerUserMessage } from '../functions/answer-user-message'

export const sendMessageRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/messages',
    {
      schema: {
        summary: 'Send a message to the AI chat.',
        tags: ['ai'],
        body: z.object({
          message: z.string(),
        }),
        response: {
          200: z.object({ response: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { message } = request.body

      const {response} = await answerUserMessage({message})

      return { response }
    }
  )
}
