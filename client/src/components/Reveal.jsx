import React, { useEffect, useRef, useState } from "react";

/**
 * Wraps any content and fades/slides it in the first time it
 * scrolls into view. Use `delay` (seconds) to stagger a group of
 * items (e.g. cards in a grid) so they animate in one after another.
 */
function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " in-view" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={{ transitionDelay: `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;