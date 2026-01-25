"use client";

import { useAuth } from "../components/AuthProvider";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
              🏰
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                GAJIAN NEST
              </h1>
              <p className="text-xs text-gray-500">Guild Raid Manager</p>
            </div>
          </div>

          {/* User Info & Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <a
                  href="/admin/users"
                  className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                >
                  👥 Admin
                </a>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500">Logged in</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/auth/login"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
