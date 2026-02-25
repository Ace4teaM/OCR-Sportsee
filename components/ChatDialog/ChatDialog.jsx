"use client"

import { useContext, useEffect, useState, useRef } from 'react';
import styles from './ChatDialog.module.css'
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"
import { HiOutlineArrowNarrowUp   } from "react-icons/hi"
import { useFetch } from '@/utils/hooks/useFetch'

const ChatDialog = () => {
  // infos
  const info = useFetch("user-info")
  const [ready, setReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

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

  const [inputMessage, setInputMessage] = useState("")

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
         <p className={styles.empty_message}>Posez vos questions sur votre programme,<br></br>vos performances ou vos objectifs</p>
         <p className={styles.user_message}><span className={styles.messageUserIcon}>{ready ? <img src={`${info.data.profile.profilePicture}`}></img> : <label>vous</label>}</span>Que signifie mon score de récupération ?</p>
         <p className={styles.assistant_message}><span className={styles.messageAssistantIcon}></span>Votre score de récupération indique à quel point votre corps a récupéré après vos précédents entraînements. 
<br/>
Il prend en compte plusieurs facteurs comme :<br/>
<br/>
💤 La qualité de votre sommeil<br/>
❤️ Votre fréquence cardiaque au repos<br/>
🧘‍♂️ Votre niveau de stress<br/>
🏋️‍♀️ L’intensité de vos séances récentes<br/>
<br/>
Un score élevé (80-100) signifie que vous êtes en bonne forme pour vous entraîner à nouveau.<br/>
 Un score moyen (50-79) suggère de privilégier une séance plus légère ou de récupération active.<br/>
 Un score faible (&lt;50) indique que votre corps a besoin de repos.<br/>
<br/>
📊 Ce score vous aide à éviter le surentraînement et à progresser en respectant vos capacités du moment.<br/>
<br/>
Souhaitez-vous des conseils pour améliorer votre récupération ?</p>
        </div>
        <div className={styles.prompt}>
         <span className={styles.promptBtn}><HiOutlineArrowNarrowUp size={24} color="white" /></span>
         <p className={styles.promptMessage}><span className={styles.promptIcon}></span><textarea className={styles.promptInput} value={inputMessage} onChange={(e)=>setInputMessage(e.target.value)} cols="40" rows="5" wrap='hard' placeholder="Comment puis-je vous aider"></textarea></p>
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
