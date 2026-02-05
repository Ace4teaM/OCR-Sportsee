'use client'

import { useEffect, useState } from "react";
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"

const ContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"))
  const [userId, setUserId] = useState(localStorage.getItem("userId"))

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