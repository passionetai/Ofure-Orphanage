// JavaScript for Ofure Orphanage website will go here.
// Example: Mobile menu toggle, animations, etc.

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            // Optional: Change icon on toggle
            const icon = mobileMenuButton.querySelector('i');
            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    const mobileNavLinks = mobileMenu?.querySelectorAll('a');
    mobileNavLinks?.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu?.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                mobileMenuButton?.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
            }
        });
    });


    // --- Add other JS functionality below ---

    // Example: Smooth scrolling for anchor links (if not handled by CSS scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's an internal link and not just '#'
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Example: Counter animation (requires Intersection Observer API)
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;

        // Lower inc to slow and higher to slow
        const inc = Math.ceil(target / speed);

        // Check if target is reached
        if (count < target) {
            // Add inc to count and output in counter
            counter.innerText = count + inc;
            // Call function every ms
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target; // Ensure it ends exactly at the target
        }
    };

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of item has to be visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                observer.unobserve(counter); // Stop observing once animation starts
            }
        });
    };

    const counterObserver = new IntersectionObserver(observerCallback, observerOptions);

    counters.forEach(counter => {
        counter.innerText = '0'; // Start counter at 0
        counterObserver.observe(counter);
    });


    // Example: Testimonial Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.display = 'none'; // Hide all slides initially
            dots[i].classList.remove('active', 'bg-indigo-600');
            dots[i].classList.add('bg-indigo-200');
        });
        slides[index].style.display = 'block'; // Show the target slide
        // Add a small delay for the fade-in effect if using CSS animations
        setTimeout(() => slides[index].classList.add('active'), 10);
        dots[index].classList.add('active', 'bg-indigo-600');
        dots[index].classList.remove('bg-indigo-200');
        currentSlide = index;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showSlide(parseInt(dot.getAttribute('data-slide')));
        });
    });

    // Initialize the slider
    if (slides.length > 0) {
        showSlide(0);
        // Auto-play slider every 6 seconds
        setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            showSlide(nextSlide);
        }, 6000); // Change slide every 6 seconds
    }

    // Example: Donation Chart (requires Chart.js - needs to be included)
    // Check if Chart.js is loaded before trying to use it
    if (typeof Chart !== 'undefined') {
        const ctx = document.getElementById('donationChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Food & Shelter', 'Education', 'Healthcare', 'Staff Salaries', 'Administrative'],
                    datasets: [{
                        data: [45, 30, 15, 7, 3],
                        backgroundColor: [
                            '#4f46e5', // indigo-600
                            '#22c55e', // green-500
                            '#f59e0b', // amber-400 (using amber-500 for better visibility)
                            '#a855f7', // purple-500
                            '#9ca3af'  // gray-400
                        ],
                        borderColor: '#ffffff', // White border between segments
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%', // Adjust for thickness of the doughnut ring
                    plugins: {
                        legend: {
                            display: false // Hide the default legend, as we have a custom one
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += context.parsed + '%';
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    } else {
        console.warn('Chart.js not loaded. Donation chart cannot be displayed.');
        // Optionally hide the chart container or show a message
        const chartContainer = document.getElementById('donationChart')?.parentElement?.parentElement; // Adjust selector as needed
        if (chartContainer) {
           // chartContainer.innerHTML = '<p class="text-center text-gray-500">Chart could not be loaded.</p>';
           // Or hide it: chartContainer.style.display = 'none';
        }
    }

    // EmailJS Contact Form Integration
    // Initialize EmailJS with your public key from config
    emailjs.init(emailJSConfig.PUBLIC_KEY);

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Show loading state
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
            submitBtn.disabled = true;

            // Get form status elements
            const formStatus = document.getElementById('form-status');
            const successMessage = document.getElementById('success-message');
            const errorMessage = document.getElementById('error-message');

            // Hide any previous messages
            formStatus.classList.add('hidden');
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');

            // Get reCAPTCHA response
            const recaptchaResponse = grecaptcha.getResponse();

            // Check if reCAPTCHA is completed
            if (!recaptchaResponse) {
                // Show error message for reCAPTCHA
                formStatus.classList.remove('hidden');
                errorMessage.classList.remove('hidden');
                errorMessage.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> Please complete the reCAPTCHA verification.';

                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                return;
            }

            // Prepare template parameters from form data
            const templateParams = {
                user_name: contactForm.user_name.value,
                user_email: contactForm.user_email.value,
                subject: contactForm.subject.value,
                message: contactForm.message.value,
                newsletter: contactForm.newsletter?.checked ? 'Yes' : 'No',
                'g-recaptcha-response': recaptchaResponse
            };

            // Send the email using EmailJS
            emailjs.send(emailJSConfig.SERVICE_ID, emailJSConfig.TEMPLATE_ID, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response);

                // Show success message
                formStatus.classList.remove('hidden');
                successMessage.classList.remove('hidden');

                // Reset the form
                contactForm.reset();

                // Reset reCAPTCHA
                grecaptcha.reset();

                // Restore button state after a short delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
            }, function(error) {
                console.error('FAILED...', error);

                // Show error message
                formStatus.classList.remove('hidden');
                errorMessage.classList.remove('hidden');

                // Reset reCAPTCHA
                grecaptcha.reset();

                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
}); // End DOMContentLoaded

// Hero Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if hero images exist
    function checkImage(imageSrc, callback) {
        var img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = imageSrc;
    }

    // Check all hero images
    const heroImageCount = 10;
    for (let i = 1; i <= heroImageCount; i++) {
        const imagePath = `./images/a${i}.png`;
        const slideIndex = i - 1;

        checkImage(imagePath, function(exists) {
            if (!exists) {
                console.error(`Hero image ${i} not found at ${imagePath}`);
                // Try to apply a default background if image not found
                document.querySelector(`.hero-slide:nth-child(${i})`).style.backgroundImage =
                    'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1542810634-71277d95dcbb")';
            } else {
                console.log(`Hero image ${i} loaded successfully`);
            }
        });
    }

    // Hero slider functionality
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;

    function nextHeroSlide() {
        // Remove active class from current slide
        heroSlides[currentHeroSlide].classList.remove('active');

        // Calculate next slide index
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;

        // Add active class to next slide
        heroSlides[currentHeroSlide].classList.add('active');
    }

    // Change slide every 6 seconds (with 3-second transition)
    setInterval(nextHeroSlide, 6000);
}); // End DOMContentLoaded
