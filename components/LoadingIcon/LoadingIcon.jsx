import styles from './LoadingIcon.module.css'

const LoadingIcon = ({children}) => {

  return (
    <div className={styles.content}>
        <div className={styles.load}>
            <div className={`${styles.point} ${styles.point1}`}></div>
            <div className={`${styles.point} ${styles.point2}`}></div>
            <div className={`${styles.point} ${styles.point3}`}></div>
            <div className={`${styles.point} ${styles.point4}`}></div>
            <div className={`${styles.point} ${styles.point5}`}></div>
        </div>
        <div className={styles.text}>{children ?? "Chargement..."}</div>
    </div>
  )
}

export default LoadingIcon;
