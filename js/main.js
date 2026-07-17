/* ==========================================================================
   Ethan Hennenhoefer — Portfolio
   Motion & interaction layer. Progressive enhancement only: the page is
   fully readable with JS (or the CDN) unavailable, and with reduced motion.
   ========================================================================== */

(() => {
  "use strict";

  const params = new URLSearchParams(location.search);
  const motionOff = params.get("motion") === "off";
  if (params.get("flat") === "1") document.documentElement.classList.add("qa-flat"); // full-page snapshot mode
  const reduceMotion = motionOff || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  let lenis = null;
  let scrollVelocity = 0;

  /* ------------------------------ Smooth scroll ------------------------------ */
  if (hasLenis && hasGSAP && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    lenis = new Lenis({ duration: 1.1 });
    lenis.on("scroll", (e) => {
      scrollVelocity = e.velocity;
      ScrollTrigger.update();
    });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis; // handy for debugging

  } else if (hasGSAP && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ------------------------------ Hero name: fit to container width ------------------------------ */
  const fitName = document.querySelector("[data-fit-name]");
  const fitLongD = document.querySelector("[data-fit-long]");
  const fitLongM = document.querySelector("[data-fit-long-m]");
  function fitHeroName() {
    if (!fitName) return;
    const fitLong = window.innerWidth <= 560 && fitLongM ? fitLongM : fitLongD;
    if (!fitLong) return;
    fitName.style.fontSize = "100px";
    const textWidth = fitLong.getBoundingClientRect().width;
    if (!textWidth) return;
    const scale = fitName.clientWidth / textWidth;
    const size = Math.max(24, Math.min(100 * scale * 0.99, 260));
    fitName.style.fontSize = size.toFixed(2) + "px";
  }
  fitHeroName();
  document.fonts?.ready.then(fitHeroName);
  let fitTimer;
  window.addEventListener("resize", () => {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitHeroName, 120);
  }, { passive: true });

  /* ------------------------------ Anchor navigation ------------------------------ */
  document.querySelectorAll("[data-scroll-to]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return;
      const target = hash === "#top" ? document.body : document.querySelector(hash);
      if (!target) return;

      closeMenu();

      if (lenis) {
        e.preventDefault();
        lenis.scrollTo(hash === "#top" ? 0 : target, { offset: -24, duration: 1.2 });
        history.pushState(null, "", hash);
      }
      // else: native anchor + CSS smooth scroll handles it
    });
  });

  /* ------------------------------ Header ------------------------------ */
  const header = document.querySelector("[data-header]");
  let lastY = 0;

  function onScrollPos(y) {
    if (!header) return;
    header.classList.toggle("is-scrolled", y > 24);
    const goingDown = y > lastY && y > 220;
    header.classList.toggle("is-hidden", goingDown && !menuOpen);
    lastY = y;
  }
  if (lenis) {
    lenis.on("scroll", (e) => onScrollPos(e.scroll));
  } else {
    window.addEventListener("scroll", () => onScrollPos(window.scrollY), { passive: true });
  }

  /* active section link */
  const sectionIds = ["work", "practice", "about", "contact"];
  const headLinks = new Map(
    [...document.querySelectorAll(".head-link")].map((a) => [a.getAttribute("href"), a])
  );
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = headLinks.get("#" + entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          headLinks.forEach((l) => l.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ------------------------------ Menu (mobile) ------------------------------ */
  const menu = document.querySelector("[data-menu]");
  const menuBtn = document.querySelector("[data-menu-btn]");
  let menuOpen = false;

  function openMenu() {
    if (!menu || menuOpen) return;
    menuOpen = true;
    menu.hidden = false;
    void menu.offsetHeight; // flush styles so the transition runs
    menu.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.textContent = "Close";
    document.body.style.overflow = "hidden";
    header.classList.remove("is-hidden");
  }
  function closeMenu() {
    if (!menu || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "Menu";
    document.body.style.overflow = "";
    setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 380);
  }
  menuBtn?.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ------------------------------ Clock (Austin, TX) ------------------------------ */
  const clockFmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Chicago",
  });
  function tickClock() {
    const stamp = clockFmt.format(new Date());
    document.querySelectorAll("[data-clock]").forEach((el) => (el.textContent = stamp));
    document.querySelectorAll("[data-clock-copy]").forEach((el) => (el.textContent = `Austin, TX · ${stamp}`));
  }
  tickClock();
  setInterval(tickClock, 20000);

  /* ------------------------------ Copy email ------------------------------ */
  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    const label = btn.querySelector("[data-copy-label]");
    const original = label.textContent;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.getAttribute("data-copy-email"));
        label.textContent = "Copied!";
      } catch {
        label.textContent = btn.getAttribute("data-copy-email");
      }
      setTimeout(() => (label.textContent = original), 2000);
    });
  });

  /* ------------------------------ GSAP motion ------------------------------ */
  if (hasGSAP && !reduceMotion) {
    /* Intro — hero name rises out of masks, meta fades in */
    const introLines = document.querySelectorAll("[data-intro-line]");
    const introFades = document.querySelectorAll("[data-intro-fade]");
    gsap.set(introLines, { yPercent: 110 });
    gsap.set(introFades, { opacity: 0, y: 14 });

    const intro = gsap.timeline({ delay: 0.15 });
    intro
      .to(introLines, { yPercent: 0, duration: 1.15, stagger: 0.12, ease: "power4.out" })
      .to(introFades, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: "power3.out" }, "-=0.55");

    /* Section title masks */
    document.querySelectorAll("[data-reveal-title]").forEach((el) => {
      gsap.fromTo(el, { yPercent: 112 }, {
        yPercent: 0,
        duration: 1.05,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });

    /* Hairline rules draw across */
    document.querySelectorAll("[data-rule]").forEach((el) => {
      gsap.fromTo(el, { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.3,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 92%" },
      });
    });

    /* Generic reveals */
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    /* Parallax frames */
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const strength = parseFloat(el.getAttribute("data-parallax")) || 6;
      gsap.fromTo(el, { yPercent: -strength }, {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    });

    /* Phones drift & tilt with scroll — the "spin as you scroll" nod */
    document.querySelectorAll("[data-phone]").forEach((el) => {
      const dir = parseInt(el.getAttribute("data-phone"), 10);
      gsap.to(el, {
        y: dir === 0 ? -30 : 26,
        rotation: `+=${dir * 4}`,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest(".project-media"),
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });

    /* Marquee — infinite loop, speeds up with scroll velocity */
    const track = document.querySelector("[data-marquee]");
    if (track) {
      const chunk = track.querySelector(".marquee-chunk");
      const needed = Math.ceil((window.innerWidth * 2) / chunk.offsetWidth) + 1;
      for (let i = 0; i < needed; i++) track.appendChild(chunk.cloneNode(true));

      let x = 0;
      const wrap = () => -chunk.offsetWidth;
      gsap.ticker.add(() => {
        const boost = Math.min(Math.abs(scrollVelocity) * 0.12, 6);
        x -= 0.55 + boost;
        if (x <= wrap()) x -= wrap();
        gsap.set(track, { x });
      });
    }

    /* Cursor-follow tag on projects */
    const tag = document.querySelector("[data-cursor-tag]");
    const tagText = document.querySelector("[data-cursor-text]");
    if (tag && window.matchMedia("(pointer: fine)").matches) {
      const xTo = gsap.quickTo(tag, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(tag, "y", { duration: 0.35, ease: "power3" });
      window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });

      document.querySelectorAll("[data-cursor]").forEach((zone) => {
        zone.addEventListener("mouseenter", () => {
          tagText.textContent = zone.getAttribute("data-cursor");
          gsap.to(tag, { scale: 1, duration: 0.35, ease: "back.out(1.6)" });
        });
        zone.addEventListener("mouseleave", () => {
          gsap.to(tag, { scale: 0, duration: 0.25, ease: "power3.in" });
        });
      });
    }

    /* Contact title chars — slight stagger on entry */
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
})();
