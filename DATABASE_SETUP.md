# Database Setup Guide

## 🗄️ **Supabase Setup**

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Schema

#### Teams Table
```sql
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  leader TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  size INTEGER NOT NULL,
  progress JSONB DEFAULT '{"currentRiddle": 0, "hintsUsed": 0, "startTime": "", "completedRiddles": []}',
  registeredAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Game Sessions Table
```sql
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teamId UUID REFERENCES teams(id) ON DELETE CASCADE,
  currentRiddle INTEGER DEFAULT 0,
  hintsUsed INTEGER DEFAULT 0,
  startTime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completedRiddles INTEGER[] DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict later)
CREATE POLICY "Allow all operations" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON game_sessions FOR ALL USING (true);
```

## 🔧 **Alternative Database Options**

### Option 1: MongoDB Atlas
```bash
npm install mongodb
```

### Option 2: PostgreSQL with Prisma
```bash
npm install @prisma/client prisma
npx prisma init
```

### Option 3: Firebase Firestore
```bash
npm install firebase
```

## 🚀 **Quick Start**

1. **Set up Supabase:**
   - Create project at supabase.com
   - Run the SQL schema above
   - Add environment variables

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Test the application:**
   - Register a new team
   - Login with credentials
   - Complete riddles
   - Check database for saved progress

## 📊 **Features Implemented**

- ✅ Team registration and login
- ✅ Game session management
- ✅ Progress tracking
- ✅ Riddle completion
- ✅ Hint usage tracking
- ✅ Persistent data storage
- ✅ Real-time updates (with Supabase)

## 🔒 **Security Considerations**

- Passwords are stored in plain text (use bcrypt in production)
- Add proper authentication (JWT, OAuth)
- Implement rate limiting
- Add input validation
- Use HTTPS in production

## 📈 **Scaling Options**

- **Supabase:** Built-in scaling, real-time features
- **MongoDB Atlas:** Document-based, flexible schema
- **PostgreSQL + Prisma:** Type-safe, powerful queries
- **Firebase:** Google's managed solution
