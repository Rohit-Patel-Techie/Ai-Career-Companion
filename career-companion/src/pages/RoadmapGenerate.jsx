import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RoadmapGenerate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const doGenerate = async () => {
      const career = location.state?.career;
      if (!career) {
        setLoading(false);
        setError("No career context provided. Go back and pick a suggestion.");
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setLoading(false);
          setError("Missing auth token. Please login again.");
          return;
        }
        const res = await fetch("http://localhost:8000/api/roadmaps/generate/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ career }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Generate failed: ${res.status} ${t}`);
        }
        const data = await res.json();
        const shortId = data?.id;
        if (!shortId) {
          throw new Error("No roadmap id returned from backend.");
        }
        navigate(`/roadmap/${shortId}`, { replace: true });
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to generate roadmap");
        toast.error("Failed to generate roadmap");
      } finally {
        setLoading(false);
      }
    };

    doGenerate();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Generating your personalized roadmap…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default RoadmapGenerate;
