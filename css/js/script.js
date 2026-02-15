// SahityaBitt - Functional Script

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Data Generation (Simulating a database) ---
    // We generate content dynamically to ensure high volume (30+) without massive HTML files.
    
    const generateContent = (type, count) => {
        const items = [];
        const adjectives = ["Silent", "Golden", "Misty", "Eternal", "Broken", "Whispering", "Ancient", "Velvet", "Dusty", "Sacred"];
        const nouns = ["Hills", "Rivers", "Shadows", "Echoes", "Dreams", "Lanterns", "Monsoons", "Temples", "Letters", "Souls"];
        
        for (let i = 1; i <= count; i++) {
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const title = `${adj} ${noun} ${i}`;
            
            // Randomly assign size classes for Masonry effect
            const sizeRandom = Math.random();
            let sizeClass = "small";
            if (sizeRandom > 0.7) sizeClass = "wide";
            if (sizeRandom > 0.85) sizeClass = "tall";

            // Generate Content based on type
            let bodyText = "";
            let excerpt = "";
            
            if (type === 'poetry') {
                excerpt = "In the heart of the valley, where the wind speaks...";
                bodyText = `
                    In the heart of the valley, where the wind speaks,
                    The ${noun.toLowerCase()} tremble with ancient secrets.
                    
                    I sat by the window, watching the rain,
                    Washing away the dust of yesterday's pain.
                    The color of the sky, a bruised purple hue,
                    Reminding me always, always of you.

                    The ${adj.toLowerCase()} light filters through the leaves,
                    Touching the ground where the spirit believes.
                    No sound but the breathing of the earth,
                    A cycle of dying, a cycle of birth.

                    (Stanza ${i})
                    Oh, how the time flies on wings of glass,
                    Watching the shadows as they pass.
                    
                    The end comes softly, like a lover's breath,
                    A gentle embrace, not of fear, but of depth.
                `;
            } else {
                excerpt = "It was a Tuesday when the letter arrived, smelling of old paper and saffron...";
                bodyText = `
                    It was a Tuesday when the letter arrived, smelling of old paper and saffron. The handwriting was unmistakable—sharp, slanted, urgent. I hadn't thought about the ${noun.toLowerCase()} in years.

                    We used to walk down the path behind the old temple, where the banyan tree roots choked the stone walls. "Nothing lasts," you used to say. "Not even the ${adj.toLowerCase()} silence."

                    I remember the market days in Kathmandu. The noise, the dust, the vibrant chaos. We were younger then, foolish enough to believe we could outrun our destinies. But destiny is like the monsoon rain; it finds every crack in the roof.

                    Returning now feels different. The village has changed. The ${noun.toLowerCase()} are still there, but they look smaller, less imposing. Or perhaps I have just grown too tired to fear them.

                    I opened the gate. The hinge squeaked—a familiar greeting. Inside, the house was exactly as I left it, preserved in dust and memory. I sat down and finally began to read.
                `;
            }

            items.push({
                id: i,
                title: title,
                excerpt: excerpt,
                fullText: bodyText,
                image: `https://picsum.photos/seed/${type}${i}/600/${sizeClass === 'tall' ? '800' : '400'}`, // Unique image per item
                size: sizeClass
            });
        }
        return items;
    };

    const poems = generateContent('poetry', 30);
    const stories = generateContent('story', 30);

    // --- DOM Elements ---
    const poetryGrid = document.getElementById('poetry-grid');
    const storiesGrid = document.getElementById('stories-grid');
    const featuredGrid = document.getElementById('featured-grid');
    const modal = document.getElementById('viewer-modal');
    const modalImage = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text-content');
    const closeBtn = document.querySelector('.close-btn');

    // --- Rendering Functions ---
    
    function createCard(item) {
        const card = document.createElement('div');
        card.className = `card ${item.size}`;
        card.setAttribute('data-full-text', item.fullText);
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="card-overlay">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-excerpt">${item.excerpt}</p>
            </div>
        `;

        // Click Event for Modal
        card.addEventListener('click', () => {
            openModal(item);
        });

        return card;
    }

    function renderGrid(container, items) {
        if (!container) return;
        container.innerHTML = '';
        items.forEach(item => {
            container.appendChild(createCard(item));
        });
        observeCards(); // Re-attach observer
    }

    // --- Render Logic based on Page ---
    if (poetryGrid) renderGrid(poetryGrid, poems);
    if (storiesGrid) renderGrid(storiesGrid, stories);
    
    if (featuredGrid) {
        // Mix of top 3 poems and top 3 stories for home page
        const featured = [...poems.slice(0, 3), ...stories.slice(0, 3)];
        renderGrid(featuredGrid, featured);
    }

    // --- Modal Logic ---
    function openModal(item) {
        modalImage.src = item.image;
        modalTitle.textContent = item.title;
        modalText.innerHTML = item.fullText.replace(/\n/g, '<br>'); // Preserve line breaks
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            modalImage.src = ''; // Clear image to prevent flicker next time
        }, 300);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on click outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- Animation on Scroll (Intersection Observer) ---
    function observeCards() {
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add delay based on index for staggered effect
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 50); // Small delay logic is simplified here
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });
    }
});
