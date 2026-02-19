import { useEffect, useState, useRef } from 'react';
import styles from './DateSelector.module.css';
import { formatDateMD } from "@/utils/functions/format.js"

/**
 * DateSelector Component
 *
 * Permet de sélectionner une plage de dates.
 *
 * @param {Object} props - Props du composant
 * @param {Date} props.beginDate - Date de début sélectionnée
 * @param {function(Date): void} props.setBeginDate - Fonction pour mettre à jour la date de début
 * @param {Date} props.endDate - Date de fin sélectionnée
 * @param {function(Date): void} props.setEndDate - Fonction pour mettre à jour la date de fin
 * @param {number} [props.dayStep=7] - Intervalle en jours pour la sélection
 */
const DateSelector = ({initialDate, onChange, dayStep}) => {

  const [beginDate, setBeginDate] = useState(() => {
    if(initialDate)
      return initialDate

    // ou aujourd'hui - dayStep
    let date = new Date()
    date.setDate(date.getDate() - dayStep)
    return date
  })
  const [endDate, setEndDate] = useState(null)

  // false si l'initialisation n'a pas encore eu lieu
  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    // Ajustement premier rendu uniquement
    dateAdjust()
  }, [])

  /// Ajuste la date pour correspondre du dimanche au dimanche
  const dateAdjust = () => {
    const adjustedBegin = new Date(beginDate)

    // fix le début de la date à un dimanche
    /*if(beginDate.getDay() > 0)
      adjustedBegin.setDate(adjustedBegin.getDate() - (beginDate.getDay()))*/

    // fix le début de la date à un lundi
    if(beginDate.getDay() > 1)
      adjustedBegin.setDate(adjustedBegin.getDate() - (beginDate.getDay() - 1))
    else
      adjustedBegin.setDate(adjustedBegin.getDate() + 1)

    // fix la fin à + x jours  (dayStep)
    const adjustedEnd = new Date(adjustedBegin)
    adjustedEnd.setDate(adjustedEnd.getDate() + dayStep)

    setBeginDate(adjustedBegin)
    setEndDate(adjustedEnd)
  }

  const onPrevDate = () =>{
    const adjustedBegin = new Date(beginDate)
    adjustedBegin.setDate(adjustedBegin.getDate() - dayStep)
    const adjustedEnd = new Date(adjustedBegin)
    adjustedEnd.setDate(adjustedEnd.getDate() + dayStep)
    
    setBeginDate(adjustedBegin)
    setEndDate(adjustedEnd)
  }

  const onNextDate = () =>{
    const adjustedBegin = new Date(beginDate)
    adjustedBegin.setDate(adjustedBegin.getDate() + dayStep)
    const adjustedEnd = new Date(adjustedBegin)
    adjustedEnd.setDate(adjustedEnd.getDate() + dayStep)
    
    setBeginDate(adjustedBegin)
    setEndDate(adjustedEnd)
  }

  useEffect(() => {
    if (!didInit.current) return

    if(endDate > beginDate && onChange)
    {
      onChange(beginDate, endDate)
    }
  }, [beginDate, endDate, onChange])

  return (
    <div className={styles.content}>
      <span className='button' onClick={onPrevDate}>&lt;</span>
      <span>{formatDateMD(beginDate)}</span>
      <span>-</span>
      <span>{formatDateMD(endDate)}</span>
      <span className='button' onClick={onNextDate}>&gt;</span>
    </div>
  )
}

export default DateSelector;
