"use client";
import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-start">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-4 drop-shadow-lg">Welcome to CineBook</h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl">
          Book your favorite seats at top cinemas, discover the latest movies, and enjoy a seamless movie-going experience.
        </p>
        <Link href="/booking">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition">
            Book Tickets Now
          </button>
        </Link>
      </section>
      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-400">
          <span className="text-4xl mb-3">🎬</span>
          <h3 className="text-xl font-bold text-blue-700 mb-2">Easy Booking</h3>
          <p className="text-gray-600">Select your cinema, screen, and seat in just a few clicks. No hassle, no queues!</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-purple-400">
          <span className="text-4xl mb-3">💺</span>
          <h3 className="text-xl font-bold text-purple-700 mb-2">Live Seat Selection</h3>
          <p className="text-gray-600">See real-time seat availability and choose the perfect spot for your movie night.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-pink-400">
          <span className="text-4xl mb-3">🍿</span>
          <h3 className="text-xl font-bold text-pink-700 mb-2">Top Cinemas & Movies</h3>
          <p className="text-gray-600">Browse the latest releases and book at the best cinemas in town.</p>
        </div>
      </section>
      {/* Popular Cinemas/Movies Section (static for now) */}
      <section className="w-full max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-extrabold text-blue-800 mb-6 text-center">Popular Cinemas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🏢</span>
            <div className="font-bold text-lg text-blue-700 mb-1">Grand City Cinema</div>
            <div className="text-gray-500 text-sm">Downtown, Main Street</div>
          </div>
          <div className="bg-gradient-to-br from-purple-200 to-purple-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🏢</span>
            <div className="font-bold text-lg text-purple-700 mb-1">Starplex</div>
            <div className="text-gray-500 text-sm">Mall Road, Uptown</div>
          </div>
          <div className="bg-gradient-to-br from-pink-200 to-pink-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🏢</span>
            <div className="font-bold text-lg text-pink-700 mb-1">CineWorld</div>
            <div className="text-gray-500 text-sm">Lakeview Avenue</div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm mt-auto">
        &copy; {new Date().getFullYear()} CineBook. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
