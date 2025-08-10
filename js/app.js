// Main Application Entry Point
class InstagramNetflixApp {
    constructor() {
        this.isInitialized = false;
        this.serviceWorker = null;
        
        this.init();
    }

    // Initialize the application
    async init() {
        try {
            console.log('🚀 Initializing Instagram Netflix Feed...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }

        } catch (error) {
            console.error('❌ Error initializing app:', error);
            this.handleInitializationError(error);
        }
    }

    // Start the application
    async start() {
        try {
            // Check browser compatibility
            this.checkBrowserCompatibility();
            
            // Initialize service worker for caching (optional)
            await this.initializeServiceWorker();
            
            // Initialize UI manager
            await uiManager.initialize();
            
            // Setup auto-refresh
            this.setupAutoRefresh();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ App initialized successfully!');
            
            // Log some stats
            this.logInitializationStats();

        } catch (error) {
            console.error('❌ Error starting app:', error);
            this.handleInitializationError(error);
        }
    }

    // Check browser compatibility
    checkBrowserCompatibility() {
        const features = {
            'Fetch API': 'fetch' in window,
            'Promise': 'Promise' in window,
            'Local Storage': 'localStorage' in window,
            'CSS Grid': CSS.supports('display', 'grid'),
            'CSS Custom Properties': CSS.supports('color', 'var(--test)'),
            'Intersection Observer': 'IntersectionObserver' in window
        };

        const unsupported = Object.entries(features)
            .filter(([name, supported]) => !supported)
            .map(([name]) => name);

        if (unsupported.length > 0) {
            console.warn('⚠️ Unsupported features:', unsupported);
            
            // Show fallback for very old browsers
            if (!features['Fetch API'] || !features['Promise']) {
                this.showBrowserCompatibilityWarning();
            }
        }
    }

    // Show browser compatibility warning
    showBrowserCompatibilityWarning() {
        const warningHTML = `
            <div class="browser-warning">
                <h2>Browser Not Supported</h2>
                <p>This application requires a modern browser. Please update your browser or try:</p>
                <ul>
                    <li>Chrome 60+</li>
                    <li>Firefox 55+</li>
                    <li>Safari 12+</li>
                    <li>Edge 79+</li>
                </ul>
            </div>
        `;
        document.body.innerHTML = warningHTML;
    }

    // Initialize service worker for caching
    async initializeServiceWorker() {
        if ('serviceWorker' in navigator && location.protocol === 'https:') {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registered:', registration.scope);
                this.serviceWorker = registration;
            } catch (error) {
                console.log('ℹ️ Service Worker registration failed:', error.message);
            }
        }
    }

    // Setup auto-refresh functionality
    setupAutoRefresh() {
        if (CONFIG.UI.AUTO_REFRESH_INTERVAL > 0) {
            setInterval(() => {
                if (!uiManager.isLoading && document.visibilityState === 'visible') {
                    console.log('🔄 Auto-refreshing feed...');
                    uiManager.refreshFeed();
                }
            }, CONFIG.UI.AUTO_REFRESH_INTERVAL);
        }
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor page load performance
        if ('performance' in window && 'getEntriesByType' in performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                    
                    console.log(`📊 Page load time: ${Math.round(loadTime)}ms`);
                    
                    // Log to analytics if available
                    this.logPerformanceMetric('page_load_time', loadTime);
                }, 0);
            });
        }

        // Monitor image loading performance
        this.monitorImageLoading();
        
        // Monitor memory usage (if available)
        this.monitorMemoryUsage();
    }

    // Monitor image loading performance
    monitorImageLoading() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.initiatorType === 'img') {
                    const loadTime = entry.responseEnd - entry.requestStart;
                    if (loadTime > 2000) { // Log slow images
                        console.warn(`🐌 Slow image load: ${entry.name} (${Math.round(loadTime)}ms)`);
                    }
                }
            });
        });

        try {
            observer.observe({ entryTypes: ['resource'] });
        } catch (error) {
            console.log('ℹ️ Resource timing not supported');
        }
    }

    // Monitor memory usage
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
                
                if (used > limit * 0.8) {
                    console.warn(`⚠️ High memory usage: ${used}MB / ${limit}MB`);
                }
            }, 60000); // Check every minute
        }
    }

    // Log performance metrics
    logPerformanceMetric(name, value, extra = {}) {
        // Here you could send to Google Analytics, Mixpanel, etc.
        console.log(`📈 Metric: ${name} = ${value}`, extra);
    }

    // Log initialization stats
    logInitializationStats() {
        const stats = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };

        console.log('📊 Initialization Stats:', stats);
        
        // Log to analytics
        this.logPerformanceMetric('app_initialized', 1, stats);
    }

    // Handle initialization errors
    handleInitializationError(error) {
        console.error('💥 App initialization failed:', error);
        
        // Show error UI
        const errorHTML = `
            <div class="app-error">
                <div class="error-content">
                    <h1>Something went wrong</h1>
                    <p>We're having trouble loading the Instagram feed.</p>
                    <button onclick="window.location.reload()" class="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
        
        // Log error for debugging
        this.logPerformanceMetric('app_initialization_error', 1, {
            error: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent
        });
    }

    // Cleanup on app destroy
    destroy() {
        if (this.serviceWorker) {
            this.serviceWorker.unregister();
        }
        
        // Clear any intervals or timeouts
        // Remove event listeners
        // Clear caches
        
        console.log('🧹 App destroyed and cleaned up');
    }

    // Get app health status
    getHealthStatus() {
        return {
            initialized: this.isInitialized,
            online: navigator.onLine,
            cacheEnabled: CONFIG.CACHE.ENABLED,
            usingFallbackData: CONFIG.FALLBACK_DATA.USE_FALLBACK,
            serviceWorkerActive: this.serviceWorker && this.serviceWorker.active,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : 'unavailable'
        };
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
    
    // Log to analytics if available
    if (window.app) {
        window.app.logPerformanceMetric('global_error', 1, {
            error: event.error.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    
    // Log to analytics if available
    if (window.app) {
        window.app.logPerformanceMetric('unhandled_promise_rejection', 1, {
            reason: event.reason.toString()
        });
    }
});

// Online/offline status monitoring
window.addEventListener('online', () => {
    console.log('🌐 App is now online');
    if (window.uiManager && !CONFIG.FALLBACK_DATA.USE_FALLBACK) {
        uiManager.refreshFeed();
    }
});

window.addEventListener('offline', () => {
    console.log('📴 App is now offline');
    // Could show offline indicator
});

// Visibility change handler (for auto-refresh)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.uiManager) {
        console.log('👁️ App became visible, checking for updates...');
        // Could refresh if data is stale
    }
});

// Initialize the app
const app = new InstagramNetflixApp();

// Make app globally accessible for debugging
window.app = app;
window.uiManager = uiManager;
window.instagramAPI = instagramAPI;
window.CONFIG = CONFIG;

// Development helpers
if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    window.devTools = {
        refreshFeed: () => uiManager.refreshFeed(),
        clearCache: () => instagramAPI.cache.clear(),
        getHealthStatus: () => app.getHealthStatus(),
        toggleFallbackData: () => {
            CONFIG.FALLBACK_DATA.USE_FALLBACK = !CONFIG.FALLBACK_DATA.USE_FALLBACK;
            console.log('Fallback data:', CONFIG.FALLBACK_DATA.USE_FALLBACK ? 'enabled' : 'disabled');
        },
        simulateError: () => {
            throw new Error('Simulated error for testing');
        }
    };
    
    console.log('🛠️ Development tools available: window.devTools');
}