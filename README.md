<body>

<h1>SF Project – README</h1>

<p>Hey there! Welcome to my <strong>Salesforce Integration</strong> project. This README provides an overview of the tech stack, code structure, flow, and deployment details. I’ve tried to keep it friendly yet detailed enough so you can dive in without issues.</p>

<hr />

<h2>1. Tech Stack</h2>
<ul>
  <li><strong>Frontend</strong>:
    <ul>
      <li><strong>Vue 3</strong> for the SPA (Single-Page Application)</li>
      <li><strong>Tailwind CSS</strong> for styling</li>
      <li><strong>Vite</strong> for bundling</li>
    </ul>
  </li>
  <li><strong>Backend</strong>:
    <ul>
      <li><strong>Node.js</strong> &amp; <strong>Express.js</strong> for server logic</li>
      <li><strong>PostgreSQL</strong> as the database (user credentials, minimal tables)</li>
    </ul>
  </li>
  <li><strong>Salesforce</strong>: 
    <ul>
      <li>Used for OAuth 2.0 login and retrieving standard objects (e.g. Accounts)</li>
    </ul>
  </li>
  <li><strong>Deployment</strong>:
    <ul>
      <li><strong>Render</strong> hosting the Node/Express backend</li>
      <li><strong>Render PostgreSQL</strong> for the database</li>
      <li><strong>Netlify</strong> for the static front-end</li>
    </ul>
  </li>
</ul>

<hr />

<h2>2. Code Structure</h2>
<p>At a high level, the repo looks like this:</p>
<pre><code>SF_Project/
├─ backend/
│  ├─ package.json
│  ├─ .env.example
│  ├─ src/
│  │  ├─ config/
│  │  │  ├─ db.js           (PostgreSQL connection)
│  │  │  └─ salesforce.js   (Salesforce OAuth setup)
│  │  ├─ controllers/
│  │  │  ├─ authController.js      (handles user login, registration, Salesforce flows)
│  │  │  └─ dashboardController.js (Salesforce queries)
│  │  ├─ middleware/
│  │  │  └─ authMiddleware.js      (JWT or session-based checks)
│  │  ├─ routes/
│  │  │  ├─ authRoutes.js          (auth endpoints)
│  │  │  └─ accountRoutes.js       (Salesforce data fetching)
│  │  ├─ app.js                    (Express app config)
│  │  └─ server.js                 (Express server startup)
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ public/ or dist/ (build output)
│  └─ src/
│     ├─ assets/       (Tailwind CSS, images)
│     ├─ components/   (smaller UI components)
│     ├─ router/
│     │  └─ index.js   (defines Vue routes)
│     ├─ views/
│     │  ├─ LoginView.vue
│     │  ├─ RegisterView.vue
│     │  └─ DashboardView.vue
│     └─ App.vue       (root component)
</code></pre>

<hr />

<h2>3. Code Flow</h2>
<ol>
  <li><strong>User Registration</strong>
    <ul>
      <li>The user visits the <em>frontend</em> at Netlify.</li>
      <li>Goes to <code>/register</code>, enters email/password.</li>
      <li>Frontend calls the <em>backend</em> <code>/api/auth/register</code> on Render.</li>
      <li>Backend hashes the password, stores credentials in Postgres.</li>
    </ul>
  </li>
  <li><strong>User Login</strong>
    <ul>
      <li>On <code>/login</code>, user enters email/password.</li>
      <li>Frontend posts to <code>/api/auth/login</code>.</li>
      <li>If valid, the backend returns a token (JWT or sets a session/cookie).</li>
      <li>Frontend either stores that token or just uses the session.</li>
    </ul>
  </li>
  <li><strong>Salesforce OAuth</strong>
    <ul>
      <li>The user or the app triggers a call to <code>/api/auth/salesforce</code>.</li>
      <li>The user is redirected to Salesforce to grant access.</li>
      <li>Salesforce redirects back to <code>/api/auth/salesforce/callback</code>.</li>
      <li>The backend obtains an access token, which can be stored server-side or returned to the user.</li>
    </ul>
  </li>
  <li><strong>Fetching Salesforce Data</strong>
    <ul>
      <li>Frontend calls <code>/api/accounts</code> with the user’s credentials or session.</li>
      <li>Backend uses <code>jsforce</code> + stored tokens to query Salesforce objects (e.g. Accounts).</li>
      <li>Returns that data in JSON.</li>
    </ul>
  </li>
  <li><strong>Dashboard</strong>
    <ul>
      <li>Displays the returned Salesforce data, with pagination or filtering as needed.</li>
    </ul>
  </li>
</ol>

<hr />

<h2>4. Routes in the Frontend &amp; Their Purpose</h2>
<ul>
  <li><code>/</code> – Typically redirects to <code>/login</code> if the user is not authenticated or else redirects to <code>/dashboard</code>. This is the landing route.</li>
  <li><code>/login</code> – User login page. Also triggers Salesforce login if no tokens found.</li>
  <li><code>/register</code> – User registration form.</li>
  <li><code>/dashboard</code> – Protected route that shows Salesforce Accounts (or other objects). If you’re not authenticated, the app redirects you to <code>/login</code>.</li>
</ul>
<p>All these routes are handled client-side by Vue Router.</p>

<hr />

