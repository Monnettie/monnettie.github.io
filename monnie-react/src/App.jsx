import { useState } from "react";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import ProjectGrid from "./components/ProjectGrid";
import ProjectModal from "./components/ProjectModal";
import Footer from "./components/Footer";
import { projects } from "./data/projects";

function App() {
    const [selectedCategory, setSelectedCategory] = useState("featured");
    const [selectedProject, setSelectedProject] = useState(null);

    const filteredProjects =
        selectedCategory === "featured"
            ? projects
            : projects.filter((project) =>
                  project.categories.includes(selectedCategory)
              );

    return (
        <>
            <main>
                <aside>
                    <Header />

                    <CategoryNav
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </aside>

                <ProjectGrid
                    projects={filteredProjects}
                    onProjectSelect={setSelectedProject}
                />

                <Footer />

                <img
                    src="/assets/ui/Header_Star.png"
                    style={{ margin: "auto" }}
                    height="31"
                    alt=""
                />

                <p className="footy">
                    MONNETTIE © SOFIA CARMELA ORLANDO
                </p>
            </main>

            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </>
    );
}

export default App;