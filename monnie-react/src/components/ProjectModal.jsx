function ProjectModal({ project, onClose }) {
    if (!project) {
        return <div className="thing1" />;
    }

    const mediaContent = project.content.filter(
        (item) =>
            item.type === "image" ||
            item.type === "video" ||
            item.type === "iframe"
    );

    const textContent = project.content.filter(
        (item) =>
            item.type === "heading" ||
            item.type === "paragraph" ||
            item.type === "link"
    );

    return (
        <div
            className="thing1 active"
            aria-hidden="false"
        >
            <div className="project-modal">
                <div className="project-modal-media">
                    {mediaContent.map((item, index) => {
                        if (item.type === "image") {
                            return (
                                <img
                                    key={`${item.src}-${index}`}
                                    src={item.src}
                                    className="featured responsive"
                                    alt={project.title}
                                />
                            );
                        }

                        if (item.type === "video") {
                            return (
                                <video
                                    key={`${item.src}-${index}`}
                                    controls
                                >
                                    <source
                                        src={item.src}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the
                                    video tag.
                                </video>
                            );
                        }

                        if (item.type === "iframe") {
                            return (
                                <div
                                    id="wrap"
                                    className={item.className || ""}
                                    key={`${item.src}-${index}`}
                                >
                                    <iframe
                                        id="frame"
                                        src={item.src}
                                        width={item.width || "500"}
                                        height={item.height || "700"}
                                        allowFullScreen
                                        title={project.title}
                                    />
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>

                <div className="project-modal-text">
                    <h1>{project.title}</h1>

                    {project.subtitle && (
                        <h3 className="project-modal-subtitle">
                            {project.subtitle}
                        </h3>
                    )}

                    {textContent.map((item, index) => {
                        if (item.type === "heading") {
                            return (
                                <h2 key={`heading-${index}`}>
                                    {item.text}
                                </h2>
                            );
                        }

                        if (item.type === "paragraph") {
                            return (
                                <p
                                    key={`paragraph-${index}`}
                                    style={{
                                        whiteSpace: "pre-line",
                                        fontStyle: item.italic
                                            ? "italic"
                                            : "normal",
                                    }}
                                >
                                    {item.text}
                                </p>
                            );
                        }

                        if (item.type === "link") {
                            return (
                                <a
                                    key={`${item.href}-${index}`}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button>{item.label}</button>
                                </a>
                            );
                        }

                        return null;
                    })}

                    <button
                        className="project-modal-close"
                        onClick={onClose}
                    >
                        back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProjectModal;