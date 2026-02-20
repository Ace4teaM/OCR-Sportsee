'use client'

import { useEffect, useState } from 'react';
import { PieChart, Pie, Sector, LabelList } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import styles from './CoursesChart.module.css'

export const data = [
  { label: "réalisé", count: 4 },
  { label: "restant", count: 2 }
];


const CoursesChart = ({ initialDate, ...rest }) => {

  const ShapeStyle = (props) => (
    <Sector 
      {...props}
      fill={props.index == 0 ? '#0B23F4' : '#B6BDFC'}
    />
  );

  return (
    <div className="CoursesChart-component">
      <div className={styles.header}>
        <div className={styles.title}><span>x{data[0].count}</span> sur objectif de {data[1].count}</div>
      </div>
      <div className={styles.subtitle}>Courses hebdomadaire réalisées</div>
      <div className={styles.content}>
        <PieChart responsive
          style={{ width: '100%', height: '100%', aspectRatio: 1.4, padding: 20 }}
          margin={{
            top: 30,
            right: 0,
            left: 0,
            bottom: 30,
          }}
          >
            <Pie
            label={(props) => {
                const { cx, cy, midAngle, outerRadius, percent, name, value, payload } = props;
                const RAD = Math.PI / 180;
                const r = outerRadius + 20; // distance du label
                const x = cx + r * Math.cos(-midAngle * RAD);
                const y = cy + r * Math.sin(-midAngle * RAD);

                return (
                  <g>
                    <text x={x+10} y={y+5} fill="#707070" textAnchor={x > cx ? "start" : "end"} dy={0}>
                      {payload.count} {payload.label}{payload.count>1 ? 's' : ''}
                    </text>
                  </g>
                );
              }}
            data={data} dataKey="count" nameKey="count" labelLine={false} outerRadius="100%" innerRadius="50%" isAnimationActive={false} fill='#707070' shape={ShapeStyle} >
            </Pie>
            <RechartsDevtools />
        </PieChart>
      </div>
    </div>
  )
}

export default CoursesChart;
