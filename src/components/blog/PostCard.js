import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col dark:bg-gray-800 dark:shadow-lg dark:shadow-black/20">
    {/* Use post.coverImage if it exists, otherwise use placeholder */}
    <Link to={`/post/${post._id}`}>
      <img
        src={post.coverImage || `https://placehold.co/600x400/64748B/FFFFFF?text=${post.title.split(' ').slice(0, 2).join('+')}`}
        alt={post.title}
        className="w-full h-48 object-cover cursor-pointer"
      />
    </Link>
    <div className="p-6 flex flex-col flex-grow">
      <div className="mb-3">
        {post.tags?.map(tag => (
          <Link
            key={tag}
            to={`/?tag=${tag}`}
            className="inline-block bg-gray-100 text-slate-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-slate-200 dark:hover:bg-gray-600"
          >
            {tag}
          </Link>
        ))}
      </div>
      <Link to={`/post/${post._id}`}>
        <h2
          className="text-2xl font-semibold text-gray-800 mb-2 truncate cursor-pointer hover:text-slate-600 dark:text-gray-100 dark:hover:text-slate-300"
        >
          {post.title}
        </h2>
      </Link>
      <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
         <img src={post.author?.avatar || `https://i.pravatar.cc/150?u=${post.author?._id}`} alt={post.author?.name} className="w-6 h-6 rounded-full mr-2 inline-block" /> {post.author?.name || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-6 text-sm flex-grow dark:text-gray-300">{post.content && post.content.replace(/<[^>]+>/g, '').substring(0, 120)}...</p>
      <Link
        to={`/post/${post._id}`}
        className="font-medium text-slate-700 hover:text-slate-900 self-start dark:text-slate-300 dark:hover:text-slate-100"
      >
        Read more &rarr;
      </Link>
    </div>
  </div>
);

export default PostCard;
