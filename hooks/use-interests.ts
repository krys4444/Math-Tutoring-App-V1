"use client"

import { useState, useEffect } from "react"
import { interestsService, type Interest } from "@/lib/interests-service"

export function useInterests() {
  const [interests, setInterests] = useState<Interest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        setLoading(true)
        const { data, error } = await interestsService.getUserInterests()

        if (error) {
          setError(error.message)
        } else {
          setInterests(data || [])
        }
      } catch (err) {
        setError("Failed to fetch interests")
      } finally {
        setLoading(false)
      }
    }

    fetchUserInterests()
  }, [])

  const addInterest = async (interestName: string) => {
    try {
      const { error } = await interestsService.addUserInterest(interestName)
      if (error) {
        throw new Error(error.message)
      }

      // Refresh interests
      const { data } = await interestsService.getUserInterests()
      setInterests(data || [])
    } catch (err) {
      throw err
    }
  }

  const removeInterest = async (interestId: number) => {
    try {
      const { error } = await interestsService.removeUserInterest(interestId)
      if (error) {
        throw new Error(error.message)
      }

      // Refresh interests
      const { data } = await interestsService.getUserInterests()
      setInterests(data || [])
    } catch (err) {
      throw err
    }
  }

  return {
    interests,
    loading,
    error,
    addInterest,
    removeInterest,
  }
}
