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
    <form onSubmit={onSubmit}>
      <label htmlFor="username">Nom d'utilisateur</label>
      <input type="text" name="username" />
      <label htmlFor="password">Mot de passe</label>
      <input type="password" name="password" />
      <button type="submit">Submit</button>
    </form>
  )
}
export default Login