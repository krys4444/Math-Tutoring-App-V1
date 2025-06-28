"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonalizedLesson } from "@/components/personalized-lesson"
import { useAuth } from "@/hooks/use-auth"
import { useInterests } from "@/hooks/use-interests"
import { BookOpen, Calculator, TrendingUp, User, LogOut, Menu, X } from "lucide-react"
import { GradeSelectorDialog } from "@/components/grade-selector-dialog"

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { interests, loading: interestsLoading } = useInterests()
  const [showLesson, setShowLesson] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Student"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
      {/* Left Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-gray-900">MathTutor</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings</h3>
              <div className="space-y-2">
                <GradeSelectorDialog
                  onGradeUpdated={() => {
                    console.log("Grade updated!")
                  }}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="lg:hidden">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">MathTutor</h1>
                  <p className="text-sm text-gray-500">Welcome back, {firstName}!</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showLesson ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Personalized Lesson</h2>
                <Button variant="outline" onClick={() => setShowLesson(false)}>
                  Back to Dashboard
                </Button>
              </div>
              <PersonalizedLesson />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89</div>
                    <p className="text-xs text-muted-foreground">+15 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">+5% from last week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Start Learning */}
                <Card>
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>Pick up where you left off with personalized lessons</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={() => setShowLesson(true)} className="w-full bg-purple-500 hover:bg-purple-600">
                      Start Personalized Lesson
                    </Button>
                    <div className="text-sm text-gray-600">
                      <p>Next topic: Quadratic Equations</p>
                      <p>Estimated time: 15 minutes</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile & Interests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Your Learning Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Grade Level</h4>
                      <p className="text-sm text-gray-600">Grade 10 Mathematics</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Learning Interests</h4>
                      {interestsLoading ? (
                        <p className="text-sm text-gray-600">Loading interests...</p>
                      ) : interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {interests.map((interest) => (
                            <span
                              key={interest.id}
                              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                            >
                              {interest.interest_name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No interests selected yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Completed: Linear Equations</p>
                        <p className="text-sm text-gray-600">2 hours ago</p>
                      </div>
                      <span className="text-green-600 font-medium">92%</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Completed: Graphing Functions</p>
                        <p className="text-sm text-gray-600">1 day ago</p>
                      </div>
                      <span className="text-green-600 font-medium">85%</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Completed: Polynomial Operations</p>
                        <p className="text-sm text-gray-600">3 days ago</p>
                      </div>
                      <span className="text-yellow-600 font-medium">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
