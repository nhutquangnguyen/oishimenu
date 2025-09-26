# Server-Side User Management Scripts

## Delete User Script

This script allows you to permanently delete users from Firebase Authentication using the Firebase Admin SDK.

### Prerequisites

1. **Download Service Account Key**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `serviceAccountKey.json` in the project root
   - **IMPORTANT**: Add `serviceAccountKey.json` to `.gitignore` to keep it secure

2. **Install Firebase Admin SDK**:
   ```bash
   npm install firebase-admin
   ```

3. **Update Project ID**:
   - Edit `scripts/delete-user.js`
   - Replace `'your-project-id'` with your actual Firebase project ID

### Usage

```bash
# Delete a user by email
node scripts/delete-user.js dinhbarista@gmail.com

# The script will:
# 1. Find the user by email
# 2. Delete them from Firebase Authentication
# 3. Confirm deletion
```

### Security Notes

- **Never commit `serviceAccountKey.json` to version control**
- **Only run this script on secure servers**
- **The service account key has full admin access to your Firebase project**

### What This Script Does

1. **Finds the user** by email in Firebase Authentication
2. **Permanently deletes** the user from Firebase Auth
3. **Cannot be undone** - the user will be completely removed

### Alternative: Firebase Console

You can also delete users manually:
1. Go to Firebase Console → Authentication → Users
2. Find the user by email
3. Click the three dots → Delete user

### Integration with Admin Panel

The admin panel in the web app can only delete user data from Firestore, not from Firebase Authentication. This script provides the missing piece for complete user deletion.

**Complete deletion process**:
1. Admin panel deletes user data from Firestore ✅
2. This script deletes user from Firebase Auth ✅
3. User is completely removed from the system ✅
