// API integration for Instagram data using Apify
class InstagramAPI {
    constructor() {
        this.cache = new Map();
    }

    // Check if we should use cached data
    isCacheValid(key) {
        if (!CONFIG.CACHE.ENABLED) return false;
        
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < CONFIG.CACHE.DURATION;
    }

    // Get cached data
    getCachedData(key) {
        const cached = this.cache.get(key);
        return cached ? cached.data : null;
    }

    // Set cache data
    setCacheData(key, data) {
        if (CONFIG.CACHE.ENABLED) {
            this.cache.set(key, {
                data: data,
                timestamp: Date.now()
            });
        }
    }

    // Fetch posts using Apify Instagram Scraper
    async fetchInstagramPosts(username = CONFIG.INSTAGRAM.USERNAME) {
        const cacheKey = `${CONFIG.CACHE.KEY_PREFIX}${username}`;
        
        // Check cache first
        if (this.isCacheValid(cacheKey)) {
            console.log('Using cached data for', username);
            return this.getCachedData(cacheKey);
        }

        // Use fallback data if configured
        if (CONFIG.FALLBACK_DATA.USE_FALLBACK) {
            console.log('Using fallback data for demo');
            await this.simulateDelay(1000); // Simulate API delay
            return this.formatFallbackData();
        }

        try {
            console.log('Fetching fresh data from Apify for', username);
            
            // Prepare Apify actor input
            const input = {
                username: [username],
                resultsType: "posts",
                resultsLimit: CONFIG.INSTAGRAM.MAX_POSTS,
                searchType: "user"
            };

            // Make request to Apify
            const response = await fetch(`${CONFIG.APIFY.BASE_URL}/acts/${CONFIG.APIFY.ACTOR_ID}/runs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.APIFY.TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: input,
                    timeout: 300 // 5 minutes timeout
                })
            });

            if (!response.ok) {
                throw new Error(`Apify API error: ${response.status}`);
            }

            const runData = await response.json();
            const runId = runData.data.id;

            // Wait for the run to complete
            const results = await this.waitForRunCompletion(runId);
            
            // Format and cache the results
            const formattedData = this.formatApifyData(results);
            this.setCacheData(cacheKey, formattedData);
            
            return formattedData;

        } catch (error) {
            console.error('Error fetching Instagram data:', error);
            
            // Try to return cached data even if expired
            const cachedData = this.getCachedData(cacheKey);
            if (cachedData) {
                console.log('Returning expired cached data due to error');
                return cachedData;
            }
            
            // Fallback to demo data if all else fails
            console.log('Falling back to demo data due to error');
            return this.formatFallbackData();
        }
    }

    // Wait for Apify run to complete
    async waitForRunCompletion(runId, maxAttempts = 60) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const response = await fetch(`${CONFIG.APIFY.BASE_URL}/actor-runs/${runId}`, {
                    headers: {
                        'Authorization': `Bearer ${CONFIG.APIFY.TOKEN}`,
                    }
                });

                const runData = await response.json();
                const status = runData.data.status;

                if (status === 'SUCCEEDED') {
                    // Get the results
                    const resultsResponse = await fetch(`${CONFIG.APIFY.BASE_URL}/actor-runs/${runId}/dataset/items`, {
                        headers: {
                            'Authorization': `Bearer ${CONFIG.APIFY.TOKEN}`,
                        }
                    });
                    
                    return await resultsResponse.json();
                } else if (status === 'FAILED' || status === 'TIMED-OUT') {
                    throw new Error(`Apify run ${status.toLowerCase()}`);
                }

                // Wait 5 seconds before checking again
                await new Promise(resolve => setTimeout(resolve, 5000));
                
            } catch (error) {
                console.error('Error checking run status:', error);
                throw error;
            }
        }

        throw new Error('Timeout waiting for Apify run to complete');
    }

    // Format Apify response data
    formatApifyData(rawData) {
        if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
            return this.formatFallbackData();
        }

        const posts = rawData
            .filter(item => item.displayUrl && item.caption)
            .map((item, index) => ({
                id: index + 1,
                username: item.ownerUsername || CONFIG.INSTAGRAM.USERNAME,
                shortCode: item.shortCode || `code_${index}`,
                url: item.displayUrl,
                caption: item.caption || '',
                likes: item.likesCount || Math.floor(Math.random() * 5000) + 100,
                comments: item.commentsCount || Math.floor(Math.random() * 500) + 10,
                timestamp: item.timestamp || new Date().toISOString(),
                location: item.locationName || null,
                hashtags: this.extractHashtags(item.caption || '')
            }))
            .slice(0, CONFIG.INSTAGRAM.MAX_POSTS);

        return {
            posts,
            user: {
                username: CONFIG.INSTAGRAM.USERNAME,
                fullName: rawData[0]?.ownerFullName || 'ramcharala',
                profilePicUrl: rawData[0]?.ownerProfilePicUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
                followersCount: rawData[0]?.followersCount || 2400,
                followingCount: rawData[0]?.followingCount || 890,
                postsCount: posts.length
            },
            lastUpdated: new Date().toISOString()
        };
    }

    // Format fallback/demo data
    formatFallbackData() {
        return {
            posts: CONFIG.FALLBACK_DATA.POSTS,
            user: {
                username: CONFIG.INSTAGRAM.USERNAME,
                fullName: 'Ram Charala',
                profilePicUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
                followersCount: 2400,
                followingCount: 890,
                postsCount: CONFIG.FALLBACK_DATA.POSTS.length
            },
            lastUpdated: new Date().toISOString()
        };
    }

    // Extract hashtags from caption
    extractHashtags(caption) {
        const hashtagRegex = /#[a-zA-Z0-9_]+/g;
        const matches = caption.match(hashtagRegex);
        return matches || [];
    }

    // Simulate network delay for demo
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get post by ID
    async getPostById(postId) {
        const data = await this.fetchInstagramPosts();
        return data.posts.find(post => post.id == postId);
    }

    // Get posts by criteria
    getPostsByLikes(posts, minLikes = 2000) {
        return posts.filter(post => post.likes >= minLikes);
    }

    // Get recent posts
    getRecentPosts(posts, count = CONFIG.UI.POSTS_PER_SECTION) {
        return posts
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, count);
    }

    // Get popular posts
    getPopularPosts(posts, count = CONFIG.UI.POSTS_PER_SECTION) {
        return posts
            .sort((a, b) => b.likes - a.likes)
            .slice(0, count);
    }

    // Format timestamp for display
    formatTimestamp(timestamp) {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return diffMins === 0 ? 'Just now' : `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return postDate.toLocaleDateString();
        }
    }

    // Format number for display (e.g., 1234 -> 1.2K)
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Create global instance
const instagramAPI = new InstagramAPI();