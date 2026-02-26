'use client'

import { useState, useEffect, useContext, useMemo } from 'react'
import ContextInstance from "@/utils/context/ContextInstance/ContextInstance"
 

export function useFetch(url, domain = process.env.NEXT_PUBLIC_USER_API_URL) {
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const { userToken, isReady } = useContext(ContextInstance)

    const hasData = useMemo(
        () => (isLoading == false && error == false && data && Object.keys(data).length > 0)
    ,[isLoading, error, data])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${domain}/${url}`, 
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${userToken}`
                        },
                    }
                );
                if(response.status != 200)
                    setError(true)

                if(response.headers.get("content-type")?.includes("application/json")) // ex: Content-Type: application/json; charset=utf-8
                {
                    const data = await response.json()
                    setData(data)
                }
                else{
                    const data = await response.text()
                    setData(data)
                }
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
            setError(false)
            fetchData()
        }
    }, [isReady, url])

    return { data, isLoading, error, hasData }
}

export function useFetchWithContent(url, post, domain = process.env.NEXT_PUBLIC_USER_API_URL) {
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const { userToken, isReady } = useContext(ContextInstance)

    const hasData = useMemo(
        () => (isLoading == false && error == false && data && Object.keys(data).length > 0)
    ,[isLoading, error, data])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${domain}/${url}`, 
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${userToken}`,
                            "Content-Type" : "application/json"
                        },
                        body: JSON.stringify(post)
                    }
                );

                if(response.status != 200)
                    setError(true)

                if(response.headers.get("content-type")?.includes("application/json")) // ex: Content-Type: application/json; charset=utf-8
                {
                    const data = await response.json()
                    setData(data)
                }
                else{
                    const data = await response.text()
                    setData(data)
                }
            } catch (err) {
                console.log(err)
                setData(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        if (isReady && url && post) {
            console.log("loading",url,"with",post)
            setLoading(true)
            setError(false)
            fetchData()
        }
    }, [isReady, url, post])

    return { data, isLoading, error, hasData }
}