<h2>5. Brief About DB &amp; Tables</h2>
<p>This project uses a <strong>PostgreSQL</strong> instance:</p>
<ul>
  <li><strong>Users</strong> table:
    <ul>
      <li><code>id SERIAL PRIMARY KEY</code></li>
      <li><code>email VARCHAR(255)</code></li>
      <li><code>password VARCHAR(255)</code> (hashed)</li>
    </ul>
  </li>
</ul>
<p>It’s pretty minimal, focusing on user credentials for each user.</p>

<hr />

<h2>6. Deployment Details</h2>
<h3>Render for Backend &amp; Postgres</h3>
<ul>
  <li>Create a <strong>Web Service</strong> in Render, point to your backend folder/repo.</li>
  <li>Set Build Command (<code>npm install</code>) and Start Command (<code>npm start</code> or <code>node src/server.js</code>).</li>
  <li>Add environment variables: <code>SF_CONSUMER_KEY</code>, <code>SF_CONSUMER_SECRET</code>, <code>SF_CALLBACK_URL</code>, <code>JWT_SECRET</code>, and DB credentials (<code>DB_HOST</code>, etc.).</li>
  <li>Render’s <strong>PostgreSQL</strong> instance is configured.</li>
</ul>

<h3>Netlify for Frontend</h3>
<ul>
  <li>Netlify hosts the static Vue build.</li>
  <li>Build command: <code>npm run build</code>, publish directory: <code>dist</code>.</li>
  <li>Added a <code>_redirects</code> file with <code>/* /index.html 200</code> so sub-routes don’t 404.</li>
  <li>The front-end calls the <strong>Render</strong> backend domain for API requests.</li>
</ul>
<p>Finally, set your <strong>Salesforce Connected App</strong> callback to the Render domain.</p>

<hr />

<h2>Challenges Faced</h2>
<p>Here are some of the interesting hurdles during development and deployment:</p>
<ol>
  <li><strong>Session vs. Token Storage</strong><br />
    Deciding whether to store tokens in localStorage, cookies, or server sessions. Each has pros/cons around security and ease of implementation.Even though using Cookies was a preferred way but it was not implemented due to time crunch.</li>
  <li><strong>CORS &amp; Cross-Domain Setup</strong><br />
    With the front-end on Netlify and the back-end on Render, I had to configure CORS properly so requests with tokens/cookies worked across domains.</li>
  <li><strong>Salesforce OAuth Callback Mismatch</strong><br />
    One small mismatch (like trailing slash vs no slash) can break the OAuth flow. Had to carefully align the callback URL in Salesforce Connected App settings.</li>
  <li><strong>Netlify Sub-Route 404</strong><br />
    Using Vue’s <code>createWebHistory</code> requires a <code>_redirects</code> file to avoid 404 on direct sub-route access (like <code>/login</code> or <code>/dashboard</code>).</li>
  <p><strong>Netlify Sub-Route 404 &amp; Potential Cyclic Redirects</strong><br />
When using Vue’s <code>createWebHistory</code>, the browser expects the server to handle every sub-route (e.g., <code>/login</code>, <code>/dashboard</code>) by returning the same <code>index.html</code> file. If Netlify doesn’t know to serve <code>index.html</code> for those routes, it tries to find actual <code>/login</code> or <code>/dashboard</code> files on disk and returns <em>404 Not Found</em>. To fix that, you need a <code>_redirects</code> file in your final build output containing:
</p>
<pre><code>/* /index.html 200
</code></pre>
<p>
Netlify will then rewrite any path (<code>/login</code>, <code>/dashboard</code>, etc.) to <code>index.html</code>, letting Vue’s client-side router decide which component to render. Without this, a direct sub-route navigation breaks with 404.
</p>

<p>
<strong>Beware of Potential Cyclic Redirects</strong>:  
If your router (or code) automatically redirects <code>/</code> to <code>/login</code>, and Netlify rewrites <code>/login</code> back to <code>/index.html</code>, you can end up in a loop if the app again attempts to redirect to <code>/login</code>. The fix is to avoid a conflicting auto-redirect or to ensure that once <code>index.html</code> is served, your Vue router doesn’t send the user back to <code>/login</code> in a continuous cycle. Sometimes removing <code>{ path: "/", redirect: "/login" }</code> in your routes and letting the app handle a default route in code can prevent these loops. Also double-check any route guards that might cause repeated redirects if the user is unauthenticated. 
</p>

<p>
In short, for <strong>Netlify + Vue + createWebHistory</strong>:
</p>
<ul>
  <li>Add <code>_redirects</code> to rewrite <code>/*</code> → <code>/index.html</code>.</li>
  <li>Remove or carefully manage your <code>"/" → "/login"</code> auto-redirect to avoid cycic re-routing.</li>
  <li>Ensure any route guards don’t cause indefinite redirection if the user lacks auth tokens.</li>
</ul>
</ol>
<p>Each challenge led me to refine the architecture and keep everything stable and secure, while also ensuring the user experience remains smooth.</p>

<hr />

<p><em>Thanks for reading!</em> I hope this README helps you understand the <strong>why</strong> and <strong>how</strong> of the Salesforce Integration project—feel free to clone, fork, or build upon it. If you run into issues, double-check environment variables, rewrite rules, and that pesky Salesforce callback URL. Happy coding!</p>

</body>
