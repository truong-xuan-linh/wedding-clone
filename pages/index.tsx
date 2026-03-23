import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import fs from 'fs';
import path from 'path';

const WEDDING_DATE = new Date('2026-04-22T11:00:00+07:00');

interface HomeProps {
  pageContent: string;
}

const Home: NextPage<HomeProps> = ({ pageContent }) => {
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
        const sc = document.querySelector('.styles_customScroll__X5r6w');
        if (!sc) return;
        const scrollContainer = sc;

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

    // --- Envelope Animation + Scroll-prevention overlay ---
    const scrollContainer = document.querySelector('.styles_customScroll__X5r6w') as HTMLElement | null;
    const envelope = document.querySelector('.envelope-container') as HTMLElement | null;

    const overlay = document.createElement('div');

    const hintText = document.createElement('div');
    hintText.style.cssText = [
      'color:rgb(75,83,32)', 'font-size:24.232px', 'font-weight:bold',
      'font-family:Signora', 'text-align:center', 'font-style:italic',
      'background:rgba(255,255,255,0.9)', 'padding:16px 32px', 'border-radius:8px',
      'pointer-events:none',
    ].join(';');
    hintText.textContent = 'Chạm để mở thiệp';
    overlay.appendChild(hintText);

    const openEnvelope = () => {
      if (envelope) {
        envelope.classList.remove('close');
        envelope.classList.add('open');
      }
      overlay.remove();
      // Allow scroll
      if (scrollContainer) scrollContainer.style.overflowY = 'auto';
      window.dispatchEvent(new CustomEvent('envelope-opened'));
    };

    overlay.addEventListener('click', openEnvelope);

    // Mount overlay inside the scroll container so it covers the card
    const pcContent = document.querySelector('.pc-content') as HTMLElement | null;
    if (pcContent) {
      pcContent.style.position = 'relative';
      pcContent.appendChild(overlay);
      // Lock scroll until envelope is opened
      if (scrollContainer) scrollContainer.style.overflowY = 'hidden';
    }

    // Also allow clicking the envelope directly to open it
    if (envelope) {
      envelope.addEventListener('click', openEnvelope);
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

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'content', 'pageContent.html');
  const pageContent = fs.readFileSync(filePath, 'utf-8');

  return {
    props: {
      pageContent,
    },
  };
};

export default Home;
