// --- DUMMY DATA ---
// As requested, dummy data to show if the fetch fails.
// Added more posts and more tags.
export const DUMMY_POSTS = [
  {
    _id: 'dummy1',
    title: 'Welcome to the Blog (Dummy Data)',
    author: { name: 'Admin' },
    createdAt: new Date().toISOString(),
    content: `
      <p>This is dummy content because the backend could not be reached. Please check that your API server is running.</p>
      <p>This is a full-featured blog front-end, built entirely in a single React file. It includes:</p>
      <ul>
        <li>Authentication (Login, Register, Logout)</li>
        <li>Automatic 14-minute token refresh</li>
        <li>A secure fetch wrapper</li>
        <li>A multi-page routing system</li>
        <li>Tag filtering</li>
        <li>A clean, modern, responsive design</li>
      </ul>
      <pre><code>console.log("Welcome to the blog!");</code></pre>
    `,
    tags: ['Welcome', 'React', 'Demo']
  },
  {
    _id: 'dummy2',
    title: 'Understanding React Hooks',
    author: { name: 'Jane Doe' },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    content: '<p>React Hooks are a powerful feature that let you use state and other React features without writing a class. This post explores useState, useEffect, and useContext.</p><p><code>useState</code> is for managing local component state. <code>useEffect</code> is for handling side effects like data fetching. <code>useContext</code> is for accessing global state, like our <code>AuthContext</code>!</p>',
    tags: ['React', 'JavaScript', 'WebDev']
  },
  {
    _id: 'dummy3',
    title: 'Styling with Tailwind CSS',
    author: { name: 'John Smith' },
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    content: '<p>Tailwind CSS is a utility-first CSS framework that makes it incredibly fast to build modern user interfaces. We used it to build this very blog frontend!</p><p>Instead of writing custom CSS files, you use utility classes directly in your HTML (or JSX, in our case).</p><p>Example:</p><pre><code>&lt;div class="bg-white p-6 rounded-lg shadow-md"&gt;\n  Hello, Tailwind!\n&lt;/div&gt;</code></pre>',
    tags: ['CSS', 'Tailwind', 'Design']
  },
  {
    _id: 'dummy4',
    title: 'A Guide to API Security',
    author: { name: 'Admin' },
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    content: '<p>Securing your API is critical. Our backend uses JWT (JSON Web Tokens) for authentication. The frontend stores an <code>accessToken</code> and a <code>refreshToken</code> (conceptually). The <code>accessToken</code> is sent with each secure request, and the <code>refreshToken</code> is used to get a new <code>accessToken</code> when it expires.</p>',
    tags: ['Security', 'API', 'WebDev']
  },
  {
    _id: 'dummy5',
    title: 'What is Node.js?',
    author: { name: 'Chris Miles' },
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    content: '<p>Node.js is a back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser. Our backend API for this blog is built with Express.js, which is the most popular framework for Node.js.</p>',
    tags: ['Node.js', 'JavaScript', 'Backend']
  }
];

export const DUMMY_COMMENTS = {
  dummy1: [
    { _id: 'c1', author: { name: 'Jane Doe' }, content: 'Great first post!', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { _id: 'c2', author: { name: 'John Smith' }, content: 'Thanks for the demo!', createdAt: new Date(Date.now() - 1800000).toISOString() }
  ],
  dummy2: [
    { _id: 'c3', author: { name: 'Admin' }, content: 'Hooks are truly a game-changer.', createdAt: new Date(Date.now() - 7200000).toISOString() }
  ],
  dummy3: [
    { _id: 'c4', author: { name: 'Jane Doe' }, content: 'I love Tailwind CSS!', createdAt: new Date(Date.now() - 9000000).toISOString() }
  ],
};
