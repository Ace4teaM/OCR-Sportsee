import Image from "next/image";
import styles from "./page.module.css";

export default function Profil() {
  return (

    <div className={styles.container}>
      <div className={styles.profil}>
        <div className={styles.photo}>
          <img src='/profil.png'></img>
          <div>
            <h2>Clara Dupont</h2>
            <p>Membre depuis le 14 juin 2023</p>
          </div>
        </div>
        <div className={styles.infos}>
          <h2>Votre profil</h2>
          <ul>
            <li>Âge : 29</li>
            <li>Genre : Femme</li>
            <li>Taille : 1m68</li>
            <li>Poids : 58kg</li>
          </ul>
        </div>
    </div>
    <div className={styles.stats}>
      <div>
        <h2>Vos statistiques</h2>
        <p>depuis le 14 juin 2023</p>
      </div>
      <div className={styles.items}>
        <div>
          <p>Temps total couru</p>
          <p>27h <span className={styles.unit}>15min</span></p>
        </div>
        <div>
          <p>Calories brûlées</p>
          <p>25000 <span className={styles.unit}>cal</span></p>
        </div>
        <div>
          <p>Distance totale parcourue</p>
          <p>312 <span className={styles.unit}>km</span></p>
        </div>
        <div>
          <p>Nombre de jours de repos</p>
          <p>9 <span className={styles.unit}>jours</span></p>
        </div>
        <div>
          <p>Nombre de sessions</p>
          <p>41 <span className={styles.unit}>sessions</span></p>
        </div>
      </div>
    </div>
    </div>
  );
}
