document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Toggle mobile menu
    const overlay = document.querySelector('.menu-overlay');

    function toggleMenu() {
        mainNav.classList.toggle('active');
        overlay.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';

        const icon = mobileMenuBtn.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Handle mobile dropdowns
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const link = e.target.closest('a');
                if (link && link.nextElementSibling?.classList.contains('dropdown-menu')) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            }
        });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                mainNav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        }
    });

    // Slider Functionality
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const indicators = document.querySelectorAll('.indicator');

    if (sliderWrapper && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;

        function updateSlider() {
            const isRTL = document.documentElement.dir === 'rtl';
            const multiplier = isRTL ? 1 : -1;
            sliderWrapper.style.transform = `translateX(${currentSlide * 100 * multiplier}%)`;
            indicators.forEach((ind, index) => {
                ind.classList.toggle('active', index === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        window.updateSlider = updateSlider;

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });

        // Auto slide
        setInterval(nextSlide, 5000);
    }

    // Gallery & Accreditation logic
    const accordionContainer = document.getElementById('accreditation-accordion');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModalBtn = document.querySelector('.close-modal');

    const categories = [
        { id: 'PhD_Certificates', key: 'phd_section', icon: 'fa-user-graduate' },
        { id: 'Graduation_Certificates', key: 'grad_certs', icon: 'fa-certificate' },
        { id: 'Membership_Cards', key: 'member_cards', icon: 'fa-id-card' },
        { id: 'Marketing_Cards', key: 'marketing_cards', icon: 'fa-bullhorn' }
    ];

    window.renderAccreditation = function () {
        if (!accordionContainer || !window.albumsData) return;

        accordionContainer.innerHTML = '';

        categories.forEach(category => {
            const images = window.albumsData[category.id] || [];
            if (images.length === 0) return;

            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            accordionItem.style.cssText = 'margin-bottom: 15px; border-radius: 8px; overflow: hidden; border: 1px solid var(--gold-main); box-shadow: 0 4px 6px rgba(0,0,0,0.05);';

            const header = document.createElement('div');
            header.className = 'accordion-header';
            header.style.cssText = 'background: var(--primary-color); color: var(--gold-light); padding: 18px 25px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.3s;';

            const categoryTitle = typeof getT === 'function' ? getT(category.key) : category.key;

            header.innerHTML = `<h3 style="margin: 0; font-size: 1.2rem; display: flex; align-items: center; gap: 10px;"><i class="fas ${category.icon}"></i> ${categoryTitle}</h3> <i class="fas fa-plus accordion-icon" style="transition: transform 0.3s; color: var(--gold-main);"></i>`;

            const contentWrap = document.createElement('div');
            contentWrap.className = 'accordion-content';
            contentWrap.style.cssText = 'background: #fff; max-height: 0; overflow: hidden; transition: max-height 0.4s ease-out;';

            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; padding: 25px;';

            images.forEach(imgSrc => {
                const imgWrap = document.createElement('div');
                imgWrap.style.cssText = 'overflow: hidden; border-radius: 8px; cursor: pointer; border: 2px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: transform 0.3s, border-color 0.3s; aspect-ratio: 1; position: relative;';

                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s, filter 0.3s; filter: blur(3px);';

                imgWrap.onmouseover = () => {
                    imgWrap.style.transform = 'translateY(-3px)';
                    imgWrap.style.borderColor = 'var(--gold-main)';
                    imgElement.style.transform = 'scale(1.1)';
                    imgElement.style.filter = 'blur(0px)';
                };
                imgWrap.onmouseout = () => {
                    imgWrap.style.transform = 'translateY(0)';
                    imgWrap.style.borderColor = '#eee';
                    imgElement.style.transform = 'scale(1)';
                    imgElement.style.filter = 'blur(3px)';
                };

                imgWrap.addEventListener('click', () => {
                    modal.style.display = 'block';
                    modalImg.src = imgSrc;
                });

                imgWrap.appendChild(imgElement);
                grid.appendChild(imgWrap);
            });

            contentWrap.appendChild(grid);
            accordionItem.appendChild(header);
            accordionItem.appendChild(contentWrap);

            header.addEventListener('click', () => {
                const icon = header.querySelector('.accordion-icon');
                const isOpen = contentWrap.style.maxHeight !== '0px' && contentWrap.style.maxHeight !== '';

                document.querySelectorAll('.accordion-content').forEach(c => c.style.maxHeight = '0px');
                document.querySelectorAll('.accordion-icon').forEach(i => {
                    i.classList.remove('fa-minus');
                    i.classList.add('fa-plus');
                    i.style.transform = 'rotate(0deg)';
                });

                if (!isOpen) {
                    contentWrap.style.maxHeight = contentWrap.scrollHeight + 'px';
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                    icon.style.transform = 'rotate(180deg)';
                }
            });

            accordionContainer.appendChild(accordionItem);
        });
    };

    // Initial render
    window.renderAccreditation();

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Back to Top Button Logic
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Floating Action Buttons Logic (AI & Support)
    const floatingButtonsHTML = `
        <!-- Smart Assistant Toggle -->
        <div class="ai-bot-toggle" id="ai-bot-toggle">
            <i class="fas fa-robot"></i>
        </div>

        <!-- Technical Support Button -->
        <a href="tickets.html" class="floating-ticket-btn">
            <i class="fas fa-headset"></i>
            <span class="floating-tooltip" data-i18n="support_btn">${getT('support_btn')}</span>
        </a>

        <!-- AI Chat Window -->
        <div class="ai-chat-window" id="ai-chat-window">
            <div class="ai-chat-header">
                <h3 data-i18n="ai_assistant_title"><i class="fas fa-magic"></i> ${getT('ai_assistant_title')}</h3>
                <i class="fas fa-times ai-chat-close" id="ai-chat-close"></i>
            </div>
            <div class="ai-chat-body">
                <div class="ai-msg" data-i18n="ai_welcome_msg">
                    ${getT('ai_welcome_msg')}
                </div>
                <div class="ai-quick-replies">
                    <button class="quick-reply-btn" onclick="aiReply('specializations')" data-i18n="q_specializations">${getT('q_specializations')}</button>
                    <button class="quick-reply-btn" onclick="aiReply('registration')" data-i18n="q_registration">${getT('q_registration')}</button>
                    <button class="quick-reply-btn" onclick="aiReply('accreditation')" data-i18n="q_accreditation">${getT('q_accreditation')}</button>
                    <a href="https://wa.me/message/KRol8QEQDD19LUhJ6BSoKi" target="_blank" class="ai-whatsapp-link">
                        <i class="fab fa-whatsapp"></i> <span data-i18n="talk_to_admin">${getT('talk_to_admin')}</span>
                    </a>
                </div>
                <div id="ai-dynamic-reply" style="margin-top: 15px;"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', floatingButtonsHTML);

    const botToggle = document.getElementById('ai-bot-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatClose = document.getElementById('ai-chat-close');

    botToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    window.aiReply = function (type) {
        const replyDiv = document.getElementById('ai-dynamic-reply');
        let text = '';

        const replies = {
            specializations: {
                ar: "تخصصاتنا تشمل: فقه الطب الشمولي، مدرسة الإدراك، الصحة النفسية الشمولية، الإسعافات الطبية المتقدمة، وعلوم الأعشاب والزيوت.",
                en: "Our specializations include: Holistic Medicine Jurisprudence, School of Perception, Holistic Mental Health, Advanced Medical First Aid, and Herbal & Oil Sciences."
            },
            registration: {
                ar: "يمكنك التسجيل عبر الضغط على زر 'سجل الآن' في القائمة الرئيسية أو عبر التواصل مباشرة مع قسم القبول والتسجيل.",
                en: "You can register by clicking the 'Register Now' button in the main menu or by contacting the Admissions and Registration Department directly."
            },
            accreditation: {
                ar: "شهاداتنا موثقة ومعتمدة أكاديمياً وفق نظام الساعات المعتمد، وتصدر بالتعاون مع كبرى المؤسسات التدريبية في مجال الطب التكميلي.",
                en: "Our certificates are documented and academically accredited according to the credit hour system, issued in cooperation with major training institutions in the field of complementary medicine."
            }
        };

        const lang = localStorage.getItem('selectedLanguage') || 'ar';
        text = replies[type][lang] || replies[type]['ar'];

        replyDiv.innerHTML = `<div class="ai-msg">${text}</div>`;
        replyDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // --- Interactive Map Logic ---
    const mapContainer = document.getElementById('interactive-map');
    if (mapContainer) {
        const map = L.map('interactive-map', {
            center: [25, 30],
            zoom: 3,
            minZoom: 3,
            maxZoom: 3,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            boxZoom: false,
            zoomControl: false
        });

        // Use standard clear tiles (Light style)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        function createCustomIcon(colorClass) {
            const isStar = colorClass === 'gold';
            return L.divIcon({
                className: 'custom-pin',
                html: `<div class="pin-inner ${isStar ? 'admin-star' : ''}" style="color: ${colorClass === 'gold' ? '#d4af37' : '#2ecc71'}"></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
        }

        const adminLocations = [
            { key: 'yemen', coords: [15.5527, 48.5164] },
            { key: 'algeria', coords: [28.0339, 1.6596] },
            { key: 'syria', coords: [34.8021, 38.9968] },
            { key: 'iraq', coords: [33.2232, 43.6793] }
        ];

        const studentLocations = [
            { key: 'saudi_arabia', coords: [23.8859, 45.0792] },
            { key: 'egypt', coords: [26.8206, 30.8025] },
            { key: 'morocco', coords: [31.7917, -7.0926] },
            { key: 'tunisia', coords: [33.8869, 9.5375] },
            { key: 'jordan', coords: [30.5852, 36.2384] },
            { key: 'uae', coords: [23.4241, 53.8478] },
            { key: 'qatar', coords: [25.3548, 51.1839] },
            { key: 'turkey', coords: [38.9637, 35.2433] },
            { key: 'malaysia', coords: [4.2105, 101.9758] },
            { key: 'france', coords: [46.2276, 2.2137] },
            { key: 'germany', coords: [51.1657, 10.4515] },
            { key: 'britain', coords: [55.3781, -3.4360] },
            { key: 'america', coords: [37.0902, -95.7129] },
            { key: 'canada', coords: [56.1304, -106.3468] },
            { key: 'australia', coords: [-25.2744, 133.7751] }
        ];

        adminLocations.forEach(loc => {
            const locName = window.getT(loc.key);
            const adminHint = window.getT('map_admin_hint');
            const popupText = `<div style="text-align: center;">
                <strong style="color: var(--gold-dark); font-size: 1.1rem;">${locName}</strong><br>
                <p style="margin-top: 5px;">${adminHint}</p>
            </div>`;
            L.marker(loc.coords, { icon: createCustomIcon('gold') }).addTo(map).bindPopup(popupText);
        });

        studentLocations.forEach(loc => {
            const locName = window.getT(loc.key);
            const studentHint = window.getT('map_student_hint');
            L.marker(loc.coords, { icon: createCustomIcon('green') }).addTo(map)
                .bindPopup(`<strong style="color: #2ecc71;">${locName}</strong><br>${studentHint}`);
        });

        window.addEventListener('resize', () => map.invalidateSize());
    }
});
