'use client'

import styles from './Footer.module.css'

import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Footer = () => {

  useEffect(() => {
    console.log(`Footer mounted`)
  }, [])

  return (
    <div className={styles.footer}>
      <span>©Sportsee Tous droits réservés</span>
      <span>
        <ul className={styles.menu}>
          <li>Conditions générales</li>
          <li>Contact</li>
          <li><img src='/small-logo.png'></img></li>
        </ul>
      </span>
    </div>
  )
}

Footer.propTypes = {
  // bla: PropTypes.string,
};

Footer.defaultProps = {
  // bla: 'test',
};

export default Footer;
