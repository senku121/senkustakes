/* ==========================================
        SENKU STAKES
        script.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
            MOBILE MENU
    =============================== */

    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const navButtons = document.querySelector(".nav-buttons");

    if (menuBtn) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("mobile-active");

            navButtons.classList.toggle("mobile-active");

        });

    }

    /* ===============================
            STICKY HEADER
    =============================== */

    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {

            header.style.background = "rgba(7,10,20,.92)";
            header.style.boxShadow = "0 12px 35px rgba(0,0,0,.25)";

        }

        else {

            header.style.background = "rgba(9,12,24,.72)";
            header.style.boxShadow = "none";

        }

    });

    /* ===============================
            SMOOTH SCROLL
    =============================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        });

    });

    /* ===============================
            SCROLL REVEAL
    =============================== */

    const reveals = document.querySelectorAll(

        ".feature-card, .service-card, .testimonial-card, .stat-box"

    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {

        threshold: .15

    });

    reveals.forEach(card => {

        card.classList.add("hidden");

        observer.observe(card);

    });

    /* ===============================
            COUNTER ANIMATION
    =============================== */

    const counters = document.querySelectorAll(".stat-box h2");

    let counted = false;

    function animateCounters() {

        if (counted) return;

        const stats = document.querySelector(".stats-section");

        if (!stats) return;

        const top = stats.getBoundingClientRect().top;

        if (top < window.innerHeight - 120) {

            counted = true;

            counters.forEach(counter => {

                const original = counter.innerText;

                const value = parseFloat(original.replace(/[^0-9.]/g, ""));

                if (isNaN(value)) return;

                let current = 0;

                const duration = 1800;

                const step = value / (duration / 20);

                const timer = setInterval(() => {

                    current += step;

                    if (current >= value) {

                        current = value;

                        clearInterval(timer);

                    }

                    if (original.includes("%")) {

                        counter.innerText = current.toFixed(2) + "%";

                    }

                    else if (original.includes("$")) {

                        counter.innerText = "$" + current.toFixed(1) + "B";

                    }

                    else if (original.includes("K")) {

                        counter.innerText = Math.floor(current) + "K+";

                    }

                    else {

                        counter.innerText = Math.floor(current);

                    }

                },20);

            });

        }

    }

    window.addEventListener("scroll", animateCounters);

    animateCounters();

    /* ===============================
            ACTIVE NAV LINK
    =============================== */

    const sections = document.querySelectorAll("section[id]");

    const navItems = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 140;

            const height = section.offsetHeight;

            if (scrollY >= top) {

                current = section.getAttribute("id");

            }

        });

        navItems.forEach(link => {

            link.classList.remove("active-link");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active-link");

            }

        });

    });

});