import React from 'react';

const PrivacyPage = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <article className="prose prose-slate lg:prose-lg dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>This is a dummy privacy policy for a demo application.</p>
      <p>We (MyBlog) do not collect, store, or share any of your personal data. Any information you enter (like in the login or register forms) is processed by the backend API you provide and is not visible to us.</p>
      <h2>Data We "Collect"</h2>
      <p>When you register, you provide a name, email, and password. This is stored securely in the backend database (e.g., MongoDB) and is only used for authentication.</p>
      <h2>Cookies & Local Storage</h2>
      <p>This application does not use cookies for authentication. The JSON Web Token (JWT) is managed in React's state. In a production app, refresh tokens might be stored in secure <code>httpOnly</code> cookies, but for this demo, we are using a simplified local-state-based approach. We use <code>localStorage</code> only to persist your theme preference.</p>
      <h2>Your Rights</h2>
      <p>You have the right to not use this application. Since it's a demo, you also have the right to be impressed.</p>
    </article>
  </div>
);

export default PrivacyPage;
