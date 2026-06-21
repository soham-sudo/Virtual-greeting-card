// Happy Father's Day e-card — behavior

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('audioToggle');
  const video = document.getElementById('mainVideo');

  let musicWasPlayingBeforeVideo = false;
  let audioAvailable = true;

  // ---- Background music toggle ----
  function setToggleState(isPlaying) {
    toggle.classList.toggle('playing', isPlaying);
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.title = isPlaying ? 'Pause background music' : 'Play background music';
  }

  toggle.addEventListener('click', () => {
    if (!audioAvailable) return;
    if (audio.paused) {
      audio.play().then(() => setToggleState(true)).catch(() => {
        // Browser blocked playback (rare after a real tap) — fail quietly
        setToggleState(false);
      });
    } else {
      audio.pause();
      setToggleState(false);
    }
  });

  audio.addEventListener('error', () => {
    audioAvailable = false;
    toggle.classList.add('unavailable');
    toggle.title = 'Add assets/music.mp3 to enable background music';
  });

  // ---- Pause music while the video plays, resume after ----
  if (video) {
    video.addEventListener('play', () => {
      if (!audio.paused) {
        musicWasPlayingBeforeVideo = true;
        audio.pause();
        setToggleState(false);
      } else {
        musicWasPlayingBeforeVideo = false;
      }
    });

    const resumeMusicIfNeeded = () => {
      if (musicWasPlayingBeforeVideo && audioAvailable) {
        audio.play().then(() => setToggleState(true)).catch(() => {});
      }
    };
    video.addEventListener('pause', resumeMusicIfNeeded);
    video.addEventListener('ended', resumeMusicIfNeeded);
  }

  // ---- Scroll-reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
});
