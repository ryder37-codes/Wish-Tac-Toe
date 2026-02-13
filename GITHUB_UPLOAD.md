# 📤 GitHub Upload Guide

## Step 1: Initialize Git Repository

```bash
cd c:\Users\enhim\OneDrive\Documents\project_26\wish-tac-toe
git init
```

## Step 2: Add All Files

```bash
git add .
```

This will add all files except those in `.gitignore`.

## Step 3: Make Your First Commit

```bash
git commit -m "Initial commit: Wish-Tac-Toe Valentine's Edition"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** button → **"New repository"**
3. Repository name: `wish-tac-toe` (or any name you like)
4. Description: "A romantic Tic-Tac-Toe game for Valentine's Day 💝"
5. Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README" (you already have one)
7. Click **"Create repository"**

## Step 5: Link Your Local Repo to GitHub

GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/ryder37-codes/wish-tac-toe.git
git branch -M main
git push -u origin main
```

## Step 6: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded!

---

## 🌐 Enable GitHub Pages (Free Hosting)

To host your game for free on GitHub:

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select **main** branch
5. Click **Save**
6. Wait 1-2 minutes
7. Your game will be live at: `https://ryder37-codes.github.io/wish-tac-toe/`

---

## ⚠️ Important Reminders

### Before Pushing to GitHub:
- ✅ Ensure `.gitignore` is in place (already done!)
- ✅ Check no sensitive data in code (already verified!)
- ✅ Deploy Firebase security rules (DO THIS FIRST!)

### After Hosting on GitHub Pages:
- ✅ Test the live URL to ensure everything works
- ✅ Share the Game ID with your partner to test multiplayer
- ✅ Firebase will work seamlessly with GitHub Pages

---

## 🎮 Using Your Hosted Game

Once live on GitHub Pages:
1. You and your partner both visit: `https://ryder37-codes.github.io/wish-tac-toe/`
2. One person creates a game
3. Share the Game ID
4. Other person joins
5. Play and enjoy! 💝

---

## 🔧 Future Updates

To update your hosted game:

```bash
git add .
git commit -m "Update: describe your changes"
git push
```

GitHub Pages will automatically update within 1-2 minutes!
