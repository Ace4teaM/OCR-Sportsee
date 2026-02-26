"use client"

import { useEffect, useState, useRef } from 'react';
import styles from './ChatDialog.module.css'
import { HiOutlineArrowNarrowUp   } from "react-icons/hi"
import { useFetch, useFetchWithContent } from '@/utils/hooks/useFetch'
import WritingIcon from '@/components/WritingIcon/WritingIcon'
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { formatDate, formatDateShort, formatDateISO } from "@/utils/functions/format.js"

const ChatDialog = () => {

  // infos
  const [errorMessage, setErrorMessage] = useState("")
  const info = useFetch("user-info")
  // data
  const [activityUrl, setActivityUrl] = useState(null)
  const activity = useFetch(activityUrl)
  // chat
  const [post, setPost] = useState(null)
  const [chatErrorMessage, setChatErrorMessage] = useState("")
  const chat = useFetchWithContent("chat", post, process.env.NEXT_PUBLIC_ASSIST_API_URL)
  // message utilisateur
  const [inputMessage, setInputMessage] = useState("où imprimer des fichiers STL")
  // historique des conversations
  const [conversation, setConversation] = useState([])

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
    if(chat.isLoading == false)
    {
      if(chat.error == true)
      {
        const message = (chat.data.content !== undefined ? chat.data.content : chat.data.toString())
        setChatErrorMessage(message)
        return;
      }
    }
  }, [chat.isLoading])

  useEffect(()=>{
    if(chat.hasData)
    {
      if(chat.data.response !== undefined){
        // ajoute la convesation précédente à l'historique
        setConversation(prev => [...prev, {role:"user", content:inputMessage.trim()}])
        setInputMessage("")
        setConversation(prev => [...prev, {role:"assistant", content:chat.data.response}])
      }
    }
  }, [chat.hasData])

  function sendMessage(){
      if(!inputMessage)
      {
        setChatErrorMessage("Empty message")
        return;
      }

      setPost({
        conversation : [...conversation],
        message : inputMessage.trim(),
        info : info.data,
        activity : activity.data
      })
      setChatErrorMessage("")
  }

  const onClickMessage = (e) => {
    if(chat.isLoading)
      return;
    sendMessage();
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage()
    }
  }

  const onClickClose = (e) => {
    const dlg = document.getElementById("chatDialog");
    dlg.close();
  }

  const onClickSuggestion = (e) => {
    setInputMessage(e.target.innerText);
  }

  const isInDialogRef = useRef(false)

  const handleMouseUp = (e) => {
    if (isInDialogRef.current) {
      return
    }

    const dlg = document.getElementById("chatDialog");
    dlg.close();
  }

  const handleMouseDown = (e) => {
    const dlg = document.getElementById("chatDialog");
    const rect = dlg.getBoundingClientRect();

    const clickedInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;

    isInDialogRef.current = clickedInDialog;
  }

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, chat.isLoading, chatErrorMessage]);

  return (
    <dialog id="chatDialog" className={styles.chatDialog} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown}>
      <div className={styles.container}>
    {info.isLoading === true || activity.isLoading === true ? <><LoadingIcon></LoadingIcon><div>Veuillez patienter nous rassemblons vos dernières statistiques...</div></> : errorMessage ? <div>{errorMessage}</div> : info.hasData && activity.hasData ?
        <>
        <div className={styles.messages}>
         <span className={styles.closeBtn} onClick={onClickClose}>Fermer</span>
        {conversation.length === 0 && <p className={styles.empty_message}>Posez vos questions sur votre programme,<br></br>vos performances ou vos objectifs</p>}
        {conversation.map((response, i)=>{
          if(response.role == "user")
            return <div key={`chat-${i}`} className={styles.user_message}><span className={styles.messageUserIcon}><img src={`${info.data.profile.profilePicture}`}></img></span>{response.content.split("\n").map((line, j) => (<div key={`chat-${i}-${j}`}>{line}</div>))}</div>
          return <div key={`chat-${i}`} className={styles.assistant_message}><span className={styles.messageAssistantIcon}></span>{response.content.split("\n").map((line, j) => (<div key={`chat-${i}-${j}`}>{line}</div>))}</div>
        })}
         {chat.isLoading === true && <div className={styles.assistant_message}><span className={styles.messageAssistantIcon}></span><WritingIcon></WritingIcon></div>}
          <a ref={bottomRef}></a>
        </div>
        <div className={styles.error}>
          {
          chatErrorMessage === "This operation was aborted" ? "La réponse a dépassé le temps imparti, veuillez reéssayer ou reformuler votre demande." :
          chatErrorMessage === "Empty message" ? "Veuillez saisir un message." :
          chatErrorMessage ? "Une erreur est survenue : " + chatErrorMessage : ""
          }
          </div>
        <div className={styles.prompt}>
         <span className={styles.promptBtn} onClick={onClickMessage}><HiOutlineArrowNarrowUp size={24} color="white" /></span>
         <p className={styles.promptMessage}><span className={styles.promptIcon}></span><textarea disabled={chat.isLoading} onKeyDown={onKeyDown} className={styles.promptInput} value={inputMessage} onChange={(e)=>setInputMessage(e.target.value)} cols="40" rows="5" wrap='hard' placeholder="Comment puis-je vous aider"></textarea></p>
        </div>
        <div className={styles.suggestion}>
         <span onClick={onClickSuggestion}>Comment améliorer mon endurance ?</span>
         <span onClick={onClickSuggestion}>Que signifie mon score de récupération ?</span>
         <span onClick={onClickSuggestion}>Peux-tu m’expliquer mon dernier graphique ?</span>
        </div>
        </>
    :<>Nous n'avons aucune données pour le moment info:{info.hasData}, activity:{activity.hasData}</>}
      </div>
  </dialog>
  )
}

export default ChatDialog;
