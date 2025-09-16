import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { AuthResponse } from "@/lib/types"

// GET /api/users/[id] - Get user profile
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Invalid user ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

    if (!user) {
      return NextResponse.json<AuthResponse>({ success: false, message: "User not found" }, { status: 404 })
    }

    const userData = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio || "",
      avatar: user.avatar || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "User profile fetched successfully",
        user: userData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
