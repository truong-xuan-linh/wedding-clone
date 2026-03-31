import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import InvitationContent from '../components/InvitationContent';

const WEDDING_DATE = new Date('2026-04-22T11:00:00+07:00');

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

    // --- Scroll-triggered Animations ---
    const parseTransitionKey = (key: string) => {
      const withoutFlag = key.replace(/-(true|false)$/, '');
      const match = withoutFlag.match(
        /(fade-in|rotate-in|scale-in|slide-right|slide-left|slide-up|slide-down|zoom-in|bounce-in|flip-in)-(\d+\.?\d*)-(\d+\.?\d*)-(.+)$/
      );
      if (!match) return null;
      return {
        animationType: match[1],
        duration: parseFloat(match[2]),
        delay: parseFloat(match[3]),
        easing: match[4],
      };
    };

    const getInitialStyle = (animType: string): { opacity: string; transform: string } => {
      switch (animType) {
        case 'fade-in':     return { opacity: '0', transform: 'none' };
        case 'rotate-in':   return { opacity: '0', transform: 'rotate(-180deg)' };
        case 'scale-in':    return { opacity: '0', transform: 'scale(0.5)' };
        case 'slide-right': return { opacity: '0', transform: 'translateX(-60px)' };
        case 'slide-left':  return { opacity: '0', transform: 'translateX(60px)' };
        case 'slide-up':    return { opacity: '0', transform: 'translateY(60px)' };
        case 'slide-down':  return { opacity: '0', transform: 'translateY(-60px)' };
        case 'zoom-in':     return { opacity: '0', transform: 'scale(0.2)' };
        case 'bounce-in':   return { opacity: '0', transform: 'scale(0.5)' };
        case 'flip-in':     return { opacity: '0', transform: 'perspective(400px) rotateY(90deg)' };
        default:            return { opacity: '0', transform: 'none' };
      }
    };

    const animRoot = document.querySelector('.styles_customScroll__X5r6w');
    const animElements = document.querySelectorAll<HTMLElement>('[data-transition-key]');

    animElements.forEach((el) => {
      const key = el.getAttribute('data-transition-key');
      if (!key) return;
      const parsed = parseTransitionKey(key);
      if (!parsed) return;
      const initial = getInitialStyle(parsed.animationType);
      el.style.opacity = initial.opacity;
      el.style.transform = initial.transform;
      el.style.willChange = 'opacity, transform';
    });

    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const key = el.getAttribute('data-transition-key');
          if (!key) return;
          const parsed = parseTransitionKey(key);
          if (!parsed) return;
          el.style.transition = `opacity ${parsed.duration}s ${parsed.easing} ${parsed.delay}s, transform ${parsed.duration}s ${parsed.easing} ${parsed.delay}s`;
          el.style.opacity = '1';
          el.style.transform = 'none';
          animObserver.unobserve(el);
        });
      },
      { root: animRoot, threshold: 0.1 }
    );

    animElements.forEach((el) => animObserver.observe(el));

    // --- Countdown Timer ---
    let timer: ReturnType<typeof setInterval> | null = null;
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
      timer = setInterval(tick, 1000);
    }

    return () => {
      animObserver.disconnect();
      if (timer) clearInterval(timer);
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
      <InvitationContent />
    </>
  );
};

export default Home;

