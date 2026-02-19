'use client'

import styles from "./page.module.css";
import { useFetch } from '@/utils/hooks/useFetch'
import { useState, useEffect } from 'react';
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import CardioChart from "@/components/CardioChart/CardioChart";
import DistanceChart from "@/components/DistanceChart/DistanceChart";
import CoursesChart from "@/components/CoursesChart/CoursesChart";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import {  formatDate } from "@/utils/functions/format.js"

export default function DashBoard() {
  const { data, isLoading, error } = useFetch("user-info")
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
        <p>Du 23/06/2025 au 30/06/2025</p>
        <div className={styles.items}>
          <div className={styles.box}>
            <CoursesChart></CoursesChart>
          </div>
          <div>
            <div className={styles.box}>
              <div className={styles.subtitle}>Durée d’activité</div>
              <div className={styles.label1}><span>140</span> minutes</div>
            </div>
            <div className={styles.box}>
              <div className={styles.subtitle}>Distance</div>
              <div className={styles.label2}><span>21.7</span> kilomètres</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
