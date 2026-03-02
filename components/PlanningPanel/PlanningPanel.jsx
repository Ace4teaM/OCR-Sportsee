"use client"

import { useEffect, useState, useRef } from 'react';
import styles from './PlanningPanel.module.css'
import { HiOutlineArrowLeft   } from "react-icons/hi"
import { useFetch, useFetchWithContent } from '@/utils/hooks/useFetch'
import WritingIcon from '@/components/WritingIcon/WritingIcon'
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { formatDate, formatDateShort, formatDateISO } from "@/utils/functions/format.js"
import ReactMarkdown from 'react-markdown'

const PlanningPanel = () => {
  // pages
  const page1Ref = useRef(0)
  const page2Ref = useRef(0)
  const page3Ref = useRef(0)
  const objectifRef = useRef(0)
  const dateRef = useRef(0)
  const [pageIndex, setPageIndex] = useState(0)
  // infos
  const [errorMessage, setErrorMessage] = useState("")
  const info = useFetch("user-info")
  // data
  const [activityUrl, setActivityUrl] = useState(null)
  const activity = useFetch(activityUrl)
  // planning
  const [post, setPost] = useState(null)
  const [planningErrorMessage, setPlanningErrorMessage] = useState("")
  const planning = useFetchWithContent("training-plan/generate", post, process.env.NEXT_PUBLIC_ASSIST_API_URL)
  // message utilisateur
  const [inputMessage, setInputMessage] = useState("")
  // historique des conversations
  const [conversation, setConversation] = useState([])

  // maximum de messages dans la conversation (assistant + utilisateur)
  const maxConversations = 40

  useEffect(()=>{
    if(info.isLoading == false)
    {
      if(info.error == true)
      {
        const message = (info.data.message ?? info.data.toString())
        setErrorMessage(message)
        return;
      }
      
      if(info.hasData == true)
      {
        setActivityUrl(`user-activity?startWeek=${info.data.profile.createdAt}&endWeek=${formatDateISO(new Date())}`)
      }
    }
  }, [info.isLoading])

  useEffect(()=>{
    if(activity.isLoading == false)
    {
      if(activity.error == true)
      {
        const message = (activity.data.message ?? info.data.toString())
        setErrorMessage(message)
        return;
      }
    }
  }, [activity.isLoading])

  useEffect(()=>{
    if(planning.isLoading == false)
    {
      if(planning.error == true)
      {
        const message = (planning.data.content !== undefined ? planning.data.content : planning.data.toString())
        setPlanningErrorMessage(message)
        return;
      }
    }
  }, [planning.isLoading])

  useEffect(()=>{
    if(planning.hasData)
    {
      if(planning.data.response !== undefined){
        // ajoute la convesation précédente à l'historique
        setConversation(prev => [...prev, {role:"user", content:inputMessage.trim()}, {role:"assistant", content:planning.data.response}].slice(-maxConversations))
        setInputMessage("")
      }
    }
  }, [planning.hasData])

  function sendMessage(data){
      setPost({
        objectif : data.objectif.trim(),
        date : data.date,
        info : info.data,
        activity : activity.data.slice(-10)
      })
      setPlanningErrorMessage("")
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

    if(planning.isLoading)
      return;

    const form = document.querySelector("form");
    if(form.checkValidity() === false)
    {
      form.reportValidity() // affiche les erreurs
      return;
    }

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    console.log(data)

    sendMessage(data)

    form.reset()
    setPageIndex(0)
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
        </div>
      </form>
    </div>
  )
}

export default PlanningPanel;
