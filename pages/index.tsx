import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import InvitationContent from "../components/InvitationContent";

const WEDDING_DATE = new Date("2026-04-22T11:00:00+07:00");

const Home: NextPage = () => {
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // --- Audio Control ---
    const audioEl = document.querySelector("audio") as HTMLAudioElement | null;
    const audioWrapper = document.getElementById("audio-control-wrapper");
    const audioToggle = audioWrapper?.querySelector(".audio-toggle");

    if (audioWrapper && audioEl) {
      audioEl.volume = 0.5;

      const updateToggleState = (playing: boolean) => {
        if (playing) {
          audioToggle?.classList.remove("paused");
        } else {
          audioToggle?.classList.add("paused");
        }
      };

      // Start paused; user must interact first
      updateToggleState(false);
      audioToggle?.classList.add("paused");

      audioWrapper.addEventListener(
        "click",
        () => {
          if (audioEl.paused) {
            audioEl
              .play()
              .then(() => updateToggleState(true))
              .catch(() => {});
          } else {
            audioEl.pause();
            updateToggleState(false);
          }
        },
        { signal },
      );

      // Auto-play on first user interaction with the page
      const handleFirstInteraction = () => {
        if (audioEl.paused) {
          audioEl
            .play()
            .then(() => updateToggleState(true))
            .catch(() => {});
        }
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
      };
      document.addEventListener("click", handleFirstInteraction, { signal });
      document.addEventListener("touchstart", handleFirstInteraction, { signal });
    }

    // --- Auto-scroll Play Button ---
    const playBtn = document.getElementById("auto-scroll-play");
    let scrollInterval: ReturnType<typeof setInterval> | null = null;
    let isScrolling = false;

    if (playBtn) {
      playBtn.addEventListener(
        "click",
        () => {
          const sc = document.querySelector(".styles_customScroll__X5r6w");
          if (!sc) return;
          const scrollContainer = sc;

          if (isScrolling) {
            if (scrollInterval) clearInterval(scrollInterval);
            isScrolling = false;
            playBtn.style.opacity = "1";
          } else {
            isScrolling = true;
            playBtn.style.opacity = "0.5";
            scrollInterval = setInterval(() => {
              scrollContainer.scrollTop += 1;
              const atBottom =
                scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 5;
              if (atBottom) {
                if (scrollInterval) clearInterval(scrollInterval);
                isScrolling = false;
                playBtn.style.opacity = "1";
              }
            }, 16);
          }
        },
        { signal },
      );
    }

    // --- Envelope Animation + Scroll-prevention overlay ---
    const scrollContainer = document.querySelector(".styles_customScroll__X5r6w") as HTMLElement | null;
    const envelope = document.querySelector(".envelope-container") as HTMLElement | null;

    const overlay = document.createElement("div");

    const hintText = document.createElement("div");
    hintText.style.cssText = [
      "color:rgb(75,83,32)",
      "font-size:24.232px",
      "font-weight:bold",
      "font-family:Signora",
      "text-align:center",
      "font-style:italic",
      "background:rgba(255,255,255,0.9)",
      "padding:16px 32px",
      "border-radius:8px",
      "pointer-events:none",
    ].join(";");
    hintText.textContent = "Chạm để mở thiệp";
    overlay.appendChild(hintText);

    const openEnvelope = () => {
      if (envelope) {
        envelope.classList.remove("close");
        envelope.classList.add("open");
      }
      overlay.remove();
      // Allow scroll
      if (scrollContainer) scrollContainer.style.overflowY = "auto";
      window.dispatchEvent(new CustomEvent("envelope-opened"));
    };

    overlay.addEventListener("click", openEnvelope, { signal });

    // Mount overlay inside the scroll container so it covers the card
    const pcContent = document.querySelector(".pc-content") as HTMLElement | null;
    if (pcContent) {
      pcContent.style.position = "relative";
      pcContent.appendChild(overlay);
      // Lock scroll until envelope is opened
      if (scrollContainer) scrollContainer.style.overflowY = "hidden";
    }

    // Also allow clicking the envelope directly to open it
    if (envelope) {
      envelope.addEventListener("click", openEnvelope, { signal });
    }

    // --- RSVP Card Radio Visual State ---
    const rsvpCardYes = document.querySelector<HTMLLabelElement>('label.rsvp-card-yes');
    const rsvpCardNo = document.querySelector<HTMLLabelElement>('label.rsvp-card-no');

    const applyCardState = (selected: 'yes' | 'no') => {
      if (!rsvpCardYes || !rsvpCardNo) return;
      if (selected === 'yes') {
        rsvpCardYes.style.background = 'rgb(58,74,58)';
        rsvpCardYes.style.color = 'white';
        rsvpCardYes.style.border = '1.5px solid rgb(58,74,58)';
        rsvpCardNo.style.background = 'transparent';
        rsvpCardNo.style.color = 'rgba(75,83,32,0.7)';
        rsvpCardNo.style.border = '1.5px solid rgba(150,130,70,0.4)';
      } else {
        rsvpCardNo.style.background = 'rgb(58,74,58)';
        rsvpCardNo.style.color = 'white';
        rsvpCardNo.style.border = '1.5px solid rgb(58,74,58)';
        rsvpCardYes.style.background = 'transparent';
        rsvpCardYes.style.color = 'rgba(75,83,32,0.7)';
        rsvpCardYes.style.border = '1.5px solid rgba(150,130,70,0.4)';
      }
    };

    if (rsvpCardYes) {
      rsvpCardYes.addEventListener('click', () => applyCardState('yes'), { signal });
    }
    if (rsvpCardNo) {
      rsvpCardNo.addEventListener('click', () => applyCardState('no'), { signal });
    }

    // --- RSVP Form ---
    const rsvpForm = document.querySelector(".rsvp-form form") as HTMLFormElement | null;
    if (rsvpForm) {
      rsvpForm.addEventListener(
        "submit",
        async (e) => {
          e.preventDefault();
          const nameInput = rsvpForm.querySelector<HTMLInputElement>('[name="rsvp-name"]');
          const attendanceInput = rsvpForm.querySelector<HTMLInputElement>('[name="rsvp-attendance"]:checked');
          const countSelect = rsvpForm.querySelector<HTMLSelectElement>("#rsvp-attendee-count");
          const submitBtn = rsvpForm.querySelector<HTMLButtonElement>('[type="submit"]');

          const name = nameInput?.value.trim() ?? "";
          const attending = (attendanceInput?.value ?? "yes") === "yes";
          const attendeeCount = Number(countSelect?.value ?? "1");

          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Đang gửi...";
          }

          try {
            const res = await fetch("/api/rsvp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, attending, attendeeCount }),
            });

            if (submitBtn) {
              if (res.ok) {
                submitBtn.textContent = attending ? "✓ Đã xác nhận tham dự!" : "✓ Đã ghi nhận";
                submitBtn.style.background = "#4caf50";
              } else {
                submitBtn.disabled = false;
                submitBtn.textContent = "Gửi xác nhận";
              }
            }
          } catch (_) {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Gửi xác nhận";
            }
          }
        },
        { signal },
      );
    }

    // --- Gửi lời chúc (Send Wishes) ---
    const wishBtn = document.querySelector(".message-box-button") as HTMLElement | null;
    const blessingBox = document.getElementById("blessing-box") as HTMLElement | null;

    if (wishBtn && blessingBox) {
      wishBtn.style.cursor = "pointer";

      // Set up blessing-box as a vertical chat stack (newest at bottom)
      blessingBox.style.flexDirection = "column";
      blessingBox.style.justifyContent = "flex-end";
      blessingBox.style.gap = "4px";
      blessingBox.style.padding = "0 0 4px 0";
      blessingBox.style.boxSizing = "border-box";
      blessingBox.style.position = "absolute";

      const showBlessingMessage = (name: string, message: string) => {
        blessingBox.style.opacity = "1";

        const msgEl = document.createElement("div");
        msgEl.className = "blessing-message jsx-3895218497";
        msgEl.textContent = name ? `${name}: ${message}` : message;
        // Override absolute positioning from CSS — use flow layout inside flex box
        msgEl.style.position = "relative";
        msgEl.style.bottom = "auto";
        msgEl.style.left = "auto";
        msgEl.style.right = "auto";
        msgEl.style.opacity = "0";
        msgEl.style.transform = "translateY(20px)";
        msgEl.style.transition = "opacity 0.35s ease, transform 0.35s ease";

        blessingBox.appendChild(msgEl);

        // Slide in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            msgEl.style.opacity = "1";
            msgEl.style.transform = "translateY(0)";
          });
        });

        // Fade out after 6s, then remove
        setTimeout(() => {
          msgEl.style.transition = "opacity 0.5s ease";
          msgEl.style.opacity = "0";
          setTimeout(() => {
            msgEl.remove();
            if (blessingBox.children.length === 0) {
              blessingBox.style.opacity = "0";
            }
          }, 500);
        }, 6000);
      };

      let sheetOpen = false;

      const openWishModal = () => {
        if (sheetOpen) return;
        sheetOpen = true;

        const appEl = document.getElementById("app-view-index");
        const appRect = appEl ? appEl.getBoundingClientRect() : { left: 0, width: window.innerWidth };

        const overlay = document.createElement("div");
        overlay.style.cssText = `position:fixed;top:0;left:${appRect.left}px;width:${appRect.width}px;height:100%;background:rgba(0,0,0,0.4);z-index:999999;`;

        const sheet = document.createElement("div");
        sheet.style.cssText = [
          `position:fixed;left:${appRect.left}px;width:${appRect.width}px;bottom:0;z-index:1000000;`,
          "background:white;border-radius:20px 20px 0 0;padding:24px 20px 32px;",
          "box-sizing:border-box;",
          "transform:translateY(100%);transition:transform 0.35s cubic-bezier(0.32,0.72,0,1);",
        ].join("");

        const handle = document.createElement("div");
        handle.style.cssText = "width:40px;height:4px;border-radius:2px;background:#ddd;margin:0 auto 20px;";

        const title = document.createElement("h3");
        title.textContent = "Gửi lời chúc";
        title.style.cssText =
          "margin:0 0 20px;font-family:Signora;color:rgb(58,74,58);font-size:22px;text-align:center;font-weight:normal;";

        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Tên của bạn";
        nameLabel.style.cssText = "display:block;font-size:13px;color:#888;margin-bottom:6px;";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Nhập tên...";
        nameInput.style.cssText =
          "width:100%;box-sizing:border-box;border:1.5px solid #eee;border-radius:10px;padding:10px 14px;font-size:14px;margin-bottom:14px;outline:none;font-family:inherit;background:#fafafa;";

        const msgLabel = document.createElement("label");
        msgLabel.textContent = "Lời chúc";
        msgLabel.style.cssText = "display:block;font-size:13px;color:#888;margin-bottom:6px;";

        const msgInput = document.createElement("textarea");
        msgInput.placeholder = "Nhập lời chúc...";
        msgInput.style.cssText =
          "width:100%;box-sizing:border-box;border:1.5px solid #eee;border-radius:10px;padding:10px 14px;font-size:14px;height:88px;resize:none;outline:none;margin-bottom:18px;font-family:inherit;display:block;background:#fafafa;";

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Gửi lời chúc";
        submitBtn.style.cssText =
          "width:100%;padding:14px;border:none;background:rgb(58,74,58);color:white;border-radius:12px;cursor:pointer;font-size:15px;font-family:inherit;letter-spacing:0.5px;";

        const closeSheet = () => {
          sheetOpen = false;
          sheet.style.transform = "translateY(100%)";
          overlay.style.opacity = "0";
          overlay.style.transition = "opacity 0.3s ease";
          setTimeout(() => {
            sheet.remove();
            overlay.remove();
          }, 350);
        };

        overlay.addEventListener("click", closeSheet);

        submitBtn.addEventListener("click", async () => {
          const name = nameInput.value.trim();
          const message = msgInput.value.trim();
          if (!message) {
            msgInput.style.borderColor = "#e57373";
            return;
          }
          closeSheet();
          showBlessingMessage(name, message);
          try {
            await fetch("/api/blessings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, message }),
            });
          } catch (_) {}
        });

        sheet.appendChild(handle);
        sheet.appendChild(title);
        sheet.appendChild(nameLabel);
        sheet.appendChild(nameInput);
        sheet.appendChild(msgLabel);
        sheet.appendChild(msgInput);
        sheet.appendChild(submitBtn);
        document.body.appendChild(overlay);
        document.body.appendChild(sheet);

        // Slide up
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            sheet.style.transform = "translateY(0)";
          });
        });

        setTimeout(() => nameInput.focus(), 400);
      };

      wishBtn.addEventListener("click", openWishModal, { signal });

      // Show recent blessings on load
      fetch("/api/blessings", { signal })
        .then((r) => r.json())
        .then((blessings: Array<{ name: string; message: string }>) => {
          const recent = blessings.slice(-5);
          recent.forEach((b, i) => {
            setTimeout(() => showBlessingMessage(b.name, b.message), i * 2000);
          });
        })
        .catch(() => {});
    }

    // --- Scroll-triggered Animations ---
    const parseTransitionKey = (key: string) => {
      const withoutFlag = key.replace(/-(true|false)$/, "");
      const match = withoutFlag.match(
        /(fade-in|rotate-in|scale-in|slide-right|slide-left|slide-up|slide-down|zoom-in|bounce-in|flip-in)-(\d+\.?\d*)-(\d+\.?\d*)-(.+)$/,
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
        case "fade-in":
          return { opacity: "0", transform: "none" };
        case "rotate-in":
          return { opacity: "0", transform: "rotate(-180deg)" };
        case "scale-in":
          return { opacity: "0", transform: "scale(0.5)" };
        case "slide-right":
          return { opacity: "0", transform: "translateX(-60px)" };
        case "slide-left":
          return { opacity: "0", transform: "translateX(60px)" };
        case "slide-up":
          return { opacity: "0", transform: "translateY(60px)" };
        case "slide-down":
          return { opacity: "0", transform: "translateY(-60px)" };
        case "zoom-in":
          return { opacity: "0", transform: "scale(0.2)" };
        case "bounce-in":
          return { opacity: "0", transform: "scale(0.5)" };
        case "flip-in":
          return { opacity: "0", transform: "perspective(400px) rotateY(90deg)" };
        default:
          return { opacity: "0", transform: "none" };
      }
    };

    const animRoot = document.querySelector(".styles_customScroll__X5r6w");
    const animElements = document.querySelectorAll<HTMLElement>("[data-transition-key]");

    animElements.forEach((el) => {
      const key = el.getAttribute("data-transition-key");
      if (!key) return;
      const parsed = parseTransitionKey(key);
      if (!parsed) return;
      const initial = getInitialStyle(parsed.animationType);
      el.style.opacity = initial.opacity;
      el.style.transform = initial.transform;
      el.style.willChange = "opacity, transform";
    });

    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const key = el.getAttribute("data-transition-key");
          if (!key) return;
          const parsed = parseTransitionKey(key);
          if (!parsed) return;
          el.style.transition = `opacity ${parsed.duration}s ${parsed.easing} ${parsed.delay}s, transform ${parsed.duration}s ${parsed.easing} ${parsed.delay}s`;
          el.style.opacity = "1";
          el.style.transform = "none";
          animObserver.unobserve(el);
        });
      },
      { root: animRoot, threshold: 0.1 },
    );

    animElements.forEach((el) => animObserver.observe(el));

    // --- Countdown Timer ---
    let timer: ReturnType<typeof setInterval> | null = null;
    const countdownEl = document.querySelector(".jsx-3272123691.countdown.componentBOX");
    if (countdownEl) {
      const children = countdownEl.querySelectorAll(":scope > div");
      const [daysBox, hoursBox, minutesBox, secondsBox] = Array.from(children);

      const getValueEl = (box: Element) => box.querySelector("div:first-child");

      const tick = () => {
        const now = new Date();
        const diff = WEDDING_DATE.getTime() - now.getTime();

        if (diff <= 0) {
          // Wedding already happened
          [daysBox, hoursBox, minutesBox, secondsBox].forEach((box) => {
            const el = getValueEl(box);
            if (el) el.textContent = "0";
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
      controller.abort();
      animObserver.disconnect();
      if (timer) clearInterval(timer);
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Công Tú &amp; Diễm My Wedding Invitation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Công Tú &amp; Diễm My Wedding Invitation" />
      </Head>
      <InvitationContent />
    </>
  );
};

export default Home;
