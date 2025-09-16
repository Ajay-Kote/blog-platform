# MERN Blog Application

A full-stack blog application built with Next.js, MongoDB, Redux Toolkit, and TypeScript. Features user authentication, blog creation/editing, user profiles, and a responsive design.

## Features

- 🔐 **Authentication**: JWT-based user registration and login
- 📝 **Blog Management**: Create, read, update, and delete blog posts
- 👤 **User Profiles**: Customizable user profiles with bio and avatar
- 🎨 **Modern UI**: Responsive design with Tailwind CSS and shadcn/ui
- 🔄 **State Management**: Redux Toolkit for client-side state
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🚀 **Performance**: Optimized with Next.js 15 and server-side rendering

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Redux Toolkit
- **Backend**: Next.js API Routes
- **Database**: MongoDB with native driver
- **Authentication**: JWT tokens with bcrypt password hashing
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB instance)
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd mern-blog-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-app?retryWrites=true&w=majority
   
   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   
   # Next.js (for production)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   \`\`\`

4. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a new cluster
   - Create a database user with read/write permissions
   - Get your connection string and add it to `.env.local`
   - Whitelist your IP address (or use 0.0.0.0/0 for development)

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── blogs/         # Blog CRUD endpoints
│   │   └── users/         # User profile endpoints
│   ├── blog/              # Blog pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   └── profile/           # User profile page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── ProtectedRoute.tsx # Route protection
├── lib/                  # Utility functions
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts           # Authentication utilities
│   └── types.ts          # TypeScript type definitions
├── store/                # Redux store
│   ├── authSlice.ts      # Authentication state
│   ├── blogSlice.ts      # Blog state
│   └── store.ts          # Store configuration
└── styles/               # Global styles
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Blogs
- `GET /api/blogs` - Get all published blogs
- `POST /api/blogs` - Create new blog (authenticated)
- `GET /api/blogs/[id]` - Get single blog
- `PUT /api/blogs/[id]` - Update blog (authenticated, owner only)
- `DELETE /api/blogs/[id]` - Delete blog (authenticated, owner only)
- `GET /api/blogs/my-blogs` - Get current user's blogs
- `GET /api/blogs/user/[userId]` - Get user's published blogs

### Users
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/profile` - Update user profile (authenticated)

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NEXTAUTH_URL` (your Vercel domain)
     - `NEXTAUTH_SECRET`

3. **Configure MongoDB Atlas**
   - Add your Vercel domain to MongoDB Atlas IP whitelist
   - Or use 0.0.0.0/0 for all IPs (less secure)

### Environment Variables for Production

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
\`\`\`

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Login**: Sign in to access the dashboard
3. **Write Blogs**: Create and publish blog posts with rich text
4. **Manage Content**: Edit or delete your own blog posts
5. **Profile**: Update your profile information and bio
6. **Browse**: Read blogs from other users

## Development Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/mern-blog-app/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [MongoDB](https://www.mongodb.com/) for the database
- [Vercel](https://vercel.com/) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
