let intervalId = null;
let originalTitle = null;

export const startTitleBlink = text => {
  if (intervalId) return;

  originalTitle = document.title;
  let showAlt = true;

  intervalId = setInterval(() => {
    document.title = showAlt ? text : originalTitle;
    showAlt = !showAlt;
  }, 1000);
};

export const stopTitleBlink = () => {
  if (!intervalId) return;

  clearInterval(intervalId);
  intervalId = null;

  if (originalTitle !== null) {
    document.title = originalTitle;
    originalTitle = null;
  }
};
