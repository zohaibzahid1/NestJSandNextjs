import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md mb-8 w-full">
      <div className="text-xl font-bold text-blue-700">MyApp</div>
      <div className="flex gap-6">
        <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 no-underline">Home</Link>
        <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 no-underline">Login</Link>
        <Link href="/signup" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 no-underline">Signup</Link>
        <Link href="/address" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 no-underline">Address</Link>
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 no-underline">Dashboard</Link>
        <Link href="/aboutus" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 no-underline">About Us</Link>
    </div>
    </nav>
  );
};

export default Navbar;
