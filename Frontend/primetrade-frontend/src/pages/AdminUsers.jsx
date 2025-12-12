import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const load = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/admin/users?page=${pageNum}&limit=10`);
      setUsers(res.data.users);
      setTotal(res.data.totalPages);
      setErr("");
    } catch (error) {
      setErr("Failed to load users");
    }
  };

  useEffect(() => {
    load(page);
  }, [page]);

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userName}? All their tasks will also be deleted.`
      )
    ) {
      return;
    }

    setDeleting(userId);
    try {
      await axios.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      setErr("");
    } catch (error) {
      setErr("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">All Users</h1>
          <p className="text-gray-600 mb-8">Manage and view all system users</p>

          {err && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {err}
            </div>
          )}

          <div className="grid gap-4">
            {users.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex justify-between items-center border-l-4 border-purple-500"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{u.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{u.email}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {u.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
                <div className="flex gap-3 ml-4">
                  <Link
                    to={`/admin/users/${u._id}/tasks`}
                    className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
                  >
                    View Tasks
                  </Link>
                  <button
                    onClick={() => handleDeleteUser(u._id, u.name)}
                    disabled={deleting === u._id}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {deleting === u._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {total > 1 && (
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-6 py-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-lg font-semibold text-gray-700 px-4">
                Page {page} of {total}
              </span>
              <button
                disabled={page === total}
                onClick={() => setPage(page + 1)}
                className="px-6 py-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
