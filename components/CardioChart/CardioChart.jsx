'use client'

import { useFetch } from '@/utils/hooks/useFetch'
import { useEffect, useState, useCallback, useRef } from 'react';
import styles from './CardioChart.module.css'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import DateSelector from '@/components/DateSelector/DateSelector'
import Placeholder from '@/components/Placeholder/Placeholder'
import {formatDateISO} from '@/utils/functions/format'

const emptyDataModel = () => [
  { day: "Lun", min: NaN, max: NaN, average: NaN },
  { day: "Mar", min: NaN, max: NaN, average: NaN },
  { day: "Mer", min: NaN, max: NaN, average: NaN },
  { day: "Jeu", min: NaN, max: NaN, average: NaN },
  { day: "Ven", min: NaN, max: NaN, average: NaN },
  { day: "Sam", min: NaN, max: NaN, average: NaN },
  { day: "Dim", min: NaN, max: NaN, average: NaN },
];

const CardioChart = ({ initialDate, ...rest }) => {
  const [ chartData, setChartData ] = useState(emptyDataModel())
  const [ moyenne, setMoyenne ] = useState(0)
  const [ url, setUrl ] = useState(null)
  const [ready, setReady] = useState(false)
  const [firstDate, setFirstDate] = useState(null)
  const { data, isLoading, error } = useFetch(url)
  const [errorMessage, setErrorMessage] = useState("")

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

  const dayStep = 7;

  // useCallback est nécessaire pour éviter les re-render en chaine de DateSelector (et indirectement onDateChange)
  const onDateChange = useCallback((beginDate, endDate) => {
    const ajustedUrl = `user-activity?startWeek=${formatDateISO(beginDate)}&endWeek=${formatDateISO(endDate)}`
    setErrorMessage(null)
    setReady(false)
    setFirstDate(beginDate)
    setUrl(ajustedUrl)
  }, [])

  // obtient l'indice du jour entre la date de départ et la date de fin
  function dayIndice(date1, date2) {
    const msPerDay = 24 * 60 * 60 * 1000; // millisecondes dans un jour
    const diffMs = date2 - date1;         // différence en millisecondes
    const day = parseInt(Math.round(diffMs / msPerDay)); // jours complets

    return day
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

    let totalAverage = 0

    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      // obtient le numero de la semaine par rapport à la date de début
      const day = Math.min(ajustedData.length-1,Math.max(0, dayIndice(new Date(formatDateISO(firstDate)), new Date(item.date))))

      ajustedData[day].min = isNaN(ajustedData[day].min) ? data[i].heartRate.min : Math.min(data[i].heartRate.min)
      ajustedData[day].max = isNaN(ajustedData[day].max) ? data[i].heartRate.max : Math.max(data[i].heartRate.max)
      ajustedData[day].average = isNaN(ajustedData[day].average) ? data[i].heartRate.average : ((ajustedData[day].average + data[i].heartRate.average) / 2)

      totalAverage += data[i].heartRate.average
    }

    setMoyenne(totalAverage / data.length)
    setChartData(ajustedData.filter(item => isNaN(item.average) == false))
  }, [ready])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}><Placeholder ready={ready} replacement="...">{Math.round(moyenne)}</Placeholder> BPM</div>
        <DateSelector onChange={onDateChange} dayStep={dayStep}></DateSelector>
      </div>
      <div className={styles.subtitle}>Fréquence cardiaque moyenne</div>
      <Placeholder ready={ready} replacement={isLoading ? "Chargement des données..." : errorMessage ?? "Aucune donnée disponible"}>
        <ComposedChart
          style={{ width: '100%', aspectRatio: 1.618 }}
          responsive
          data={chartData}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis width="auto" domain={['auto', 'auto']}  />
          <Bar barSize={14} name="Min" legendType="circle" dataKey="min" fill="#ff8b8b" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
          <Line name="Moy BPM" legendType="line" type="natural" fill="blue" dataKey="average" stroke="#F2F3FF" strokeWidth={3} dot={{ stroke: 'blue', strokeWidth: 2 }} connectNulls />
          <Bar barSize={14} name="Max BPM" legendType="circle" dataKey="max" fill="#ff2b2b" activeBar={{ fill: 'gold', stroke: 'purple' }} radius={[10, 10, 0, 0]} />
          <Legend align="left" itemSorter={null} verticalAlign="bottom"></Legend>
          <RechartsDevtools />
        </ComposedChart>
      </Placeholder>
    </>
  )
}

export default CardioChart;
