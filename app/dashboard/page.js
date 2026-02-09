import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import CardioChart from "@/components/CardioChart/CardioChart";
import DistanceChart from "@/components/DistanceChart/DistanceChart";
import CoursesChart from "@/components/CoursesChart/CoursesChart";

export default function DashBoard() {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
          <p><span className="icon star"></span>Posez vos questions sur votre programme, vos performances ou vos objectifs.</p>
          <span className={styles.button}>Lancer une conversation</span>
      </div>
      <div className={styles.profil}>
        <div className={styles.photo}>
          <img src='/profil.png'></img>
          <div>
            <h2>Clara Dupont</h2>
            <p>Membre depuis le 14 juin 2023</p>
          </div>
        </div>
        <div className={styles.infos}>
          <p>Distance totale parcourue</p>
          <span className={styles.button}>312 km</span>
        </div>
      </div>
      <div className={styles.stats}>
        <h2>Vos dernières performances</h2>
        <div className={styles.items}>
          <div className={styles.box}>
            <DistanceChart></DistanceChart>
          </div>
          <div className={styles.box}>
            <CardioChart></CardioChart>
          </div>
        </div>
      </div>
      <div className={styles.stats}>
        <h2>Cette semaine</h2>
        <p>Du 23/06/2025 au 30/06/2025</p>
        <div className={styles.items}>
          <div className={styles.box}>
            <CoursesChart></CoursesChart>
          </div>
          <div>
            <div className={styles.box}>
              <div className={styles.subtitle}>Durée d’activité</div>
              <div className={styles.label1}><span>140</span> minutes</div>
            </div>
            <div className={styles.box}>
              <div className={styles.subtitle}>Distance</div>
              <div className={styles.label2}><span>21.7</span> kilomètres</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
