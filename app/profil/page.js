'use client'

import styles from "./page.module.css";
import { useFetch } from '@/utils/hooks/useFetch'
import { useState, useEffect } from 'react';
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { formatHeight, formatDate, formatGenre, hour, min } from "@/utils/functions/format.js"

export default function Profil() {
  const info = useFetch("user-info")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(()=>{
    if(info.isLoading == false)
    {
      if(info.error == true)
      {
        const message = (info.data.message ?? info.data.toString())
        console.log("error", message)
        setErrorMessage(message)
        return;
      }
    }
  }, [info.isLoading])


  return (
    info.isLoading === true ? <LoadingIcon></LoadingIcon> : errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : info.hasData ?
    <div className={styles.container}>
      <div className={styles.profil}>
        <div className={styles.photo}>
          <div className={styles.avatar}>
            <img src={`${info.data.profile.profilePicture}`}></img>
          </div>
          <div>
            <h2>{info.data.profile.firstName} {info.data.profile.lastName}</h2>
            <p>Membre depuis le {formatDate(info.data.profile.createdAt)}</p>
          </div>
        </div>
        <div className={styles.infos}>
          <h2>Votre profil</h2>
          <ul>
            <li>Âge : {info.data.profile.age}</li>
            <li>Genre : {formatGenre(info.data.profile.genre)}</li>
            <li>Taille : {formatHeight(info.data.profile.height)}</li>
            <li>Poids : {info.data.profile.weight}kg</li>
          </ul>
        </div>
    </div>
    <div className={styles.stats}>
      <div>
        <h2>Vos statistiques</h2>
        <p>depuis le {formatDate(info.data.profile.createdAt)}</p>
      </div>
      <div className={styles.items}>
        <div>
          <p>Temps total couru</p>
          <p>{hour(info.data.statistics.totalDuration)}h <span className={styles.unit}>{min(info.data.statistics.totalDuration)}min</span></p>
        </div>
        <div>
          <p>Calories brûlées</p>
          <p>{info.data.statistics.calories} <span className={styles.unit}>cal</span></p>
        </div>
        <div>
          <p>Distance totale parcourue</p>
          <p>{info.data.statistics.totalDistance} <span className={styles.unit}>km</span></p>
        </div>
        <div>
          <p>Nombre de jours de repos</p>
          <p>{info.data.statistics.repos} <span className={styles.unit}>jours</span></p>
        </div>
        <div>
          <p>Nombre de sessions</p>
          <p>{info.data.statistics.totalSessions} <span className={styles.unit}>sessions</span></p>
        </div>
      </div>
    </div>
    </div>
    :<></>
  );
}
