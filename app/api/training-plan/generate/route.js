/*
  génère des programmes personnalisés basés sur l'analyse des données utilisateur et ses contraintes personnelles.
*/

import Joi from "joi"

const schema = Joi.object({
  message: Joi.string().min(5).required()
 /* ,disponibility: Joi.array().items(
    Joi.object({
      day: Joi.string().valid("lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche").required(),
      startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // format HH:mm
      endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required() // format HH:mm
    })
  ).required(),
  constraints: Joi.object({
    maxDuration: Joi.number().min(5).max(336).required(), // Durée maximale de l'entraînement en minutes (max 2 semaines)
    preferredIntensity: Joi.string().valid("faible", "modérée", "élevée").required(),
    equipment: Joi.array().items(Joi.string()).required(), // liste d'équipements disponibles
    healthConditions: Joi.array().items(Joi.string()).required() // liste de conditions de santé à prendre en compte
  }).required()*/
})

const responseSchema = Joi.object({
  duration: Joi.number().required().min(5).max(336), // Durée de l'entraînement en minutes (max 2 semaines)
  description: Joi.string().required(),
  intensity: Joi.string().required(),
  objectif: Joi.string().required(),
  advice: Joi.string().optional()
}).required()

export async function POST(request) {
  
  const timeout = 60000 // ms
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const body = await request.json()

    const { error, value } = schema.validate(body)

    if (error) {
      return new Response(error.details[0].message, { status: 500 }) // retourne le premier message d'erreur
    }

    const apiKey = process.env.MISTRAL_API_KEY
    const pathname = "/v1/chat/completions"
    const proxyURL = new URL(pathname, 'https://api.mistral.ai')
    let conversation = [
      {
        role : "system",
        content : "Tu es un agent sportif planificateur de programmes d'entraînement personnalisés. Tu génère un programme personnalisé basé sur l'analyse des données utilisateur et ses contraintes personnelles"
      },
      {
        role : "system",
        content : "Répond avec un objet JSON structuré de la manière suivante : { duration: integer, description: string, intensity: string, objectif: string, advice: string }\n"+
                  "duration: Durée de l'entraînement en minutes (ex: 30, 60...)\n" + 
                  "description: Description détaillée (échauffement, corps de séance, retour au calme\n" + 
                  "intensity: Intensité/allure recommandée\n" + 
                  "objectif: Rappel de l'objectif de la séance\n" + 
                  "advice: Optionnel - Conseils spécifiques (hydratation, matériel, terrain)\n"
      },
      {
        role : "system",
        content : "Si la question est hors sujet ou inréaliste répons avec un l'objet structuré suivant: { raison: string }\n"+
                  "raison: raison de l'impossibilité de générer un programme\n"
      },
      {
        role : "user",
        content : body.message
      }
    ]

    const proxyRequest = new Request(proxyURL, {
      method: "POST",
      body: JSON.stringify({
        messages:conversation,
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
      {
        console.log(await proxyResponse.json())
        throw new Error("Response error")
      }

      if(proxyResponse.headers.get("content-type")?.includes("application/json") == false)
        throw new Error("Unexpected response format")

      const proxyBody = await proxyResponse.json()

      const iaMessage = proxyBody.choices[0].message.content

      console.log(proxyBody.choices[0].message)

      const { respError, respValue } = schema.validate(iaMessage)

      if (error) {
        return new Response(respError.details[0].message, { status: 500 }) // retourne le premier message d'erreur
      }

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