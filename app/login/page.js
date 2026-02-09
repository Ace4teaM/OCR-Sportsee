'use client'

import styles from "./page.module.css";
import { useContext } from 'react'
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"

const Login = () => {

  const { setUserId, setUserToken } = useContext(ContextInstance)

  const onSubmit = async (event) => {
    event.preventDefault()
 
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
      console.log(response);
      return;
    }
 
    // Stock les informations d'identification
    const data = await response.json()

    setUserId(data["userId"])
    setUserToken(data["token"])
  }
 
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.form}>
          <h2>Transformez<br></br>vos stats en résultats</h2>
          <p>Se connecter</p>
          <form onSubmit={onSubmit}>
            <label htmlFor="username">Adresse email</label>
            <input type="email" name="email" />
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
  )
}
export default Login