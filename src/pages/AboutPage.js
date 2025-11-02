import React from 'react';

const AboutPage = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <article className="prose prose-slate lg:prose-lg dark:prose-invert">
      <h1>About MyBlog</h1>
      <p>This is a demonstration blog application built to showcase a modern, single-file React frontend communicating with a robust backend API.</p>
      <p>The entire frontend you are interacting with was originally built in a single <code>.jsx</code> file and has now been refactored into a professional project structure. This includes:</p>
      <ul>
        <li>A smart, multi-page routing system.</li>
        <li>Global state management with React Context for authentication.</li>
        <li>Automatic token refresh logic.</li>
        <li>All components, pages, and styling.</li>
      </ul>
      <p>The styling is done using Tailwind CSS, a utility-first CSS framework. The blog post content is styled using the <code>@tailwindcss/prose</code> plugin, which provides beautiful typographic defaults.</p>
    </article>
  </div>
);

export default AboutPage;
