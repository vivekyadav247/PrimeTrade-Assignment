import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminUserTasks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");
  const [userName, setUserName] = useState("");

  const load = async () => {
    try {
      const res = await axios.get(`/admin/users/${id}/tasks`);
      setTasks(res.data);
      if (res.data.length > 0) {
        setUserName(res.data[0].createdBy?.name);
      }
      setErr("");
    } catch (error) {
      setErr("Failed to load tasks");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                {userName}'s Tasks
              </h1>
              <p className="text-gray-600">Tasks created by this user</p>
            </div>
            <button
              onClick={() => navigate("/admin/users")}
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
              <p className="text-gray-600">
                This user hasn't created any tasks
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {tasks.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {t.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
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

                  <div className="text-xs text-gray-400 pt-4 border-t border-gray-200">
                    Created: {new Date(t.createdAt).toLocaleDateString()} at{" "}
                    {new Date(t.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
