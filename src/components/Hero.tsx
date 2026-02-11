export function Hero() {
  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'JOURNAL', href: '#journal' },
  ];

  return (
    <section id="home" className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl relative">
        {/* Main card */}
        <div className="relative bg-[#d4d4d4] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Top / content area */}
          <div className="pt-12 md:pt-16 pb-28 md:pb-36 px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {/* Left: CRISTI + SWE */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right order-2 md:order-1">
              <span className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight">
                CRISTI
              </span>
              <span className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-black mt-1">
                SWE
              </span>
            </div>

            {/* Center: profile image (grayscale placeholder – replace src with your photo) */}
            <div className="relative shrink-0 order-1 md:order-2">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden bg-neutral-400 grayscale">
                {/* Replace the div below with <img src="/your-photo.jpg" alt="Cristi Savca" className="w-full h-full object-cover" /> */}
                <div className="w-full h-full bg-gradient-to-br from-neutral-500 to-neutral-600" />
              </div>
            </div>

            {/* Right: SAVCA + NYC */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left order-3">
              <span className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight">
                SAVCA
              </span>
              <span className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-black mt-1">
                NYC
              </span>
            </div>
          </div>

          {/* Glass navbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-2xl">
            <nav
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-full border border-white/40 shadow-lg"
              style={{
                background: 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Left: abstract/logo pill */}
              <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-blue-400 via-blue-300 to-white opacity-90" />

              <div className="flex items-center gap-6 md:gap-8">
                {navLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-black hover:opacity-70 transition-opacity"
                  >
                    {label}
                  </a>
                ))}
              </div>

              <a
                href="#explore"
                className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-black bg-white/90 border border-neutral-300 rounded-lg px-4 py-2.5 hover:bg-white transition-colors shrink-0"
              >
                EXPLORE
              </a>
            </nav>
          </div>

          {/* Bottom-right avatar/module */}
          <div className="absolute bottom-6 right-6 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-amber-500/90" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
