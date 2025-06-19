import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
   jsonSchemaTransform,
   serializerCompiler,
   validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { accessInviteLinkRoute } from './routes/access-invite-link-route'
import { getRankingRoute } from './routes/get-ranking-route'
import { getSubscriberInvitesClicksRoute } from './routes/get-subscriber-invites-clicks-route'
import { getSubscriberInvitesCountRoute } from './routes/get-subscriber-invites-count-route'
import { getSubscriberRankingPositionRoute } from './routes/get-subscriber-ranking-position'
import { sendMessageRoute } from './routes/send-message-route'
import { sendReportsRoute } from './routes/send-reports-route'

const app = fastify()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
   origin: '*',
})

app.register(fastifySwagger, {
   openapi: {
      info: {
         title: 'EMS API',
         version: '0.1',
      },
   },
   transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
   routePrefix: '/docs',
})

app.register(sendReportsRoute)
app.register(accessInviteLinkRoute)
app.register(getRankingRoute)
app.register(getSubscriberInvitesCountRoute)
app.register(getSubscriberInvitesClicksRoute)
app.register(getSubscriberRankingPositionRoute)
app.register(sendMessageRoute)

app.listen({
   port: env.PORT,
   host: '0.0.0.0'
}).then(() => {
   console.log(`🚀 HTTP server running on http://0.0.0.0:${env.PORT}`)
   console.log(`📚 API Documentation available at http://0.0.0.0:${env.PORT}/docs`)
})
