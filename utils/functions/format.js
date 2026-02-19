
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