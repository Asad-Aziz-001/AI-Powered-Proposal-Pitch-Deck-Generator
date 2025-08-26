"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Presentation, Clock, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Project {
  id: string
  title: string
  type: "proposal" | "pitch_deck"
  created_at: string
  status: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    async function loadUserData() {
      try {
        // Get current user
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.push("/login")
          return
        }

        // Get user profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

        if (profile) {
          setUser({
            id: profile.id,
            email: authUser.email || "",
            full_name: profile.full_name || "User",
          })
        }

        // Get user's projects
        const { data: userProjects } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (userProjects) {
          setProjects(userProjects)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">ProposalAI</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{user?.full_name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.full_name}!</h2>
          <p className="text-muted-foreground">
            Create professional business proposals and pitch decks with AI assistance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Create Business Proposal</span>
              </CardTitle>
              <CardDescription>Generate comprehensive business proposals with AI assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/create?type=proposal">
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  New Proposal
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Presentation className="w-5 h-5 text-primary" />
                <span>Create Pitch Deck</span>
              </CardTitle>
              <CardDescription>Build compelling pitch decks for investors and stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/create?type=pitch_deck">
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  New Pitch Deck
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Recent Projects</h3>
            {projects.length > 0 && (
              <Button variant="outline" size="sm">
                View All
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">No projects yet</h4>
                <p className="text-muted-foreground text-center mb-6">
                  Get started by creating your first business proposal or pitch deck
                </p>
                <Link href="/dashboard/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {project.type === "proposal" ? (
                          <FileText className="w-5 h-5 text-primary" />
                        ) : (
                          <Presentation className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{project.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {project.type === "proposal" ? "Proposal" : "Pitch Deck"}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(project.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
