'use client'

import { useState, useEffect, useContext } from 'react'
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"
 

export function useFetch(url) {
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { userToken, isReady } = useContext(ContextInstance)

    useEffect(() => {
        if (!url) return
        async function fetchData() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
                    method: "GET", // ou POST, PUT...
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    },
                });
                const data = await response.json()
                if(response.status != 200)
                    setError(true)
                setData(data)
            } catch (err) {
                console.log(err)
                setData(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        if (isReady && url) {
            console.log("loading",url)
            setLoading(true)
            fetchData()
        }
    }, [isReady, url])

    return { data, isLoading, error }
}
