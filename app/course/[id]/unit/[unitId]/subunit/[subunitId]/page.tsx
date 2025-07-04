"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Lock,
  Loader2,
  Play,
  FileText,
  Video,
  Headphones,
  Clock,
  Target,
} from "lucide-react"
import { useState, useEffect } from "react"
import { courseService, type Course } from "@/lib/courses-service"
import { unitService, type Unit } from "@/lib/units-services"
import { subunitService, type Subunit } from "@/lib/subunits-service"
import { lessonService, type Lesson } from "@/lib/lessons-service"

export default function SubunitPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id
  const unitId = params.unitId
  const subunitId = params.subunitId

  const [course, setCourse] = useState<Course | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [subunit, setSubunit] = useState<Subunit | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSubunitAndLessons = async () => {
      if (courseId && unitId && subunitId) {
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

          // Load unit details
          const { data: unitData, error: unitError } = await unitService.getUnitById(Number(unitId))
          if (unitError) {
            setError(`Failed to load unit: ${unitError.message}`)
            setLoading(false)
            return
          }
          setUnit(unitData)

          // Load subunit details
          const { data: subunitData, error: subunitError } = await subunitService.getSubunitById(Number(subunitId))
          if (subunitError) {
            setError(`Failed to load subunit: ${subunitError.message}`)
            setLoading(false)
            return
          }
          setSubunit(subunitData)

          // Load lessons for this subunit
          const { data: lessonsData, error: lessonsError } = await lessonService.getLessonsBySubunitId(
            Number(subunitId),
          )
          if (lessonsError) {
            console.warn("Could not load lessons:", lessonsError.message)
            // Don't set error for lessons, just continue without them
          } else {
            setLessons(lessonsData || [])
          }
        } catch (err) {
          setError(`Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`)
        }

        setLoading(false)
      }
    }

    loadSubunitAndLessons()
  }, [courseId, unitId, subunitId])

  const handleLessonClick = (lesson: Lesson) => {
    // Navigate to lesson detail page (you can create this later)
    router.push(`/course/${courseId}/unit/${unitId}/subunit/${subunitId}/lesson/${lesson.lesson_id}`)
  }

  const getContentIcon = (contentType: string | null | undefined) => {
    if (!contentType) return <Play className="w-5 h-5" />

    switch (contentType.toLowerCase()) {
      case "video":
        return <Video className="w-5 h-5" />
      case "audio":
        return <Headphones className="w-5 h-5" />
      case "text":
      case "reading":
        return <FileText className="w-5 h-5" />
      case "interactive":
      case "exercise":
        return <Target className="w-5 h-5" />
      default:
        return <Play className="w-5 h-5" />
    }
  }

  const getContentColor = (contentType: string | null | undefined) => {
    if (!contentType) return "text-purple-600 bg-purple-100"

    switch (contentType.toLowerCase()) {
      case "video":
        return "text-red-600 bg-red-100"
      case "audio":
        return "text-green-600 bg-green-100"
      case "text":
      case "reading":
        return "text-blue-600 bg-blue-100"
      case "interactive":
      case "exercise":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-purple-600 bg-purple-100"
    }
  }

  const getDifficultyColor = (difficulty: string | null | undefined) => {
    if (!difficulty) return "text-gray-600 bg-gray-100"

    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "easy":
        return "text-green-600 bg-green-100"
      case "intermediate":
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "advanced":
      case "hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
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
              onClick={() => router.push(`/course/${courseId}/unit/${unitId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Unit
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
              <p className="text-gray-600">Loading subunit...</p>
            </div>
          </div>
        ) : subunit && unit && course ? (
          <>
            {/* Subunit Header */}
            <div className="mb-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>{course.course_name}</span>
                <span>›</span>
                <span>{unit.unit_name}</span>
                <span>›</span>
                <span className="text-gray-800 font-medium">{subunit.subunit_name}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{subunit.sub_unit_name}</h1>
                  <p className="text-gray-600">{subunit.sub_unit_description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Subunit</span>
                <span>•</span>
                <span>Unit: {unit.unit_name}</span>
              </div>
            </div>

            {/* Subunit Lessons Section */}
            {lessons.length > 0 ? (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Lessons ({lessons.length})</h2>
                  <div className="text-sm text-gray-500">Click on any lesson to start learning</div>
                </div>

                <div className="grid gap-4">
                  {lessons.map((lesson, index) => (
                    <Card
                      key={lesson.lesson_id}
                      className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500"
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                                {lesson.order}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800">{lesson.lesson_name}</h3>
                              <div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getContentColor(lesson.content_type)}`}
                              >
                                {getContentIcon(lesson.content_type)}
                                <span className="capitalize">{lesson.content_type || "Lesson"}</span>
                              </div>
                              {lesson.difficulty_level && (
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty_level)}`}
                                >
                                  {lesson.difficulty_level}
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{lesson.description}</p>

                            {/* Learning Objectives */}
                            {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                              <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Learning Objectives:</h4>
                                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                                  {lesson.learning_objectives.map((objective, idx) => (
                                    <li key={idx}>{objective}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Lesson {lesson.order}</span>
                              {lesson.estimated_duration_minutes && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{lesson.estimated_duration_minutes} min</span>
                                  </div>
                                </>
                              )}
                              <span>•</span>
                              <span>Subunit ID: {lesson.subunit_id}</span>
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

                {/* Subunit Progress Summary */}
                <Card className="mt-8 bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      Subunit Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-600">Lessons Completed</span>
                      <span className="text-sm font-semibold text-green-700">0 / {lessons.length}</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">Complete all lessons to finish this subunit</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* No Lessons Available */
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lessons</h2>
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No lessons available for this subunit yet</p>
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                {lessons.length > 0
                  ? "Ready to start learning? Click on any lesson above to begin!"
                  : "Lesson content is being prepared. Check back soon for exciting lessons!"}
              </p>
              <Button
                onClick={() => router.push(`/course/${courseId}/unit/${unitId}`)}
                className="bg-purple-500 hover:bg-purple-600 px-8 py-3"
              >
                Back to Unit
              </Button>
            </div>
          </>
        ) : (
          /* Subunit Not Found */
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Subunit Not Found</h3>
              <p className="text-gray-600 mb-4">The subunit you're looking for doesn't exist or has been removed.</p>
              <Button
                onClick={() => router.push(`/course/${courseId}/unit/${unitId}`)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Back to Unit
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
