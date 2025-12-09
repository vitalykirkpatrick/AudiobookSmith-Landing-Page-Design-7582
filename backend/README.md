# AudiobookSmith Backend

This is the backend server for AudiobookSmith that you can deploy on your own server instead of using Supabase.

## Features

- **Authentication**: JWT-based authentication system
- **Database Operations**: CRUD operations for user data and audiobook projects
- **File Upload**: Handle manuscript and audio file uploads
- **MySQL Support**: Uses MySQL database (easily adaptable to PostgreSQL or MongoDB)
- **Security**: Password hashing, JWT tokens, input validation

## Setup Instructions

### 1. Database Setup

Create a MySQL database and update the connection details in your `.env` file:

```sql
CREATE DATABASE audiobooksmith;
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=audiobooksmith
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Frontend Configuration

Update your frontend `.env` file:

```
REACT_APP_API_URL=http://your-server-domain.com:5000
REACT_APP_API_KEY=your_api_key_here
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user
- `POST /api/auth/reset-password` - Reset password

### Database Operations
- `POST /api/db/:table` - Insert new record
- `GET /api/db/:table` - Get records with filters
- `POST /api/db/:table/upsert` - Insert or update record

### File Upload
- `POST /api/storage/upload` - Upload files

### Health Check
- `GET /api/health` - Server health status

## Database Schema

The server automatically creates these tables:

- `users` - User authentication data
- `users_audiobooksmith` - User audiobook project data
- `audiobooks_audiobooksmith` - Completed audiobook records

## Deployment

### Option 1: Traditional VPS/Dedicated Server

1. Deploy to your server using PM2:
```bash
npm install -g pm2
pm2 start server.js --name audiobooksmith-backend
```

2. Set up Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 2: Docker

```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Option 3: Cloud Platforms

- **Heroku**: Add `Procfile` with `web: npm start`
- **DigitalOcean App Platform**: Use the provided `package.json` scripts
- **AWS EC2**: Follow traditional VPS setup
- **Google Cloud Run**: Use Docker deployment

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, randomly generated secret
3. **Database**: Use proper database user permissions
4. **CORS**: Configure CORS for your frontend domain only
5. **Rate Limiting**: Consider adding rate limiting for production
6. **HTTPS**: Always use HTTPS in production

## Database Alternatives

### PostgreSQL
Replace MySQL with PostgreSQL:
```bash
npm install pg
```

Update connection code in `server.js`

### MongoDB
Replace MySQL with MongoDB:
```bash
npm install mongodb
```

Update database operations in `server.js`

## Monitoring

Add monitoring with tools like:
- **PM2 Monitoring**: Built-in process monitoring
- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure monitoring
- **Sentry**: Error tracking

## Backup Strategy

1. **Database Backups**: Set up automated MySQL backups
2. **File Backups**: Backup uploaded files directory
3. **Code Backups**: Use Git for version control

This backend provides a complete replacement for Supabase while giving you full control over your data and infrastructure.