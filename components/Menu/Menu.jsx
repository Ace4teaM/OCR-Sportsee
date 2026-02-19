'use client'

import { useContext, useEffect } from 'react';
import styles from './Menu.module.css'
import Link from 'next/link'
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"

const Menu = () => {
  const { logged, setLogged } = useContext(ContextInstance)

  useEffect(() => {
    console.log(`Menu mounted`)
  }, [])

  const onLogin = () =>{
    var dialog = document.getElementById("loginDialog");
    dialog.showModal();
  }

  const onUnlog = () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setLogged(false)
    window.location = "/"
  }

  return (
    <div>
        <ul className={styles.menu}>
          <li className={styles.button}>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li className={styles.button}>
            <Link href="/coachai">Coach AI</Link>
          </li>
          <li className={styles.button}>
            <Link href="/profil">Mon profil</Link>
          </li>
          <li>
            <span className={styles.separator}>&nbsp;</span>
          </li>
          <li className={styles.button}>
            {!logged ? <Link href="#" onClick={onLogin}>Se connecter</Link> : <Link href="#" onClick={onUnlog}>Se déconnecter</Link>}
          </li>
        </ul>
    </div>
  )
}

Menu.propTypes = {
  // bla: PropTypes.string,
};

Menu.defaultProps = {
  // bla: 'test',
};

export default Menu;
