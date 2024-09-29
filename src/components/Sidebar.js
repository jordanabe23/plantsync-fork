'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaComments, FaCalendarAlt, FaUsers, FaCog, FaBars, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/' },
    { name: 'Chat', icon: <FaComments />, path: '/chat' },
    { name: 'Calendar', icon: <FaCalendarAlt />, path: '/calendar' },
    { name: 'People', icon: <FaUsers />, path: '/people' },
    { name: 'Settings', icon: <FaCog />, path: '/settings' },
    // Add the logout button as a menu item
    { name: 'Logout', icon: <FaSignOutAlt />, action: handleLogout }
  ];

  function handleLogout() {
    // Clear the JWT token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page or home page
    router.push('/login');
  }

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-20'} bg-blue-200 p-5 pt-8 relative duration-300`}>
      <FaBars
        className={`absolute cursor-pointer -right-3 top-9 w-7 border-blue-300 border-2 rounded-full ${!isExpanded && 'rotate-180'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      <div className="flex items-center gap-x-4">
        <FaComments className="text-2xl text-gray-800" />
        {isExpanded && <span className="text-gray-800 text-xl font-bold">Reminders</span>}
      </div>
      <ul className="pt-6">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <li key={index} className="flex items-center">
              {item.action ? (
                <div
                  onClick={item.action}
                  className={`flex items-center gap-x-4 cursor-pointer p-2 rounded-md mt-2 hover:bg-blue-300`}
                >
                  <span className="text-2xl text-gray-800">{item.icon}</span>
                  {isExpanded && <span className="text-gray-800 text-lg">{item.name}</span>}
                </div>
              ) : (
                <Link href={item.path} passHref>
                  <div
                    className={`flex items-center gap-x-4 cursor-pointer p-2 rounded-md mt-2 ${isActive ? 'bg-blue-300' : 'hover:bg-blue-300'}`}
                  >
                    <span className="text-2xl text-gray-800">{item.icon}</span>
                    {isExpanded && <span className="text-gray-800 text-lg">{item.name}</span>}
                  </div>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
