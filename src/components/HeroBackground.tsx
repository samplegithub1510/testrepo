/**
 * Static hero backdrop: a faint dot grid, a brighter grid revealed around
 * the cursor (positioned by --mx / --my on the hero section), and a soft glow.
 */
export default function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="dot-grid absolute inset-0" />
      <div className="dot-grid-lit absolute inset-0" />
      <div
        className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 65%)" }}
      />
    </div>
  );
}
