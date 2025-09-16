import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { BlogResponse, UpdateBlogData } from "@/lib/types"

// GET /api/blogs/[id] - Fetch a single blog
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Invalid blog ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const blogs = db.collection("blogs")

    const blog = await blogs.findOne({ _id: new ObjectId(id) })

    if (!blog) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Blog not found" }, { status: 404 })
    }

    // Increment view count
    await blogs.updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } })

    // Get author data
    const users = db.collection("users")
    const author = await users.findOne(
      { _id: new ObjectId(blog.authorId) },
      { projection: { username: 1, name: 1, avatar: 1 } },
    )

    const blogWithAuthor = {
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
      views: (blog.views || 0) + 1,
    }

    return NextResponse.json<BlogResponse>(
      {
        success: true,
        message: "Blog fetched successfully",
        blog: blogWithAuthor,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Fetch blog error:", error)
    return NextResponse.json<BlogResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/blogs/[id] - Update a blog
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(request)

    if (!userPayload) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Invalid blog ID" }, { status: 400 })
    }

    const updateData: UpdateBlogData = await request.json()

    const db = await getDatabase()
    const blogs = db.collection("blogs")

    // Check if blog exists and user owns it
    const existingBlog = await blogs.findOne({ _id: new ObjectId(id) })

    if (!existingBlog) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Blog not found" }, { status: 404 })
    }

    if (existingBlog.authorId.toString() !== userPayload.userId) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Forbidden" }, { status: 403 })
    }

    const excerpt = updateData.content.substring(0, 150) + (updateData.content.length > 150 ? "..." : "")
    const tags = updateData.category ? [updateData.category] : []

    // Update blog
    const updatedBlog = {
      title: updateData.title,
      content: updateData.content,
      category: updateData.category,
      excerpt: excerpt,
      tags: tags,
      updatedAt: new Date(),
    }

    await blogs.updateOne({ _id: new ObjectId(id) }, { $set: updatedBlog })

    // Get updated blog with author
    const blog = await blogs.findOne({ _id: new ObjectId(id) })
    const users = db.collection("users")
    const author = await users.findOne(
      { _id: new ObjectId(userPayload.userId) },
      { projection: { username: 1, name: 1, avatar: 1 } },
    )

    const blogWithAuthor = {
      _id: blog!._id.toString(),
      title: blog!.title,
      content: blog!.content,
      excerpt: blog!.excerpt,
      author: {
        _id: userPayload.userId,
        username: author?.username || "",
        name: author?.name || "",
        avatar: author?.avatar || "",
      },
      tags: blog!.tags,
      published: blog!.published,
      createdAt: blog!.createdAt,
      updatedAt: blog!.updatedAt,
      likes: blog!.likes || 0,
      views: blog!.views || 0,
    }

    return NextResponse.json<BlogResponse>(
      {
        success: true,
        message: "Blog updated successfully",
        blog: blogWithAuthor,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update blog error:", error)
    return NextResponse.json<BlogResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/blogs/[id] - Delete a blog
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(request)

    if (!userPayload) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Invalid blog ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const blogs = db.collection("blogs")

    // Check if blog exists and user owns it
    const existingBlog = await blogs.findOne({ _id: new ObjectId(id) })

    if (!existingBlog) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Blog not found" }, { status: 404 })
    }

    if (existingBlog.authorId.toString() !== userPayload.userId) {
      return NextResponse.json<BlogResponse>({ success: false, message: "Forbidden" }, { status: 403 })
    }

    // Delete blog
    await blogs.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json<BlogResponse>(
      {
        success: true,
        message: "Blog deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Delete blog error:", error)
    return NextResponse.json<BlogResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
