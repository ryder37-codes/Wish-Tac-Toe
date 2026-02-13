# 💝 Wish-Tac-Toe: Valentine's Edition

A romantic twist on Tic-Tac-Toe where the winner gets a special wish! Built with love using HTML, CSS, JavaScript, and Firebase for real-time multiplayer.

## ✨ Features

- **Real-Time Multiplayer**: Play with your partner across devices using a unique Game ID.
- **Fair Play Logic**: Alternating turns ensure everyone gets a chance to start.
- **Wish Reward**: The winner earns a wish that the partner must fulfill! 
- **Crash-Proof**: Robust handling for network glitches and data sync.
- **Handmade Aesthetic**: Stitched felt textures, gingham patterns, and gentle animations.

## 🚀 How to Play

1.  Open `index.html` in your browser.
2.  Click **Create New Game** to get a Game ID.
3.  Share the ID with your partner.
4.  Partner clicks **Join Game** and enters the ID.
5.  Play! The winner gets their wish granted. ✨

## 🛠️ Setup

1.  **Firebase**: This game requires a Firebase project for real-time features.
2.  **Configuration**: Update `firebase-config.js` with your own project credentials.
3.  **Run**: No build process needed! Just open the HTML file.

## 🔒 Security

### Firebase Security Rules

This project includes Firebase Realtime Database security rules in [`database.rules.json`](database.rules.json) to protect your game data.

**To deploy the security rules:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`wish-tac-toe`)
3. Navigate to **Realtime Database** → **Rules** tab
4. Copy the contents of [`database.rules.json`](database.rules.json)
5. Paste into the Rules editor
6. Click **Publish**

**What the rules do:**
- ✅ Allow anyone to create and read games (needed for multiplayer)
- ✅ Prevent players from cheating or tampering with game results
- ✅ Restrict unauthorized modifications to game state
- ✅ Enable proper turn-based gameplay

### Firebase API Key Security

> **Note:** The Firebase API key in `firebase-config.js` is **safe to expose** in client-side code. Firebase's security model protects your data through Security Rules, not by hiding the API key. See [Firebase documentation](https://firebase.google.com/docs/projects/api-keys) for details.

### GitHub Preparation

Before uploading to GitHub:
- ✅ `.gitignore` is already configured to exclude OS/editor files
- ✅ No sensitive credentials are stored in the code
- ✅ Firebase security rules are documented in `database.rules.json`


*Made with ❤️ for Valentine's Day*

<!-- 
For my favorite Player 2 🎮❤️ 
To the one who makes every game worth playing. 
This is for you. 
-->
