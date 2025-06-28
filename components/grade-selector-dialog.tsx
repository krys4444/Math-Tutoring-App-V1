"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, GraduationCap, CheckCircle } from "lucide-react"
import { gradeService, type Grade } from "@/lib/grades-service"
import { useAuth } from "@/hooks/use-auth"

interface GradeSelectorDialogProps {
  onGradeSelected?: (grade: Grade) => void
}

export function GradeSelectorDialog({ onGradeSelected }: GradeSelectorDialogProps) {
  const { user, loading: authLoading } = useAuth() // Get loading state too
  const [isOpen, setIsOpen] = useState(false)
  const [grades, setGrades] = useState<Grade[]>([])
  const [currentGrade, setCurrentGrade] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Debug logging
  useEffect(() => {
    console.log("Auth loading:", authLoading)
    console.log("User object:", user)
    console.log("User type:", typeof user)
    console.log("User keys:", user ? Object.keys(user) : "No user")
  }, [user, authLoading])

  // Load grades and current user grade when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load available grades
      const { data: gradesData, error: gradesError } = await gradeService.getGrades()
      if (gradesError) {
        setError(`Failed to load grades: ${gradesError.message}`)
        return
      }
      setGrades(gradesData || [])

      // Load current user grade
      const { data: currentGradeData, error: currentGradeError } = await gradeService.getUserGrade()
      if (currentGradeError && !currentGradeError.message.includes("No rows")) {
        console.warn("Could not load current grade:", currentGradeError.message)
      } else if (currentGradeData) {
        setCurrentGrade(currentGradeData)
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGradeSelect = async (grade: Grade) => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    const { data, error: saveError } = await gradeService.saveUserGrade(grade.grade_id)

    if (saveError) {
      setError(`Failed to save grade: ${saveError.message}`)
    } else {
      setSuccessMessage(`Successfully selected ${grade.grade}!`)
      setCurrentGrade({ ...data, grades: grade })
      onGradeSelected?.(grade)

      // Close dialog after a short delay
      setTimeout(() => {
        setIsOpen(false)
        setSuccessMessage(null)
      }, 1500)
    }

    setSaving(false)
  }

  return (
    <>
      <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={() => setIsOpen(true)}>
        <GraduationCap className="w-4 h-4" />
        {currentGrade?.grades?.grade_name || "Select Grade"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              Select Your Grade Level
            </DialogTitle>
            <div className="text-xs text-gray-500 mt-2 whitespace-pre-wrap max-h-40 overflow-y-auto bg-gray-100 p-2 rounded">
              Debug Info:
              {"\n"}Auth Loading: {authLoading ? "true" : "false"}
              {"\n"}User Exists: {user ? "true" : "false"}
              {"\n"}User Type: {typeof user}
              {"\n"}User Object: {user ? JSON.stringify(user, null, 2) : "No user found"}
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Grade Display */}
            {currentGrade?.grades && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Current Grade</span>
                </div>
                <p className="text-purple-700 font-semibold">{currentGrade.grades.grade_name}</p>
                {currentGrade.grades.description && (
                  <p className="text-sm text-purple-600 mt-1">{currentGrade.grades.description}</p>
                )}
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600">Loading grade options...</p>
                </div>
              </div>
            ) : (
              /* Grade Options */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {grades.map((grade) => {
                  const isSelected = currentGrade?.grades?.id === grade.grade_id
                  return (
                    <Card
                      key={grade.grade_id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CardContent className="p-4">
                        <button
                          onClick={() => handleGradeSelect(grade)}
                          disabled={saving || isSelected}
                          className="w-full text-left disabled:cursor-not-allowed"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`font-semibold mb-1 ${isSelected ? "text-purple-700" : "text-gray-800"}`}>
                                {grade.grade}
                              </h3>
                              {grade.description && <p className="text-sm text-gray-600">{grade.description}</p>}
                              <p className="text-xs text-gray-500 mt-1">Level {grade.grade}</p>
                            </div>
                            {isSelected && <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 ml-2" />}
                          </div>
                        </button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {!loading && grades.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No grade options available</p>
              </div>
            )}

            {saving && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500 mr-2" />
                <span className="text-gray-600">Saving your selection...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
