"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookOpen, CheckCircle, Clock, FileText, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { courseService, type Course } from "@/lib/courses-service"
import { unitService, type Unit } from "@/lib/units-services"
import { subunitService, type Subunit } from "@/lib/subunits-service"
import { lessonService, type Lesson } from "@/lib/lessons-service"

// Component to render markdown and LaTeX content
function LessonContent({ content }: { content: string }) {
  // Process the content to handle both markdown and LaTeX
  const processContent = (text: string) => {
    // Split content by LaTeX expressions ($$...$$)
    const parts = text.split(/(\$\$[^$]+\$\$)/g)

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        // This is a LaTeX expression
        const latex = part.slice(2, -2) // Remove $$ from both ends
        return (
          <div key={index} className="my-4 text-center">
            <span className="inline-block p-2 bg-blue-50 rounded border text-blue-800 font-mono">{latex}</span>
          </div>
        )
      } else {
        // This is regular text/markdown - process basic markdown
        return (
          <div key={index} className="whitespace-pre-wrap">
            {processMarkdown(part)}
          </div>
        )
      }
    })
  }

  // Basic markdown processing
  const processMarkdown = (text: string) => {
    // Handle headers
    text = text.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800">$1</h3>')
    text = text.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4 text-gray-800">$1</h2>')
    text = text.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-800">$1</h1>')

    // Handle bold and italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Handle code blocks
    text = text.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm">$1</code></pre>',
    )
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')

    // Handle line breaks
    text = text.replace(/\n\n/g, '</p><p class="mb-4">')
    text = text.replace(/\n/g, "<br>")

    // Wrap in paragraph tags
    if (text.trim()) {
      text = '<p class="mb-4">' + text + "</p>"
    }

    return <div dangerouslySetInnerHTML={{ __html: text }} />
  }

  return <div className="prose prose-lg max-w-none">{processContent(content)}</div>
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id
  const unitId = params.unitId
  const subunitId = params.subunitId
  const lessonId = params.lessonId

  const [course, setCourse] = useState<Course | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [subunit, setSubunit] = useState<Subunit | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLessonData = async () => {
      if (courseId && unitId && subunitId && lessonId) {
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

          // Load lesson details
          const { data: lessonData, error: lessonError } = await lessonService.getLessonById(Number(lessonId))
          if (lessonError) {
            setError(`Failed to load lesson: ${lessonError.message}`)
            setLoading(false)
            return
          }
          setLesson(lessonData)
        } catch (err) {
          setError(`Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`)
        }

        setLoading(false)
      }
    }

    loadLessonData()
  }, [courseId, unitId, subunitId, lessonId])

  const handleMarkComplete = () => {
    // TODO: Implement lesson completion logic
    console.log("Lesson marked as complete")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/course/${courseId}/unit/${unitId}/subunit/${subunitId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Subunit
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">MathTutor</span>
            </div>
          </div>

          {/* Lesson Actions */}
          {lesson && (
            <div className="flex items-center gap-3">
              <Button onClick={handleMarkComplete} className="bg-green-500 hover:bg-green-600 text-white" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
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
              <p className="text-gray-600">Loading lesson...</p>
            </div>
          </div>
        ) : lesson && subunit && unit && course ? (
          <>
            {/* Lesson Header */}
            <div className="mb-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>{course.course_name}</span>
                <span>›</span>
                <span>{unit.unit_name}</span>
                <span>›</span>
                <span>{subunit.sub_unit_name}</span>
                <span>›</span>
                <span className="text-gray-800 font-medium">Lesson {lessonId}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Lesson {lessonId}</h1>
                  <p className="text-gray-600">From: {subunit.sub_unit_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Lesson ID: {lesson.lesson_id}</span>
                <span>•</span>
                <span>Content Length: {lesson.lesson_content.length} characters</span>
                <span>•</span>
                <span>Sub-unit: {subunit.sub_unit_name}</span>
              </div>
            </div>

            {/* Lesson Content */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <BookOpen className="w-5 h-5" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <LessonContent content={lesson.lesson_content} />
              </CardContent>
            </Card>

            {/* Lesson Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => router.push(`/course/${courseId}/unit/${unitId}/subunit/${subunitId}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Lessons
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Navigate to previous lesson
                    console.log("Previous lesson")
                  }}
                >
                  Previous Lesson
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Navigate to next lesson
                    console.log("Next lesson")
                  }}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Next Lesson
                </Button>
              </div>
            </div>

            {/* Lesson Info Card */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-5 h-5" />
                  Lesson Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Course:</span>
                    <p className="text-blue-600">{course.course_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Unit:</span>
                    <p className="text-blue-600">{unit.unit_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Sub-unit:</span>
                    <p className="text-blue-600">{subunit.sub_unit_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Lesson Not Found */
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Lesson Not Found</h3>
              <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist or has been removed.</p>
              <Button
                onClick={() => router.push(`/course/${courseId}/unit/${unitId}/subunit/${subunitId}`)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Back to Subunit
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
