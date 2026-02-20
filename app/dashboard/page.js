'use client'

import styles from "./page.module.css";
import { useFetch } from '@/utils/hooks/useFetch'
import { useState, useEffect, useRef } from 'react';
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import CardioChart from "@/components/CardioChart/CardioChart";
import DistanceChart from "@/components/DistanceChart/DistanceChart";
import CoursesChart from "@/components/CoursesChart/CoursesChart";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Placeholder from '@/components/Placeholder/Placeholder'
import { formatDate, formatDateShort, formatDateISO } from "@/utils/functions/format.js"

export default function DashBoard() {
  const { data, isLoading, error } = useFetch("user-info")
  const [ url, setUrl ] = useState(null)
  const { data: dataWeek, isLoading:isLoadingWeek, error:errorWeek } = useFetch(url)
  const [readyWeek, setReadyWeek] = useState(false)
  const [errorWeekMessage, setErrorWeekMessage] = useState("")
  const [ready, setReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [beginDate, setBeginDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [totalActivity, setTotalActivity] = useState(0)
  const [totalDistance, setTotalDistance] = useState(0)

  // false si l'initialisation n'a pas encore eu lieu
  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    // Ajustement premier rendu uniquement
    const adjustedBegin = new Date()

    // fix le début de la date à un lundi
    if(adjustedBegin.getDay() > 1)
      adjustedBegin.setDate(adjustedBegin.getDate() - (adjustedBegin.getDay() - 1))
    else
      adjustedBegin.setDate(adjustedBegin.getDate() + 1)

    // Ajourd'hui
    const adjustedEnd = new Date()

    setBeginDate(adjustedBegin)
    setEndDate(adjustedEnd)
  }, [])

  /*
  Infos DATA
  */

  useEffect(()=>{
        if(isLoading == false)
        {
          if(error == true)
          {
            const message = (data.message ?? data.toString())
            setErrorMessage(message)
            return;
          }
          
          setReady(true)
        }
  }, [isLoading])

  /*
  Week DATA
  */

  useEffect(()=>{
    if(ready == true)
    {
        const ajustedUrl = `user-activity?startWeek=${formatDateISO(beginDate)}&endWeek=${formatDateISO(endDate)}`
        setReadyWeek(false)
        setUrl(ajustedUrl)
    }
  }, [ready])

  useEffect(()=>{
    if(isLoadingWeek == false)
    {
      if(errorWeek == true)
      {
        const message = (dataWeek.message ?? dataWeek.toString())
        setErrorWeekMessage(message)
        return;
      }
      
      setReadyWeek(true)
    }
  }, [isLoadingWeek])

  useEffect(()=>{
    if(readyWeek == false)
      return
  
    if(data.length == 0)
    {
      setErrorWeekMessage("Aucune donnée disponible")
      setReadyWeek(false)
      return
    }

    let activity = 0;
    let distance = 0;

    for (let i = 0; i < dataWeek.length; i++) {
      activity += parseFloat(dataWeek[i].duration)
      distance += parseFloat(dataWeek[i].distance)
    }

    setTotalActivity(activity)
    setTotalDistance(distance)
  }, [readyWeek])

  return (
    !ready ? (isLoading == true) ? <LoadingIcon></LoadingIcon> : <ErrorMessage>{errorMessage}</ErrorMessage>:
    <div className={styles.container}>
      <div className={styles.banner}>
          <div><span className="icon star"></span>Posez vos questions sur votre programme, vos performances ou vos objectifs.</div>
          <span className={`${styles.button} ${styles.buttonAnim}`}>Lancer une conversation</span>
      </div>
      <div className={styles.profil}>
        <div className={styles.photo}>
          <div className={styles.avatar}>
            <div className={styles.avatar_content}>
              <img src={`${data.profile.profilePicture}`}></img>
            </div>
          </div>
          <div>
            <h2>{data.profile.firstName} {data.profile.lastName}</h2>
            <p>Membre depuis le {formatDate(data.profile.createdAt)}</p>
          </div>
        </div>
        <div className={styles.infos}>
          <p>Distance totale parcourue</p>
          <span className={`${styles.button} ${styles.buttonAnim}`}><img src="/goal.png"></img>{data.statistics.totalDistance} km</span>
        </div>
      </div>
      <div className={styles.stats}>
        <h2>Vos dernières performances</h2>
        <div className={styles.items}>
          <div className={styles.box}>
            <DistanceChart></DistanceChart>
          </div>
          <div className={styles.box}>
            <CardioChart></CardioChart>
          </div>
        </div>
      </div>
      <div className={styles.stats}>
        <h2>Cette semaine</h2>
        <p>Du {formatDateShort(beginDate)} au {formatDateShort(endDate)}</p>
        <div className={styles.items}>
          <div className={styles.box}>
            <CoursesChart></CoursesChart>
          </div>
          <div>
            <div className={styles.box}>
              <div className={styles.subtitle}>Durée d’activité</div>
              <div className={styles.label1}><span><Placeholder ready={readyWeek} replacement="...">{totalActivity}</Placeholder></span> minutes</div>
            </div>
            <div className={styles.box}>
              <div className={styles.subtitle}>Distance</div>
              <div className={styles.label2}><span><Placeholder ready={readyWeek} replacement="...">{totalDistance}</Placeholder></span> kilomètres</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
