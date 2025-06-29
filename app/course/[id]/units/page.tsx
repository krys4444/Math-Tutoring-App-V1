"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookOpen, CheckCircle, Lock, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { courseService, type Course } from "@/lib/courses-service"
import { unitService, type Unit } from "@/lib/units-services"

export default function UnitsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id

  const [course, setCourse] = useState<Course | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCourseAndUnits = async () => {
      if (courseId) {
        setLoading(true)
        setError(null)

        try {
          // Load course details
          const { data: courseData, error: courseError } = await courseService.getCourseById(Number(courseId))

          if (courseError) {
            setError(`Failed to load course: ${courseError.message}`)
            setLoading(false)
            return
          }

          setCourse(courseData)

          // Load units for this course
          const { data: unitsData, error: unitsError } = await unitService.getUnitsByCourseId(Number(courseId))

          if (unitsError) {
            setError(`Failed to load units: ${unitsError.message}`)
          } else {
            setUnits(unitsData || [])
          }
        } catch (err) {
          setError(`Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`)
        }

        setLoading(false)
      }
    }

    loadCourseAndUnits()
  }, [courseId])

  const handleUnitClick = (unit: Unit) => {
    // Navigate to unit detail page (you can create this later)
    router.push(`/course/${courseId}/unit/${unit.unit_id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/course/${courseId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">MathTutor</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Course Header */}
        {course && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{course.course_name}</h1>
                <p className="text-gray-600">Course Units</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Grade {course.grade_id}</span>
              <span>•</span>
              <span>{course.duration_weeks} weeks</span>
              <span>•</span>
              <span>{course.difficulty_level}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading course units...</p>
            </div>
          </div>
        ) : units.length > 0 ? (
          /* Units List */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Course Units ({units.length})</h2>
              <div className="text-sm text-gray-500">Click on a unit to start learning</div>
            </div>

            <div className="grid gap-4">
              {units.map((unit, index) => (
                <Card
                  key={unit.unit_id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500"
                  onClick={() => handleUnitClick(unit)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                            {unit.order || index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">{unit.unit_name}</h3>
                        </div>
                        <p className="text-gray-600 mb-3">{unit.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Unit {unit.order || index + 1}</span>
                          <span>•</span>
                          <span>Course ID: {unit.course_id}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 ml-4">
                        {/* Status indicator - you can customize this based on user progress */}
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-500">Locked</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* No Units State */
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Units Available</h3>
              <p className="text-gray-600 mb-4">This course doesn't have any units yet. Check back later!</p>
              <Button onClick={() => router.push(`/course/${courseId}`)} className="bg-purple-500 hover:bg-purple-600">
                Back to Course
              </Button>
            </div>
          </div>
        )}

        {/* Course Progress Summary (if units exist) */}
        {units.length > 0 && (
          <Card className="mt-8 bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <CheckCircle className="w-5 h-5" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-600">Units Completed</span>
                <span className="text-sm font-semibold text-purple-700">0 / {units.length}</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
              <p className="text-xs text-purple-600 mt-2">Complete all units to finish this course</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
