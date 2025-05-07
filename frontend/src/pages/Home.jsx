import React, { useEffect, useState } from "react";
import axios from "axios";
import Modals from "../others/Modals";
import { Link } from "react-router-dom";
import Background from "../Background/Background";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    if (showProjects) {
      fetchProjects();
    }
  }, [showProjects]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/v1/api/project/list");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleCreateProject = async (name) => {
    try {
      await axios.post("http://localhost:3000/v1/api/project/create", { name });
      fetchProjects();
      setModal(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
     <Background/>
     <div className="absolute inset-0 bg-black/80"></div>

      {/* Main Content */}
      <section className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Illustration Section (Left) */}
        {!showProjects && (
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-12 text-center">
            <div className=" rounded-full w-[35vw] h-[70vh] overflow-hidden">
              <img 
                src="https://i.pinimg.com/736x/bb/50/0e/bb500e8deca4e8227dfd45b77d490414.jpg"
                alt="Project Management" 
                className="w-full h-full mb-8 scale-125  object-cover animate-float"
              />
             
            </div>
          </div>
        )}

        {/* Projects Panel (Right) - Slides in when Get Started is clicked */}
        <div className={`w-full ${showProjects ? 'lg:w-full' : 'lg:w-1/2'} transition-all duration-500 ease-in-out`}>
          <div className={`  bg-transparent
                          ${showProjects ? 'h-full min-h-screen' : 'h-full'} p-8 lg:p-12 
                          `}>
            {showProjects ? (
              <>
                <div className="flex justify-between items-center mb-12">
                  <div>
                    
                    <h2 className="text-3xl font-bold text-white flex items-center">
                      <button 
                        onClick={() => setShowProjects(false)}
                        className="mr-4 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                      >
                        ←
                      </button>
                      Your Projects
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {projects.length} project{projects.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 
                              rounded-lg shadow-lg transition-all duration-300 hover:scale-105 
                              hover:shadow-xl flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Project
                  </button>
                </div>

                {/* Projects Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <Link to={`/project/${project._id}`} key={project._id}>
                        <div className="bg-gray-800/50 hover:bg-gray-700/70 p-6 rounded-xl border border-gray-700 
                                      transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400">
                              {project.name}
                            </h3>
                            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                              Active
                            </div>
                          </div>
                          <p className="text-gray-400 mt-3 text-sm">
                            Last updated: {new Date().toLocaleDateString()}
                          </p>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex -space-x-2">
                              {/* Team avatars placeholder */}
                              <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                              <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-white mt-4">No projects yet</h3>
                        <p className="text-gray-400 mt-2">Create your first project to get started</p>
                        <button
                          onClick={() => setModal(true)}
                          className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 
                                    rounded-lg shadow-lg transition-all duration-300 hover:scale-105 
                                    inline-flex items-center mx-auto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Create Project
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center px-4">
  <div className="max-w-3xl">
    {/* Animated title with gradient text */}
    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Elevate Your Workflow
      </span>
    </h1>
    
    {/* Dynamic subtitle with typing effect (you'll need to implement the animation) */}
    <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
      Where <span className="text-blue-300 font-medium">ideas</span> meet <span className="text-purple-300 font-medium">execution</span>
    </p>
    
    {/* Hero description with animated punctuation */}
    <div className="mb-10">
      <p className="text-lg md:text-xl text-gray-300 mb-2">
        ✨ The ultimate workspace for creative minds ✨
      </p>
      <p className="text-gray-400">
        Streamline your process | Track progress in real-time | Collaborate effortlessly
      </p>
    </div>

    {/* Animated CTA button with icon */}
    <button
      onClick={() => setShowProjects(true)}
      className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 
                rounded-xl text-xl font-semibold shadow-2xl hover:shadow-3xl 
                transition-all duration-300 hover:scale-105 group overflow-hidden"
    >
      <span className="relative z-10 flex items-center justify-center gap-3">
        Launch Your Workspace
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </button>

    {/* Trust indicators */}
    <div className="mt-12 flex flex-col items-center">
      <div className="flex -space-x-3 mb-3">
        {/* Team avatars placeholder */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-gray-800"></div>
        ))}
      </div>
      <p className="text-gray-400 text-sm">
        Join <span className="text-white">1000+</span> creators already organizing their work
      </p>
    </div>
  </div>
</div>
            )}
          </div>
        </div>
      </section>

      {/* Modal Component */}
      {modal && <Modals isOpen={modal} onClose={() => setModal(false)} onSubmit={handleCreateProject} />}
    </div>
  );
};

export default Home;