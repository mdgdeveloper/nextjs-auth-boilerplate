import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({
      status: 400,
      json: {
        error: "Invalid token"
      }
    })
  }

  // Verificar si existe el token en la base de datos
  const verificationToken = await db.verificationToken.findFirst({
    where: {
      token
    }
  })

  if (!verificationToken) {
    return NextResponse.json({
      status: 400,
      json: {
        error: "Invalid token"
      }
    })
  }

  // Verificar que la fecha de expiracion no haya pasado
  if (new Date() > verificationToken.expires) {
    return NextResponse.json({
      status: 400,
      json: {
        error: "Token expired"
      }
    })
  }

  // Actualizar el usuario
  await db.user.update({
    where: {
      email: verificationToken.identifier
    },
    data: {
      emailVerified: new Date()
    }
  })

  // Eliminar token
  await db.verificationToken.delete({
    where: {
      identifier: verificationToken.identifier
    }
  })

  return redirect("/login?verified=true")

}