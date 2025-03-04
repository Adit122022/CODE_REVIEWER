import React, { useEffect, useState } from "react";
import axios from "axios";
import Modals from "../others/Modals";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from API
  const fetchProjects = () => {
    axios
    .get("http://localhost:3000/v1/api/project/list")
    .then((response) => {
      setProjects(response.data);
    })
    .catch((error) => {
      console.error("Error fetching projects:", error);
    });
  };

  // Function to handle form submission
  const handleCreateProject = (name) => {
    axios
      .post("http://localhost:3000/v1/api/project/create", { name })
      .then(() => {
        fetchProjects(); // Refresh project list after creation
        setModal(false); // Close modal
      })
      .catch((error) => {
        console.error("Error creating project:", error);
      });
  };

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Project List
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-200 transition duration-300 hover:shadow-lg hover:bg-blue-100"
              >
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">No projects found.</p>
          )}
        </div>

        {/* Modal Component */}
        {modal && (
          <Modals
            isOpen={modal}
            onClose={() => setModal(false)}
            onSubmit={handleCreateProject}
          />
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 active:scale-95"
          >
            New Project
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
