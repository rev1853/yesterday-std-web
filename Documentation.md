Indexes:**
- `idx_album_access_album` on `album_id`
- `idx_album_access_client` on `client_id`
- **UNIQUE** constraint on `(album_id, client_id)`

**Relationships:**
- `album_id` → `albums.id` (Many-to-One)
- `client_id` → `users.id` (Many-to-One)

---

#### 7. **activity_logs** (Optional - For Audit Trail)
Tracks all important system activities

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique log identifier |
| `user_id` | UUID | FOREIGN KEY → users(id) | User who performed action |
| `action_type` | VARCHAR(50) | NOT NULL | Type of action (e.g., 'login', 'create_album', 'submit_selection') |
| `entity_type` | VARCHAR(50) | NULLABLE | Type of entity affected (e.g., 'album', 'photo', 'submission') |
| `entity_id` | UUID | NULLABLE | ID of affected entity |
| `metadata` | JSONB | NULLABLE | Additional action details |
| `ip_address` | VARCHAR(45) | NULLABLE | User's IP address |
| `user_agent` | TEXT | NULLABLE | Browser/device information |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Action timestamp |

**Indexes:**
- `idx_activity_logs_user` on `user_id`
- `idx_activity_logs_action` on `action_type`
- `idx_activity_logs_created` on `created_at`

---

#### 8. **testimonials**
Stores client reviews and ratings for albums

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique testimonial identifier |
| `album_id` | UUID | FOREIGN KEY → albums(id) | Album being reviewed |
| `client_id` | UUID | FOREIGN KEY → users(id) | Client who wrote review |
| `rating` | INTEGER | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | Star rating (1-5) |
| `comment` | TEXT | NULLABLE | Optional review text (max 500 chars recommended) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Review creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_testimonials_album` on `album_id`
- `idx_testimonials_client` on `client_id`
- **UNIQUE** constraint on `(album_id, client_id)` - one review per client per album

**Relationships:**
- `album_id` → `albums.id` (Many-to-One)
- `client_id` → `users.id` (Many-to-One)

---

### Database Views (Useful Queries)

#### View: `creator_dashboard_stats`
```sql
CREATE VIEW creator_dashboard_stats AS
SELECT 
  u.id as creator_id,
  u.name as creator_name,
  COUNT(DISTINCT a.id) as total_albums,
  COUNT(DISTINCT p.id) as total_photos,
  COUNT(DISTINCT s.id) as total_submissions,
  COUNT(DISTINCT CASE WHEN s.status = 'pending' THEN s.id END) as pending_submissions
FROM users u
LEFT JOIN albums a ON u.id = a.creator_id
LEFT JOIN photos p ON a.id = p.album_id
LEFT JOIN submissions s ON a.id = s.album_id
WHERE u.role = 'creator'
GROUP BY u.id, u.name;
```

#### View: `client_dashboard_stats`
```sql
CREATE VIEW client_dashboard_stats AS
SELECT 
  u.id as client_id,
  u.name as client_name,
  COUNT(DISTINCT s.album_id) as albums_accessed,
  COUNT(DISTINCT sp.photo_id) as total_photos_selected,
  COUNT(DISTINCT s.id) as total_submissions
