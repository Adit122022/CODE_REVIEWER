import React, { useEffect, useState } from "react";
import axios from "axios";
import Modals from "../others/Modals";
import { Link } from "react-router-dom";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/v1/api/project/list");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Function to handle form submission
  const handleCreateProject = async (name) => {
    try {
      await axios.post("http://localhost:3000/v1/api/project/create", { name });
      fetchProjects(); // Refresh project list after creation
      setModal(false); // Close modal
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center py-5">
          <h2 className="text-3xl font-bold text-gray-800 text-center md:text-left">
            🚀 Your Projects
          </h2>

          {/* New Project Button */}
          <button
            onClick={() => setModal(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 
                      rounded-lg shadow-lg transition duration-300 hover:scale-105"
          >
            + New Project
          </button>
        </div>

        {/* Project List */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link to={`/project/${project._id}`} key={project._id}>
                <div
                  className="bg-white p-5 rounded-lg shadow-md border border-gray-300 
                            transition duration-300 hover:shadow-xl hover:bg-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full text-lg">
              No projects found. Start by adding a new one!
            </p>
          )}
        </div>

        {/* Modal Component */}
        {modal && <Modals isOpen={modal} onClose={() => setModal(false)} onSubmit={handleCreateProject} />}
      </div>
    </section>
  );
};

export default Home;
