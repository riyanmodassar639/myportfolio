function MaintenancePage() {
  return (
    <section className="maintenance-page">
      <div className="maintenance-bg" />

      <div className="maintenance-content">
        <div className="maintenance-robot-wrap">
          <div className="maintenance-robot-shadow" />

          <svg
            className="maintenance-robot"
            viewBox="0 0 260 260"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* big slowly spinning gear behind the robot */}
            <g className="robot-gear">
              <circle cx="198" cy="150" r="26" fill="none" stroke="var(--lux-gold)" strokeWidth="6" opacity="0.35" />
              <circle cx="198" cy="150" r="8" fill="var(--lux-ink)" stroke="var(--lux-gold)" strokeWidth="4" opacity="0.5" />
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={i}
                  x="194"
                  y="116"
                  width="8"
                  height="12"
                  rx="2"
                  fill="var(--lux-gold)"
                  opacity="0.35"
                  transform={`rotate(${i * 45} 198 150)`}
                />
              ))}
            </g>

            {/* antenna */}
            <line x1="130" y1="46" x2="130" y2="26" stroke="var(--lux-gold)" strokeWidth="4" strokeLinecap="round" />
            <circle className="robot-antenna-light" cx="130" cy="20" r="7" fill="var(--lux-gold-light)" />

            {/* head */}
            <rect x="92" y="46" width="76" height="58" rx="16" fill="var(--lux-charcoal)" stroke="var(--lux-gold)" strokeWidth="3" />
            <circle className="robot-eye" cx="116" cy="74" r="7" fill="var(--lux-gold-light)" />
            <circle className="robot-eye" cx="144" cy="74" r="7" fill="var(--lux-gold-light)" />
            <path d="M116 90 Q130 98 144 90" stroke="var(--lux-gold)" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* body */}
            <rect x="82" y="108" width="96" height="80" rx="18" fill="var(--lux-charcoal)" stroke="var(--lux-gold)" strokeWidth="3" />
            <rect x="104" y="128" width="52" height="34" rx="8" fill="var(--lux-ink)" stroke="var(--lux-gold-line)" strokeWidth="2" />
            <circle className="robot-panel-light" cx="130" cy="145" r="6" fill="var(--lux-gold)" />

            {/* left arm (static, resting) */}
            <rect x="66" y="118" width="16" height="46" rx="8" fill="var(--lux-charcoal)" stroke="var(--lux-gold)" strokeWidth="3" />

            {/* right arm + wrench — swings at the shoulder joint (186, 122) */}
            <g className="robot-arm">
              <rect x="178" y="122" width="16" height="46" rx="8" fill="var(--lux-charcoal)" stroke="var(--lux-gold)" strokeWidth="3" />
              <rect x="180" y="166" width="12" height="30" rx="3" fill="var(--lux-gold)" transform="rotate(18 186 168)" />
              <circle cx="190" cy="167" r="9" fill="none" stroke="var(--lux-gold)" strokeWidth="4" />
            </g>

            {/* sparks near the wrench tip */}
            <g className="robot-sparks" transform="translate(206, 176)">
              <circle cx="0" cy="0" r="2.5" fill="var(--lux-gold-light)" />
              <circle cx="8" cy="-6" r="2" fill="var(--lux-gold-light)" />
              <circle cx="-6" cy="-8" r="1.6" fill="var(--lux-gold-light)" />
            </g>

            {/* legs */}
            <rect x="98" y="186" width="14" height="24" rx="6" fill="var(--lux-charcoal)" stroke="var(--lux-gold)" strokeWidth="3" />
            <rect x="148" y="186" width="14" height="24" rx="6" fill="var(--lux-charcoal)" stroke="var(--lux-gold)" strokeWidth="3" />
          </svg>
        </div>

        <span className="maintenance-label">Riyan Modassar — Portfolio</span>
        <h1>Website is Under Maintenance</h1>
        <p>
          A few improvements are being polished behind the scenes.
          Please check back shortly — we won't be long.
        </p>

        <div className="maintenance-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

export default MaintenancePage;