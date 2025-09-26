# Delete User: dinhbarista@gmail.com

## Method 1: Firebase Console (Recommended)

### Step 1: Delete from Firebase Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Users**
4. Find the user with email `dinhbarista@gmail.com`
5. Click the **three dots** next to the user
6. Select **Delete user**
7. Confirm deletion

### Step 2: Delete Firestore Data
1. Go to **Firestore Database** in Firebase Console
2. Delete the following collections/documents:

#### Restaurants Collection
- Find documents where `ownerId` matches the user's UID
- Delete all restaurant documents

#### Menus Collection  
- Find documents where the restaurant ID matches deleted restaurants
- Delete all menu documents

#### Tables Collection
- Find documents where the restaurant ID matches deleted restaurants  
- Delete all table documents

#### Orders Collection
- Find documents where `userId` matches the user's UID
- Delete all order documents

## Method 2: Using Admin SDK (Advanced)

If you have Firebase Admin SDK set up, you can use the script I created:

```bash
# Install dependencies
npm install firebase firebase-admin

# Set environment variables
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"

# Run the deletion script
node delete-user-data.js
```

## Method 3: Manual Firestore Query

### Find User UID
1. Go to Firebase Console → Authentication → Users
2. Find `dinhbarista@gmail.com` and copy the UID

### Delete Data by UID
Use these Firestore queries to find and delete data:

```javascript
// In Firebase Console → Firestore → Query
// Replace USER_UID with the actual UID

// 1. Find restaurants
Collection: restaurants
Field: ownerId
Operator: ==
Value: USER_UID

// 2. Find menus (if they have ownerId field)
Collection: menus  
Field: restaurant.ownerId
Operator: ==
Value: USER_UID

// 3. Find tables (if they have ownerId field)
Collection: tables
Field: ownerId  
Operator: ==
Value: USER_UID

// 4. Find orders
Collection: orders
Field: userId
Operator: ==
Value: USER_UID
```

## ⚠️ Important Notes

1. **Backup First**: Consider exporting data before deletion
2. **Irreversible**: This action cannot be undone
3. **Cascading Effects**: Deleting a user will affect all their restaurants
4. **Public Menus**: Any public menu URLs will stop working

## ✅ Verification

After deletion, verify:
1. User cannot sign in with `dinhbarista@gmail.com`
2. No restaurants appear in the system for this user
3. Public menu URLs return 404 or error
4. No orders exist for this user

## 🆘 Need Help?

If you need assistance with the deletion process, provide:
1. The user's UID from Firebase Console
2. Confirmation of which data to delete
3. Any specific requirements or constraints
