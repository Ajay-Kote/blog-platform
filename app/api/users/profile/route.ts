import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { AuthResponse } from "@/lib/types"

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)

    if (!userPayload) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { name, bio, avatar } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Name is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const updateData = {
      name,
      bio: bio || "",
      avatar: avatar || "",
      updatedAt: new Date(),
    }

    await users.updateOne({ _id: new ObjectId(userPayload.userId) }, { $set: updateData })

    // Get updated user
    const updatedUser = await users.findOne({ _id: new ObjectId(userPayload.userId) }, { projection: { password: 0 } })

    if (!updatedUser) {
      return NextResponse.json<AuthResponse>({ success: false, message: "User not found" }, { status: 404 })
    }

    const userData = {
      _id: updatedUser._id.toString(),
      email: updatedUser.email,
      username: updatedUser.username,
      name: updatedUser.name,
      bio: updatedUser.bio || "",
      avatar: updatedUser.avatar || "",
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    }

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "Profile updated successfully",
        user: userData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
