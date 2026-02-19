'use client'

import { useEffect, useState, useRef } from "react";
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"

const ContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [logged, setLogged] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // false si l'initialisation n'a pas encore eu lieu
  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    // Ajustement premier rendu uniquement
    setUserToken(localStorage.getItem("token"))
    setUserId(localStorage.getItem("userId"))
    setLogged(localStorage.getItem("token") != null)
    setIsReady(true)
  }, [])

  useEffect(()=>{
    if (!didInit.current) return
    if(userToken == null)
      localStorage.removeItem("token");
    else
      localStorage.setItem("token", userToken);
  }, [userToken])

  useEffect(()=>{
    if (!didInit.current) return
    if(userToken == null)
      localStorage.removeItem("userId");
    else
      localStorage.setItem("userId", userId);
  }, [userId])

  return (
    <ContextInstance.Provider value={{ userToken, setUserToken, userId, setUserId, logged, setLogged, isReady }}>
        {children}
    </ContextInstance.Provider>
  )
}

export default ContextProvider