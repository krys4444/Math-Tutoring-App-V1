"use client"

import { useState, useEffect } from "react"
import { gradeService, type Grade } from "@/lib/grade-service"

export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true)
        const { data, error } = await gradeService.getGrades()

        if (error) {
          setError(error.message)
        } else {
          setGrades(data || [])
        }
      } catch (err) {
        setError("Failed to fetch grades")
      } finally {
        setLoading(false)
      }
    }

    fetchGrades()
  }, [])

  const saveUserGrade = async (gradeId: number) => {
    try {
      const { error } = await gradeService.saveUserGrade(gradeId)
      if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      throw err
    }
  }

  return {
    grades,
    loading,
    error,
    saveUserGrade,
  }
}
