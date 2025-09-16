"use client"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, User, Edit, Trash2, Calendar } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import type { RootState, AppDispatch } from "@/store/store"
import { logout } from "@/store/authSlice"

interface Blog {
  _id: string
  title: string
  content: string
  category?: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/blogs/my-blogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setBlogs(data.blogs || [])
        } else {
          setError("Failed to fetch blogs")
        }
      } catch (error) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }

    fetchMyBlogs()
  }, [])

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId))
      } else {
        alert("Failed to delete blog")
      }
    } catch (error) {
      alert("Network error")
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-primary">
                MERN Blog
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost">Home</Button>
                </Link>
                <Link href="/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Write Blog
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground">@{user?.username}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Write New Blog</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Share your thoughts with the world</p>
                <Link href="/create">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Blog
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Update your profile information</p>
                <Link href="/profile">
                  <Button variant="outline" className="w-full bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Browse Blogs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Discover stories from other writers</p>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* My Blogs Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Blogs</h2>
              <Link href="/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Blog
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading your blogs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 border-2 border-dashed border-destructive/20 rounded-lg">
                <p className="text-destructive text-lg mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                <p className="text-muted-foreground text-lg mb-4">You haven't written any blogs yet.</p>
                <Link href="/create">
                  <Button>Write Your First Blog</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {blogs.map((blog) => (
                  <Card key={blog._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{blog.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(blog.createdAt)}
                            </div>
                            {blog.category && <Badge variant="secondary">{blog.category}</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/blogs/${blog._id}/edit`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">
                        {blog.content.substring(0, 200)}
                        {blog.content.length > 200 && "..."}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
