const categories = [
    {
        id: "all",
        label: "ALL",
    },
    {
        id: "design",
        label: "DESIGN",
    },
    {
        id: "illustration",
        label: "ILLUSTRATION",
    },
    {
        id: "motion_graphics",
        label: "MOTION",
    },
    {
        id: "games",
        label: "GAMES",
    },
];

function CategoryNav({
    selectedCategory,
    setSelectedCategory,
}) {
    return (
        <div className="categories">
            <div className="cats">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={
                            selectedCategory === category.id
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(category.id)
                        }
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryNav;