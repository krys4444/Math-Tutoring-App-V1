"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookOpen, CheckCircle, FileText, Loader2, ChevronRight, ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { courseService, type Course } from "@/lib/courses-service"
import { unitService, type Unit } from "@/lib/units-services"
import { subunitService, type Subunit } from "@/lib/subunits-service"
import { lessonService, type Lesson } from "@/lib/lessons-service"

// Component to render markdown and LaTeX content with better formatting
function LessonContent({ content }: { content: string }) {
  const processContent = (text: string) => {
    // First, handle display math \[ \] (block level)
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, latex) => {
      return `<div class="my-6 flex justify-center"><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm"><div class="text-blue-900 font-mono text-lg text-center">${latex.trim()}</div><div class="text-xs text-blue-600 text-center mt-2">Mathematical Expression</div></div></div>`
    })

    // Handle inline math $$ $$
    text = text.replace(/\\$$(.*?)\\$$/g, (match, latex) => {
      return `<span class="inline-block bg-blue-50 border border-blue-200 rounded px-2 py-1 mx-1 text-blue-900 font-mono text-sm">${latex}</span>`
    })

    // Handle $$ expressions (often used for large headings or emphasis)
    text = text.replace(/\$\$(.*?)\$\$/g, (match, latex) => {
      // Check if it looks like a heading (contains \Large, \textbf, etc.)
      if (latex.includes("\\Large") || latex.includes("\\textbf")) {
        // Extract the actual text content, removing LaTeX commands
        const cleanText = latex
          .replace(/\\Large/g, "")
          .replace(/\\textbf\{(.*?)\}/g, "$1")
          .replace(/\{|\}/g, "")
          .trim()
        return `<h2 class="text-2xl font-bold mt-8 mb-6 text-gray-800 border-b-2 border-purple-300 pb-3">${cleanText}</h2>`
      } else {
        // Regular math expression
        return `<div class="my-6 flex justify-center"><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm"><div class="text-blue-900 font-mono text-lg text-center">${latex}</div><div class="text-xs text-blue-600 text-center mt-2">Mathematical Expression</div></div></div>`
      }
    })

    // Handle images with better styling
    text = text.replace(/!\[(.*?)\]$$(.*?)$$/g, (match, alt, src) => {
      return `<div class="my-8 flex justify-center"><div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-2xl"><img src="${src}" alt="${alt}" class="w-full h-auto rounded" /><div class="text-sm text-gray-600 text-center mt-2 italic">${alt}</div></div></div>`
    })

    // Handle horizontal rules
    text = text.replace(/^---$/gm, '<hr class="my-8 border-t-2 border-gray-300">')

    // Handle headers (regular markdown)
    text = text.replace(
      /^### (.*$)/gm,
      '<h3 class="text-xl font-semibold mt-8 mb-4 text-gray-800 border-b border-gray-200 pb-2">$1</h3>',
    )
    text = text.replace(
      /^## (.*$)/gm,
      '<h2 class="text-2xl font-semibold mt-10 mb-6 text-gray-800 border-b-2 border-purple-200 pb-3">$1</h2>',
    )
    text = text.replace(
      /^# (.*$)/gm,
      '<h1 class="text-3xl font-bold mt-12 mb-8 text-gray-800 border-b-2 border-purple-300 pb-4">$1</h1>',
    )

    // Handle bold and italic
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-gray-900 bg-yellow-50 px-1 rounded">$1</strong>',
    )
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')

    // Handle code blocks
    text = text.replace(
      /```([\s\S]*?)```/g,
      '<div class="my-6"><pre class="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-300 shadow-sm"><code class="text-sm font-mono leading-relaxed">$1</code></pre></div>',
    )

    // Handle inline code
    text = text.replace(
      /`(.*?)`/g,
      '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border">$1</code>',
    )

    // Handle unordered lists with better spacing
    const lines = text.split("\n")
    let inList = false
    const processedLines = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.match(/^\* /)) {
        if (!inList) {
          processedLines.push('<ul class="my-4 space-y-2 ml-6">')
          inList = true
        }
        const content = line.replace(/^\* /, "")
        processedLines.push(`<li class="text-gray-700 list-disc">${content}</li>`)
      } else {
        if (inList) {
          processedLines.push("</ul>")
          inList = false
        }
        processedLines.push(line)
      }
    }

    if (inList) {
      processedLines.push("</ul>")
    }

    text = processedLines.join("\n")

    // Handle blockquotes
    text = text.replace(
      /^> (.*$)/gm,
      '<blockquote class="border-l-4 border-blue-400 bg-blue-50 pl-6 py-4 my-6 italic text-gray-700 rounded-r-lg">$1</blockquote>',
    )

    // Handle paragraphs - split by double newlines
    const paragraphs = text.split(/\n\s*\n/)
    const processedParagraphs = paragraphs.map((para) => {
      para = para.trim()
      if (!para) return ""

      // Don't wrap if it's already HTML (contains < and >)
      if (para.includes("<") && para.includes(">")) {
        return para
      }

      // Handle single line breaks within paragraphs
      para = para.replace(/\n/g, '<br class="mb-1">')

      return `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${para}</p>`
    })

    return processedParagraphs.join("\n")
  }

  const processedContent = processContent(content)

  return (
    <div className="prose prose-lg max-w-none">
      <div className="space-y-4 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: processedContent }} />
    </div>
  )
}

interface LessonWithSubunit extends Lesson {
  subunit_name?: string
  subunit_id?: number
}

