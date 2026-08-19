document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       VISITOR COUNTER (Live Count via countapi.xyz)
       ========================================================================== */
    const visitorCountEl = document.getElementById('visitor-count');
    if (visitorCountEl) {
        fetch('https://api.countapi.xyz/hit/sandeep405812-portfollio/visits')
            .then(res => res.json())
            .then(data => {
                // Animate number count up
                const target = data.value;
                let current = Math.max(0, target - 30);
                const duration = 1500;
                const step = (target - current) / (duration / 16);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    visitorCountEl.textContent = Math.floor(current).toLocaleString();
                }, 16);
            })
            .catch(() => {
                // Fallback: use localStorage to count locally
                let count = parseInt(localStorage.getItem('portfolio_visits') || '0') + 1;
                localStorage.setItem('portfolio_visits', count);
                visitorCountEl.textContent = count.toLocaleString();
            });
    }

    /* ==========================================================================
       CUSTOM CURSOR
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let mouseX = 0, mouseY = 0; // Mouse position
    let outlineX = 0, outlineY = 0; // Outline position (smoothed)
    let isMoving = false;

    // Check if the device has a mouse/pointer (not touch-only)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice) {
        // Show cursor elements
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;
            
            // Dot moves instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth spring animation for cursor outline (lerp)
        const animateOutline = () => {
            const ease = 0.15; // Smoothness factor
            
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateOutline);
        };
        requestAnimationFrame(animateOutline);

        // Hover effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card, .accent-btn, .modal-close');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    } else {
        // Hide cursor elements completely on touch screens
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }


    /* ==========================================================================
       THEME ACCENT COLOR SWITCHER
       ========================================================================== */
    const accentBtns = document.querySelectorAll('.accent-btn');

    accentBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            accentBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Set data-theme on document element
            const theme = btn.getAttribute('data-accent');
            document.documentElement.setAttribute('data-theme', theme);
        });
    });


    /* ==========================================================================
       TYPING ANIMATION
       ========================================================================== */
    const typingText = document.getElementById('typing-text');
    const phrases = ["MERN Stack Apps", "RESTful APIs", "Full Stack Solutions", "ML Systems", "Scalable Backends"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const typeLoop = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Remove character
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Delete faster
        } else {
            // Add character
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Completed typing, pause before deleting
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Completed deleting, move to next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Short pause before next phrase
        }

        setTimeout(typeLoop, typeSpeed);
    };

    if (typingText) {
        typeLoop();
    }


    /* ==========================================================================
       SCROLL REVEAL (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 0px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Also force-reveal any project cards already in viewport on load
    setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 300);


    /* ==========================================================================
       HEADER SCROLL & ACTIVE NAV LINK
       ========================================================================== */
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // 1. Header background solid scroll state
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 2. Navigation Active State Switch
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close menu when clicking navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }


    /* ==========================================================================
       SKILL CARDS HOVER SHADOW
       ========================================================================== */
    const skillCards = document.querySelectorAll('.skill-card');

    // Helper to convert hex to rgb string (e.g. #00f0ff -> 0, 240, 255)
    const hexToRgb = (hex) => {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    };

    skillCards.forEach(card => {
        const color = card.getAttribute('data-color');
        if (color) {
            card.style.setProperty('--hover-color', color);
            const rgbColor = hexToRgb(color);
            if (rgbColor) {
                card.style.setProperty('--hover-color-rgb', rgbColor);
            }
        }
    });


    /* ==========================================================================
       PORTFOLIO PROJECTS FILTER
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Add fade-out transition before hiding
                card.style.transform = 'scale(0.85)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });


    /* ==========================================================================
       PROJECTS DATA & DETAILS MODAL
       ========================================================================== */
    const projectsData = {
        1: {
            title: "Hospital Management System",
            category: "Full Stack Web App · MERN Stack",
            image: "assets/project1.png",
            summary: "A full-stack MERN application for managing patient registration, doctor appointments, medical records, and billing with role-based access control.",
            description: "Built a complete Hospital Management System using the MERN stack to manage patient registration, doctor appointments, medical records, and billing in real time. Implemented role-based access control (Admin, Doctor, Patient) with JWT authentication and protected React routes. Designed RESTful APIs with Express.js and Node.js, integrating MongoDB for scalable and persistent data storage. Created a responsive React.js frontend with dynamic dashboards, appointment booking, and medical history views.",
            tech: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT", "REST API"],
            live: "https://hospital-management-roan-iota.vercel.app/login",
            code: "https://github.com/Sandeep405812"
        },
        2: {
            title: "Autonomous Car Driving System",
            category: "AI / ML · Embedded Systems · In Progress 🚧",
            image: "assets/project2.png",
            summary: "A real-world autonomous car using Raspberry Pi with ML models for lane detection, obstacle avoidance, and steering angle prediction via OpenCV.",
            description: "Building a real-world autonomous car using Raspberry Pi as the onboard controller, integrated with a camera module for live environment sensing. Implementing Machine Learning models for real-time lane detection, obstacle avoidance, and steering angle prediction directly on the Raspberry Pi. Using OpenCV for live video frame capture and processing to detect road lanes and obstacles under varying lighting conditions. Controlling motor drivers and servo mechanisms via Raspberry Pi GPIO pins for physical steering and speed regulation.",
            tech: ["Raspberry Pi", "Python", "OpenCV", "Machine Learning", "GPIO"],
            live: "#",
            code: "https://github.com/Sandeep405812"
        },
        3: {
            title: "Smart College ERP",
            category: "ERP System · Full Stack Web App",
            image: "assets/project3.png",
            summary: "A comprehensive College ERP system managing students, faculty, attendance, exams, timetables, fees, and library — all in one unified platform.",
            description: "Smart College ERP is a full-featured Enterprise Resource Planning system built for educational institutions. It includes modules for student enrollment & management, faculty assignments, daily attendance tracking with analytics, exam scheduling & result management, automated fee collection with payment gateway integration, timetable generation, and library management. Built with role-based access control for Admin, Faculty, and Student roles with JWT-secured APIs and a fully responsive React.js frontend with dynamic dashboards.",
            tech: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT", "REST API"],
            live: "#",
            code: "https://github.com/Sandeep405812"
        }
    };

    const projectCardsEl = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');

    const openModal = (projectId) => {
        const data = projectsData[projectId];
        if (!data) return;

        // Render modal content
        modalBody.innerHTML = `
            <img src="${data.image}" alt="${data.title}" class="modal-project-img">
            <h3 class="modal-project-title">${data.title}</h3>
            <p class="modal-project-meta">${data.category}</p>
            <div class="modal-project-desc">
                <p>${data.description}</p>
            </div>
            
            <h4 class="modal-project-tech-title">Technologies Used</h4>
            <div class="project-tech" style="margin-bottom: 2rem;">
                ${data.tech.map(t => `<span>${t}</span>`).join('')}
            </div>

            <div class="modal-project-links">
                <a href="${data.live}" target="_blank" class="btn btn-primary" style="color:#000;">
                    Live Project <i class="fa-solid fa-up-right-from-square"></i>
                </a>
                <a href="${data.code}" target="_blank" class="btn btn-secondary">
                    View Code <i class="fa-brands fa-github"></i>
                </a>
            </div>
        `;

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scroll
    };

    const closeModal = () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = ''; // Enable page scroll
    };

    projectCardsEl.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-project-id');
            openModal(id);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });


    /* ==========================================================================
       CONTACT FORM HANDLING (Mock Submission)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Set loading state
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>`;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Simulate form submisson to server
            setTimeout(() => {
                // Success message
                formStatus.textContent = "Thank you! Your message has been sent successfully.";
                formStatus.classList.add('success');
                
                // Reset form fields
                contactForm.reset();
                
                // Restore submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.classList.remove('success');
                }, 5000);
            }, 1800);
        });
    }

    /* ==========================================================================
       MAGNETIC BUTTON MICRO-INTERACTIONS
       ========================================================================== */
    const magneticBtns = document.querySelectorAll('.magnetic');

    if (!isTouchDevice) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Translate the button slightly towards cursor
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                // Return button to origin
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }
});
