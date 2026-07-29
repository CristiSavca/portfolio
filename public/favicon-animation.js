(() => {
  const icon = document.querySelector('link[rel~="icon"]');
  if (!icon) return;

  const frameCount = 18;
  const frameDuration = 180;
  let frame = 0;

  const showNextFrame = () => {
    icon.href = `./favicon-frames/frame-${String(frame).padStart(2, '0')}.png`;
    frame = (frame + 1) % frameCount;
  };

  showNextFrame();
  window.setInterval(showNextFrame, frameDuration);
})();
