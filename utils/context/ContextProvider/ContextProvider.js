'use client'

import { useEffect, useState } from "react";
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"

const ContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null)
  const [userId, setUserId] = useState(null)

  // lecture localStorage côté client uniquement
  useEffect(() => {
    setUserToken(localStorage.getItem("token"))
    setUserId(localStorage.getItem("userId"))
  }, [])

  useEffect(()=>{
    localStorage.setItem("token", userToken);
  }, [userToken])

  useEffect(()=>{
    localStorage.setItem("userId", userId);
  }, [userId])

  return (
    <ContextInstance.Provider value={{ userToken, setUserToken, userId, setUserId }}>
        {children}
    </ContextInstance.Provider>
  )
}

export default ContextProvider