"use client";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Camera, Award, MapPin, Mail } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 to-slate-700/10 dark:from-slate-100/5 dark:to-slate-300/5"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Photographer Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Elijah Rivero
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
                Professional Photographer
              </p>
              <div className="flex justify-center items-center gap-4">
                <ThemeToggle />
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>New York, NY</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">About Me</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              I'm a passionate photographer with over 8 years of experience capturing life's most precious moments. 
              My journey began with a simple point-and-shoot camera and has evolved into a deep love for the art 
              of visual storytelling.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Specializing in portrait, landscape, and event photography, I believe that every moment has a story 
              worth telling. My approach combines technical expertise with an intuitive understanding of light, 
              composition, and human emotion.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              When I'm not behind the camera, you'll find me exploring new locations, studying the masters of 
              photography, and constantly pushing the boundaries of what's possible with light and shadow.
            </p>
          </motion.div>

          {/* Photography Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">My Photography Style</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              I specialize in creating authentic, emotion-driven images that tell a story. My style is characterized 
              by natural lighting, genuine expressions, and a keen eye for detail. Whether it's a candid street 
              moment or a carefully composed landscape, I strive to capture the essence of the subject and the 
              atmosphere of the moment.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">8+ Years</h4>
              <p className="text-slate-600 dark:text-slate-400">Experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">50+ Awards</h4>
              <p className="text-slate-600 dark:text-slate-400">Recognition</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">200+ Clients</h4>
              <p className="text-slate-600 dark:text-slate-400">Satisfied</p>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
            <p className="text-lg mb-6 opacity-90">
              Ready to capture your special moments? I'd love to hear about your project.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors duration-200"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
