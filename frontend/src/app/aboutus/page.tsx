
export const dynamic = 'force-static';
export const revalidate = false;

const AboutUsPage = async () => {
  let mission = "Unable to load mission statement.";

  try {
    const res = await fetch("http://localhost:3000/aboutus", {
      cache: 'force-cache',
    });
    const data = await res.json();
    mission = data.message;
  } catch (error) {
    console.error("Error fetching mission:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2 tracking-tight drop-shadow-sm">About Us</h1>
          <p className="text-gray-500 text-lg text-center max-w-xl">
            Welcome to our Cinema Booking Platform! We are passionate about making your movie experience seamless, fun, and memorable.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Our Mission</h2>
          <p className="text-gray-700 text-base leading-relaxed">{mission}</p>
        </div>

        {/* Team Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Meet the Team</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { name: "Zohaib", role: "Founder", initial: "Z" },
              { name: "Maria", role: "Lead Developer", initial: "M" },
              { name: "Ali", role: "UI/UX Designer", initial: "A" },
            ].map((member) => (
              <div key={member.name} className="flex flex-col items-center bg-blue-50 rounded-xl p-4 shadow border border-blue-100 w-40">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 to-blue-200 flex items-center justify-center text-2xl font-bold text-white mb-2">
                  {member.initial}
                </div>
                <div className="font-semibold text-blue-800">{member.name}</div>
                <div className="text-xs text-gray-500">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Cinema Booking Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
