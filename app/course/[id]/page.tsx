"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookOpen, Clock, Users, Star, CheckCircle, Lock, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { courseService, type Course } from "@/lib/courses-service"
import { unitService, type Unit } from "@/lib/units-services"

export default function CoursePage() {
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
            console.warn("Could not load units:", unitsError.message)
            // Don't set error for units, just continue without them
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
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
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
              <p className="text-gray-600">Loading course...</p>
            </div>
          </div>
        ) : course ? (
          <>
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{course.course_name}</h1>
                  <p className="text-gray-600">{course.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Grade {course.grade_id}</span>
                <span>•</span>
                <span>{course.duration_weeks} weeks</span>
                <span>•</span>
                <span>{course.difficulty_level}</span>
                {course.course_code && (
                  <>
                    <span>•</span>
                    <span>{course.course_code}</span>
                  </>
                )}
              </div>
            </div>

            {/* Course Units Section */}
            {units.length > 0 ? (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Course Units ({units.length})</h2>
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
                                {index + 1}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800">{unit.unit_name}</h3>
                            </div>
                            <p className="text-gray-600 mb-3">{unit.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Unit {index + 1}</span>
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

                {/* Course Progress Summary */}
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
              </div>
            ) : (
              /* No Units Available */
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Course Units</h2>
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No units available for this course yet</p>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Preview Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <BookOpen className="w-5 h-5" />
                    Interactive Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-600">
                    Engaging video lessons with interactive exercises and real-time feedback to help you master
                    mathematical concepts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Clock className="w-5 h-5" />
                    Progress Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600">
                    Track your learning progress with detailed analytics and personalized recommendations for
                    improvement.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Users className="w-5 h-5" />
                    AI Tutoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-600">
                    Get instant help from our AI tutor that adapts to your learning style and provides personalized
                    explanations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Star className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-600">
                    Earn badges and certificates as you complete lessons and demonstrate mastery of mathematical
                    concepts.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                {units.length > 0
                  ? "Ready to start learning? Click on any unit above to begin!"
                  : "Course content is being prepared. Check back soon for exciting lessons!"}
              </p>
              <Button onClick={() => router.back()} className="bg-purple-500 hover:bg-purple-600 px-8 py-3">
                Back to My Courses
              </Button>
            </div>
          </>
        ) : (
          /* Course Not Found */
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Course Not Found</h3>
              <p className="text-gray-600 mb-4">The course you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => router.back()} className="bg-purple-500 hover:bg-purple-600">
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
