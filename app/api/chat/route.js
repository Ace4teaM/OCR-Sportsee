/*
  accepte les messages utilisateur et fait les requêtes adaptées à l’API Mistral
*/

import Joi from "joi"

const schema = Joi.object({
  message: Joi.string().min(1).max(5000).required(),
  info: Joi.object().required(),
  activity: Joi.array().required(),
  conversation: Joi.array().items(
    Joi.object({
      role: Joi.string().required(),
      content: Joi.string().required()
    })
  ).min(0).required()
})
 
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
        content : "Tu es un coach sportif tu dois avoir un ton bienveillant et encourageant. Tu ne dois pas utiliser de termes trop techniques."
      },
      {
        role : "system",
        content : "Utilise des réponses concises, ne dépasse jamais les 300 mots"
      },
      {
        role : "system",
        content : "Si la question demande un avis médical, propose toujours à l'utilisateur de consulter un médecin. Redirige vers un médecin pour les douleurs persistantes"
      },
      {
        role : "system",
        content : "Évite les conseils trop génériques sans lien avec les données utilisateur"
      },
      {
        role : "system",
        content : "Si la question de l'utilisateur est hors sujet (ne concerne pas le coaching sportif), répond : Ha... cela dépasse mes compétences, je te suggère de te rapprocher d'une IA plus généraliste"
      },
      {
        role : "system",
        content : `Voici quelques informations sur ton élève: ${body.info.profile.genre === "female" ? "une femme" : "un homme"} qui s'appelle ${body.info.profile.firstName} de ${body.info.profile.age} ans et ${body.info.profile.weight} kg, elle mesure ${body.info.profile.height} cm et est inscrit depuis le ${body.info.profile.createdAt}`
      },
      {
        role : "user",
        content : `je souhaiterais que tu réponde à certaines de mes questions`
      },
      {
        role : "assistant",
        content : `Bonjour ${body.info.profile.firstName} aucun problème, je suis là pour t'aider. Pose moi tes questions, je t'écoute...`
      },
      {
        role : "user",
        content : `Très bien, voici mes données d'entraînement pour les 10 dernières courses:\n` + JSON.stringify(body.activity)
      }
    ]

    // ajoute les conversations précédentes
    if(body.conversation.length > 0)
    {
      conversation = conversation.concat(body.conversation)
    }

    conversation.push(
      {
        // transmet le message
        role : "user",
        content : body.message
      }
    )

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