export interface User {
  _id: string
  email: string
  username: string
  name: string
  bio?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Blog {
  _id: string
  title: string
  content: string
  excerpt: string
  author: {
    _id: string
    username: string
    name: string
    avatar?: string
  }
  tags: string[]
  published: boolean
  createdAt: Date
  updatedAt: Date
  likes: number
  views: number
}

export interface CreateBlogData {
  title: string
  content: string
  excerpt: string
  tags: string[]
  published: boolean
}

export interface UpdateBlogData extends Partial<CreateBlogData> {}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface BlogResponse {
  success: boolean
  message: string
  blog?: Blog
  blogs?: Blog[]
}
