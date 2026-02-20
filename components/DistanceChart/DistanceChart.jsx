'use client'

import { useFetch } from '@/utils/hooks/useFetch'
import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import styles from './DistanceChart.module.css'
import DateSelector from '@/components/DateSelector/DateSelector'
import Placeholder from '@/components/Placeholder/Placeholder'
import {formatDateISO} from '@/utils/functions/format'

const emptyDataModel = () => [
  { semaine: "S1", km: 0 },
  { semaine: "S2", km: 0 },
  { semaine: "S3", km: 0 },
  { semaine: "S4", km: 0 },
];

const DistanceChart = ({ initialDate, ...rest }) => {
  const [ chartData, setChartData ] = useState(emptyDataModel())
  const [ url, setUrl ] = useState(null)
  const [ready, setReady] = useState(false)
  const [firstDate, setFirstDate] = useState(null)
  const { data, isLoading, error } = useFetch(url)
  const [errorMessage, setErrorMessage] = useState("")

  const dayStep = 7 * 4;

  const moyenne = () => Math.round(chartData.reduce((acc, v) => acc + v.km, 0) / chartData.length);

  useEffect(()=>{
    if(isLoading == false)
    {
      if(error == true)
      {
        const message = (data.message ?? data.toString())
        setErrorMessage(message)
        return;
      }
            
      setReady(true)
    }
  }, [isLoading])

  // obtient l'indice de la semaine entre la date de départ et la date de fin
  function weekIndice(date1, date2) {
    const msPerDay = 24 * 60 * 60 * 1000; // millisecondes dans un jour
    const diffMs = date2 - date1;         // différence en millisecondes
    return parseInt(Math.round(diffMs / msPerDay) / 7); // jours complets
  }

  useEffect(()=>{
    if(ready == false)
      return
  
    if(data.length == 0)
    {
      setErrorMessage("Aucune donnée disponible")
      setReady(false)
      return
    }

    let ajustedData = emptyDataModel();

    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      // obtient le numero de la semaine par rapport à la date de début
      const sem = Math.min(ajustedData.length-1,Math.max(0, weekIndice(new Date(formatDateISO(firstDate)), new Date(item.date))))

      ajustedData[sem].km += data[i].distance // additionne car data peut retourner plusieurs résultats pour la même semaine
    }

    setChartData(ajustedData)
  }, [ready])

  // useCallback est nécessaire pour éviter les re-render en chaine de DateSelector (et indirectement onDateChange)
  const onDateChange = useCallback((beginDate, endDate) => {
    const ajustedUrl = `user-activity?startWeek=${formatDateISO(beginDate)}&endWeek=${formatDateISO(endDate)}`
    setErrorMessage(null)
    setReady(false)
    setFirstDate(beginDate)
    setUrl(ajustedUrl)
  }, [])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}><Placeholder ready={ready} replacement="...">{moyenne()}</Placeholder> km en moyenne</div>
        <DateSelector onChange={onDateChange} dayStep={dayStep}></DateSelector>
      </div>
      <div className={styles.subtitle}>Total des kilomètres 4 dernières semaines</div>
      <Placeholder ready={ready} replacement={isLoading ? "Chargement des données..." : errorMessage ?? "Aucune donnée disponible"}>
        <BarChart
            style={{ width: '100%', height: '100%', aspectRatio: 1.618 }}
            responsive
            data={chartData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="semaine" />
          <YAxis width="auto" />
          <Tooltip />
          <Legend align="left" />
          <Bar barSize={14} name="Km" legendType="circle" dataKey="km" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
          <RechartsDevtools />
        </BarChart>
      </Placeholder>
    </>
  )
}

export default DistanceChart;
