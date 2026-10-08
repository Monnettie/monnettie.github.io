import { useState } from "react";
import "./App.css";
import { projects } from "./data/projects";
import ProjectGrid from "./components/ProjectGrid";
import ProjectModal from "./components/ProjectModal";
import CategoryNav from "./components/CategoryNav";

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProject, setSelectedProject] = useState(null);

    const filteredProjects =
        selectedCategory === "all"
            ? projects
            : projects.filter((project) =>
                  project.categories.includes(selectedCategory)
              );

    const renderPage = () => {
        if (currentPage === "about") {
            return (
                <div className="about">
                    <h1>(ﾉ・ω・)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆</h1>

                    <img
                        src="assets/square.png"
                        alt="Sofia Orlando"
                    />

                    <p>
                        Sofia Orlando is a current New Media Design student at
                        Rochester Institute of Technology.
                        <br />
                        She's a creative soul who's worked with photoshop,
                        illustrator, premiere pro, maya, and various other art
                        programs for the past 9 years and plans to learn even
                        more.
                        <br />
                        After graduation she intends to work in marketing and
                        put her own cute unique spin on her work.
                        <br />
                        Please give her your love and support!
                        <br />
                        <br />
                        Contact at: sofia.orlando30@gmail.com
                        <br />
                        monnettie on all platforms!
                    </p>
                </div>
            );
        }

        if (currentPage === "portfolio") {
            return (
                <>
                    <CategoryNav
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />

                    <ProjectGrid
                        projects={filteredProjects}
                        onProjectClick={setSelectedProject}
                    />
                </>
            );
        }

        return (
            <div className="about">
                <br />

                <img
                    src="/assets/monnie.png"
                    alt="Monnettie"
                />

                <h1>WELCOME TO MONNETTIE!!!</h1>

                <p>(ﾉ・ω・)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆</p>
            </div>
        );
    };

    return (
        <main>
            <aside>
                <div className="topbar">
                    <img
                        src="/assets/ui/Header_SqaureL.png"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_Date.png"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_Stars.png"
                        height="31"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_Monnettie.png"
                        alt="Monnettie"
                    />

                    <img
                        src="/assets/ui/Header_Rings.png"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_Warning.png"
                        alt=""
                    />

                    <div className="nav-links">
                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                setCurrentPage("home");
                            }}
                        >
                            HOME
                        </a>

                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                setCurrentPage("about");
                            }}
                        >
                            ABOUT
                        </a>

                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                setCurrentPage("portfolio");
                            }}
                        >
                            PORTFOLIO
                        </a>

                        <a
                            href="/assets/Pro_Resume2026.pdf"
                            target="_blank"
                            rel="noreferrer"
                        >
                            RESUME
                        </a>
                    </div>

                    <img
                        src="/assets/ui/Header_Stars.png"
                        height="31"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_Warning.png"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Y2K SVGs/Asset 11.svg"
                        height="31"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_SO.png"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_Stars.png"
                        height="31"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_Hearts.png"
                        alt=""
                    />

                    <img
                        src="/assets/ui/Header_SquareR.png"
                        alt=""
                    />
                </div>
            </aside>

            <div
                className="page-transition"
                key={currentPage}
            >
                {renderPage()}
            </div>

            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </main>
    );
}

export default App;