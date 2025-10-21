import { register } from "./controllers/register.ts"
import { FastifyInstance } from "fastify"

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register)
}
