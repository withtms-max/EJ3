import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

interface ProjectCarouselProps {
  projects: Project[];
}

/**
 * Design Philosophy: 3D Carousel with Hover Effects
 * - 3D perspective transformation
 * - Smooth rotation animations
 * - Hover scale and shadow effects
 * - Auto-play with manual controls
 */

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, projects.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  return (
    <div className="relative w-full">
      {/* Main Carousel */}
      <div className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full" style={{ perspective: "1200px" }}>
          {projects.map((project, index) => {
            const offset = (index - currentSlide + projects.length) % projects.length;
            const isActive = offset === 0;
            const angle = (offset - 0.5) * (360 / projects.length);
            const distance = Math.abs(offset - 0.5) * 100;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1 : 0.75,
                  rotateY: angle,
                  z: isActive ? 100 : -distance,
                  x: isActive ? 0 : (offset > 0.5 ? 1 : -1) * 50,
                }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
                className="absolute w-full h-full px-4"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  animate={{
                    y: hoveredIndex === index ? -12 : 0,
                    boxShadow: hoveredIndex === index
                      ? "0 30px 60px rgba(0, 217, 255, 0.4)"
                      : "0 10px 30px rgba(0, 217, 255, 0.1)"
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full rounded-2xl overflow-hidden border border-border bg-card cursor-pointer"
                >
                  <div className="relative w-full h-full group">
                    {/* Image */}
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Overlay */}
                    <motion.div
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
                    />

                    {/* Content */}
                    <motion.div
                      animate={{
                        y: hoveredIndex === index ? 0 : 20,
                        opacity: hoveredIndex === index ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-6 flex flex-col justify-end"
                    >
                      <motion.h3
                        className="text-2xl font-bold mb-2 font-poppins text-white"
                        animate={{
                          color: hoveredIndex === index ? "#00D9FF" : "#FFFFFF",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {project.title}
                      </motion.h3>

                      <motion.p
                        animate={{
                          opacity: hoveredIndex === index ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-gray-300 mb-4"
                      >
                        {project.description}
                      </motion.p>

                      <div className="flex gap-2 flex-wrap">
                        {project.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: hoveredIndex === index ? 1 : 0.6,
                              scale: 1,
                            }}
                            transition={{
                              duration: 0.3,
                              delay: hoveredIndex === index ? tagIndex * 0.05 : 0,
                            }}
                            className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <motion.button
          whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 z-10 p-3 rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-all"
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 z-10 p-3 rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-all"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-3 mt-12"
      >
        {projects.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            animate={{
              width: index === currentSlide ? 32 : 12,
              backgroundColor: index === currentSlide ? "#00D9FF" : "#2A2A2A",
            }}
            whileHover={{
              scale: 1.2,
              backgroundColor: index === currentSlide ? "#00D9FF" : "#3A3A3A",
            }}
            transition={{ duration: 0.3 }}
            className="h-3 rounded-full cursor-pointer transition-all"
          />
        ))}
      </motion.div>

      {/* Slide Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-6 text-muted-foreground text-sm"
      >
        <span className="text-primary font-bold">{currentSlide + 1}</span> / {projects.length}
      </motion.div>
    </div>
  );
}
