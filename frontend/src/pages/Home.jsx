import React, { useEffect, useState } from "react";
import axios from "axios";
import Modals from "../others/Modals";
import { Link } from "react-router-dom";
import bgVideo from "../assets/bg.mp4";

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 ">
        <video
          autoPlay
          loop
          muted
        className="w-full h-full object-cover "
          // poster="https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-background-281-large.mp4"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-50 "></div>
      </div>

      {/* Content */}
      <section className="relative z-10 min-h-screen flex justify-center items-center py-12 px-4">
        <div className="w-full max-w-5xl bg-transparent  backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white border-opacity-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center py-5">
            <div>
              <h2 className="text-3xl font-bold text-gray-200 text-center md:text-left">
                🚀 Your Projects
              </h2>
              <p className="text-gray-200 mt-1">
                {projects.length} project{projects.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* New Project Button */}
            <button
              onClick={() => setModal(true)}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 
                        rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl
                        flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Project
            </button>
          </div>

          {/* Project List */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-8">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link to={`/project/${project._id}`} key={project._id}>
                  <div
                    className="bg-white bg-opacity-70 hover:bg-opacity-100 p-5 rounded-xl shadow-lg border border-white border-opacity-30 
                              transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transform group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700">{project.name}</h3>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mt-4">No projects found</h3>
                <p className="text-gray-500 mt-2">Start by creating your first project</p>
                <button
                  onClick={() => setModal(true)}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 
                            rounded-lg shadow transition duration-300 hover:scale-105 inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Component */}
        {modal && <Modals isOpen={modal} onClose={() => setModal(false)} onSubmit={handleCreateProject} />}
      </section>
    </div>
  );
};

export default Home;