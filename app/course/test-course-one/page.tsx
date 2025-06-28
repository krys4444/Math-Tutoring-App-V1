"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookOpen, Clock, Users, Globe, Loader2, AlertCircle } from "lucide-react"
import { getLessonsByTopic, type Lesson } from "@/lib/lessons-service"
import { useAuth } from "@/hooks/use-auth"

export default function TestCourseOne() {
  const { user, loading: authLoading } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch lessons on component mount, but only if user is authenticated
  useEffect(() => {
    const fetchLessons = async () => {
      // Wait for auth to complete
      if (authLoading) return

      // Redirect to login if not authenticated
      if (!user) {
        window.location.href = "/"
        return
      }

      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await getLessonsByTopic("Percentages")

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setLessons(data || [])
      }

      setLoading(false)
    }

    fetchLessons()
  }, [user, authLoading])

  // Function to render markdown content as HTML (basic implementation)
  const renderMarkdown = (markdown: string) => {
    // Basic markdown parsing - you might want to use a proper markdown library like 'marked' or 'react-markdown'
    return markdown
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/\n\n/g, "</p><p>") // Paragraphs
      .replace(/\n/g, "<br>") // Line breaks
      .replace(/^# (.*$)/gm, "<h1>$1</h1>") // H1
      .replace(/^## (.*$)/gm, "<h2>$1</h2>") // H2
      .replace(/^### (.*$)/gm, "<h3>$1</h3>") // H3
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect message if not authenticated (shouldn't show due to redirect above)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access this course.</p>
          <Button onClick={() => (window.location.href = "/")}>Go to Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/dashboard")}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">MathTutor</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-medium text-sm">
                {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Test Course One</h1>
              <p className="text-lg text-gray-600 mb-6">
                A comprehensive introduction to fundamental mathematical concepts and problem-solving techniques.
              </p>
            </div>

            {/* Lessons Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Percentages Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                      <p className="text-gray-600">Loading lesson content...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="text-red-800">
                      Error loading lessons: {error}
                      <br />
                      <span className="text-sm">
                        Make sure you have the 'lessons' table set up in Supabase and proper RLS policies.
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                {!loading && !error && lessons.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Lessons Found</h3>
                    <p className="text-gray-600 mb-4">
                      No lessons found for the topic "Percentages". Please check your database.
                    </p>
                    <Button variant="outline" onClick={() => window.open("https://supabase.com/dashboard", "_blank")}>
                      Open Supabase Dashboard
                    </Button>
                  </div>
                )}

                {!loading && !error && lessons.length > 0 && (
                  <div className="space-y-6">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm font-medium">
                            Lesson {lesson.order_index || index + 1}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-800">{lesson.title || lesson.topic}</h3>
                        </div>
                        {lesson.description && <p className="text-gray-600 mb-4">{lesson.description}</p>}
                        <div
                          className="prose prose-gray max-w-none lesson-content"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(lesson.body_md),
                          }}
                        />
                        {lesson.created_at && (
                          <p className="text-sm text-gray-500 mt-4">
                            Created: {new Date(lesson.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Course Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Lessons Available</span>
                        <span>{lessons.length} lessons</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                      {lessons.length > 0 ? "Continue Learning" : "Start Course"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Duration</p>
                        <p className="text-sm text-gray-600">6 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Lessons</p>
                        <p className="text-sm text-gray-600">{lessons.length} lessons</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Level</p>
                        <p className="text-sm text-gray-600">Beginner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Language</p>
                        <p className="text-sm text-gray-600">English</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Understanding percentage concepts and calculations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Real-world applications of percentages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Problem-solving techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Mathematical reasoning and logic</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .lesson-content h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0;
          color: #1f2937;
        }
        .lesson-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0;
          color: #374151;
        }
        .lesson-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.5rem 0;
          color: #4b5563;
        }
        .lesson-content p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}
