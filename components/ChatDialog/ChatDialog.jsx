"use client"

import { useContext, useEffect, useState, useRef } from 'react';
import styles from './ChatDialog.module.css'
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"
import { HiOutlineArrowNarrowUp   } from "react-icons/hi"
import { useFetch, useFetchWithContent } from '@/utils/hooks/useFetch'

const ChatDialog = () => {
  // infos
  const [ready, setReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const info = useFetch("user-info")
  // chat
  const [post, setPost] = useState(null)
  const chat = useFetchWithContent("chat", post, process.env.NEXT_PUBLIC_ASSIST_API_URL)

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

  useEffect(()=>{
    console.log("isLoading",chat.isLoading)
  }, [chat.isLoading])

  useEffect(()=>{
    if(chat.hasData)
    {
      if(chat.data.response !== undefined){
          setConversation([...conversation, {role:"assitant", message:chat.data.response}])
      }
    }
  }, [chat.hasData])

  const [inputMessage, setInputMessage] = useState("")
  const [conversation, setConversation] = useState([])

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setPost({
        message : inputMessage.trim()
      })
      setConversation([...conversation, {role:"user", message:inputMessage.trim()}])
      setInputMessage("")
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

  return (
    <dialog id="chatDialog" className={styles.chatDialog} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown}>
      <div className={styles.container}>
        <div className={styles.messages}>
         <span className={styles.closeBtn} onClick={onClickClose}>Fermer</span>
        {conversation.length === 0 && <p className={styles.empty_message}>Posez vos questions sur votre programme,<br></br>vos performances ou vos objectifs</p>}
        {conversation.map((response, i)=>{
          if(response.role == "user")
            return <p key={`chat-${i}`} className={styles.user_message}><span className={styles.messageUserIcon}>{ready ? <img src={`${info.data.profile.profilePicture}`}></img> : <label>vous</label>}</span>{response.message}</p>
          return <p key={`chat-${i}`} className={styles.assistant_message}><span className={styles.messageAssistantIcon}></span>{response.message}</p>
        })}
         {chat.isLoading === true && <p className={styles.assistant_message}><span className={styles.messageAssistantIcon}></span>...</p>}
        </div>
        <div className={styles.prompt}>
         <span className={styles.promptBtn}><HiOutlineArrowNarrowUp size={24} color="white" /></span>
         <p className={styles.promptMessage}><span className={styles.promptIcon}></span><textarea onKeyDown={onKeyDown} className={styles.promptInput} value={inputMessage} onChange={(e)=>setInputMessage(e.target.value)} cols="40" rows="5" wrap='hard' placeholder="Comment puis-je vous aider"></textarea></p>
        </div>
        <div className={styles.suggestion}>
         <span onClick={onClickSuggestion}>Comment améliorer mon endurance ?</span>
         <span onClick={onClickSuggestion}>Que signifie mon score de récupération ?</span>
         <span onClick={onClickSuggestion}>Peux-tu m’expliquer mon dernier graphique ?</span>
        </div>
      </div>
  </dialog>
  )
}

export default ChatDialog;
