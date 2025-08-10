// UI Management for Instagram Netflix Feed
class UIManager {
    constructor() {
        this.currentSection = 'recent';
        this.isLoading = false;
        this.scrollPosition = 0;
        this.lastScrollTime = 0;
        this.data = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            header: document.getElementById('header'),
            feedContainer: document.getElementById('feed-container'),
            postsCount: document.getElementById('posts-count'),
            profileAvatar: document.getElementById('profile-avatar'),
            navButtons: document.querySelectorAll('.nav-btn'),
            refreshBtn: document.getElementById('refresh-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            scrollToTopBtn: document.getElementById('scroll-to-top'),
            modal: document.getElementById('post-modal'),
            modalClose: document.getElementById('modal-close'),
            modalBody: document.getElementById('modal-body')
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation buttons
        this.elements.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // Refresh button
        this.elements.refreshBtn.addEventListener('click', () => {
            this.refreshFeed();
        });

        // Settings button
        this.elements.settingsBtn.addEventListener('click', () => {
            this.showSettings();
        });

        // Scroll to top button
        this.elements.scrollToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Modal close
        this.elements.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Smooth horizontal scrolling for post containers
        this.setupHorizontalScroll();
    }

    // Setup horizontal scroll with mouse wheel
    setupHorizontalScroll() {
        document.addEventListener('wheel', (e) => {
            const containers = document.querySelectorAll('.posts-container');
            containers.forEach(container => {
                if (container.matches(':hover')) {
                    e.preventDefault();
                    container.scrollLeft += e.deltaY;
                }
            });
        });
    }

    // Handle scroll events
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Header background effect
        if (scrollY > 50) {
            this.elements.header.classList.add('scrolled');
        } else {
            this.elements.header.classList.remove('scrolled');
        }

        // Show/hide scroll to top button
        if (scrollY > CONFIG.UI.SCROLL_THRESHOLD) {
            this.elements.scrollToTopBtn.classList.add('visible');
        } else {
            this.elements.scrollToTopBtn.classList.remove('visible');
        }

        this.scrollPosition = scrollY;
    }

