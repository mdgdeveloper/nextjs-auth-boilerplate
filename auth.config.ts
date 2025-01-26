// import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod"
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { nanoid } from "nanoid";



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

        // Verirficacion del email
        if (!user.emailVerified) {
          const verificationRequestExists = await db.verificationToken.findFirst({
            where: {
              identifier: user.email,
            }
          })

          // Si existe token, se elimina:
          if (verificationRequestExists) {
            await db.verificationToken.delete({
              where: {
                identifier: user.email
              }
            })
          }

          const token = nanoid()

          // Creamos nuevo verification token
          await db.verificationToken.create({
            data: {
              identifier: user.email,
              token,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
            }
          })

          // Enviar email
          // Configurar con un sistema de envio de mail

          // Error: Email no verificado
          throw new Error("Verification email sent")

        }


        return user

      },
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    },
  },
} satisfies NextAuthConfig