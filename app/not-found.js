import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>La page demandée est introuvable.</p>
        <Link href="/">Retour à l'accueil</Link>
      </main>
    </div>
  );
}
