'use client'

import styles from "./page.module.css";
import { useFetch } from '@/utils/hooks/useFetch'
import { useState, useEffect } from 'react';
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { formatHeight, formatDate, formatGenre, hour, min } from "@/utils/functions/format.js"

export default function Profil() {
  const { data, isLoading, error } = useFetch("http://localhost:8000/api/user-info")
  const [ready, setReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(()=>{
        if(isLoading == false)
        {
          if(error == true)
          {
            const message = (data.message ?? data.toString())
            console.log("error", message)
            setErrorMessage(message)
            return;
          }
          
          setReady(true)
        }
  }, [isLoading])


  return (
    !ready ? (isLoading == true) ? <LoadingIcon></LoadingIcon> : <ErrorMessage>{errorMessage}</ErrorMessage>:
    <div className={styles.container}>
      <div className={styles.profil}>
        <div className={styles.photo}>
          <div className={styles.avatar}>
            <img src={`${data.profile.profilePicture}`}></img>
          </div>
          <div>
            <h2>{data.profile.firstName} {data.profile.lastName}</h2>
            <p>Membre depuis le {formatDate(data.profile.createdAt)}</p>
          </div>
        </div>
        <div className={styles.infos}>
          <h2>Votre profil</h2>
          <ul>
            <li>Âge : {data.profile.age}</li>
            <li>Genre : {formatGenre(data.profile.genre)}</li>
            <li>Taille : {formatHeight(data.profile.height)}</li>
            <li>Poids : {data.profile.weight}kg</li>
          </ul>
        </div>
    </div>
    <div className={styles.stats}>
      <div>
        <h2>Vos statistiques</h2>
        <p>depuis le {formatDate(data.profile.createdAt)}</p>
      </div>
      <div className={styles.items}>
        <div>
          <p>Temps total couru</p>
          <p>{hour(data.statistics.totalDuration)}h <span className={styles.unit}>{min(data.statistics.totalDuration)}min</span></p>
        </div>
        <div>
          <p>Calories brûlées</p>
          <p>{data.statistics.calories} <span className={styles.unit}>cal</span></p>
        </div>
        <div>
          <p>Distance totale parcourue</p>
          <p>{data.statistics.totalDistance} <span className={styles.unit}>km</span></p>
        </div>
        <div>
          <p>Nombre de jours de repos</p>
          <p>{data.statistics.repos} <span className={styles.unit}>jours</span></p>
        </div>
        <div>
          <p>Nombre de sessions</p>
          <p>{data.statistics.totalSessions} <span className={styles.unit}>sessions</span></p>
        </div>
      </div>
    </div>
    </div>
  );
}
