'use client'

import { useEffect } from 'react';
import styles from './CardioChart.module.css'
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { generateMockData, RechartsDevtools } from '@recharts/devtools';
import DateSelector from '@/components/DateSelector/DateSelector'

export const data = [
  { day: "Lun", min: 138, max: 170 },
  { day: "Mar", min: 140, max: 173 },
  { day: "Mer", min: 145, max: 180 },
  { day: "Jeu", min: 140, max: 168 },
  { day: "Ven", min: 133, max: 160 },
  { day: "Sam", min: 145, max: 156 },
  { day: "Dim", min: 128, max: 170 },
];

const moyenne =
  data.reduce((acc, v) => acc + v.max, 0) / data.length;


const dataMock = generateMockData(5, 50);

const CardioChart = () => {

  useEffect(() => {
    console.log(dataMock)
  }, [])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>{Math.round(moyenne)} BPM</div>
        <DateSelector></DateSelector>
      </div>
      <div className={styles.subtitle}>Fréquence cardiaque moyenne</div>
      <ComposedChart
        style={{ width: '100%', aspectRatio: 1.618 }}
        responsive
        data={data}
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
        <Line name="Max BPM" legendType="line" type="natural" fill="blue" dataKey="max" stroke="#F2F3FF" strokeWidth={3} dot={{ stroke: 'blue', strokeWidth: 2 }} connectNulls />
        <Bar barSize={14} name="Max BPM" legendType="circle" dataKey="max" fill="#ff2b2b" activeBar={{ fill: 'gold', stroke: 'purple' }} radius={[10, 10, 0, 0]} />
        <Legend align="left" itemSorter={null} verticalAlign="bottom"></Legend>
        <RechartsDevtools />
      </ComposedChart>
    </>
  )
}

export default CardioChart;
