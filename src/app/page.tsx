import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Impact from "@/components/Impact";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Credentials from "@/components/Credentials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <Providers>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Impact />
        <Experience />
        <Projects />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </Providers>
  );
}
