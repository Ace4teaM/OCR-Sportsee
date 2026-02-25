/*
  accepte les messages utilisateur et fait les requêtes adaptées à l’API Mistral
*/

import { fetchWithTimeout } from "@/utils/functions/fetchWithTimeout";
import Joi from "joi"

const schema = Joi.object({
  message: Joi.string().min(1).required()
})
 
export async function POST(request) {
  
  const timeout = 20000 // 20sec
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const body = await request.json()

    const { error, value } = schema.validate(body)

    if (error) {
      return Response.json(
        { error: error.details },
        { status: 400 }
      )
    }

    const apiKey = process.env.MISTRAL_API_KEY
    const pathname = "/v1/chat/completions"
    const proxyURL = new URL(pathname, 'https://api.mistral.ai')
    const proxyRequest = new Request(proxyURL, {
      method: "POST",
      body: JSON.stringify({messages:[
          {
            // transmet le message
            role : "user",
            content : body.message
          }
        ],
        model:"mistral-large-latest"
      }),
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      signal: controller.signal
    })
  
    try {
      const proxyResponse = await fetch(proxyRequest)
      clearTimeout(id)

      if(proxyResponse.status != 200)
        throw new Error("Erreur de format de requête")
      
      const proxyBody = await proxyResponse.json()

      const iaMessage = proxyBody.choices[0].message.content

      console.log(iaMessage)

      return Response.json({ success: true, response: iaMessage })

    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : 'Unexpected exception'
  
      return new Response(message, { status: 500 })
    }
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error'
 
    return new Response(message, { status: 500 })
  }
  finally {
    // s'assure que le time out est annulé
    clearTimeout(id)
  }
}