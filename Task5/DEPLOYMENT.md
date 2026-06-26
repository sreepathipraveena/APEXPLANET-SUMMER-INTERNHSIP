# Deployment Documentation

This guide provides step-by-step instructions on deploying the **Student Placement Tracker Web Application** to various production and staging environments. Since this is a static client-side application (HTML/CSS/JS), it can be hosted on any static web server for free.

---

## 💻 Environment Options

### 1. Local Deployment (For Development / Testing)
The project includes a lightweight custom static web server written in Node.js to serve files locally on port `8081`.

**Prerequisites**: Node.js installed.

1. Open your terminal in the root directory:
   ```bash
   cd apexplanet4
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Access the app in your browser at `http://localhost:8081`.

---

## ☁️ Cloud Production Deployments

### Option A: GitHub Pages (Recommended for Portfolio Projects)
GitHub Pages offers free static web hosting directly from your GitHub repository.

#### Step-by-Step Configuration:
1. Initialize a git repository and commit your files:
   ```bash
   git init
   * Create a repo on GitHub named `student-placement-tracker` *
   git add .
   git commit -m "Initial commit of Placement Tracker code and docs"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/student-placement-tracker.git
   git push -u origin main
   ```
2. Navigate to your repository page on GitHub.
3. Click on the **Settings** tab (gear icon) on the top menu bar.
4. Under the left sidebar, click on **Pages** (under the "Code and automation" section).
5. Under **Build and deployment**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or the branch you pushed to)
   - **Folder**: `/ (root)`
6. Click **Save**.
7. Wait 1-2 minutes. Refresh the page to see your live deployment URL (e.g., `https://YOUR_USERNAME.github.io/student-placement-tracker/`).

---

### Option B: Netlify (Drag & Drop - Easiest)
Netlify provides lightning-fast hosting and CDN delivery.

#### Method 1: Netlify Drop (No Git Required)
1. Build or locate your project directory (`c:\apexplanet4`).
2. Open your browser and navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the entire folder containing `index.html`, `style.css`, and `script.js` into the upload box on the screen.
4. Netlify will deploy your site in seconds and provide a random `.netlify.app` URL.
5. You can change this site name under **Site Configuration** > **Change Site Name**.

#### Method 2: Git Continuous Deployment (Recommended)
1. Push your code to a GitHub repository.
2. Log into your Netlify dashboard and click **Add New Site** > **Import an existing project**.
3. Select **GitHub** and authorize access.
4. Select your `student-placement-tracker` repository.
5. In the build settings:
   - **Build Command**: *Leave blank* (Not required since there's no compilation step)
   - **Publish directory**: `.` (or leave blank to publish the root folder)
6. Click **Deploy Site**. Netlify will automatically rebuild and deploy the project every time you push code to GitHub.

---

### Option C: Vercel (CLI & Git Integration)
Vercel is a cloud platform for static sites and serverless functions.

#### Method 1: Git Integration (Recommended)
1. Connect your Vercel account to GitHub.
2. In the Vercel Dashboard, click **Add New** > **Project**.
3. Select the repository `student-placement-tracker` and click **Import**.
4. In the Project configuration:
   - Keep default settings. No build command is needed.
   - Publish directory will automatically resolve to root.
5. Click **Deploy**. Vercel will build your static files and publish them to a secure `.vercel.app` domain.

#### Method 2: Vercel CLI (For Terminal Deployment)
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Navigate to your project folder:
   ```bash
   cd c:\apexplanet4
   ```
3. Run the deployment command:
   ```bash
   vercel
   ```
4. Follow the terminal prompts (select default settings). 
5. Run `vercel --prod` to deploy to production.

---

## 🛡️ Production Checklist

- [ ] **Asset Minification**: For a production release, minify `style.css` and `script.js` to reduce bundle sizes and improve page speeds.
- [ ] **SEO Compliance**: Ensure the metadata in `<head>` is customized with your portfolio branding.
- [ ] **Asset Security**: Ensure that the Chart.js library is loaded over a secure HTTPS connection (`https://cdn.jsdelivr.net/...`).
- [ ] **PWA Conversion (Optional)**: Add a simple manifest file and service worker to make the tracker available offline.
