import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { IconPlusCircle, IconTrash2, IconArrowUp, IconArrowDown } from '../components/ui/icons';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([{ type: 'text', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { axiosInstance } = useAuth();
  const { showNotification } = useNotification();
  const [isUpdate, setIsUpdate] = useState(false);
  const [postId, setPostId] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.post) {
      const { post } = location.state;
      setTitle(post.title);
      setCategory(post.category);
      setTags(post.tags.join(', '));
      setContentBlocks(post.contentBlocks);
      setPostId(post._id);
      setIsUpdate(true);
    }
  }, [location.state]);

  const handleBlockChange = (index, value) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].value = value;
    setContentBlocks(newBlocks);
  };

  const handleFileChange = (index, file) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].value = file;
    setContentBlocks(newBlocks);
  };

  const addBlock = (type) => {
    setContentBlocks([...contentBlocks, { type, value: type === 'image' ? null : '' }]);
  };

  const removeBlock = (index) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...contentBlocks];
    const block = newBlocks[index];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newBlocks.length) return;
    newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, block);
    setContentBlocks(newBlocks);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axiosInstance.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.url;
    } catch (err) {
      throw err.response?.data?.message || err.message || 'Image upload failed';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if(contentBlocks.length === 0 || contentBlocks.every(block => !block.value)) {
      setError('Please add at least one content block.');
      setLoading(false);
      return;
    }

    try {
      let coverImageUrl = '';
      if (coverImage) {
        coverImageUrl = await handleImageUpload(coverImage);
      }

      const processedContentBlocks = await Promise.all(
        contentBlocks.map(async (block) => {
          if (block.type === 'image' && block.value instanceof File) {
            const imageUrl = await handleImageUpload(block.value);
            return { ...block, value: imageUrl };
          }
          return block;
        })
      );

      const postData = {
        title,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        coverImage: coverImageUrl,
        contentBlocks: processedContentBlocks.filter(block => block.value),
      };

      const url = isUpdate ? `/posts/${postId}` : '/posts';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await axiosInstance({
        method,
        url,
        data: postData,
      });

      showNotification('Post created successfully!', 'success');
      navigate(`/post/${res.data.post._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Create New Post</h1>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Post Details</h2>
          <div className="space-y-4">
            <Input
              id="title"
              label="Title"
              type="text"
              placeholder="Your post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              id="category"
              label="Category"
              type="text"
              placeholder="e.g. Technology, Lifestyle"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <Input
              id="tags"
              label="Tags (comma-separated)"
              type="text"
              placeholder="e.g. React, JavaScript, WebDev"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image
              </label>
              <input
                id="coverImage"
                type="file"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className='flex space-x-1'>
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Content Builder</h2><p className='text-red-400'>*</p>
          </div>
          <div className="space-y-6">
            {contentBlocks.map((block, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{block.type}</span>
                  <div className="flex items-center space-x-2">
                    <Button type="button" size="sm" variant="ghost" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="w-auto">
                      <IconArrowUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => moveBlock(index, 'down')} disabled={index === contentBlocks.length - 1} className="w-auto">
                      <IconArrowDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="danger" onClick={() => removeBlock(index)} className="w-auto">
                      <IconTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {block.type === 'text' && (
                  <textarea
                    rows="5"
                    placeholder="Write your text here..."
                    value={block.value}
                    onChange={(e) => handleBlockChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                )}
                {block.type === 'heading' && (
                  <Input
                    type="text"
                    placeholder="Enter heading text"
                    value={block.value}
                    onChange={(e) => handleBlockChange(index, e.target.value)}
                  />
                )}
                {block.type === 'image' && (
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center space-x-4">
            <div className="relative">
              <Button type="button" variant="secondary" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                <IconPlusCircle className="h-4 w-4 mr-2" /> Add Content
              </Button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                  <button onClick={() => { addBlock('text'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Add Text</button>
                  <button onClick={() => { addBlock('heading'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Add Heading</button>
                  <button onClick={() => { addBlock('image'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Add Image</button>
                  <button onClick={() => { addBlock('text'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Add Link</button>
                  <button onClick={() => { addBlock('text'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Add iFrame</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm dark:text-red-400">{error}</p>}
        <Button type="submit" isLoading={loading} className="w-full">Publish Post</Button>
      </form>
    </div>
  );
};

export default CreatePostPage;
