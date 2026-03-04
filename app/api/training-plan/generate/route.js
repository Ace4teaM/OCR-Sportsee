/*
  génère des programmes personnalisés basés sur l'analyse des données utilisateur et ses contraintes personnelles.
*/

import Joi from "joi"

const schema = Joi.object({
  objectif: Joi.string().required(),
  info: Joi.object().required(),
  activity: Joi.array().required(),
  date: Joi.date().required()
})


// { program: [ { day: date, duration: integer, description: string, intensity: string, objectif: string, advice: string }, ... ] }
const responseSchema = Joi.object({
  program: Joi.array().items(
    Joi.object({
      day: Joi.date().iso().required(),
      duration: Joi.number().required().min(5),
      description: Joi.string().required(),
      intensity: Joi.string().required(),
      objectif: Joi.string().required(),
      advice: Joi.string().optional()
    })
  ).required()
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
        content : "Tu es un agent sportif planificateur de programmes d'entraînement personnalisés.\n"+
                  "Tu génère un programme personnalisé basé sur l'analyse des données utilisateur et ses contraintes personnelles.\n"+
                  `Limite à une activité par jour et uniquement dans les jours de la semaine indiqué par ton élève.\n`+
                  `L'activité peut commencer à partir de ${body.date}\n`
      },
      {
        role : "system",
        content : "Retourne uniquement un objet JSON strict et compact, en respectant les guillemets doubles et les caractères d’échappement nécessaires, sans ajouter de texte, bloc de code ```json ou d’explications autour\n"+
                  "{ program: [ { day: date, duration: integer, description: string, intensity: string, objectif: string, advice: string }, ... ] }\n"+
                  "day: Date du jour de l'exercice au format YYYY-MM-DD\n" + 
                  "duration: Durée de l'entraînement en minutes (ex: 30, 60, ...)\n" + 
                  "description: Description détaillée (échauffement, corps de séance, retour au calme\n" + 
                  "intensity: Intensité/allure recommandée\n" + 
                  "objectif: Rappel de l'objectif de la séance\n" + 
                  "advice: Optionnel - Conseils spécifiques (hydratation, matériel, terrain)\n"
      },
      {
        role : "system",
        content : "Si la question est hors sujet ou irréaliste réponds avec un message non structuré indiquant la cause de l'impossibilité de générer un programme\n"
      },
      {
        role : "system",
        content : `Voici quelques informations sur ton élève: ${body.info.profile.genre === "female" ? "une femme" : "un homme"} qui s'appelle ${body.info.profile.firstName} de ${body.info.profile.age} ans et ${body.info.profile.weight} kg, elle mesure ${body.info.profile.height} cm et est inscrit depuis le ${body.info.profile.createdAt}`
      },
      {
        role : "user",
        content : `Bonjour coach, voici mon objectif: ${body.objectif}\nPeux-tu me générer un programme d'entraînement personnalisé pour atteindre cet objectif en prenant en compte mes données et mes contraintes ?`
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

    const proxyResponse = await fetch(proxyRequest)
    clearTimeout(id)

    if(proxyResponse.headers.get("content-type")?.includes("application/json") == false)
      throw new Error("Unexpected response format")

    const proxyBody = await proxyResponse.json()

    if(proxyBody.choices[0].message == undefined || proxyBody.choices[0].message.content == undefined)
    {
      throw new Error("Unexpected response format from IA API")
    }
    console.log(proxyBody.choices[0].message)

    // test le format de la réponse de l'ia, si elle n'est pas au format attendu, on considère que c'est une erreur
    let iaMessage;
    try {
      iaMessage = JSON.parse(proxyBody.choices[0].message.content)
    }
    catch(e)
    {
      // si erreur de formatage JSON, on considère que c'est une erreur de l'ia et on retourne le message d'erreur
      if(proxyBody.choices[0].message.content.substring(0) == '{')
        throw new Error("Unexpected response format from IA API")
      // sinon, on considère que c'est un message de l'ia
      throw new Error(proxyBody.choices[0].message.content)
    }

    // test le status de la réponse, si ce n'est pas 200, on considère que c'est une erreur
    if(proxyResponse.status != 200)
    {
      throw new Error("Error from IA API : " + proxyResponse.status)
    }

    const { respError, respValue } = responseSchema.validate(iaMessage)
    if (respError) {
      throw new Error({ success: false, response: iaMessage })
    }

    return Response.json({ success: true, response: iaMessage })

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