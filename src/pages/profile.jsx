import React from "react";

const ProfilePage = () => {
  const user = {
    name: "Muhammad Jawad",
    role: "Lab Engineer, UET Taxila",
    email: "jawad@example.com",
    phone: "+92 300 1234567",
    location: "Taxila, Pakistan",
    about:
      "With over 12 years of experience in academia, industry, and research, I specialize in Industrial and Manufacturing Engineering. Passionate about education, innovation, and excellence.",
    avatar:
      "https://i.pravatar.cc/150?img=12", // Replace with actual image or avatar
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-32 h-32 rounded-full shadow-md object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>

        <div className="mt-6 space-y-4 text-gray-700">
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Phone:</strong> {user.phone}
          </div>
          <div>
            <strong>Location:</strong> {user.location}
          </div>
          <div>
            <strong>About:</strong>
            <p className="mt-1 text-sm text-gray-600">{user.about}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
