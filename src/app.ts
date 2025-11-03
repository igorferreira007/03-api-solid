import { ZodError, z } from "zod"
import { usersRoutes } from "./http/controllers/users/routes.ts"
import fastify from "fastify"
import { env } from "./env/index.ts"
import fastifyJwt from "@fastify/jwt"
import { gymsRoutes } from "./http/controllers/gyms/routes.ts"
import { checkInsRoutes } from "./http/controllers/check-ins/routes.ts"

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: z.treeifyError(error) })
  }

  if (env.NODE_ENV !== "production") {
    console.error(error)
  } else {
    // TODO: Aqui nos devemos criar um log para uma ferramenta externa
  }

  return reply.status(500).send({ message: "Internal server error." })
})
