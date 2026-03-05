"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const METRICS_TOP = [
  { value: "58%", label: "Increase in pick up point use", tone: "bg-[#d6ef3e] text-[#0a0a0f]" },
  { value: "27%", label: "Increase in pick up point use", tone: "bg-[#2d2f34] text-[#f2f2f2]" }
];

const METRICS_BOTTOM = [
  { value: "23%", label: "Decreased in customer phone calls", tone: "bg-[#63b4e0] text-[#0a0a0f]" },
  { value: "40%", label: "Decreased in customer phone calls", tone: "bg-[#b56a2d] text-[#0a0a0f]" }
];
const BASE_PATH = process.env.NODE_ENV === "production" ? "/scroll-hero-animation" : "";

export default function Home() {
  const sceneRef = useRef(null);
  const titleRef = useRef(null);
  const cardsTopRef = useRef([]);
  const cardsBottomRef = useRef([]);
  const stripFillRef = useRef(null);
  const carWrapRef = useRef(null);
  const carRef = useRef(null);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const cardsStateRef = useRef([0, 0, 0, 0]);
  const frameRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { opacity: 1 });
      gsap.set(cardsTopRef.current, { opacity: 0, y: -18 });
      gsap.set(cardsBottomRef.current, { opacity: 0, y: 18 });
      gsap.set(carWrapRef.current, { opacity: 1 });

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
      const updateProgress = (delta) => {
        targetProgressRef.current = clamp(targetProgressRef.current + delta, 0, 1);
      };

      let touchY = 0;
      const onWheel = (event) => {
        event.preventDefault();
        updateProgress(event.deltaY * 0.00052);
      };
      const onTouchStart = (event) => {
        touchY = event.touches[0]?.clientY ?? 0;
      };
      const onTouchMove = (event) => {
        const nextY = event.touches[0]?.clientY ?? touchY;
        const deltaY = touchY - nextY;
        touchY = nextY;
        updateProgress(deltaY * 0.00115);
      };

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });

      const animate = () => {
        smoothProgressRef.current += (targetProgressRef.current - smoothProgressRef.current) * 0.1;
        const p = smoothProgressRef.current;
        const vw = window.innerWidth;
        const carWidth = carRef.current?.getBoundingClientRect().width ?? 560;
        const startX = -carWidth * 0.72;
        const endX = vw - carWidth * 0.28;
        const x = startX + (endX - startX) * p;
        const carCenterPercent = ((x + carWidth * 0.5) / vw) * 100;
        const revealPercent = clamp(((carCenterPercent - 8) / 78) * 100, 0, 100);
        const cardsProgress = Math.max(p, targetProgressRef.current);
        const cardsX = startX + (endX - startX) * cardsProgress;
        const cardsCenterPercent = ((cardsX + carWidth * 0.5) / vw) * 100;

        if (carRef.current) {
          carRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
        }

        if (stripFillRef.current) {
          const passedX = clamp(x + carWidth * 0.28, 0, vw);
          stripFillRef.current.style.width = `${passedX}px`;
        }

        if (titleRef.current) {
          titleRef.current.style.clipPath = `inset(0 ${100 - revealPercent}% 0 0)`;
        }

        const allCards = [
          cardsTopRef.current[0],
          cardsTopRef.current[1],
          cardsBottomRef.current[0],
          cardsBottomRef.current[1]
        ];
        const thresholds = [30, 50, 60, 70];

        allCards.forEach((card, index) => {
          const target = cardsCenterPercent >= thresholds[index] ? 1 : 0;
          cardsStateRef.current[index] += (target - cardsStateRef.current[index]) * 0.16;
          if (card) {
            const state =
              targetProgressRef.current >= 0.999 && target === 1 ? 1 : cardsStateRef.current[index];
            const y = index < 2 ? (1 - state) * -18 : (1 - state) * 18;
            card.style.opacity = `${state}`;
            card.style.transform = `translate3d(0, ${y}px, 0)`;
          }
        });

        frameRef.current = window.requestAnimationFrame(animate);
      };

      frameRef.current = window.requestAnimationFrame(animate);

      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
      };
    }, sceneRef);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      ctx.revert();
    };
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-[#c6c6c9]">
      <section ref={sceneRef} className="relative h-screen">
        <div className="h-screen overflow-hidden">
          <div className="absolute left-0 right-0 top-[8vh] z-20 mx-auto grid w-[min(94vw,760px)] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-7">
            {METRICS_TOP.map((item, index) => (
              <article
                key={item.value}
                ref={(el) => {
                  cardsTopRef.current[index] = el;
                }}
                className={`rounded-2xl px-6 py-6 shadow-sm sm:px-10 sm:py-8 ${item.tone}`}
              >
                <p className="display-font text-5xl font-semibold leading-none sm:text-6xl">{item.value}</p>
                <p className="mt-3 text-lg leading-tight sm:mt-4 sm:text-[1.05rem]">{item.label}</p>
              </article>
            ))}
          </div>

          <div className="absolute left-0 right-0 top-1/2 h-[34vh] min-h-[220px] -translate-y-1/2">
            <div className="h-full bg-[#9b9ca1]" />
            <div ref={stripFillRef} className="absolute left-0 top-0 h-full w-0 bg-[#46d37a]" />
            <h1
              ref={titleRef}
              className="display-font absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[clamp(28px,6.2vw,118px)] font-semibold leading-[0.9] tracking-[0.02em] text-[#05070d]"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              WELCOME TO ITSFIZZ
            </h1>
            <div ref={carWrapRef} className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
              <img
                ref={carRef}
                src={`${BASE_PATH}/car-top.svg`}
                alt="Top view orange sports car"
                className="w-[clamp(380px,50vw,760px)] will-change-transform"
              />
            </div>
          </div>

          <div className="absolute bottom-[8vh] right-[3vw] z-20 grid w-[min(94vw,830px)] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-7">
            {METRICS_BOTTOM.map((item, index) => (
              <article
                key={item.value}
                ref={(el) => {
                  cardsBottomRef.current[index] = el;
                }}
                className={`rounded-2xl px-6 py-6 shadow-sm sm:px-10 sm:py-8 ${item.tone}`}
              >
                <p className="display-font text-5xl font-semibold leading-none sm:text-6xl">{item.value}</p>
                <p className="mt-3 text-lg leading-tight sm:mt-4 sm:text-[1.05rem]">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
