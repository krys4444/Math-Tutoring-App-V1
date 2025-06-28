"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, GraduationCap, CheckCircle } from "lucide-react"
import { gradeService, type Grade } from "@/lib/grade-service"

interface GradeSelectorDialogProps {
  onGradeUpdated?: () => void
}

export function GradeSelectorDialog({ onGradeUpdated }: GradeSelectorDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [currentUserGrade, setCurrentUserGrade] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
        setError("Failed to load grades")
        return
      }
      setGrades(gradesData || [])

      // Load current user grade
      const { data: userGradeData, error: userGradeError } = await gradeService.getUserGrade()
      if (userGradeError && !userGradeError.message.includes("No rows")) {
        console.warn("Could not load current grade:", userGradeError)
      }

      setCurrentUserGrade(userGradeData)
      if (userGradeData?.grade_id) {
        setSelectedGrade(userGradeData.grade_id.toString())
      }
    } catch (err) {
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedGrade) {
      setError("Please select a grade")
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: saveError } = await gradeService.saveUserGrade(Number.parseInt(selectedGrade))

      if (saveError) {
        setError(saveError.message || "Failed to save grade")
        return
      }

      setSuccess("Grade updated successfully!")

      // Reload current grade data
      const { data: updatedGrade } = await gradeService.getUserGrade()
      setCurrentUserGrade(updatedGrade)

      // Notify parent component
      onGradeUpdated?.()

      // Close dialog after a short delay
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(null)
      }, 1500)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    setSuccess(null)
    setSelectedGrade("")
  }

  const getCurrentGradeName = () => {
    if (!currentUserGrade?.grade_id) return "Not set"
    const grade = grades.find((g) => g.id === currentUserGrade.grade_id)
    return grade?.grade_name || "Unknown"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <GraduationCap className="w-4 h-4" />
          Update Grade Level
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Select Your Grade Level
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Grade Display */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">Current Grade:</Label>
            <p className="text-lg font-semibold text-gray-900">{getCurrentGradeName()}</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </div>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading grades...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Grade Selection */}
              <div className="space-y-2">
                <Label htmlFor="grade">Select New Grade Level</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade} disabled={saving}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{grade.grade_name}</span>
                          {grade.description && <span className="text-xs text-gray-500">{grade.description}</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={!selectedGrade || saving}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Grade"
                  )}
                </Button>
                <Button variant="outline" onClick={handleClose} disabled={saving} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
