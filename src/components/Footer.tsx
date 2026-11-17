import { profile } from "@/content";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name}. {profile.location}.
        </p>
        <p className="flex gap-5">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            GitHub
          </a>
          <a href={profile.resume} className="hover:text-accent">
            Resume
          </a>
        </p>
      </div>
    </footer>
  );
}
