'use client'

import { useEffect } from 'react';
import styles from './Logo.module.css'

const Logo = () => {

  useEffect(() => {
    console.log(`Logo mounted`)
  }, [])

  return (
    <div className={styles.container}>
        <div className={styles.logo}>
            <div className={styles.load}>
                <div className={`${styles.bar} ${styles.load__bar1}`}></div>
                <div className={`${styles.bar} ${styles.load__bar2}`}></div>
                <div className={`${styles.bar} ${styles.load__bar3}`}></div>
                <div className={`${styles.bar} ${styles.load__bar4}`}></div>
                <div className={`${styles.bar} ${styles.load__bar5}`}></div>
            </div>
            <div className={styles.load}>
                <div className={`${styles.bar2} ${styles.load__bar1b}`}></div>
                <div className={`${styles.bar2} ${styles.load__bar2b}`}></div>
                <div className={`${styles.bar2} ${styles.load__bar3b}`}></div>
                <div className={`${styles.bar2} ${styles.load__bar4b}`}></div>
                <div className={`${styles.bar2} ${styles.load__bar5b}`}></div>
            </div>
        </div>
        <img src='/logo.png'></img>
    </div>
  )
}

Logo.propTypes = {
  // bla: PropTypes.string,
};

Logo.defaultProps = {
  // bla: 'test',
};

export default Logo;
