"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../context/storeContext";
import { Booking } from "@/stores/userStore";

const ProfilePage = observer(() => {
  const { userStore } = useStore();

  useEffect(() => {
    userStore.fetchMyBookings();
  }, [userStore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 tracking-tight drop-shadow-sm text-center">My Profile</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">My Bookings</h2>
        {userStore.loadingBookings ? (
          <div className="text-center text-blue-500">Loading bookings...</div>
        ) : userStore.bookingsError ? (
          <div className="text-center text-red-500">{userStore.bookingsError}</div>
        ) : userStore.myBookings.length === 0 ? (
          <div className="text-center text-gray-500">No bookings found.</div>
        ) : (
          <div className="space-y-4">
            {userStore.myBookings.map((booking: Booking) => (
              <div key={booking.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold text-green-700">Screen: <span className="text-gray-700">{booking.screen.name}</span></div>
                  <div className="font-semibold text-purple-700">Seat Number: <span className="text-gray-700">{booking.seatNumber}</span></div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">Booking ID: {booking.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ProfilePage; 