# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - RECOMMENDED) ⭐

### Steps:
1. **Sign up for free account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Set up database access:**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `supportuser` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Set up network access:**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
   - Click "Confirm"

5. **Get your connection string:**
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password
   - Add your database name at the end: `/support_system?retryWrites=true&w=majority`

6. **Update your .env file:**
   ```
   MONGODB_URI=mongodb+srv://supportuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/support_system?retryWrites=true&w=majority
   ```

---

## Option 2: Local MongoDB Installation

### For Windows:

1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Click "Download"

2. **Install MongoDB:**
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool - optional but helpful)

3. **Verify installation:**
   - MongoDB should start automatically as a Windows service
   - Check if it's running: Open Services (Win+R, type `services.msc`)
   - Look for "MongoDB" service - it should be "Running"

4. **Your .env file should already be correct:**
   ```
   MONGODB_URI=mongodb://localhost:27017/support_system
   ```

### For Mac:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### For Linux:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

---

## After Setup (Either Option):

1. **Restart your backend server:**
   ```bash
   # Stop the current server (Ctrl+C)
   cd backend
   npm run dev
   ```

2. **Seed the database:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Verify connection:**
   - You should see: "MongoDB Connected: ..." in the console
   - If you see errors, check your connection string in .env

---

## Troubleshooting:

### Atlas Connection Issues:
- Make sure you replaced `<password>` in the connection string
- Verify network access allows your IP (or "Allow from anywhere")
- Check that your cluster is running (not paused)

### Local MongoDB Issues:
- Check if MongoDB service is running: `services.msc` (Windows)
- Try starting manually: `net start MongoDB` (Windows as admin)
- Check if port 27017 is available: `netstat -ano | findstr :27017`

### Common Errors:
- **"MongoServerError: Authentication failed"** → Wrong password in connection string
- **"MongoNetworkError"** → Check network access settings (Atlas) or if MongoDB is running (local)
- **"ECONNREFUSED"** → MongoDB service not running (local)

