import { useRef, useState } from "react";

// Fixed aspect ratio for the movable frame — matches the project
// card / thumbnail image shape used across the site.
const FRAME_WIDTH_PCT = 46;
const FRAME_ASPECT = 200 / 340; // height / width, matches the card image

function FocalPointPicker({ imageSrc, initialX = 50, initialY = 50, onConfirm, onCancel }) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updateFromEvent = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;

    let x = ((point.clientX - rect.left) / rect.width) * 100;
    let y = ((point.clientY - rect.top) / rect.height) * 100;

    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setPos({ x, y });
  };

  const startDrag = (e) => {
    dragging.current = true;
    updateFromEvent(e);
  };

  const onMove = (e) => {
    if (!dragging.current) return;
    updateFromEvent(e);
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  return (
    <div className="focal-picker-overlay" onClick={onCancel}>
      <div className="focal-picker" onClick={(e) => e.stopPropagation()}>
        <h4>Choose thumbnail focal point</h4>
        <p className="admin-section-hint">
          Drag the frame to the part of the image you want visible in
          the thumbnail. The full image is kept — this just decides
          what shows through the card-shaped frame.
        </p>

        <div
          className="focal-picker-image"
          ref={containerRef}
          onMouseDown={startDrag}
          onMouseMove={onMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={startDrag}
          onTouchMove={onMove}
          onTouchEnd={stopDrag}
        >
          <img src={imageSrc} alt="Choose focal point" draggable={false} />

          <div
            className="focal-picker-frame"
            style={{
              width: `${FRAME_WIDTH_PCT}%`,
              paddingBottom: `${FRAME_WIDTH_PCT * FRAME_ASPECT}%`,
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          />
        </div>

        <div className="focal-picker-preview">
          <span>Thumbnail preview</span>
          <div
            className="focal-picker-preview-box"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundPosition: `${pos.x}% ${pos.y}%`,
            }}
          />
        </div>

        <div className="focal-picker-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="focal-picker-confirm"
            onClick={() => onConfirm(pos.x, pos.y)}
          >
            Use as Thumbnail
          </button>
        </div>
      </div>
    </div>
  );
}

export default FocalPointPicker;