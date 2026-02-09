'use client'

import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import styles from './DistanceChart.module.css'
import DateSelector from '@/components/DateSelector/DateSelector'

export const data = [
  { semaine: "S1", km: 20 },
  { semaine: "S2", km: 25 },
  { semaine: "S3", km: 18 },
  { semaine: "S4", km: 30 },
];

const moyenne =
  data.reduce((acc, v) => acc + v.km, 0) / data.length;


const DistanceChart = () => {

  useEffect(() => {
    console.log(`DistanceChart mounted`)
  }, [])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>{Math.round(moyenne)}km en moyenne</div>
        <DateSelector></DateSelector>
      </div>
      <div className={styles.subtitle}>Total des kilomètres 4 dernières semaines</div>
      <BarChart
            style={{ width: '100%', aspectRatio: 1.618 }}
            responsive
            data={data}
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
    </>
  )
}

export default DistanceChart;
