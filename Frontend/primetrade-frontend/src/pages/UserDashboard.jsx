import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import Navbar from "../components/Navbar";

export default function UserDashboard() {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadTasks = async () => {
    try {
      const res = await axios.get("/tasks");
      setTasks(res.data);
      setErr("");
    } catch (error) {
      setErr("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    setUpdatingId(taskId);
    try {
      const newStatus = currentStatus === "pending" ? "completed" : "pending";
      const res = await axios.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (error) {
      setErr("Failed to update task");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (error) {
      setErr("Failed to delete task");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">My Tasks</h1>
            <p className="text-gray-600">Manage and organize your work</p>
          </div>

          {err && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {err}
            </div>
          )}

          <div className="flex gap-4 mb-8">
            <button
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ New Task"}
            </button>
            <button
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 transition-colors"
              onClick={loadTasks}
            >
              Refresh
            </button>
          </div>

          {showForm && (
            <div className="mb-8">
              <TaskForm
                onTaskCreated={handleTaskCreated}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-2xl font-semibold text-gray-900 mb-2">
                No tasks yet
              </p>
              <p className="text-gray-600">
                Create your first task to get started
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
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

                  <div className="flex gap-3">
                    <button
                      disabled={updatingId === t._id}
                      onClick={() => handleToggleStatus(t._id, t.status)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {t.status === "pending"
                        ? "Mark Complete"
                        : "Mark Pending"}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(t._id)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
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
