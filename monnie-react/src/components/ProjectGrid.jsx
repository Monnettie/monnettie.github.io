function ProjectGrid({ projects, onProjectSelect }) {
  return (
    <section className="project-grid">
      {projects.map((project) => (
        <div className="project-wrapper" key={project.id}>
          <img
            src={project.thumbnail}
            className={`project ${project.categories.join(' ')}`}
            alt={project.title}
            onClick={() => onProjectSelect(project)}
          />
        </div>
      ))}
    </section>
  )
}

export default ProjectGrid