    // Switch between sections
    switchSection(section) {
        if (this.isLoading || this.currentSection === section) return;

        this.currentSection = section;
        
        // Update nav buttons
        this.elements.navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === section) {
                btn.classList.add('active');
            }
        });

        // Re-render feed with current data
        if (this.data) {
            this.renderFeed(this.data);
        }
    }

    // Show loading screen
    showLoadingScreen() {
        this.elements.loadingScreen.classList.remove('hidden');
        this.isLoading = true;
    }

    // Hide loading screen
    hideLoadingScreen() {
        this.elements.loadingScreen.classList.add('hidden');
        this.isLoading = false;
    }

    // Render the complete feed
    renderFeed(data) {
        this.data = data;
        
        // Update profile info
        this.updateProfileInfo(data.user);
        
        let feedHTML = '';
        
        switch (this.currentSection) {
            case 'recent':
                const recentPosts = instagramAPI.getRecentPosts(data.posts, CONFIG.UI.POSTS_PER_SECTION);
                feedHTML += this.createSection('Recent Posts', recentPosts);
                break;
                
            case 'popular':
                const popularPosts = instagramAPI.getPopularPosts(data.posts, CONFIG.UI.POSTS_PER_SECTION);
                feedHTML += this.createSection('Most Popular', popularPosts);
                break;
                
            case 'stories':
                // For stories, we'll show all posts grouped differently
                const allPosts = data.posts.slice(0, CONFIG.UI.POSTS_PER_SECTION);
                feedHTML += this.createSection('All Stories', allPosts);
                break;
        }

        this.elements.feedContainer.innerHTML = feedHTML;
        this.animateContent();
        this.setupPostCardListeners();
    }

    // Update profile information
    updateProfileInfo(user) {
        this.elements.postsCount.textContent = user.postsCount || 0;
        
        if (user.profilePicUrl && this.elements.profileAvatar) {
            this.elements.profileAvatar.src = user.profilePicUrl;
        }
    }

    // Create a section of posts
    createSection(title, posts) {
        if (!posts || posts.length === 0) {
            return this.createEmptyState();
        }

        const postsHTML = posts.map(post => this.createPostCard(post)).join('');
        
        return `
            <div class="feed-section slide-up">
                <h2 class="section-title">${title}</h2>
                <div class="posts-container">
                    ${postsHTML}
                </div>
            </div>
        `;
    }

    // Create a post card
    createPostCard(post) {
        const timeAgo = instagramAPI.formatTimestamp(post.timestamp);
        const likes = instagramAPI.formatNumber(post.likes);
        const comments = instagramAPI.formatNumber(post.comments);

        return `
            <div class="post-card fade-in" data-post-id="${post.id}" onclick="uiManager.openPostModal(${post.id})">
                <img class="post-image" 
                     src="${post.url}" 
                     alt="@${post.username}'s post"
                     onerror="this.parentElement.innerHTML='<div class=\\"image-error\\"><svg width=\\"48\\" height=\\"48\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"><rect x=\\"3\\" y=\\"3\\" width=\\"18\\" height=\\"18\\" rx=\\"2\\" ry=\\"2\\"></rect><circle cx=\\"8.5\\" cy=\\"8.5\\" r=\\"1.5\\"></circle><polyline points=\\"21,15 16,10 5,21\\"></polyline></svg><p>Image unavailable</p></div>' + this.innerHTML.substring(this.innerHTML.indexOf('<div class=\\"post-content\\">'))">
                <div class="post-content">
                    <div class="post-user">@${post.username}</div>
                    <div class="post-caption">${this.truncateText(post.caption, 100)}</div>
                    <div class="post-stats">
                        <span>❤️ ${likes}</span>
                        <span>💬 ${comments}</span>
                        <span>🕐 ${timeAgo}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Setup post card click listeners
    setupPostCardListeners() {
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.preloadImage(card);
            });
        });
    }

    // Preload image on hover
    preloadImage(card) {
        const img = card.querySelector('.post-image');
        if (img && img.src) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    }

    // Open post modal
    async openPostModal(postId) {
        try {
            const post = await instagramAPI.getPostById(postId);
            if (!post) return;

            const timeAgo = instagramAPI.formatTimestamp(post.timestamp);
            const likes = instagramAPI.formatNumber(post.likes);
            const comments = instagramAPI.formatNumber(post.comments);

            const modalContent = `
                <div class="modal-post">
                    <div class="modal-image-container">
                        <img src="${post.url}" alt="@${post.username}'s post" class="modal-image">
                    </div>
                    <div class="modal-details">
                        <div class="modal-header">
                            <div class="modal-user">
                                <img src="${this.data.user.profilePicUrl}" alt="@${post.username}" class="modal-avatar">
                                <div>
                                    <div class="modal-username">@${post.username}</div>
                                    ${post.location ? `<div class="modal-location">📍 ${post.location}</div>` : ''}
                                </div>
                            </div>
                            <div class="modal-time">${timeAgo}</div>
                        </div>
                        <div class="modal-caption">
                            ${post.caption}
                        </div>
                        <div class="modal-hashtags">
                            ${post.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
                        </div>
                        <div class="modal-stats">
                            <div class="modal-stat">
                                <span class="stat-icon">❤️</span>
                                <span class="stat-count">${likes} likes</span>
                            </div>
                            <div class="modal-stat">
                                <span class="stat-icon">💬</span>
                                <span class="stat-count">${comments} comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.elements.modalBody.innerHTML = modalContent;
            this.elements.modal.classList.add('active');
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('Error opening post modal:', error);
            this.showError('Unable to load post details');
        }
    }

    // Close modal
    closeModal() {
        this.elements.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Create empty state
    createEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                </div>
                <h3>No posts found</h3>
                <p>There are no posts to display in this section.</p>
                <button class="retry-btn" onclick="uiManager.refreshFeed()">
                    ${CONFIG.MESSAGES.RETRY}
                </button>
            </div>
        `;
    }

    // Show error message
    showError(message = CONFIG.MESSAGES.ERROR_GENERIC) {
        this.elements.feedContainer.innerHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                </div>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button class="retry-btn" onclick="uiManager.refreshFeed()">
                    ${CONFIG.MESSAGES.RETRY}
                </button>
            </div>
        `;
    }

    // Show loading state
    showLoadingState() {
        this.elements.feedContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>${CONFIG.MESSAGES.LOADING}</p>
            </div>
        `;
    }

    // Animate content entrance
    animateContent() {
        const elements = document.querySelectorAll('.fade-in, .slide-up');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Refresh feed
    async refreshFeed() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.elements.refreshBtn.style.animation = 'spin 1s linear infinite';
        
        try {
            // Clear cache to force fresh data
            instagramAPI.cache.clear();
            
            // Show loading state
            this.showLoadingState();
            
            // Fetch new data
            const data = await instagramAPI.fetchInstagramPosts();
            
            // Render the feed
            this.renderFeed(data);
            
        } catch (error) {
            console.error('Error refreshing feed:', error);
            this.showError(CONFIG.MESSAGES.ERROR_API);
        } finally {
            this.isLoading = false;
            this.elements.refreshBtn.style.animation = '';
        }
    }

    // Show settings modal
    showSettings() {
        const settingsContent = `
            <div class="settings-modal">
                <h3>Settings</h3>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" ${CONFIG.CACHE.ENABLED ? 'checked' : ''}> 
                        Enable caching
                    </label>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" ${CONFIG.FALLBACK_DATA.USE_FALLBACK ? 'checked' : ''}> 
                        Use demo data
                    </label>
                </div>
                <div class="setting-item">
                    <label>
                        Posts per section: 
                        <input type="number" value="${CONFIG.UI.POSTS_PER_SECTION}" min="4" max="20">
                    </label>
                </div>
                <div class="setting-actions">
                    <button onclick="uiManager.closeModal()">Close</button>
                </div>
            </div>
        `;

        this.elements.modalBody.innerHTML = settingsContent;
        this.elements.modal.classList.add('active');
    }

    // Scroll to top smoothly
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // ESC to close modal
        if (e.key === 'Escape' && this.elements.modal.classList.contains('active')) {
            this.closeModal();
        }

        // R to refresh
        if (e.key === 'r' && e.ctrlKey) {
            e.preventDefault();
            this.refreshFeed();
        }

        // Numbers 1-3 for sections
        if (e.key >= '1' && e.key <= '3') {
            const sections = ['recent', 'popular', 'stories'];
            const section = sections[parseInt(e.key) - 1];
            if (section) {
                this.switchSection(section);
            }
        }
    }

    // Truncate text with ellipsis
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Debounce function for performance
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Add loading skeleton for better UX
    showSkeletonLoading() {
        const skeletonHTML = Array.from({length: 6}, (_, i) => `
            <div class="post-card skeleton-dark">
                <div class="skeleton-image"></div>
                <div class="post-content">
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-stats">
                        <div class="skeleton-stat"></div>
                        <div class="skeleton-stat"></div>
                        <div class="skeleton-stat"></div>
                    </div>
                </div>
            </div>
        `).join('');

        this.elements.feedContainer.innerHTML = `
            <div class="feed-section">
                <h2 class="section-title">Loading Posts...</h2>
                <div class="posts-container">
                    ${skeletonHTML}
                </div>
            </div>
        `;
    }

    // Initialize UI manager
    async initialize() {
        try {
            this.showLoadingScreen();
            this.showSkeletonLoading();

            // Load initial data
            const data = await instagramAPI.fetchInstagramPosts();
            
            // Hide loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
                this.renderFeed(data);
            }, CONFIG.UI.LOADING_DELAY);

        } catch (error) {
            console.error('Error initializing UI:', error);
            this.hideLoadingScreen();
            this.showError(CONFIG.MESSAGES.ERROR_GENERIC);
        }
    }
}

// Create global UI manager instance
const uiManager = new UIManager();