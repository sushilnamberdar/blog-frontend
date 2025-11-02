import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { IconSun, IconMoon } from '../ui/icons';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const title = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={toggleTheme}
      title={title}
      className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
    >
      {isDark ? <IconSun /> : <IconMoon />}
      <span className="sr-only">{title}</span>
    </button>
  );
};

export default ThemeToggle;
