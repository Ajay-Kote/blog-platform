# Deployment Guide

This guide covers deploying your MERN Blog application to various platforms.

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications and is created by the same team.

### Step 1: Prepare Your Repository

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
   
   In the Vercel dashboard, add these environment variables:
   
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-app?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-different-from-jwt
   \`\`\`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-app-name.vercel.app`

### Step 3: Configure MongoDB Atlas

1. **Update Network Access**
   - Go to MongoDB Atlas dashboard
   - Navigate to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allows all IPs)
   - Or add Vercel's IP ranges (more secure)

2. **Test Connection**
   - Visit your deployed app
   - Try signing up/logging in
   - Check Vercel logs if there are issues

## Alternative Deployment Options

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Same as Vercel
4. **Note**: Netlify requires additional configuration for API routes

### Railway

1. **Connect GitHub Repository**
2. **Add Environment Variables**
3. **Deploy**: Railway will auto-deploy on git push
4. **Custom Domain**: Available on paid plans

### DigitalOcean App Platform

1. **Create New App**
2. **Connect GitHub**
3. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Run Command: `npm start`
4. **Add Environment Variables**

## Environment Variables Reference

### Required Variables

\`\`\`env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-app?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=another-secret-for-nextauth
\`\`\`

### Optional Variables

\`\`\`env
# Development
NEXT_PUBLIC_API_URL=https://your-domain.com

# Analytics (if using)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
\`\`\`

## MongoDB Atlas Setup

### 1. Create Cluster

1. **Sign up** at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create** a new cluster (free tier available)
3. **Choose** a cloud provider and region
4. **Wait** for cluster creation (2-5 minutes)

### 2. Create Database User

1. **Go to** Database Access
2. **Add New Database User**
3. **Choose** Password authentication
4. **Set** username and password
5. **Grant** "Read and write to any database" role

### 3. Configure Network Access

1. **Go to** Network Access
2. **Add IP Address**
3. **Choose** "Allow access from anywhere" (0.0.0.0/0)
4. **Or** add specific IP addresses for better security

### 4. Get Connection String

1. **Go to** Clusters
2. **Click** "Connect"
3. **Choose** "Connect your application"
4. **Copy** the connection string
5. **Replace** `<password>` with your database user password
6. **Replace** `<dbname>` with your database name (e.g., "blog-app")

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string format
   - Verify database user credentials
   - Ensure IP whitelist includes your deployment platform

2. **JWT Token Issues**
   - Ensure JWT_SECRET is at least 32 characters
   - Check that NEXTAUTH_URL matches your domain
   - Verify environment variables are set correctly

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Review build logs for specific errors

4. **API Routes Not Working**
   - Verify API routes are in the correct directory structure
   - Check that middleware is properly configured
   - Ensure CORS settings allow your domain

### Debugging Steps

1. **Check Logs**
   - Vercel: Function logs in dashboard
   - Railway: Application logs
   - Netlify: Function logs

2. **Test Locally**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

3. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure no trailing spaces in values

## Performance Optimization

### 1. Database Optimization

- **Indexes**: Add indexes for frequently queried fields
- **Connection Pooling**: MongoDB driver handles this automatically
- **Query Optimization**: Use projection to limit returned fields

### 2. Next.js Optimization

- **Image Optimization**: Use Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Static Generation**: Use ISR for blog posts

### 3. Caching

- **Vercel Edge Cache**: Automatic for static content
- **Database Caching**: Consider Redis for session storage
- **CDN**: Vercel provides global CDN automatically

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files to git
- Use different secrets for development and production
- Rotate secrets regularly

### 2. Database Security

- Use strong passwords for database users
- Limit IP access when possible
- Enable MongoDB Atlas security features

### 3. Application Security

- Validate all user inputs
- Use HTTPS in production (automatic with Vercel)
- Implement rate limiting for API routes
- Keep dependencies updated

## Monitoring and Analytics

### 1. Vercel Analytics

\`\`\`bash
npm install @vercel/analytics
\`\`\`

Add to your layout:
\`\`\`tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### 2. Error Monitoring

Consider integrating:
- Sentry for error tracking
- LogRocket for user session replay
- Vercel's built-in monitoring

## Scaling Considerations

### Database Scaling

- **MongoDB Atlas**: Automatic scaling available
- **Connection Limits**: Monitor connection usage
- **Sharding**: For very large datasets

### Application Scaling

- **Vercel**: Automatic scaling included
- **Edge Functions**: For global performance
- **CDN**: Static assets cached globally

This deployment guide should help you successfully deploy your MERN blog application to production!
