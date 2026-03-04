"use client"

import { useEffect, useState, useRef, useContext } from 'react';
import styles from './PlanningCalendar.module.css'
import { HiPlus, HiMiniMinus  } from "react-icons/hi2"
import { getWeekNumber, formatDateDay } from "@/utils/functions/format.js"
import { downloadFile } from "@/utils/functions/utils.js"
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"
import { useFetchWithContent } from '@/utils/hooks/useFetch'

const PlanningCalendar = ({data}) => {
  const [showIndex, setShowIndex] = useState(0)
  const [grouped, setGrouped] = useState({})
  // download
  const [post, setPost] = useState(null)
  const [downloadErrorMessage, setDownloadErrorMessage] = useState("")
  const download = useFetchWithContent("training-plan/make-ics", post, process.env.NEXT_PUBLIC_ASSIST_API_URL)

  useEffect(()=>{
    if(download.isLoading == false)
    {
      if(download.error == true)
      {
        setDownloadErrorMessage(download.data.toString())
        return;
      }
    }
  }, [download.isLoading])

  useEffect(()=>{
    if(download.hasData)
    {
      downloadFile("training_plan.ics", download.data, "text/calendar")
    }
  }, [download.hasData])

  const didInit = useRef(0)

  // groupe les données par semaine
  const dataToCalendar = (data) => {
      if(Array.isArray(data) == false)
      {
        setGrouped({});
        return;
      }

      const groupedData = {};
      data.forEach(item => {
        const week = getWeekNumber(new Date(item.day));
        if (!groupedData[week]) {
          groupedData[week] = [];
        }
        groupedData[week].push(item);
      });
      setGrouped(groupedData);
      setShowIndex(0);
  }

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    dataToCalendar(data)
  }, [])

  useEffect(() => {
    if (!didInit.current) return
    dataToCalendar(data)
  }, [data])

  const onClickDownload = () => {
    if(data === null || data === undefined)
    {
      setDownloadErrorMessage("Impossible de télécharger le planning : données manquantes.")
      return;
    }

    setPost([...data])
  }

  const onClickRegenerate = () => {
    const dlg = document.getElementById("planningDialog");
    dlg.close();
  }

  return (
    <div>
      <div className={styles.title}>
        <h2>Votre planning de la semaine</h2>
        <p>Important pour définir un programme adapté</p>
      </div>
      {Object.keys(grouped).map((group, week) => (
        <div key={`week-${week}`} className={styles.weekBox} onClick={()=>showIndex !== week ? setShowIndex(week) : null}>
          <div className={styles.week}>Semaine {group}</div>
          <span className={styles.plus}>{week === showIndex ? <HiMiniMinus onClick={()=>setShowIndex(-1)}></HiMiniMinus> : <HiPlus onClick={()=>setShowIndex(week)}></HiPlus> }</span>
          {week === showIndex && grouped[group].map((item, index) => (
            <div key={`week-${week}-day-${index}`} className={styles.dayBox}>
              <div className={styles.day}>{formatDateDay(item.day)}</div>
              <div>
                <div className={styles.objectif}>{item.objectif}</div>
                <div className={styles.details}>{item.description}</div>
              </div>
              <span className={styles.duration}>{item.duration}min</span>
            </div>
          ))}
        </div>
       ))}
       <div className={styles.buttons}>
        <button className={styles.button} onClick={()=>onClickDownload()}>Télécharger</button>
        <button className={styles.button} onClick={()=>onClickRegenerate()}>Regénérer un programme</button>
       </div>
    </div>
  )
}

export default PlanningCalendar;
