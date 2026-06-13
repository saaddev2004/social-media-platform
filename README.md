<div align="center">
  <h1>Vynce - Social Media App</h1>
  <p>A modern, high-performance social media application built with React Native and Node.js. Share your moments, connect with friends, and explore the world.</p>
</div>

---

## 🌟 Features

- **Authentication System:** Secure Login and Signup using JWT tokens.
- **Stories:** Upload, view, and navigate through user stories with a seamless tap interface.
- **Cloudinary Integration:** Reliable image hosting and delivery.
- **Live Feed:** Browse posts and updates from people you follow.
- **Profile Management:** View and edit your personal profile.
- **Cross-Platform Design:** Beautiful and responsive UI designed strictly for mobile devices.

## 🚀 Tech Stack

**Frontend:**
- React Native (Expo)
- React Navigation (Native Stack)
- Axios
- Expo Image Picker

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Cloudinary & Multer (for robust image storage)
- JWT Authentication
- Vercel (Deployment)

---

## 📸 User Interface (Screenshots)

We pride ourselves on a beautiful, dark-themed UI that is easy on the eyes and provides an immersive experience.

<table>
  <tr>
    <td align="center">
      <b>Splash Screen</b><br/>
      <img src="GUI%20Images/Splash%20Screen.png" width="250" />
    </td>
    <td align="center">
      <b>Login</b><br/>
      <img src="GUI%20Images/Login.png" width="250" />
    </td>
    <td align="center">
      <b>Sign Up</b><br/>
      <img src="GUI%20Images/Sign%20Up.png" width="250" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Home Feed</b><br/>
      <img src="GUI%20Images/Home%20Feed.png" width="250" />
    </td>
    <td align="center">
      <b>Explore</b><br/>
      <img src="GUI%20Images/Explore.png" width="250" />
    </td>
    <td align="center">
      <b>Create Post</b><br/>
      <img src="GUI%20Images/Create%20Post.png" width="250" />
    </td>
  </tr>
  <tr>
  <td align="center">
      <b>Create Story</b><br/>
      <img src="GUI%20Images/Create%20Story.png" width="250" />
    </td>
    <td align="center">
      <b>Story Viewer</b><br/>
      <img src="GUI%20Images/Story%20Viewer.png" width="250" />
    </td>
    <td align="center">
      <b>Comments</b><br/>
      <img src="GUI%20Images/Comments.png" width="250" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Profile</b><br/>
      <img src="GUI%20Images/Profile.png" width="250" />
    </td>
    <td align="center">
      <b>Edit Profile</b><br/>
      <img src="GUI%20Images/Edit%20Profile.png" width="250" />
    </td>
    <td align="center"></td>
  </tr>
</table>

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/saaddev2004/social-media-platform.git
   cd social-media-platform
   ```

2. **Frontend Setup**
   ```bash
   cd Frontend/MyApp
   npm install
   npx expo start
   ```

3. **Backend Setup (Local)**
   ```bash
   cd Backend
   npm install
   ```
   *Create a `.env` file in the Backend folder with your MongoDB URI, JWT Secret, and Cloudinary credentials.*
   ```bash
   npm start
   ```

---

## 📝 Development Log
Check out the detailed development journey, problems faced, and learning reflections in the **[Log File](logfile%20by%20Laheem.txt)**.