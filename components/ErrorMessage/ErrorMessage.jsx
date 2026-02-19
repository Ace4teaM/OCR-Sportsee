"use client"

import styles from './ErrorMessage.module.css';
import Link from 'next/link'

const ErrorMessage = ({children}) => {

  const isAuthenticationFailed = children == "Authentication required";
  const isInvalidToken = children == "Invalid token";
  const isNetworkError = children == "NetworkError when attempting to fetch resource.";

  const onLogin = () =>{
    var dialog = document.getElementById("loginDialog");
    dialog.showModal();
  }

  const onRefresh = () =>{
    window.location.reload()
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.message}>
          {isAuthenticationFailed && <>
            <h2>Vous n'êtes pas authentifiez veuillez saisir vos identifiant</h2>
            <p>Veuillez vous authentifier <Link className={styles.link} href="#" onClick={onLogin}>Cliquez ici</Link></p>
          </>
          }
          {isInvalidToken && <>
            <h2>Votre session a expirée</h2>
            <p>Veuillez vous reconnecter <Link className={styles.link} href="#" onClick={onLogin}>Cliquez ici</Link></p>
          </>
          }
          {isNetworkError && <>
            <h2>Le serveur semble indisponible</h2>
            <p>Veuillez actualiser de nouveau <Link className={styles.link} href="#" onClick={onRefresh}>Cliquez ici</Link></p>
          </>
          }
        </div>
        <code className={styles.code}>{children}</code>
      </div>
    </>
  )
}

export default ErrorMessage;
