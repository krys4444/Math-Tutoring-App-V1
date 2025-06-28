"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Calendar,
  Heart,
  MessageCircle,
  Mic,
  CheckCircle,
  User,
  Settings,
  BarChart3,
  LogOut,
  Loader2,
  TestTube,
  GraduationCap,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useInterests } from "@/hooks/use-interests"
import { useGrade } from "@/hooks/use-grade"
import { PersonalizedLesson } from "@/components/personalized-lesson"

const sidebarItems = [
  {
    category: "MAIN",
    items: [
      { icon: BarChart3, label: "Dashboard", id: "dashboard" },
      { icon: BookOpen, label: "My Courses", id: "courses" },
      { icon: Calendar, label: "Study Schedule", id: "schedule" },
      { icon: Heart, label: "Your Interests", id: "interests" },
      { icon: TestTube, label: "Testing", id: "testing" },
    ],
  },
  {
    category: "AI TUTORS",
    items: [
      { icon: MessageCircle, label: "AI Chat Tutor", id: "chat" },
      { icon: Mic, label: "Voice Tutor", id: "voice" },
      { icon: CheckCircle, label: "Check My Work", id: "check" },
    ],
  },
  {
    category: "ACCOUNT",
    items: [
      { icon: User, label: "Profile", id: "profile" },
      { icon: Settings, label: "Settings", id: "settings" },
    ],
  },
]

