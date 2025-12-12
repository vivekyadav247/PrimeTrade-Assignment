import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const load = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/admin/tasks?page=${pageNum}&limit=10`);
      setTasks(res.data.tasks);
      setTotal(res.data.totalPages);
      setErr("");
    } catch (error) {
      setErr("Failed to load tasks");
    }
  };

  useEffect(() => {
    load(page);
  }, [page]);

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (
      !window.confirm(`Are you sure you want to delete task "${taskTitle}"?`)
    ) {
      return;
    }

    setDeleting(taskId);
    try {
      await axios.delete(`/admin/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      setErr("");
    } catch (error) {
      setErr("Failed to delete task");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                All Tasks
              </h1>
              <p className="text-gray-600">View all tasks from all users</p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 transition-colors"
            >
              Back
            </button>
          </div>

          {err && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {err}
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-2xl font-semibold text-gray-900 mb-2">
                No tasks
              </p>
              <p className="text-gray-600">No tasks created yet</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {tasks.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {t.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        By:{" "}
                        <span className="font-semibold">
                          {t.createdBy?.name}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t.createdBy?.email}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${
                        t.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {t.status === "pending" ? "Pending" : "Completed"}
                    </span>
                  </div>

                  {t.description && (
                    <p className="text-gray-600 mb-4">{t.description}</p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-400">
                      Created: {new Date(t.createdAt).toLocaleDateString()} at{" "}
                      {new Date(t.createdAt).toLocaleTimeString()}
                    </div>
                    <button
                      onClick={() => handleDeleteTask(t._id, t.title)}
                      disabled={deleting === t._id}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === t._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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
