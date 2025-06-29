"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookOpen, CheckCircle, Lock, Loader2, Play, FileText, Video, Headphones } from "lucide-react"
import { useState, useEffect } from "react"
import { courseService, type Course } from "@/lib/courses-service"
import { unitService, type Unit } from "@/lib/units-services"
import { subunitService, type Subunit } from "@/lib/subunits-service"

export default function UnitPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id
  const unitId = params.unitId

  const [course, setCourse] = useState<Course | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [subunits, setSubunits] = useState<Subunit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUnitAndSubunits = async () => {
      if (courseId && unitId) {
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

          // Load subunits for this unit
          const { data: subunitsData, error: subunitsError } = await subunitService.getSubunitsByUnitId(Number(unitId))
          if (subunitsError) {
            console.warn("Could not load subunits:", subunitsError.message)
            // Don't set error for subunits, just continue without them
          } else {
            setSubunits(subunitsData || [])
          }
        } catch (err) {
          setError(`Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`)
        }

        setLoading(false)
      }
    }

    loadUnitAndSubunits()
  }, [courseId, unitId])

  const handleSubunitClick = (subunit: Subunit) => {
    // Navigate to subunit detail page (you can create this later)
    router.push(`/course/${courseId}/unit/${unitId}/subunit/${subunit.subunit_id}`)
  }

  const getContentIcon = (contentType: string) => {
    switch (contentType.toLowerCase()) {
      case "video":
        return <Video className="w-5 h-5" />
      case "audio":
        return <Headphones className="w-5 h-5" />
      case "text":
      case "reading":
        return <FileText className="w-5 h-5" />
      default:
        return <Play className="w-5 h-5" />
    }
  }

  const getContentColor = (contentType: string) => {
    switch (contentType.toLowerCase()) {
      case "video":
        return "text-red-600 bg-red-100"
      case "audio":
        return "text-green-600 bg-green-100"
      case "text":
      case "reading":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-purple-600 bg-purple-100"
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
              <p className="text-gray-600">Loading unit...</p>
            </div>
          </div>
        ) : unit && course ? (
          <>
            {/* Unit Header */}
            <div className="mb-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>{course.course_name}</span>
                <span>›</span>
                <span className="text-gray-800 font-medium">{unit.unit_name}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{unit.unit_name}</h1>
                  <p className="text-gray-600">{unit.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Unit {unit.order}</span>
                <span>•</span>
                <span>Course: {course.course_name}</span>
              </div>
            </div>

            {/* Unit Subunits Section */}
            {subunits.length > 0 ? (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Unit Content ({subunits.length} items)</h2>
                  <div className="text-sm text-gray-500">Click on any item to start learning</div>
                </div>

                <div className="grid gap-4">
                  {subunits.map((subunit, index) => (
                    <Card
                      key={subunit.subunit_id}
                      className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                      onClick={() => handleSubunitClick(subunit)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                                {subunit.order}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800">{subunit.subunit_name}</h3>
                              <div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getContentColor(subunit.content_type)}`}
                              >
                                {getContentIcon(subunit.content_type)}
                                <span className="capitalize">{subunit.content_type}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-3">{subunit.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Item {subunit.order}</span>
                              {subunit.estimated_duration_minutes && (
                                <>
                                  <span>•</span>
                                  <span>{subunit.estimated_duration_minutes} min</span>
                                </>
                              )}
                              <span>•</span>
                              <span>Unit ID: {subunit.unit_id}</span>
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

                {/* Unit Progress Summary */}
                <Card className="mt-8 bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <CheckCircle className="w-5 h-5" />
                      Unit Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600">Items Completed</span>
                      <span className="text-sm font-semibold text-blue-700">0 / {subunits.length}</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">Complete all items to finish this unit</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* No Subunits Available */
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Unit Content</h2>
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No content available for this unit yet</p>
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                {subunits.length > 0
                  ? "Ready to start learning? Click on any content item above to begin!"
                  : "Unit content is being prepared. Check back soon for exciting lessons!"}
              </p>
              <Button
                onClick={() => router.push(`/course/${courseId}`)}
                className="bg-purple-500 hover:bg-purple-600 px-8 py-3"
              >
                Back to Course
              </Button>
            </div>
          </>
        ) : (
          /* Unit Not Found */
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Unit Not Found</h3>
              <p className="text-gray-600 mb-4">The unit you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => router.push(`/course/${courseId}`)} className="bg-purple-500 hover:bg-purple-600">
                Back to Course
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
