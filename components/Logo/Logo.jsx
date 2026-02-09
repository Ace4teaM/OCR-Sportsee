'use client'

import { useEffect } from 'react';
import styles from './Logo.module.css'

const Logo = () => {

  useEffect(() => {
    console.log(`Logo mounted`)
  }, [])

  return (
    <div className={styles.logo}>
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
