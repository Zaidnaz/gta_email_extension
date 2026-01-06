let isAnimating = false;

function triggerMissionPassed() {
  if (isAnimating) return;
  isAnimating = true;

  // 1. Play Sound
  const soundUrl = chrome.runtime.getURL("mission_passed.mp3");
  const audio = new Audio(soundUrl);
  audio.volume = 0.5;
  audio.play().catch(e => console.log("Audio error:", e));

  // 2. Create Visual Elements
  const container = document.createElement("div");
  container.className = "gta-overlay-container";

  // Use the chrome runtime URL to ensure CSS finds the font
  // (The CSS @font-face handles the logic, but this adds a class for safety)
  container.style.fontFamily = "'Pricedown', sans-serif";

  const title = document.createElement("div");
  title.className = "gta-mission-text";
  title.innerText = "MISSION PASSED"; 

  const sub = document.createElement("div");
  sub.className = "gta-sub-text";
  sub.innerText = "RESPECT +";

  container.appendChild(title);
  container.appendChild(sub);
  document.body.appendChild(container);

  // 3. Remove after 5 seconds
  setTimeout(() => {
    container.style.transition = "opacity 1s";
    container.style.opacity = "0";
    setTimeout(() => {
      container.remove();
      isAnimating = false;
    }, 1000);
  }, 4000);
}

// Observer setup remains the same
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        const text = node.innerText || "";
        if (text.includes("Message sent") && text.includes("Undo")) {
          triggerMissionPassed();
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });