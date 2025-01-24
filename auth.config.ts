// import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod"
import bcrypt from "bcryptjs";
import { db } from "./lib/db";



// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {

        const { data, success } = loginSchema.safeParse(credentials)
        if (!success) {
          throw new Error("Invalid credentials")
        }
        // Verificar si existe el usuario en la base de datos
        const user = await db.user.findUnique({
          where: {
            email: data.email,
          }
        })

        if (!user || !user.password) {
          throw new Error("No user found")
        }

        // Verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return user

      },
    })
  ],
} satisfies NextAuthConfig