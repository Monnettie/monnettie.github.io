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

    const changePage = (page) => {
        setCurrentPage(page);
        setSelectedProject(null);
    };

    const renderPage = () => {
        if (currentPage === "about") {
            return (
                <div className="about">
                    <h1>(ﾉ・ω・)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆</h1>

                    <img
                        src="/assets/square.png"
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

        if (currentPage === "resume") {
            return (
                <div className="about resume">
                    <h1>Sofia Carmela Orlando</h1>
                    <h4>sofia.orlando30@gmail.com | (201) 600 3857 | linkedin.com/in/orlando1230 </h4>
                    <h2 className="left">Education</h2>
                        <h3 className="left">Rochester Institute of Technology, Rochester NY | Anticipated May 2027</h3>
                            <p className="left">Bachelor of Fine Art (New Media Design), Minor in Marketing, Creative Writing, and Japanese <br></br>RIT Presidential Scholarship</p>
                    <h2 className="left">Project Experience</h2>
                        <h3 className="left"><a href='rit.edu/vignellicenter/beyond-fashion'>Beyond Fashion</a> | Aug 2025 - Dec 2025</h3>
                            <p className="left">● Designed a variety of motion graphics to play during the 2025 Beyond Fashion show. <br></br>
                            ● Coordinated with teammates and participants to maintain cohesive design and branding.<br></br>
                            ● Spearheaded discussion on design direction by providing various mockups and feedback to other teammates.</p>
                        <h3 className="left"> <a href="monnettie.itch.io/doko-neko-hakai ">RIT x KCG Study Abroad Game Jam</a> | May 2024</h3>
                            <p className="left">
                            ● Developed an original game, Doko Neko Hakai, in two days for the Rochester Institute of Technology x Kyoto Computer Gakuin in Japan. Assigned a team of RIT students and Japanese KCG Students.<br></br>
                            ● Navigated the language barrier with intermediate Japanese to communicate ideas and connect with teammates.<br></br>
                            ● Contributed to concept, design, gameplay, and writing. <br></br>
                            ● Led coordination of tasks among team members to execute the project on a timely basis.</p>
                             <h3 className="left"> <a href='mods.one/mod/girlmori'>GIRLMORI</a> | Feb 2020 - May 2025</h3>
                            <p className="left">
                                ● Created and managed GIRLMORI, a mod for the game OMORI that aims to replace all assets of the male main
                                character with female counterparts. Has over 5,000 downloads as of 2025. <br></br>
                                ● Redesigned replacement assets such as sprites, animations, in-game and illustrated cutscenes, dialogue, UI/UX,
                                and MP4 movies. Re-coded in-game events and optimized mod loadout. <br></br>
                                ● Recruited several members of the OMORI mod community to collaborate on minor replacements, workload,
                                and optimization.
                            </p>
                    <h2 className="left">Work Experience</h2>
                        <h3 className="left">Venture Creations Incubator, Rochester NY | Sep 2025 - Present</h3>
                        <p className="left bold">Student Marketing Intern</p>
                            <p className="left">
                                ● Designed logos, style guides, and other branding material for various startups.<br></br>
                                ● Managed social media pages, posts, and content to promote startup brand.<br></br>
                                ● Planned meetings and met with various startups to discuss marketing strategy and goals.<br></br>
                                ● Maintained the VCI webpage and newsletter through WordPress.
                            </p>
                        <h3 className="left">RIT Social Media Team, Rochester | NY Sep 2025 - Present</h3>
                        <p className="left bold">Social Media Specialist</p>
                            <p className="left">
                                ● Designed animated stickers and social media assets to be used for RIT’s social media pages.<br></br>
                                ● Produced shorts, reels, and other content to post and engage with follower base.<br></br>
                                ● Wrote a variety of posts for various social media platforms using Brandwatch.<br></br>
                                ● Participated in weekly meetings to discuss engagement strategies and content ideas
                            </p>
                        <h3 className="left">RIT Enrollment Marketing Team, Rochester NY | Sep 2024 - May 2025</h3>
                        <p className="left bold">Content Creator</p>
                            <p className="left">
                                ● Produced and edited video content to promote RIT campus.<br></br>
                                ● Designed social media templates for various departments at RIT.<br></br>
                                ● Wrote articles for the RIT newspage and newsletters.
                            </p>
                    <h2 className="left">Additional Information</h2>
                    <p className="left"><span className="left bold">Languages: </span>
                        English (Native) Japanese (N4, 7 years of study) </p>
                   <p className="left"> <span className="left bold">Technical Skills: </span>
                    Adobe Suite, Figma, Canva, Autodesk Fusion, Procreate/CSP, HTML/CSS/JS, Angular, Wordpress,AWS, GitHub, Brandwatch</p>
                    <p className="left"><span className="left bold">Interests: </span>
                        Writing, Drawing, Traveling, Language Learning, Anime</p>

                </div>
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
                                changePage("home");
                            }}
                        >
                            HOME
                        </a>

                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                changePage("about");
                            }}
                        >
                            ABOUT
                        </a>

                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                changePage("portfolio");
                            }}
                        >
                            PORTFOLIO
                        </a>

                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                changePage("resume");
                            }}
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