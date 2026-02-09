import { useEffect } from 'react';
import styles from './DateSelector.module.css';

const DateSelector = ({beginDate,endDate}) => {

  useEffect(() => {
    console.log(`DateSelector mounted`)
  }, [])

  return (
    <div className={styles.content}>
      <span className='button'>&lt;</span>
      <span>28 mai</span>
      <span>-</span>
      <span>25 juin</span>
      <span className='button'>&gt;</span>
    </div>
  )
}

DateSelector.propTypes = {
  // bla: PropTypes.string,
};

DateSelector.defaultProps = {
  // bla: 'test',
};

export default DateSelector;