const availableInterests = [
  { id: "physics", name: "Physics", icon: "⚡", description: "Mathematical applications in physics and mechanics" },
  { id: "finance", name: "Finance", icon: "💰", description: "Interest, investments, and economic calculations" },
  { id: "engineering", name: "Engineering", icon: "⚙️", description: "Applied mathematics for engineering problems" },
  { id: "computer-science", name: "Computer Science", icon: "💻", description: "Algorithms, programming, and logic" },
  { id: "art", name: "Art & Design", icon: "🎨", description: "Mathematical patterns in art and design" },
  { id: "music", name: "Music", icon: "🎵", description: "Mathematical relationships in music theory" },
  { id: "sports", name: "Sports", icon: "⚽", description: "Statistics and analysis in sports performance" },
  { id: "architecture", name: "Architecture", icon: "🏛️", description: "Mathematical principles in building design" },
  { id: "medicine", name: "Medicine", icon: "🩺", description: "Mathematics in healthcare and medical research" },
  { id: "environment", name: "Environmental Science", icon: "🌍", description: "Mathematical modeling of ecosystems" },
  { id: "astronomy", name: "Astronomy", icon: "🔭", description: "Mathematics of space and celestial bodies" },
  { id: "gaming", name: "Game Development", icon: "🎮", description: "Mathematics in game mechanics and design" },
]

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("courses")
  const {
    selectedInterests,
    loading: interestsLoading,
    saving: interestsSaving,
    error: interestsError,
    successMessage: interestsSuccessMessage,
    toggleInterest,
    saveInterests,
    clearAllInterests,
  } = useInterests()

  const {
    availableGrades,
    userGrade,
    loading: gradeLoading,
    saving: gradeSaving,
    error: gradeError,
    successMessage: gradeSuccessMessage,
    selectGrade,
  } = useGrade()

  const handleSignOut = async () => {
    await signOut()
  }

  const handleSaveInterests = async () => {
    const result = await saveInterests(availableInterests)
    if (result.success) {
      // Success message is handled by the hook
    }
  }

  const handleGradeSelect = async (gradeId: number) => {
    await selectGrade(gradeId)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">MathTutor</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {sidebarItems.map((section) => (
            <div key={section.category} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{section.category}</h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-medium text-sm">
                {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-800"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === "courses" && "My Courses"}
                {activeTab === "interests" && "Your Interests"}
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "schedule" && "Study Schedule"}
                {activeTab === "testing" && "AI Lesson Personalization"}
                {activeTab === "chat" && "AI Chat Tutor"}
                {activeTab === "voice" && "Voice Tutor"}
                {activeTab === "check" && "Check My Work"}
                {activeTab === "profile" && "Profile"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-gray-600">
                {activeTab === "courses" && "Continue your mathematical journey"}
                {activeTab === "interests" && "Personalize your learning experience"}
                {activeTab === "dashboard" && "Overview of your learning progress"}
                {activeTab === "schedule" && "Plan your study sessions"}
                {activeTab === "testing" && "See how AI connects math lessons to your personal interests"}
                {activeTab === "chat" && "Get help from your AI tutor"}
                {activeTab === "voice" && "Practice with voice-guided lessons"}
                {activeTab === "check" && "Verify your work and get feedback"}
                {activeTab === "profile" && "Manage your account information"}
                {activeTab === "settings" && "Customize your preferences and account settings"}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {activeTab === "courses" && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Available Courses</h2>
                <p className="text-gray-600">Start your mathematical journey with our available courses.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Test Course One */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Test Course One</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        A comprehensive introduction to fundamental mathematical concepts and problem-solving
                        techniques.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>📚 12 Lessons</span>
                          <span>•</span>
                          <span>⏱️ 6 hours</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4 bg-purple-500 hover:bg-purple-600"
                        onClick={() => {
                          window.location.href = "/course/test-course-one"
                        }}
                      >
                        Enter Course
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interests" && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Select Your Interests</h2>
                <p className="text-gray-600">
                  Choose topics that interest you to personalize your learning experience and get course recommendations
                  tailored to your passions.
                </p>
              </div>

              {/* Error/Success Messages */}
              {interestsError && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{interestsError}</AlertDescription>
                </Alert>
              )}

              {interestsSuccessMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{interestsSuccessMessage}</AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {interestsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your interests...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {availableInterests.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        disabled={interestsSaving}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedInterests.includes(interest.id)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{interest.icon}</span>
                          <div className="flex-1">
                            <h3
                              className={`font-semibold mb-1 ${
                                selectedInterests.includes(interest.id) ? "text-purple-700" : "text-gray-800"
                              }`}
                            >
                              {interest.name}
                            </h3>
                            <p className="text-sm text-gray-600">{interest.description}</p>
                          </div>
                          {selectedInterests.includes(interest.id) && (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedInterests.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Your Selected Interests ({selectedInterests.length})
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedInterests.map((interestId) => {
                          const interest = availableInterests.find((i) => i.id === interestId)
                          return (
                            <span
                              key={interestId}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              <span>{interest?.icon}</span>
                              <span>{interest?.name}</span>
                              <button
                                onClick={() => toggleInterest(interestId)}
                                disabled={interestsSaving}
                                className="hover:bg-purple-200 rounded-full p-0.5 disabled:opacity-50"
                              >
                                <span className="text-xs">×</span>
                              </button>
                            </span>
                          )
                        })}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveInterests}
                          disabled={interestsSaving}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          {interestsSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Preferences"
                          )}
                        </Button>
                        <Button variant="outline" onClick={clearAllInterests} disabled={interestsSaving}>
                          Clear All
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedInterests.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        Select some interests above to get personalized course recommendations
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-4xl space-y-8">
              {/* Grade Selection Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Grade Level</h2>
                    <p className="text-gray-600">Select your current grade level to get appropriate course content</p>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {gradeError && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{gradeError}</AlertDescription>
                  </Alert>
                )}

                {gradeSuccessMessage && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{gradeSuccessMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Loading State */}
                {gradeLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-600">Loading grade options...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Current Grade Display */}
                    {userGrade && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{userGrade.grade}</span>
                          </div>
                          <div>
                            <p className="font-medium text-blue-800">Current Grade: Grade {userGrade.grade}</p>
                            <p className="text-sm text-blue-600">
                              Selected on {new Date(userGrade.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Grade Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {availableGrades.map((grade) => (
                        <button
                          key={grade.grade_id}
                          onClick={() => handleGradeSelect(grade.grade_id)}
                          disabled={gradeSaving}
                          className={`p-6 rounded-xl border-2 text-center transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                            userGrade?.grade_id === grade.grade_id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                                userGrade?.grade_id === grade.grade_id
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {grade.grade}
                            </div>
                            <div>
                              <h3
                                className={`font-semibold ${
                                  userGrade?.grade_id === grade.grade_id ? "text-blue-700" : "text-gray-800"
                                }`}
                              >
                                Grade {grade.grade}
                              </h3>
                              {userGrade?.grade_id === grade.grade_id && (
                                <div className="flex items-center justify-center mt-2">
                                  <CheckCircle className="w-5 h-5 text-blue-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {gradeSaving && (
                      <div className="mt-4 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Saving your grade selection...</span>
                        </div>
                      </div>
                    )}

                    {!userGrade && !gradeLoading && (
                      <div className="mt-6 text-center py-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <GraduationCap className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">Select your grade level to get started</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Account Information Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
                    <p className="text-gray-600">Your account details and preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-600">First Name</label>
                      <p className="text-gray-800 font-medium">{user?.user_metadata?.first_name || "Not provided"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-600">Last Name</label>
                      <p className="text-gray-800 font-medium">{user?.user_metadata?.last_name || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <p className="text-gray-800 font-medium">{user?.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-600">Account Created</label>
                    <p className="text-gray-800 font-medium">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "testing" && <PersonalizedLesson />}

          {/* Placeholder for other tabs */}
          {activeTab !== "courses" &&
            activeTab !== "interests" &&
            activeTab !== "testing" &&
            activeTab !== "settings" && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
                  <p className="text-gray-600">This section is under development</p>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  )
}
