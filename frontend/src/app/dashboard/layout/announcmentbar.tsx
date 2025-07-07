export const revalidate = false; // Server Side Generation // no need to revalidate the page
export const dynamic = 'force-static'; // SSG layout
import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 flex items-center justify-center overflow-hidden shadow animate-fade-in-down ">
      <span className="mr-2 animate-bounce text-xl">🎉</span>
      <div className="relative w-full max-w-2xl">
        <span className="block whitespace-nowrap animate-marquee font-bold">
         National University of Science and Technology , Lahore!
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;

// Tailwind custom animation classes (add to globals.css or tailwind.config.js if not present):
// .animate-marquee { animation: marquee 10s linear infinite; }
// @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
// .animate-fade-in-down { animation: fadeInDown 0.7s ease; }
// @keyframes fadeInDown { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
