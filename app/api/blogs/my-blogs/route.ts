import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { BlogResponse } from "@/lib/types"

// GET /api/blogs/my-blogs - Fetch current user's blogs (including drafts)
export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)

    if (!userPayload) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const blogs = db.collection("blogs")

    const blogList = await blogs
      .find({ authorId: new ObjectId(userPayload.userId) })
      .sort({ createdAt: -1 })
      .toArray()

    // Get author data
    const users = db.collection("users")
    const author = await users.findOne(
      { _id: new ObjectId(userPayload.userId) },
      { projection: { username: 1, name: 1, avatar: 1 } },
    )

    const blogsWithAuthor = blogList.map((blog) => ({
      _id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author: {
        _id: userPayload.userId,
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
    }))

    return NextResponse.json<BlogResponse>(
      {
        success: true,
        message: "My blogs fetched successfully",
        blogs: blogsWithAuthor,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Fetch my blogs error:", error)
    return NextResponse.json<BlogResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
