import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage system users and tasks</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 border-t-4 border-blue-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Manage Users
              </h3>
              <p className="text-gray-600 mb-6">
                View and manage all users in the system
              </p>
              <a
                href="/admin/users"
                className="inline-block px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Go to Users
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 border-t-4 border-green-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                View All Tasks
              </h3>
              <p className="text-gray-600 mb-6">
                View tasks from all users in the system
              </p>
              <a
                href="/admin/tasks"
                className="inline-block px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                View Tasks
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
