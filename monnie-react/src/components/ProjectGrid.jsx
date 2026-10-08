function ProjectGrid({ projects, onProjectClick }) {
    return (
        <section className="project-grid">
            {projects.map((project) => (
                <div
                    className="project-wrapper"
                    key={project.id}
                >
                    <img
                        src={project.thumbnail}
                        className={`project ${project.categories.join(" ")}`}
                        alt={project.title}
                        onClick={() => onProjectClick(project)}
                    />
                </div>
            ))}
        </section>
    );
}

export default ProjectGrid;