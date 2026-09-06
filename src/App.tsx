/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROJECTS } from './data/projects';
import { Project } from './types';
import { Navbar } from './components/Navbar';
import { SimpleImageCarousel } from './components/SimpleImageCarousel';
import { ReelsCarousel } from './components/ReelsCarousel';
import { FlyersSection } from './components/FlyersSection';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<Project | null>(null);

  const handlePlayVideo = (project: Project) => {
    setSelectedProject(null);
    setPlayingVideo(project);
    setVideoModalOpen(true);
  };

  const handleOpenDetail = (project: Project) => {
    setSelectedProject(project);
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Top: Simple Image Carousel (Exact reference match) */}
        <SimpleImageCarousel
          projects={PROJECTS}
          onPlayVideo={handlePlayVideo}
          onOpenDetail={handleOpenDetail}
        />

        {/* 2. Saiu do Forno · Reels Carousel (9:16 vertical videos) */}
        <ReelsCarousel
          projects={PROJECTS}
          onPlayVideo={handlePlayVideo}
          onOpenDetail={handleOpenDetail}
        />

        {/* 3. Flyers Comerciais & Design Gráfico (All passed flyer artworks) */}
        <FlyersSection
          projects={PROJECTS}
          onOpenDetail={handleOpenDetail}
        />

        {/* 4. Perguntas que normalmente fazem (FAQ) */}
        <FAQSection />

        {/* 5. Direct Contact & WhatsApp */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Quick-Action CTA Button */}
      <FloatingWhatsApp />

      {/* Video Player Modal (for video motion projects) */}
      <VideoPlayerModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        project={playingVideo}
        allProjects={PROJECTS}
        onSelectProject={(proj) => setPlayingVideo(proj)}
      />

      {/* Project / Image Detail Lightbox Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
        allProjects={PROJECTS}
        onPlayVideo={handlePlayVideo}
      />
    </div>
  );
}
