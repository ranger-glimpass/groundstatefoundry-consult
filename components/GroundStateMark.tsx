/** A shallow potential well with a particle that rolls in, oscillates, and settles
 *  at the lowest point: the ground state. Pure SVG, plays once and rests. */
export default function GroundStateMark({ className = "" }: { className?: string }) {
  const well = "M4 6 C 60 6, 90 46, 150 46 S 240 6, 296 6";
  return (
    <svg
      viewBox="0 0 300 56"
      className={className}
      aria-hidden
      fill="none"
    >
      <path d={well} stroke="var(--color-border-bright)" strokeWidth="1.25" />
      <circle r="3.5" fill="var(--color-fg)">
        <animateMotion
          dur="3.6s"
          fill="freeze"
          path={well}
          keyPoints="0.02;0.9;0.2;0.72;0.34;0.6;0.44;0.54;0.5"
          keyTimes="0;0.16;0.32;0.46;0.6;0.72;0.83;0.92;1"
          calcMode="spline"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
        />
      </circle>
    </svg>
  );
}
