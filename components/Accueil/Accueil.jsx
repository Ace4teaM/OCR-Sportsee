'use client'

import { useContext, useEffect } from 'react';
import styles from './Accueil.module.css';
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"
import Link from 'next/link'
import { useRouter } from "next/navigation"

const Accueil = () => {
  const { logged, isReady } = useContext(ContextInstance)
  const router = useRouter()

  useEffect(() => {
    if(!isReady)
      return;

    if(logged)
    {
      router.replace("/dashboard")
    }
    else{
      var dialog = document.getElementById("loginDialog");
      dialog.showModal();
    }
  }, [logged, isReady])

  const onLogin = () =>{
    var dialog = document.getElementById("loginDialog");
    dialog.showModal();
  }

  return (
    <div className="Accueil-component">
      <h2>Bienvenue sur Spotsee</h2>
      <p>Pour commencer veuillez vous connecter</p>
      <Link className={styles.link} href="#" onClick={onLogin}>Cliquez ici</Link>
    </div>
  )
}

export default Accueil;
