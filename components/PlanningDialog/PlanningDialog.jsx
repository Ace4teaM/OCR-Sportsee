"use client"

import { useContext, useRef } from 'react';
import styles from './PlanningDialog.module.css'
import { useFetch, useFetchWithContent } from '@/utils/hooks/useFetch'
import PlanningCalendar from '@/components/PlanningCalendar/PlanningCalendar'
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"



const PlanningDialog = () => {
  const { planning } = useContext(ContextInstance)

  const isInDialogRef = useRef(false)

  const handleMouseUp = (e) => {
    if (isInDialogRef.current) {
      return
    }

    const dlg = document.getElementById("loginDialog");
    dlg.close();
  }

  const handleMouseDown = (e) => {
    const dlg = document.getElementById("loginDialog");
    const rect = dlg.getBoundingClientRect();

    const clickedInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;

    isInDialogRef.current = clickedInDialog;
  }

  return (
    <dialog id="planningDialog" className={styles.planningDialog} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown}>
      <div className={styles.container}>
        <PlanningCalendar data={planning}></PlanningCalendar>
      </div>
    </dialog>
  )
}

export default PlanningDialog;
