"use client"

import { useState, useEffect } from "react"
import { saveUserInterests, loadUserInterests, type Interest } from "@/lib/interests-service"
import { useAuth } from "./use-auth"

export function useInterests() {
  const { user } = useAuth()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load interests when user is available
  useEffect(() => {
    if (user) {
      loadInterests()
    } else {
      setSelectedInterests([])
      setLoading(false)
    }
  }, [user])

  const loadInterests = async () => {
    setLoading(true)
    setError(null)

    const { data, error: loadError } = await loadUserInterests()

    if (loadError) {
      setError(loadError.message)
    } else {
      setSelectedInterests(data || [])
    }

    setLoading(false)
  }

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    )
    // Clear any previous messages when user makes changes
    setError(null)
    setSuccessMessage(null)
  }

  const saveInterests = async (availableInterests: Interest[]) => {
    if (!user) {
      setError("User not authenticated")
      return { success: false }
    }

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    // Get full interest objects for selected interests
    const interestsToSave = availableInterests.filter((interest) => selectedInterests.includes(interest.id))

    const { error: saveError } = await saveUserInterests(interestsToSave)

    if (saveError) {
      setError(saveError.message)
      setSaving(false)
      return { success: false }
    }

    setSuccessMessage(`Successfully saved ${interestsToSave.length} interests!`)
    setSaving(false)
    return { success: true }
  }

  const clearAllInterests = () => {
    setSelectedInterests([])
    setError(null)
    setSuccessMessage(null)
  }

  return {
    selectedInterests,
    loading,
    saving,
    error,
    successMessage,
    toggleInterest,
    saveInterests,
    clearAllInterests,
    loadInterests,
  }
}
