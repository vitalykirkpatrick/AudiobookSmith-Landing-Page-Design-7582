import React from 'react';

/**
 * SafeIcon Component
 * 
 * Safely renders a React Icon component.
 * If the icon is undefined or null, it renders nothing or a fallback, preventing crashes.
 * 
 * Usage:
 * import { FiCheck } from 'react-icons/fi';
 * <SafeIcon icon={FiCheck} className="text-green-500" />
 */
const SafeIcon = ({ icon: Icon, fallback, ...props }) => {
  if (!Icon) {
    if (fallback) {
      return fallback;
    }
    return null;
  }

  // If Icon is a function/component, render it
  if (typeof Icon === 'function') {
    return <Icon {...props} />;
  }

  // If it's already an element (less common with react-icons imports, but possible)
  return React.cloneElement(Icon, props);
};

export default SafeIcon;