FROM users u
LEFT JOIN submissions s ON u.id = s.client_id
LEFT JOIN submission_photos sp ON s.id = sp.submission_id
WHERE u.role = 'client'
GROUP BY u.id, u.name;
```

#### View: `admin_platform_stats`
```sql
CREATE VIEW admin_platform_stats AS
SELECT 
  (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
  (SELECT COUNT(*) FROM users WHERE role = 'creator') as total_creators,
  (SELECT COUNT(*) FROM users WHERE role = 'client') as total_clients,
  (SELECT COUNT(*) FROM albums) as total_albums,
  (SELECT COUNT(*) FROM albums WHERE status = 'active') as active_albums,
  (SELECT COUNT(*) FROM photos) as total_photos,
  (SELECT COUNT(*) FROM submissions) as total_submissions,
  (SELECT COUNT(*) FROM submissions WHERE status = 'pending') as pending_submissions;
```

---

### Key Relationships Summary

```
users (creator) ──1:N──> albums ──1:N──> photos
                            │
                            │
                            └──1:N──> submissions <──N:1── users (client)
                                           │
                                           │
                                           └──N:M──> photos
                                           (via submission_photos)
                            │
                            └──1:N──> testimonials <──N:1── users (client)
```

**Cascade Rules:**
- Delete User (Creator) → Keep Albums (set creator_id to NULL or prevent deletion)
- Delete User (Client) → Keep Submissions (set client_id to NULL or prevent deletion)
- Delete Album → CASCADE delete Photos
- Delete Album → CASCADE delete Submissions
- Delete Album → CASCADE delete Testimonials
- Delete Submission → CASCADE delete submission_photos

---

## Technical Implementation

### Current Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4.0
- **State Management**: React Context API
- **Icons**: Lucide React
- **Charts**: Recharts
- **Image Handling**: Custom ImageWithFallback component
- **Notifications**: Custom Toast system

### Frontend Architecture

```
/
├── App.tsx                      # Main app component with routing
├── context/
│   └── AppContext.tsx           # Global state management
├── pages/
│   ├── HomePage.tsx             # Public landing page
│   ├── LoginPage.tsx            # Authentication
│   ├── AdminDashboard.tsx       # Admin control panel
│   ├── CreatorDashboard.tsx     # Creator workspace
│   ├── ClientDashboard.tsx      # Client portal
│   ├── CreateAlbum.tsx          # Album creation form
│   ├── AlbumDetail.tsx          # Album viewer with photo selection
│   ├── AlbumsPage.tsx           # Public albums gallery
│   ├── InvitationPage.tsx       # Invite code entry
│   ├── SubmissionReview.tsx     # View client selections
│   └── ContactPage.tsx          # Contact information
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer component
│   ├── FullscreenViewer.tsx     # Photo fullscreen viewer
│   ├── TestimonialForm.tsx      # Client testimonial/review form
│   ├── TestimonialsList.tsx     # Display list of testimonials
│   ├── CustomToast.tsx          # Toast notification
│   └── ToastContainer.tsx       # Toast container
└── styles/
    └── globals.css              # Global styles and Tailwind config
```

### API Endpoints (For Backend Implementation)

#### **Authentication**
```
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout
POST   /api/auth/register        # New user registration
GET    /api/auth/me              # Get current user
```

#### **Users**
```
GET    /api/users                # List all users (admin only)
GET    /api/users/:id            # Get user by ID
PUT    /api/users/:id            # Update user
DELETE /api/users/:id            # Delete user (admin only)
```

#### **Albums**
```
GET    /api/albums               # List albums (filtered by role)
GET    /api/albums/:id           # Get album details
POST   /api/albums               # Create new album (creator only)
PUT    /api/albums/:id           # Update album (creator only)
DELETE /api/albums/:id           # Delete album (creator/admin)
POST   /api/albums/:id/invite    # Generate invite code
GET    /api/albums/code/:code    # Get album by invite code
```

#### **Photos**
```
GET    /api/albums/:albumId/photos      # List album photos
POST   /api/albums/:albumId/photos      # Add photos to album
DELETE /api/photos/:id                  # Delete photo
```

#### **Submissions**
```
GET    /api/submissions                 # List submissions (filtered by role)
GET    /api/submissions/:id             # Get submission details
POST   /api/submissions                 # Create new submission (client)
PUT    /api/submissions/:id             # Update submission status
GET    /api/submissions/:id/download    # Download selected photos (creator)
```

#### **Testimonials**
```
GET    /api/testimonials                      # List all testimonials (admin)
GET    /api/albums/:albumId/testimonials      # Get testimonials for an album
GET    /api/testimonials/:id                  # Get testimonial by ID
POST   /api/testimonials                      # Create testimonial (client)
PUT    /api/testimonials/:id                  # Update testimonial (client)
DELETE /api/testimonials/:id                  # Delete testimonial (client/admin)
```

#### **Analytics** (Admin)
```
GET    /api/analytics/platform           # Platform-wide statistics
GET    /api/analytics/creator/:id        # Creator statistics
GET    /api/analytics/client/:id         # Client statistics
```

---

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/album_management
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h
BCRYPT_ROUNDS=10

# File Storage (AWS S3 / Cloudinary / etc)
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=album-photos

# Email (for sending invitations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# Application
APP_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com
PORT=3000
NODE_ENV=production
```

---

### Security Considerations

1. **Authentication**
   - Implement JWT-based authentication
   - Hash passwords with bcrypt (minimum 10 rounds)
   - Implement refresh token rotation
   - Session timeout after 24 hours of inactivity

2. **Authorization**
   - Role-based access control (RBAC)
   - Validate user permissions on every request
   - Creator can only access their own albums
   - Client can only access albums with valid invite code

3. **Data Validation**
   - Validate all input data
   - Sanitize user-generated content
   - Implement rate limiting on API endpoints
   - Validate file types and sizes for uploads

4. **Invite Codes**
   - Generate cryptographically secure invite codes
   - Implement expiry dates for invite links (optional)
   - Track invite code usage

5. **File Uploads**
   - Validate file types (JPEG, PNG, WebP only)
   - Limit file sizes (e.g., max 10MB per photo)
   - Scan for malware before storing
   - Use CDN for delivery

6. **Privacy**
   - Albums are private by default
   - No PII (Personally Identifiable Information) collection
   - Implement data deletion on user request
   - GDPR compliance for EU users

---

### Deployment Recommendations

**Frontend**: Deploy to Vercel, Netlify, or Cloudflare Pages
**Backend**: Deploy to Railway, Render, or AWS
**Database**: Use Supabase, PostgreSQL on Railway, or AWS RDS
**File Storage**: AWS S3, Cloudinary, or Supabase Storage
**CDN**: Cloudflare, CloudFront, or Bunny CDN

---

## Summary

This album management system provides a complete workflow for photographers to share albums with clients, receive photo selections, and manage their business efficiently. The system is designed with:

- ✅ **Clear role separation** for Admin, Creator, and Client
- ✅ **Secure invitation-based access** for private albums
- ✅ **Intuitive photo selection interface** with fullscreen viewing
- ✅ **Client testimonial/review system** with ratings and comments
- ✅ **Comprehensive analytics** for platform monitoring
- ✅ **Scalable database schema** ready for production
- ✅ **Modern tech stack** with React, TypeScript, and Tailwind

The current implementation uses **mock data and React Context** for state management, making it ready for backend integration with minimal changes.

---

**Version**: 1.1  
**Last Updated**: November 22, 2025  
**Font**: Inter (default throughout application)
