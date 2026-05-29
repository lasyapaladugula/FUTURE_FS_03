# Sunny Roast Cafe — Local Business Website (FUTURE_FS_03)

Repository: https://github.com/<your-username>/FUTURE_FS_03

This is a professional local café website built as a live project for Sunny Roast Cafe. It shows the brand, menu, contact/reservation flow, and polished retro styling.

Files included:
- index.html — main homepage and menu
- css/styles.css — full responsive styling
- js/script.js — contact form UX and success messaging
- js/auth.js — signup/login/dashboard demo flow
- README.md — run and deploy instructions
- pitch.md — owner-facing live project pitch
- assets/ — logo, favicon, hero and menu images, retro palette
- backend/ — demo backend with signup/login/contact endpoints

How to run locally:
1. Open the folder in VS Code.
2. Use Live Server or a local HTTP server:

```bash
# Python 3
python -m http.server 8000

# then open http://localhost:8000
```

Deploy to GitHub Pages:
1. Create a new public repo named `FUTURE_FS_03` on GitHub.
2. Commit and push all files to the `main` branch.
3. In repo Settings → Pages, choose branch `main` and `/ (root)` folder.
4. The site will be live at `https://<your-username>.github.io/FUTURE_FS_03/`.

Form handling:
- The contact form is ready for Formspree if you replace the `action` in `index.html` with your Formspree form URL.
- If no Formspree ID is set, the form shows a success message for testing.

Authentication demo:
- Includes `signup.html`, `login.html`, and `dashboard.html`.
- The demo uses `js/auth.js` and `localStorage` for browser-based behavior only.
- Do not use this demo auth for production.

What to submit for the internship:
- Public GitHub repo named `FUTURE_FS_03`.
- A live demo link (GitHub Pages) and the owner pitch summary from `pitch.md`.
