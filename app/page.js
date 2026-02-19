import styles from "./page.module.css";
import Accueil from "@/components/Accueil/Accueil";

export default function Home() {
  return (
    <div className={styles.page}>
      <Accueil></Accueil>
    </div>
  );
}