export default function ConsolidatedLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id
  const unitId = params.unitId

  const [course, setCourse] = useState<Course | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [subunits, setSubunits] = useState<Subunit[]>([])
  const [allLessons, setAllLessons] = useState<LessonWithSubunit[]>([])
  const [selectedLesson, setSelectedLesson] = useState<LessonWithSubunit | null>(null)
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const toggleSidebar = () => {
    setSidebarMinimized(!sidebarMinimized)
  }

  useEffect(() => {
    const loadUnitAndLessons = async () => {
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
            setSubunits([])
          } else {
            setSubunits(subunitsData || [])

            // Load all lessons for all subunits
            const allLessonsPromises = (subunitsData || []).map(async (subunit) => {
              const { data: lessonsData, error: lessonsError } = await lessonService.getLessonsBySubunitId(
                subunit.sub_unit_id,
              )
              if (lessonsError) {
                console.warn(`Could not load lessons for subunit ${subunit.sub_unit_id}:`, lessonsError.message)
                return []
              }
              // Add subunit info to each lesson
              return (lessonsData || []).map((lesson) => ({
                ...lesson,
                subunit_name: subunit.sub_unit_name,
                subunit_id: subunit.sub_unit_id,
              }))
            })

            const allLessonsArrays = await Promise.all(allLessonsPromises)
            const flattenedLessons = allLessonsArrays.flat()
            setAllLessons(flattenedLessons)

            // Select the first lesson by default
            if (flattenedLessons.length > 0) {
              setSelectedLesson(flattenedLessons[0])
              setSelectedLessonIndex(0)
            }
          }
        } catch (err) {
          setError(`Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`)
        }

        setLoading(false)
      }
    }

    loadUnitAndLessons()
  }, [courseId, unitId])

  const handleLessonSelect = (lesson: LessonWithSubunit, index: number) => {
    setSelectedLesson(lesson)
    setSelectedLessonIndex(index)
  }

  const handlePreviousLesson = () => {
    if (selectedLessonIndex > 0) {
      const newIndex = selectedLessonIndex - 1
      setSelectedLesson(allLessons[newIndex])
      setSelectedLessonIndex(newIndex)
    }
  }

  const handleNextLesson = () => {
    if (selectedLessonIndex < allLessons.length - 1) {
      const newIndex = selectedLessonIndex + 1
      setSelectedLesson(allLessons[newIndex])
      setSelectedLessonIndex(newIndex)
    }
  }

  const handleMarkComplete = () => {
    console.log("Lesson marked as complete")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
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

            {/* Lesson Actions */}
            {selectedLesson && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Lesson {selectedLessonIndex + 1} of {allLessons.length}
                </span>
                <Button onClick={handleMarkComplete} className="bg-green-500 hover:bg-green-600 text-white" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <Alert className="m-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading lessons...</p>
            </div>
          </div>
        ) : selectedLesson && unit && course ? (
          /* Lesson Content */
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Lesson Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>{course.course_name}</span>
                <span>›</span>
                <span>{unit.unit_name}</span>
                <span>›</span>
                <span className="text-gray-800 font-medium">Lesson {selectedLessonIndex + 1}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Lesson {selectedLessonIndex + 1}</h1>
                  <p className="text-gray-600">From: {selectedLesson.subunit_name}</p>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <Card className="mb-6 shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <LessonContent content={selectedLesson.lesson_content} />
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousLesson}
                disabled={selectedLessonIndex === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Lesson
              </Button>

              <Button
                onClick={handleNextLesson}
                disabled={selectedLessonIndex === allLessons.length - 1}
                className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
              >
                Next Lesson
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </main>
        ) : (
          /* No Lessons Available */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Lessons Available</h3>
              <p className="text-gray-600">No lessons are available for this unit yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Lessons List */}
      <div
        className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
          sidebarMinimized ? "w-16" : "w-80"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarMinimized ? (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Lessons</h2>
                <p className="text-sm text-gray-600">{allLessons.length} lessons available</p>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-2">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-2">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-2" />
              {!sidebarMinimized && <p className="text-sm text-gray-600">Loading lessons...</p>}
            </div>
          ) : allLessons.length > 0 ? (
            <div className="p-2">
              {allLessons.map((lesson, index) => (
                <button
                  key={lesson.lesson_id}
                  onClick={() => handleLessonSelect(lesson, index)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    selectedLesson?.lesson_id === lesson.lesson_id
                      ? "bg-purple-100 border-2 border-purple-500"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                  title={sidebarMinimized ? `Lesson ${index + 1}: ${lesson.subunit_name}` : undefined}
                >
                  {sidebarMinimized ? (
                    /* Minimized View - Just lesson number */
                    <div className="flex items-center justify-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          selectedLesson?.lesson_id === lesson.lesson_id
                            ? "bg-purple-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  ) : (
                    /* Expanded View - Full lesson info */
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                          selectedLesson?.lesson_id === lesson.lesson_id
                            ? "bg-purple-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium text-sm mb-1 ${
                            selectedLesson?.lesson_id === lesson.lesson_id ? "text-purple-700" : "text-gray-800"
                          }`}
                        >
                          Lesson {index + 1}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">{lesson.subunit_name}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {lesson.lesson_content.length > 80
                            ? `${lesson.lesson_content.substring(0, 80)}...`
                            : lesson.lesson_content}
                        </p>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              {!sidebarMinimized && <p className="text-sm text-gray-500">No lessons available</p>}
            </div>
          )}
        </div>

        {/* Progress Summary */}
        {allLessons.length > 0 && !sidebarMinimized && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-semibold text-gray-700">0 / {allLessons.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
