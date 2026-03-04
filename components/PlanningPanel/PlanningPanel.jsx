"use client"

import { useEffect, useState, useRef, useContext, useMemo } from 'react';
import styles from './PlanningPanel.module.css'
import { HiOutlineArrowLeft   } from "react-icons/hi"
import { useFetch, useFetchWithContent } from '@/utils/hooks/useFetch'
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { formatDateISO } from "@/utils/functions/format.js"
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"
import ReactMarkdown from 'react-markdown'
import { getWeekNumber, formatDateDay } from "@/utils/functions/format.js"

const PlanningPanel = () => {
  const { setPlanning } = useContext(ContextInstance)
  // pages
  const page1Ref = useRef(0)
  const page2Ref = useRef(0)
  const page3Ref = useRef(0)
  const page4Ref = useRef(0)
  const objectifRef = useRef(0)
  const dateRef = useRef(0)
  const [pageIndex, setPageIndex] = useState(0)
  // infos
  const info = useFetch("user-info")
  // data
  const [activityUrl, setActivityUrl] = useState(null)
  const activity = useFetch(activityUrl)
  // planning
  const [post, setPost] = useState(null)
  const planning = useFetchWithContent("training-plan/generate", post, process.env.NEXT_PUBLIC_ASSIST_API_URL)
  // stats
  const [stats, setStats] = useState([])

  const errorMessage = useMemo(() => {
    if (!info.isLoading && info.error) {
      return info.data?.message ?? info.data?.toString()
    }
    if (!activity.isLoading && activity.error) {
      return activity.data?.message ?? activity.data?.toString()
    }
    return null
  }, [info, activity])

  const planningErrorMessage = useMemo(() => {
    if (!planning.isLoading && planning.error) {
      return planning.data?.message ?? planning.data?.toString()
    }
    return null
  }, [planning])


  useEffect(()=>{
    if(info.hasData)
    {
      setActivityUrl(`user-activity?startWeek=${info.data.profile.createdAt}&endWeek=${formatDateISO(new Date())}`)
    }
  }, [info.hasData])


  useEffect(()=>{
    if(activity.hasData)
    {
      // groupe les données par semaine
      const groupedData = {};
      activity.data.forEach(item => {
        const date = new Date(item.date)
        const week = date.getFullYear() + "." + getWeekNumber(date)
        if (!groupedData[week]) {
          groupedData[week] = [];
        }
        groupedData[week].push(item);
      });

      // Analysez l'historique des courses pour détecter le niveau réel
      // Calculez les allures cibles basées sur les performances récentes
      // Intégrez les objectifs à long terme dans la stratégie du plan
      // > distance moyenne par semaine
      // > durée moyenne par semaine
      // > jours par semaine
      // > calories brulées en moyenne par semaine
      
      const averageData = {};
      for (const [weekKey, week] of Object.entries(groupedData)) {
        averageData[weekKey] = {
          weekOfYear: weekKey,
          distance: Math.round(week.reduce((prev,cur) => prev + cur.distance, 0) / week.length),
          duration: Math.round(week.reduce((prev,cur) => prev + cur.duration, 0) / week.length),
          days: week.length,
          daysOfWeek: week.reduce((prev,cur) => prev + formatDateDay(cur.date) + ", ", ""),
          caloriesBurned: Math.round(week.reduce((prev,cur) => prev + cur.caloriesBurned, 0) / week.length),
        }
      }

      setStats(Object.values(averageData))
    }
  }, [activity.hasData])

  useEffect(()=>{
    if(planning.hasData)
    {
      if(planning.data.success === true){
        setPlanning(planning.data.response.program)
        
        var dialog = document.getElementById("planningDialog");
        dialog.showModal();

        document.querySelector("form").reset()
        setPageIndex(0)
      }
    }
  }, [planning.hasData])

  function sendMessage(data){
      setPost({
        objectif : data.objectif.trim(),
        date : data.date,
        info : info.data,
        stats : stats.slice(-10),
        activity : activity.data.slice(-10)
      })
  }

  function checkCurrentPageValidity(){
    const form = document.querySelector("form")
    let curPageRef = page1Ref

    switch (pageIndex) {
      case 0:
      curPageRef = page1Ref
      break;
      case 1:
      curPageRef = page2Ref
      break;
      case 2:
      curPageRef = page3Ref
      break;
      case 3:
      curPageRef = page4Ref
      break;
      default:
        throw new Error("Invalid page index")
    }

    const inputs = Array.from(curPageRef.current.querySelectorAll("input"));
    if(inputs.every(e => e.checkValidity()) === false)
    {
      form.reportValidity() // affiche les erreurs
      return false
    }
    return true
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if(planning.isLoading || activity.isLoading)
    {
      alert("Veuillez patienter pendant le chargement des données...")
      return;
    }

    const form = document.querySelector("form");
    if(form.checkValidity() === false)
    {
      form.reportValidity() // affiche les erreurs
      return;
    }

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    sendMessage(data)

    setPageIndex(3)
  }
  
  const onClickNext = () => {
    if(!checkCurrentPageValidity())
      return;
    setPageIndex(prev => Math.min(prev + 1, 2))
  }

  const onClickPrev = () => {
    setPageIndex(prev => Math.max(prev - 1, 0))
  }

  const onKeyDown = (e) => {
    if(e.key === "Enter")
    {
      e.preventDefault()
      if(pageIndex === 2)
      {
        document.querySelector("form").requestSubmit()
      }
      else{
        onClickNext()
      }
    }
  }

  const onClickCancel = () => {
    setPageIndex(0)
  }

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} onKeyDown={onKeyDown}>
        <div className={styles.content}>
          <div ref={page1Ref} className={[styles.page, pageIndex !== 0 && "hidden"].join(" ")}>
            <img src="/calendar.png" alt="Planning" className={styles.planningIcon}></img>
            <h2>Créez votre planning d'entraînement intelligent</h2>
            <p>Notre IA vous aide à bâtir un planning 100 % personnalisé selon vos objectifs, votre niveau et votre emploi du temps.</p>
            <div className={styles.buttons}>
              <button type="button" className={styles.button} onClick={onClickNext}>Commencer</button>
            </div>
          </div>
          <div ref={page2Ref} className={[styles.page, pageIndex !== 1 && "hidden"].join(" ")}>
            <img src="/target.png" alt="Planning" className={styles.planningIcon}></img>
            <h2>Quel est votre objectif principal ?</h2>
            <p>Choisissez l’objectif qui vous motive le plus.</p>
            <label className={styles.label}>Objectif</label>
            <input required ref={objectifRef} className={styles.input} type="text" name='objectif' placeholder="Ex : Perte de poids, prise de masse, préparation marathon..."></input>
            <div className={styles.buttons}>
              <button type="button" className={styles.button} onClick={onClickNext}>Suivant</button>
            </div>
          </div>
          <div ref={page3Ref} className={[styles.page, pageIndex !== 2 && "hidden"].join(" ")}>
            <img src="/calendar.png" alt="Planning" className={styles.planningIcon}></img>
            <h2>Quand souhaitez vous commencer votre programme ?</h2>
            <p>Générer un programme d’une semaine à partir de la date de votre choix</p>
            <label className={styles.label}>Date de début</label>
            <input required ref={dateRef} className={styles.input} type='date' name='date'></input>
            <div className={styles.buttons}>
              <button type="button" className={`${styles.button} ${styles.buttonBack}`} onClick={onClickPrev}><HiOutlineArrowLeft></HiOutlineArrowLeft></button>
              <button type="submit" className={styles.button}>Générer mon planning</button>
            </div>
          </div>
          <div ref={page4Ref} className={[styles.page, pageIndex !== 3 && "hidden"].join(" ")}>
            <img src="/calendar.png" alt="Planning" className={styles.planningIcon}></img>
            <h2>Génération du planning...</h2>
            <p>Veuillez patienter quelques instants...</p>
            {planning.isLoading === true || activity.isLoading === true ? <LoadingIcon></LoadingIcon> : planningErrorMessage || errorMessage ? <div className={styles.error}><ReactMarkdown>{planningErrorMessage ?? errorMessage}</ReactMarkdown></div> : null}
            <div className={styles.buttons}>
              <button type="button" className={`${styles.button} ${styles.buttonBack}`} onClick={onClickCancel}>Annuler</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlanningPanel;
