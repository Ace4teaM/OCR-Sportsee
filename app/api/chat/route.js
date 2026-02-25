/*
  accepte les messages utilisateur et fait les requêtes adaptées à l’API Mistral
*/

import { NextResponse } from "next/server";
import Joi from "joi"

const schema = Joi.object({
  message: Joi.string().min(1).required()
})
 
export async function POST(request) {
  try {
    const body = await request.json()

    const { error, value } = schema.validate(body)

    if (error) {
      return Response.json(
        { error: error.details },
        { status: 400 }
      )
    }

    console.log(body)
    return Response.json({ success: true })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error'
 
    return new Response(message, { status: 500 })
  }
}