import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { AuthResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)

    if (!userPayload) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(userPayload.userId) }, { projection: { password: 0 } })

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
        message: "User data retrieved",
        user: userData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
