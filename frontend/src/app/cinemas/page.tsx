"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/context/storeContext";

const CinemaPage = observer(() => {
  const { cinemasStore, screensStore } = useStore();

  const handleCinemaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await cinemasStore.createCinema();
    screensStore.resetProgress();
  };

  const handleScreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cinemasStore.createdCinema) return;
    await screensStore.createScreen(cinemasStore.createdCinema.id);
    if (
      screensStore.currentScreenIndex ===
      cinemasStore.createdCinema.totalScreens
    ) {
      cinemasStore.closeScreenModal();
      screensStore.setSuccess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-700 text-center tracking-tight drop-shadow">Create a New Cinema</h1>
      <form onSubmit={handleCinemaSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-blue-800">Cinema Name</label>
          <input
            type="text"
            value={cinemasStore.cinemaName}
            onChange={(e) => cinemasStore.setCinemaName(e.target.value)}
            className="w-full border-2 border-blue-200 focus:border-blue-500 px-4 py-2 rounded-lg shadow-sm focus:outline-none transition"
            placeholder="Enter cinema name..."
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-blue-800">Total Screens</label>
          <input
            type="number"
            min={1}
            value={cinemasStore.totalScreens}
            onChange={(e) => cinemasStore.setTotalScreens(Number(e.target.value))}
            className="w-full border-2 border-blue-200 focus:border-blue-500 px-4 py-2 rounded-lg shadow-sm focus:outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition"
          disabled={cinemasStore.loading}
        >
          {cinemasStore.loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              Creating...
            </span>
          ) : (
            "Create Cinema"
          )}
        </button>
        {cinemasStore.error && (
          <div className="text-red-600 text-center font-medium mt-2">
            {cinemasStore.error}
          </div>
        )}
      </form>

      {/* Modal for screen creation */}
      {cinemasStore.showScreenModal && cinemasStore.createdCinema && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-blue-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
              Add Screen {screensStore.currentScreenIndex + 1} of {cinemasStore.createdCinema.totalScreens}
            </h2>
            <form onSubmit={handleScreenSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-blue-800">Screen Name</label>
                <input
                  type="text"
                  value={screensStore.screenName}
                  onChange={(e) => screensStore.setScreenName(e.target.value)}
                  className="w-full border-2 border-blue-200 focus:border-blue-500 px-4 py-2 rounded-lg shadow-sm focus:outline-none transition"
                  placeholder="Enter screen name..."
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-blue-800">Total Seats</label>
                <input
                  type="number"
                  min={1}
                  value={screensStore.totalSeats}
                  onChange={(e) => screensStore.setTotalSeats(Number(e.target.value))}
                  className="w-full border-2 border-blue-200 focus:border-blue-500 px-4 py-2 rounded-lg shadow-sm focus:outline-none transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white font-bold py-2 rounded-lg shadow hover:from-green-700 hover:to-green-500 transition"
                disabled={screensStore.loading}
              >
                {screensStore.loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </span>
                ) : (
                  "Save Screen"
                )}
              </button>
              {screensStore.error && (
                <div className="text-red-600 text-center font-medium mt-2">
                  {screensStore.error}
                </div>
              )}
            </form>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => cinemasStore.closeScreenModal()}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Success message */}
      {screensStore.success && (
        <div className="mt-8 p-5 bg-green-100 text-green-800 rounded-lg text-center text-lg font-semibold shadow">
          Cinema and all screens created successfully!
        </div>
      )}
    </div>
  );
});

export default CinemaPage; 