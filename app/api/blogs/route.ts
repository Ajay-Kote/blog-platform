import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { BlogResponse } from "@/lib/types"

// GET /api/blogs - Fetch all published blogs
export async function GET() {
  try {
    const db = await getDatabase()
    const blogs = db.collection("blogs")

    const blogList = await blogs.find({ published: true }).sort({ createdAt: -1 }).toArray()

    // Populate author data
    const blogsWithAuthors = await Promise.all(
      blogList.map(async (blog) => {
        const users = db.collection("users")
        const author = await users.findOne(
          { _id: new ObjectId(blog.authorId) },
          { projection: { username: 1, name: 1, avatar: 1 } },
        )

        return {
          _id: blog._id.toString(),
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          author: {
            _id: author?._id.toString() || "",
            username: author?.username || "",
            name: author?.name || "",
            avatar: author?.avatar || "",
          },
          tags: blog.tags,
          published: blog.published,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          likes: blog.likes || 0,
          views: blog.views || 0,
        }
      }),
    )

    return NextResponse.json<BlogResponse>(
      {
        success: true,
        message: "Blogs fetched successfully",
        blogs: blogsWithAuthors,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Fetch blogs error:", error)
    return NextResponse.json<BlogResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)

    if (!userPayload) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { title, content, category }: { title: string; content: string; category?: string } = await request.json()

    // Validate input
    if (!title || !content) {
      return NextResponse.json<BlogResponse>(
        { success: false, message: "Title and content are required" },
        { status: 400 },
      )
    }

    const db = await getDatabase()
    const blogs = db.collection("blogs")

    const excerpt = content.substring(0, 150) + (content.length > 150 ? "..." : "")
    const tags = category ? [category] : []

    const newBlog = {
      title,
      content,
      excerpt,
      authorId: new ObjectId(userPayload.userId),
      tags,
      published: true, // Auto-publish blogs
      likes: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await blogs.insertOne(newBlog)

    // Get author data
    const users = db.collection("users")
    const author = await users.findOne(
      { _id: new ObjectId(userPayload.userId) },
      { projection: { username: 1, name: 1, avatar: 1 } },
    )

    const blogWithAuthor = {
      _id: result.insertedId.toString(),
      title,
      content,
      excerpt,
      author: {
        _id: userPayload.userId,
        username: author?.username || "",
        name: author?.name || "",
        avatar: author?.avatar || "",
      },
      tags,
      published: true,
      createdAt: newBlog.createdAt,
      updatedAt: newBlog.updatedAt,
      likes: 0,
      views: 0,
    }

    return NextResponse.json<BlogResponse>(
      {
        success: true,
        message: "Blog created successfully",
        blog: blogWithAuthor,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create blog error:", error)
    return NextResponse.json<BlogResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
