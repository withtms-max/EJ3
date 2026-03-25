import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ScrollProgress } from "@/components/ScrollProgress";

/**
 * Design Philosophy: Minimalist Tech Elegance
 * - Dark theme with cyan accents
 * - Smooth Framer Motion animations
 * - 3D carousel with hover effects
 * - Interactive project cards
 */

const projects = [
  {
    id: 1,
    title: "Lumi AI Camera",
    description: "Multimodal agent that lets users point their camera at the world and talk to it naturally.",
    tags: ["AI", "Design", "UX"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663279743034/nnzWhZhsgDZLsYXqZjHBmM/hero-background-MUGDcQ3TXzfTUWfL8YDYuo.webp"
  },
  {
    id: 2,
    title: "Prism",
    description: "Strategic overhaul of the Edge Add-ons Store, transforming it into a dynamic discovery engine.",
    tags: ["Product", "Design", "Strategy"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663279743034/nnzWhZhsgDZLsYXqZjHBmM/project-card-bg-bMqVAnNqnaxxfTmpCdBJFG.webp"
  },
  {
    id: 3,
    title: "Takelessons",
    description: "Two-sided marketplace architected to democratize education in India.",
    tags: ["Marketplace", "UX", "Strategy"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663279743034/nnzWhZhsgDZLsYXqZjHBmM/portfolio-accent-1-PAYYit8666BdErAYWdXPGa.webp"
  },
  {
    id: 4,
    title: "Deal Flux",
    description: "Real-time data visualization framework for Bing Shopping.",
    tags: ["Data Viz", "Product", "Design"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663279743034/nnzWhZhsgDZLsYXqZjHBmM/portfolio-accent-2-NHUfXpyCJqRVf7SEd8UBVc.webp"
  },
  {
    id: 5,
    title: "Amazon Brand Store",
    description: "Store Builder framework empowering sellers to create flagship stores.",
    tags: ["E-commerce", "Design", "Scale"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663279743034/nnzWhZhsgDZLsYXqZjHBmM/experience-timeline-7itK9CFNgjxvEonJgpEEi7.webp"
  }
];

const experiences = [
  {
    year: "2022 - 2025",
    title: "Product Designer II",
    company: "Microsoft",
    description: "Designed core experience for Lumi Camera and Edge Extension ecosystem."
  },
  {
    year: "2025 - Present",
    title: "UX Designer III",
    company: "Microsoft",
    description: "Architecting autonomous HR agents for People Ops."
  },
  {
    year: "2018 - 2022",
    title: "Visual Designer (UXD)",
    company: "Amazon",
    description: "Built self-service Store Builder frameworks for global sellers."
  },
  {
    year: "2017 - 2018",
    title: "UI/UX Designer",
    company: "ONN Bikes",
    description: "Owned end-to-end rental experience, solving trust issues."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <ScrollProgress />
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50"
      >
        <div className="container flex items-center justify-between py-4">
          <motion.h1
            className="text-xl font-bold text-primary font-poppins"
            whileHover={{ scale: 1.05 }}
          >
            Sujit Pradhan
          </motion.h1>
          <div className="flex gap-6 text-sm">
            {["Home", "Projects", "Experience", "Connect"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 container relative">
        {/* Background decoration */}
        <motion.div
          animate={{ y: scrollY * 0.5 }}
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 border border-primary"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center relative z-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-4 font-poppins"
          >
            Hi, I&apos;m <span className="text-primary">Sujit Pradhan</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            Product Designer & AI Specialist
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Starting as a Computer Science Engineer gave me the structure; design gave me the soul. Over the last 8+ years, I&apos;ve evolved from a lone startup designer to architecting advanced AI ecosystems for Google, Microsoft and Amazon.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              View My Work
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300"
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* 3D Carousel Section */}
      <section id="projects" className="py-20 container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-16 text-center font-poppins"
        >
          Featured <span className="text-primary">Projects</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <ProjectCarousel projects={projects} />
        </motion.div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-20 container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-16 text-center font-poppins"
        >
          My <span className="text-primary">Journey</span>
        </motion.h2>

        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: false, amount: 0.5 }}
              className="relative pl-8 pb-12 border-l-2 border-primary last:pb-0"
            >
              <motion.div
                className="absolute -left-3 top-0 w-4 h-4 rounded-full bg-primary"
                whileHover={{ scale: 1.5, boxShadow: "0 0 15px rgba(0, 217, 255, 0.8)" }}
              />
              <div className="text-primary font-bold text-sm mb-1">
                {exp.year}
              </div>
              <h3 className="text-xl font-bold font-poppins mb-1">
                {exp.title}
              </h3>
              <p className="text-muted-foreground mb-2">{exp.company}</p>
              <p className="text-sm leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="connect" className="py-20 container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6 font-poppins">
            Let&apos;s <span className="text-primary">Connect</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you want to discuss the future of Agentic AI, book a career strategy session, or simply critique my latest playlist, I&apos;m always up for a chat.
          </p>

          <div className="flex gap-4 justify-center mb-8 flex-wrap">
            <motion.a
              href="mailto:hello@sujitpradhan.com"
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-all"
            >
              <Mail size={24} />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-all"
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-all"
            >
              <Github size={24} />
            </motion.a>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Start a Conversation
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container text-center text-muted-foreground text-sm">
          <p>Designed with ❤️, Logic, and a lot of Chai.</p>
          <p className="mt-2">
            Copyright © 2025 Sujit Kumar Pradhan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
