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
  // infos
  const info = useFetch("user-info")
  const [ready, setReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  // stats
  const [ url, setUrl ] = useState(null)
  const week = useFetch(url)
  const [readyWeek, setReadyWeek] = useState(false)
  const [errorWeekMessage, setErrorWeekMessage] = useState("")
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
        if(info.isLoading == false)
        {
          if(info.error == true)
          {
            const message = (info.data.message ?? info.data.toString())
            setErrorMessage(message)
            return;
          }
          
          setReady(true)
        }
  }, [info.isLoading])

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
    if(week.isLoading == false)
    {
      if(week.error == true)
      {
        const message = (week.data.message ?? week.data.toString())
        setErrorWeekMessage(message)
        return;
      }
      
      setReadyWeek(true)
    }
  }, [week.isLoading])

  useEffect(()=>{
    if(readyWeek == false)
      return
  
    if(week.data.length == 0)
    {
      setErrorWeekMessage("Aucune donnée disponible")
      setReadyWeek(false)
      return
    }

    let activity = 0;
    let distance = 0;

    for (let i = 0; i < week.data.length; i++) {
      activity += parseFloat(week.data[i].duration)
      distance += parseFloat(week.data[i].distance)
    }

    setTotalActivity(activity)
    setTotalDistance(distance)
  }, [readyWeek])

  return (
    !ready ? (info.isLoading == true) ? <LoadingIcon></LoadingIcon> : <ErrorMessage>{errorMessage}</ErrorMessage>:
    <div className={styles.container}>
      <div className={styles.banner}>
          <div><span className="icon star"></span>Posez vos questions sur votre programme, vos performances ou vos objectifs.</div>
          <span className={`${styles.button} ${styles.buttonAnim}`}>Lancer une conversation</span>
      </div>
      <div className={styles.profil}>
        <div className={styles.photo}>
          <div className={styles.avatar}>
            <div className={styles.avatar_content}>
              <img src={`${info.data.profile.profilePicture}`}></img>
            </div>
          </div>
          <div>
            <h2>{info.data.profile.firstName} {info.data.profile.lastName}</h2>
            <p>Membre depuis le {formatDate(info.data.profile.createdAt)}</p>
          </div>
        </div>
        <div className={styles.infos}>
          <p>Distance totale parcourue</p>
          <span className={`${styles.button} ${styles.buttonAnim}`}><img src="/goal.png"></img>{info.data.statistics.totalDistance} km</span>
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
