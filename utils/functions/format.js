
  export function formatHeight(height) {
    return height > 100 ? (parseInt(height / 100) + "m" + (height % 100)) : "0m"+height;
  }

  export function formatDate(date){
    return new Date(date).toLocaleDateString("fr-FR",{
      weekday: undefined,
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  export function capitalizeFirst(text){
    return text.length > 0 ? text[0].toUpperCase() + text.slice(1) : text
  }

  export function formatDateDay(date){
    return capitalizeFirst(new Date(date).toLocaleDateString("fr-FR",{
      weekday: "long"
    }))
  }

  export function formatDateMD(date){
    return new Date(date).toLocaleDateString("fr-FR",{
      weekday: undefined,
      year: undefined,
      month: "short",
      day: "numeric"
    })
  }

  export function formatDateISO(date){
    return date.toISOString().slice(0,10)
  }

  export function formatDateShort(date){
    return new Intl.DateTimeFormat("fr-FR").format(date)
  }

  export function formatGenre(genre){
    switch(genre)
    {
      case "male":
        return "Homme"
      case "female":
        return "Femme"
    }
    return "N/A"
  }

  export function hour(time){
    return parseInt(time / 60);
  }

  export function min(time){
    return parseInt(time % 60);
  }

  export function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    
    // jour de la semaine (1 = lundi, 7 = dimanche)
    const dayNum = d.getUTCDay() || 7;
    
    // se placer sur le jeudi de la semaine
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    
    // début de l'année
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    
    // calcul du numéro de semaine
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

    return weekNo;
  }