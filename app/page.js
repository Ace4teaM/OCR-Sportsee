import Link from "next/link";
import styles from "./page.module.css";
import DashBoard from "./dashboard/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <DashBoard></DashBoard>
    </div>
  );
}
