import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import pageContent from '../lib/pageContent';

// Wedding date: January 3, 2026 at 10:00 AM (Vietnam time, UTC+7)
const WEDDING_DATE = new Date('2026-01-03T10:00:00+07:00');

const Home: NextPage = () => {
  useEffect(() => {
    // --- Audio Control ---
    const audioEl = document.querySelector('audio') as HTMLAudioElement | null;
    const audioWrapper = document.getElementById('audio-control-wrapper');
    const audioToggle = audioWrapper?.querySelector('.audio-toggle');

    if (audioWrapper && audioEl) {
      audioEl.volume = 0.5;

      const updateToggleState = (playing: boolean) => {
        if (playing) {
          audioToggle?.classList.remove('paused');
        } else {
          audioToggle?.classList.add('paused');
        }
      };

      // Start paused; user must interact first
      updateToggleState(false);
      audioToggle?.classList.add('paused');

      audioWrapper.addEventListener('click', () => {
        if (audioEl.paused) {
          audioEl.play().then(() => updateToggleState(true)).catch(() => {});
        } else {
          audioEl.pause();
          updateToggleState(false);
        }
      });

      // Auto-play on first user interaction with the page
      const handleFirstInteraction = () => {
        if (audioEl.paused) {
          audioEl.play().then(() => updateToggleState(true)).catch(() => {});
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
    }

    // --- Auto-scroll Play Button ---
    const playBtn = document.getElementById('auto-scroll-play');
    let scrollInterval: ReturnType<typeof setInterval> | null = null;
    let isScrolling = false;

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const scrollContainer = document.querySelector('.styles_customScroll__X5r6w');
        if (!scrollContainer) return;

        if (isScrolling) {
          if (scrollInterval) clearInterval(scrollInterval);
          isScrolling = false;
          playBtn.style.opacity = '1';
        } else {
          isScrolling = true;
          playBtn.style.opacity = '0.5';
          scrollInterval = setInterval(() => {
            scrollContainer.scrollTop += 1;
            const atBottom =
              scrollContainer.scrollTop + scrollContainer.clientHeight >=
              scrollContainer.scrollHeight - 5;
            if (atBottom) {
              if (scrollInterval) clearInterval(scrollInterval);
              isScrolling = false;
              playBtn.style.opacity = '1';
            }
          }, 16);
        }
      });
    }

    // --- Envelope Animation ---
    const envelope = document.querySelector('.envelope-container');
    if (envelope) {
      envelope.addEventListener('click', () => {
        envelope.classList.toggle('close');
        envelope.classList.toggle('open');
      });
    }

    // --- Countdown Timer ---
    const countdownEl = document.querySelector('.jsx-3272123691.countdown.componentBOX');
    if (countdownEl) {
      const children = countdownEl.querySelectorAll(':scope > div');
      const [daysBox, hoursBox, minutesBox, secondsBox] = Array.from(children);

      const getValueEl = (box: Element) => box.querySelector('div:first-child');

      const tick = () => {
        const now = new Date();
        const diff = WEDDING_DATE.getTime() - now.getTime();

        if (diff <= 0) {
          // Wedding already happened
          [daysBox, hoursBox, minutesBox, secondsBox].forEach((box) => {
            const el = getValueEl(box);
            if (el) el.textContent = '0';
          });
          return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const daysEl = getValueEl(daysBox);
        const hoursEl = getValueEl(hoursBox);
        const minutesEl = getValueEl(minutesBox);
        const secondsEl = getValueEl(secondsBox);

        if (daysEl) daysEl.textContent = String(days);
        if (hoursEl) hoursEl.textContent = String(hours);
        if (minutesEl) minutesEl.textContent = String(minutes);
        if (secondsEl) secondsEl.textContent = String(seconds);
      };

      tick();
      const timer = setInterval(tick, 1000);
      return () => {
        clearInterval(timer);
        if (scrollInterval) clearInterval(scrollInterval);
      };
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, []);

  return (
    <>
      <Head>
        <title>G10_Huy &amp; Mai Wedding Invitation | CineLove</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="G10_Huy &amp; Mai Wedding Invitation - Thiệp cưới online trên CineLove" />
      </Head>
      <div
        dangerouslySetInnerHTML={{ __html: pageContent }}
        suppressHydrationWarning
      />
    </>
  );
};

export default Home;
