import { useEffect, useRef } from 'react'

const categories = [
  {
    label: 'featured',
    value: 'featured',
  },
  {
    label: 'motion',
    value: 'motion_graphics',
  },
  {
    label: 'games',
    value: 'games',
  },
  {
    label: 'design',
    value: 'design',
  },
  {
    label: 'illustration',
    value: 'illustration',
  },
]

function CategoryNav({ activeCategory, onCategoryChange }) {
  const navigationRef = useRef(null)
  const underlineRef = useRef(null)

  useEffect(() => {
    const activeButton = navigationRef.current?.querySelector(
      '.category.active'
    )

    if (!activeButton || !underlineRef.current) {
      return
    }

    underlineRef.current.style.left = `${activeButton.offsetLeft}px`
    underlineRef.current.style.width = `${activeButton.offsetWidth}px`
  }, [activeCategory])

  useEffect(() => {
    const handleResize = () => {
      const activeButton = navigationRef.current?.querySelector(
        '.category.active'
      )

      if (!activeButton || !underlineRef.current) {
        return
      }

      underlineRef.current.style.left = `${activeButton.offsetLeft}px`
      underlineRef.current.style.width = `${activeButton.offsetWidth}px`
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="categories">
      <img src="/assets/ui/Nav_DecoL.png" alt="" />

      <div className="cats" ref={navigationRef}>
        {categories.map((category) => (
          <button
            key={category.value}
            className={`category ${
              activeCategory === category.value ? 'active' : ''
            }`}
            onClick={() => onCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}

        <span
          ref={underlineRef}
          className="category-underline"
        />
      </div>

      <img src="/assets/ui/Nav_DecoR.png" alt="" />
    </div>
  )
}

export default CategoryNav