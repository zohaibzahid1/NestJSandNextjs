"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../context/storeContext";
import { cinema, screen } from "@/stores/bookingStore";

const BookingPage = observer(() => {
  const { bookingStore } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch cinemas on mount if not already loaded
  useEffect(() => {
    
      bookingStore.fetchCinemas();
    
    bookingStore.clearAll();

  }, []);

  // Fetch seats when a screen is selected
  useEffect(() => {
    if (bookingStore.currentScreen) {
      bookingStore.fetchSeats();
    }
  }, [bookingStore.currentScreen]);

  // Helper to determine if a seat is booked
  const isSeatBooked = (seatNumber: number) => {
    const seat = bookingStore.seats.find(s => s.seatNumber === seatNumber);
    return seat && seat.user && seat.user.id;
  };

  // Helper to determine if a seat is selected
  const isSeatSelected = (seatNumber: number) => bookingStore.selectedSeatNumbers.includes(seatNumber);

  // Render seats grid with selection support
  const renderSeats = () => {
    if (!bookingStore.currentScreen) return null;
    const totalSeats = bookingStore.currentScreen.totalSeats;
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const booked = isSeatBooked(i);
      const selected = isSeatSelected(i);
      seats.push(
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center rounded m-1 border text-sm font-semibold transition
            ${booked ? "bg-red-400 text-white border-red-600 cursor-not-allowed" :
              selected ? "bg-blue-400 text-white border-blue-600 ring-2 ring-blue-300 cursor-pointer" :
              "bg-green-200 border-green-400 hover:bg-green-300 cursor-pointer"}
          `}
          onClick={() => {
            if (!booked && !bookingStore.loading) bookingStore.toggleSeatSelection(i);
          }}
          style={{ pointerEvents: booked ? "none" : "auto", opacity: bookingStore.loading ? 0.6 : 1 }}
        >
          {i}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-8 gap-2 mt-4 mb-4 relative">
        {bookingStore.loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        )}
        {seats}
      </div>
    );
  };

  // Render error message
  const renderError = () => (
    bookingStore.error && (
      <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center border border-red-300 font-medium shadow-sm">
        Failed to book ticket(s)
      </div>
    )
  );

  // Render confirmation modal
  const renderConfirmModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full border border-gray-200 relative">
        <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">Confirm Booking</h3>
        <div className="mb-4 text-center text-gray-700">
          You are about to book the following seat{bookingStore.selectedSeatNumbers.length > 1 ? 's' : ''}:
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {bookingStore.selectedSeatNumbers.map(num => (
              <span key={num} className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm border border-blue-200">
                Seat {num}
              </span>
            ))}
          </div>
        </div>
        {renderError()}
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-5 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            onClick={async () => {
              setShowConfirm(false);
              await bookingStore.bookSelectedSeats();
            }}
            disabled={bookingStore.loading}
          >
            Confirm
          </button>
          <button
            className="px-5 py-2 rounded bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
            onClick={() => {
              setShowConfirm(false);
              bookingStore.error = null;
            }}
            disabled={bookingStore.loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1 tracking-tight drop-shadow-sm">Book Your Seat</h1>
          <p className="text-gray-500 text-sm">Choose your cinema, screen, and seat below</p>
        </div>
        {/* Error message (takes precedence over success) */}
        {renderError()}
        {/* Success message from MobX store (only if no error) */}
        {!bookingStore.error && bookingStore.successMsg && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-center border border-green-300 animate-fade-in font-medium shadow-sm">
            {bookingStore.successMsg}
          </div>
        )}
        {/* Cinema selection */}
        <div className="mb-4">
          <label htmlFor="cinema" className="block mb-2 font-semibold text-gray-700">Select Cinema:</label>
          <select
            id="cinema"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition mb-1 bg-gray-50"
            value={bookingStore.currentCinema ? bookingStore.currentCinema.id : ""}
            onChange={e => {
              const selected = bookingStore.cinemas.find(c => c.id === Number(e.target.value));
              bookingStore.setCurrentCinema(selected || null);
            }}
          >
            <option value="">-- Choose a cinema --</option>
            {bookingStore.cinemas.map((cinema: cinema) => (
              <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
            ))}
          </select>
        </div>
        {/* Screen selection only if cinema is selected */}
        {bookingStore.currentCinema && (
          <div className="mb-4">
            <label htmlFor="screen" className="block mb-2 font-semibold text-gray-700">Select Screen:</label>
            <select
              id="screen"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-gray-50"
              value={bookingStore.currentScreen ? bookingStore.currentScreen.id : ""}
              onChange={e => {
                const selected = bookingStore.currentCinema?.screens.find(s => s.id === Number(e.target.value));
                bookingStore.setCurrentScreen(selected || null);
              }}
            >
              <option value="">-- Choose a screen --</option>
              {bookingStore.currentCinema.screens.map((screen: screen) => (
                <option key={screen.id} value={screen.id}>{screen.name}</option>
              ))}
            </select>
          </div>
        )}
        {/* Show seats grid if a screen is selected */}
        {bookingStore.currentScreen && (
          <>
            {/* Live Screen stats calculated from seats */}
            {(() => {
              const totalSeats = bookingStore.currentScreen.totalSeats;
              const totalBooked = bookingStore.seats.filter(s => s.user && s.user.id).length;
              const totalRemaining = totalSeats - totalBooked;
              return (
                <div className="mb-6 flex justify-between items-center gap-2">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 shadow-sm">Total Seats: {totalSeats}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200 shadow-sm">Available: {totalRemaining}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold border border-red-200 shadow-sm">Booked: {totalBooked}</span>
                  </div>
                </div>
              );
            })()}
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Select Your Seat</h2>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-inner mb-4 relative">
              {/* LCD Screen visual at the top */}
              <div className="flex justify-center mb-6">
                <div className="w-2/3 h-6 bg-gradient-to-b from-gray-300 to-gray-100 rounded-b-2xl shadow-inner flex items-center justify-center border-b-4 border-gray-400">
                  <span className="text-xs font-mono tracking-widest text-gray-700 drop-shadow-sm">SCREEN</span>
                </div>
              </div>
              {renderSeats()}
              {/* Book Tickets Button */}
              <div className="flex justify-center mt-6">
                <button
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={bookingStore.selectedSeatNumbers.length === 0 || bookingStore.loading}
                  onClick={() => setShowConfirm(true)}
                >
                  Book Tickets
                </button>
              </div>
            </div>
            <div className="flex items-center mt-4 gap-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-200 border-green-400 border rounded shadow-sm" />
                <span className="text-gray-600 text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-400 border-red-600 border rounded shadow-sm" />
                <span className="text-gray-600 text-sm">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-400 border-blue-600 border rounded shadow-sm" />
                <span className="text-gray-600 text-sm">Selected</span>
              </div>
            </div>
            {/* Confirmation Modal */}
            {showConfirm && renderConfirmModal()}
          </>
        )}
      </div>
    </div>
  );
});

export default BookingPage; 