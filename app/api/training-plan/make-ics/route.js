/*
  génère un fichier de calendrier standard basé sur le programme d'entrainement généré par api/training-plan/generate
*/

import Joi from "joi"

// [ { day: date, duration: integer, description: string, intensity: string, objectif: string, advice: string }, ... ]
const schema = Joi.array().items(
  Joi.object({
    day: Joi.date().iso().required(),
    duration: Joi.number().required().min(5),
    description: Joi.string().required(),
    intensity: Joi.string().required(),
    objectif: Joi.string().required(),
    advice: Joi.string().optional()
  })
).required()

// ICS impose des lignes de 75 caractères maximum, on doit donc découper les longues descriptions
// Les lignes qui commencent par une espace forment la suite de la propriété commencée à la ligne précédente (les espaces en début de ligne et le saut de ligne qui précède sont ignorés) 
function parseLine(section, text) {
  if(section.length + text.length + 1 <= 75)
    return `${section}:${text}\n`
  let output = `${section}:` + text.substring(0, 74) + "\n"
  for(let i = 74; i < text.length; i += 74) {
    output += " " + text.substring(i, i + 74) + "\n"
  }
  return output
}

export async function POST(request) {
  
  try {
    const body = await request.json()

    const { error, value } = schema.validate(body)

    if (error) {
      return new Response(error.details[0].message, { status: 500 }) // retourne le premier message d'erreur
    }

    let icsData = parseLine("BEGIN","VCALENDAR") // Début du fichier calendrier
    icsData += parseLine("VERSION","2.0") // Version standard du format iCalendar
    icsData += parseLine("PRODID","-//Sportsee//Training Plan//FR") // Identifie l'application qui a généré le calendrier
    icsData += parseLine("CALSCALE","GREGORIAN") // Utilise le calendrier grégorien
    
    // Crée un événement pour chaque jour d'entraînement
    body.forEach(exercise => {
      icsData += parseLine("BEGIN","VEVENT") // Début de l'événement
      icsData += parseLine(`UID`,`${crypto.randomUUID()}@sportsee.com`) // Identifiant unique de l'événement
      icsData += parseLine(`DTSTAMP`,`${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`) // Date de création de l'événement
      icsData += parseLine(`DTSTART;VALUE=DATE`,`${exercise.day.replace(/-/g, '')}`) // Date de début de l'événement
      icsData += parseLine(`SUMMARY`,`Sportsee: ${exercise.objectif}`) // Titre de l'événement
      icsData += parseLine(`DESCRIPTION`,`${exercise.description}\\n${exercise.intensity}.\\nConseils: ${exercise.advice || 'Aucun conseil spécifique.'}`) // Description de l'événement
      icsData += parseLine(`BEGIN`,`VALARM`) // rappel de l'événement
      icsData += parseLine(`TRIGGER`,`-PT30M`) // 30min avant
      icsData += parseLine(`ACTION`,`DISPLAY`) // Affiche une notification
      icsData += parseLine(`DESCRIPTION`,`Rappel de l'événement`)
      icsData += parseLine(`END`,`VALARM`)
      icsData += parseLine(`END`,`VEVENT`) // Fin de l'événement
    })
    
    icsData += parseLine("END","VCALENDAR") // Fin du fichier calendrier

    return new Response(icsData, { status: 200, headers: { "Content-Type": "text/calendar" } })

  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error'
 
    return new Response(message, { status: 500 })
  }
}