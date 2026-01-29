        // Scroll Progress
        window.addEventListener('scroll', () => {
            const scrollProgress = document.getElementById('scrollProgress');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = scrollPercentage + '%';
        });

        // Animate on Scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-fade').forEach(el => {
            observer.observe(el);
        });

        // Countdown Timer
        function updateCountdown() {
            const now = new Date().getTime();
            const end = now + (12 * 60 * 60 * 1000);
            
            const timer = setInterval(() => {
                const current = new Date().getTime();
                const distance = end - current;
                
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
                
                if (distance < 0) {
                    clearInterval(timer);
                }
            }, 1000);
        }
        
        updateCountdown();

        // Smooth Scroll
        function scrollToPrice() {
            document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
        }

        function checkout() {
            alert('Redirecionando para o checkout seguro...\n\nEm produção, aqui seria o link da Hotmart.');
            // window.location.href = 'SEU_LINK_DA_HOTMART';
        }

        // Event Tracking
        console.log('Landing Page View');
        
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('CTA Click Event');
            });
        });