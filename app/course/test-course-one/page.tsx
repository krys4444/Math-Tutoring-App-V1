"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookOpen, Clock, Users, Globe, Loader2, AlertCircle } from "lucide-react"
import { getLessonsByTopic, type Lesson } from "@/lib/lessons-service"
import { useAuth } from "@/hooks/use-auth"

// Helper function to format duration
const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}m`
}

export default function TestCourseOne() {
  const { user, loading: authLoading } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load MathJax when component mounts
  useEffect(() => {
    // Load MathJax script
    const script = document.createElement("script")
    script.src = "https://polyfill.io/v3/polyfill.min.js?features=es6"
    document.head.appendChild(script)

    const mathJaxScript = document.createElement("script")
    mathJaxScript.id = "MathJax-script"
    mathJaxScript.async = true
    mathJaxScript.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
    document.head.appendChild(mathJaxScript)

    // Configure MathJax
    window.MathJax = {
      tex: {
        inlineMath: [["$", "$"]],
        displayMath: [["$$", "$$"]],
        processEscapes: true,
        processEnvironments: true,
      },
      options: {
        skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
      },
    }

    return () => {
      // Cleanup scripts on unmount
      const existingScript = document.getElementById("MathJax-script")
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  // Re-render MathJax when lessons change
  useEffect(() => {
    if (lessons.length > 0 && window.MathJax) {
      window.MathJax.typesetPromise().catch((err) => console.log("MathJax error:", err))
    }
  }, [lessons])

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

  // Enhanced markdown renderer with LaTeX support
  const renderMarkdown = (markdown: string) => {
    return (
      markdown
        // Headers
        .replace(/^# (.*$)/gm, '<h1 class="lesson-h1">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="lesson-h2">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="lesson-h3">$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4 class="lesson-h4">$1</h4>')

        // Bold and Italic
        .replace(/\*\*(.*?)\*\*/g, '<strong class="lesson-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="lesson-italic">$1</em>')

        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre class="lesson-code-block"><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code class="lesson-inline-code">$1</code>')

        // Lists
        .replace(/^- (.*$)/gm, '<li class="lesson-list-item">$1</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li class="lesson-numbered-item">$2</li>')

        // Blockquotes
        .replace(/^> (.*$)/gm, '<blockquote class="lesson-blockquote">$1</blockquote>')

        // LaTeX Math - Keep $$ and $ intact for MathJax processing
        // Don't modify LaTeX expressions, let MathJax handle them

        // Line breaks and paragraphs
        .replace(/\n\n/g, '</p><p class="lesson-paragraph">')
        .replace(/\n/g, "<br>")

        // Wrap in paragraph if doesn't start with heading
        .replace(/^(?!<h[1-6]|<ul|<ol|<blockquote)/, '<p class="lesson-paragraph">')
    )
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

  // Redirect message if not authenticated
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
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-3">
            {/* Course Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white mb-6">
                <h1 className="text-4xl font-bold mb-4">Test Course One</h1>
                <p className="text-xl opacity-90">
                  A comprehensive introduction to fundamental mathematical concepts and problem-solving techniques.
                </p>
                <div className="flex items-center gap-6 mt-6 text-sm opacity-80">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {lessons.length} Lessons
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {lessons.length > 0 && lessons.some((l) => l.duration_minutes)
                      ? formatDuration(lessons.reduce((total, lesson) => total + (lesson.duration_minutes || 0), 0))
                      : "6 Hours"}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Beginner Level
                  </span>
                </div>
              </div>
            </div>

            {/* Lessons Content */}
            <div className="space-y-8">
              {loading && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-6" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading lesson content...</h3>
                      <p className="text-gray-600">Please wait while we fetch your lessons</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50 shadow-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Error loading lessons:</strong> {error}
                    <br />
                    <span className="text-sm mt-2 block">
                      Make sure you have the 'lessons' table set up in Supabase and proper RLS policies.
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              {!loading && !error && lessons.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No Lessons Found</h3>
                    <p className="text-gray-600 mb-6">
                      No lessons found for the topic "Percentages". Please check your database.
                    </p>
                    <Button variant="outline" onClick={() => window.open("https://supabase.com/dashboard", "_blank")}>
                      Open Supabase Dashboard
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!loading && !error && lessons.length > 0 && (
                <div className="space-y-8">
                  {lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="border-0 shadow-lg overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{lesson.order_index || index + 1}</span>
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-gray-800">{lesson.title || lesson.topic}</CardTitle>
                            {lesson.duration_minutes && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDuration(lesson.duration_minutes)}</span>
                              </div>
                            )}
                            {lesson.description && <p className="text-gray-600 mt-2">{lesson.description}</p>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div
                          className="lesson-content"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(lesson.body_md),
                          }}
                        />
                        {lesson.created_at && (
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                              📅 Created:{" "}
                              {new Date(lesson.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Course Progress */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Course Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>Lessons Available</span>
                        <span className="font-semibold">{lessons.length} lessons</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">0% Complete</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3">
                      {lessons.length > 0 ? "Continue Learning" : "Start Course"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Course Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-800">Duration</p>
                        <p className="text-sm text-gray-600">
                          {lessons.length > 0 && lessons.some((l) => l.duration_minutes)
                            ? `${formatDuration(lessons.reduce((total, lesson) => total + (lesson.duration_minutes || 0), 0))} total`
                            : "6 hours total"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">Lessons</p>
                        <p className="text-sm text-gray-600">{lessons.length} interactive lessons</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-800">Level</p>
                        <p className="text-sm text-gray-600">Beginner friendly</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-800">Language</p>
                        <p className="text-sm text-gray-600">English</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Objectives */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Understanding percentage concepts and calculations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Real-world applications of percentages</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Problem-solving techniques and strategies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Mathematical reasoning and logical thinking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced CSS Styles */}
      <style jsx>{`
        .lesson-content {
          line-height: 1.8;
          color: #374151;
        }
        
        .lesson-h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          color: #1f2937;
          border-bottom: 3px solid #8b5cf6;
          padding-bottom: 0.5rem;
        }
        
        .lesson-h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
          color: #374151;
          position: relative;
          padding-left: 1rem;
        }
        
        .lesson-h2::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.25rem;
          width: 4px;
          height: 1.5rem;
          background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
          border-radius: 2px;
        }
        
        .lesson-h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          color: #4b5563;
        }
        
        .lesson-h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem 0;
          color: #6b7280;
        }
        
        .lesson-paragraph {
          margin: 1rem 0;
          line-height: 1.8;
        }
        
        .lesson-bold {
          font-weight: 700;
          color: #1f2937;
        }
        
        .lesson-italic {
          font-style: italic;
          color: #4b5563;
        }
        
        .lesson-code-block {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
        }
        
        .lesson-inline-code {
          background: #f1f5f9;
          color: #7c3aed;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }
        
        .lesson-list-item {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }
        
        .lesson-list-item::before {
          content: '•';
          color: #8b5cf6;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .lesson-numbered-item {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          counter-increment: list-counter;
        }
        
        .lesson-blockquote {
          border-left: 4px solid #8b5cf6;
          background: #f8fafc;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </div>
  )
}
