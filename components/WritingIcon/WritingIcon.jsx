'use client'

import styles from './WritingIcon.module.css'

const WritingIcon = () => {
  return (
    <div className={styles.container}>
      <span className={`${styles.point} ${styles.point1}`}></span>
      <span className={`${styles.point} ${styles.point2}`}></span>
      <span className={`${styles.point} ${styles.point3}`}></span>
      <span className={`${styles.point} ${styles.point4}`}></span>
    </div>
  )
}

export default WritingIcon;
