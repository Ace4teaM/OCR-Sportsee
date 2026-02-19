'use client'

import { useContext, useEffect, useState, useRef } from 'react';
import styles from './LoginDialog.module.css'
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"
import Logo from "@/components/Logo/Logo";
import { useRouter } from "next/navigation"

const LoginDialog = () => {
  const router = useRouter()

  useEffect(() => {
    console.log(`LoginDialog mounted`)
  }, [])

  const { setUserId, setUserToken, setLogged } = useContext(ContextInstance)
  const [ loginFailed, setLoginFailed ] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    
    setLogged(false)
    setLoginFailed(false)
 
    const formData = new FormData(event.target)
    
    const payload = {
      username: formData.get("username"),
      password: formData.get("password")
    };

    //{ "username": "string", "password": "string" }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if(response.status != 200)
    {
      setLoginFailed(true)
      return;
    }
 
    // Stock les informations d'identification
    const data = await response.json()

    setUserId(data["userId"])
    setUserToken(data["token"])
    setLogged(true)

    const dlg = document.getElementById("loginDialog");
    dlg.close();

    window.location.reload()
  }
 
  const isInDialogRef = useRef(false)

  const handleMouseUp = (e) => {
    if (isInDialogRef.current) {
      return
    }

    const dlg = document.getElementById("loginDialog");
    dlg.close();
  }

  const handleMouseDown = (e) => {
    const dlg = document.getElementById("loginDialog");
    const rect = dlg.getBoundingClientRect();

    const clickedInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;

    isInDialogRef.current = clickedInDialog;
  }

  return (
    <dialog id="loginDialog" className={styles.loginDialog} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown}>
      <div className={styles.container}>
        <div className={styles.center}>
          <div className={styles.logo}>
            <Logo></Logo>
          </div>
          <div className={styles.form}>
            <h2>Transformez<br></br>vos stats en résultats</h2>
            {loginFailed && <>La connexion a échouée</>}
            <p>Se connecter</p>
            <form onSubmit={onSubmit}>
              <label htmlFor="username">Nom d'utilisateur</label>
              <input type="text" name="username" />
              <label htmlFor="password">Mot de passe</label>
              <input type="password" name="password" />
              <button className={styles.button} type="submit">Se connecter</button>
            </form>
            <p>Mot de passe oublié ?</p>
          </div>
        </div>
        <div className={styles.panel}>
            <img className={styles.background} src="/background.png" alt="background"></img>
            <div className={styles.note}>Analysez vos performances en un clin d’œil, suivez vos progrès et atteignez vos objectifs.</div>
        </div>
      </div>
  </dialog>
  )
}

export default LoginDialog;
