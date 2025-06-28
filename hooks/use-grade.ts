"use client"

import { useState, useEffect } from "react"
import { getAvailableGrades, getUserGrade, saveUserGrade, type Grade, type UserGrade } from "@/lib/grade-service"
import { useAuth } from "./use-auth"

export function useGrade() {
  const { user } = useAuth()
  const [availableGrades, setAvailableGrades] = useState<Grade[]>([])
  const [userGrade, setUserGrade] = useState<UserGrade | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load grades and user's current grade when user is available
  useEffect(() => {
    if (user) {
      loadGrades()
    } else {
      setAvailableGrades([])
      setUserGrade(null)
      setLoading(false)
    }
  }, [user])

  const loadGrades = async () => {
    setLoading(true)
    setError(null)

    // Load available grades
    const { data: grades, error: gradesError } = await getAvailableGrades()
    if (gradesError) {
      setError(gradesError.message)
      setLoading(false)
      return
    }

    // Load user's current grade
    const { data: currentGrade, error: userGradeError } = await getUserGrade()
    if (userGradeError) {
      setError(userGradeError.message)
      setLoading(false)
      return
    }

    setAvailableGrades(grades || [])
    setUserGrade(currentGrade)
    setLoading(false)
  }

  const selectGrade = async (gradeId: number) => {
    if (!user) {
      setError("User not authenticated")
      return { success: false }
    }

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    const { error: saveError } = await saveUserGrade(gradeId)

    if (saveError) {
      setError(saveError.message)
      setSaving(false)
      return { success: false }
    }

    // Reload user grade to get updated data
    const { data: updatedGrade } = await getUserGrade()
    setUserGrade(updatedGrade)

    const selectedGrade = availableGrades.find((g) => g.grade_id === gradeId)
    setSuccessMessage(`Successfully selected Grade ${selectedGrade?.grade}!`)
    setSaving(false)
    return { success: true }
  }

  return {
    availableGrades,
    userGrade,
    loading,
    saving,
    error,
    successMessage,
    selectGrade,
    loadGrades,
  }
}
