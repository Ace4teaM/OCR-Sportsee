'use client'

import { useEffect } from 'react';
import styles from './Menu.module.css'
import Link from 'next/link'

const Menu = () => {

  useEffect(() => {
    console.log(`Menu mounted`)
  }, [])

  const onLogin = () =>{
    var dialog = document.getElementById("loginDialog");
    console.log(dialog);
    dialog.showModal();
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
            <Link href="#" onClick={onLogin}>Se connecter</Link>
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
