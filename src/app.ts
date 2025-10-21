import { register } from "./http/controllers/register.ts"
import { appRoutes } from "./http/routes.ts"
import fastify from "fastify"

export const app = fastify()

app.register(appRoutes)
