// Configuration file for the Instagram Netflix Feed
const CONFIG = {
    // Apify Configuration
    APIFY: {
        TOKEN: 'YOUR_APIFY_TOKEN', // Replace with your actual Apify token
        ACTOR_ID: 'apify/instagram-scraper',
        BASE_URL: 'https://api.apify.com/v2',
    },
    
    // Instagram Configuration
    INSTAGRAM: {
        USERNAME: 'ramcharala',
        MAX_POSTS: 50,
        INCLUDE_STORIES: false,
        INCLUDE_HIGHLIGHTS: false,
    },
    
    // UI Configuration
    UI: {
        POSTS_PER_SECTION: 8,
        LOADING_DELAY: 1000,
        ANIMATION_DURATION: 300,
        SCROLL_THRESHOLD: 200,
        AUTO_REFRESH_INTERVAL: 300000, // 5 minutes
    },
    
    // Cache Configuration
    CACHE: {
        ENABLED: true,
        DURATION: 600000, // 10 minutes
        KEY_PREFIX: 'insta_feed_',
    },
    
    // Fallback Data (for demo/development)
    FALLBACK_DATA: {
        USE_FALLBACK: true, // Set to false when using real API
        POSTS: [
            {
                id: 1,
                username: "ramcharala",
                shortCode: "ABC123",
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
                caption: "Exploring new horizons and pushing boundaries. Every journey teaches us something new about ourselves and the world around us. #exploration #mindset",
                likes: 1245,
                comments: 89,
                timestamp: "2024-08-10T14:30:00Z",
                location: "Mountain Peak",
                hashtags: ["#exploration", "#mindset", "#adventure"]
            },
            {
                id: 2,
                username: "ramcharala",
                shortCode: "DEF456",
                url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
                caption: "Late night coding sessions fuel my passion for technology. Building something meaningful, one line at a time. The future is written in code. #tech #coding #innovation",
                likes: 2156,
                comments: 167,
                timestamp: "2024-08-10T11:15:00Z",
                location: "Home Office",
                hashtags: ["#tech", "#coding", "#innovation"]
            },
            {
                id: 3,
                username: "ramcharala",
                shortCode: "GHI789",
                url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
                caption: "Morning motivation: Your only limit is your mind. Starting the week with positive energy and clear goals. Let's make it count! #motivation #mondayvibes",
                likes: 892,
                comments: 67,
                timestamp: "2024-08-09T06:45:00Z",
                location: "Gym",
                hashtags: ["#motivation", "#mondayvibes", "#fitness"]
            },
            {
                id: 4,
                username: "ramcharala",
                shortCode: "JKL012",
                url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop",
                caption: "Creative process in action. Sometimes the best ideas come when we least expect them. Art meets technology in beautiful ways. #creativity #digital #art",
                likes: 1876,
                comments: 145,
                timestamp: "2024-08-08T19:20:00Z",
                location: "Creative Studio",
                hashtags: ["#creativity", "#digital", "#art"]
            },
            {
                id: 5,
                username: "ramcharala",
                shortCode: "MNO345",
                url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop",
                caption: "Finding inspiration in nature's complexity. The patterns we see in forests mirror the algorithms we write. Nature is the ultimate teacher. #nature #inspiration #algorithms",
                likes: 3421,
                comments: 234,
                timestamp: "2024-08-07T15:30:00Z",
                location: "Forest Trail",
                hashtags: ["#nature", "#inspiration", "#algorithms"]
            },
            {
                id: 6,
                username: "ramcharala",
                shortCode: "PQR678",
                url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=600&fit=crop",
                caption: "City lights, endless possibilities. Every building represents someone's dream made reality. Urban landscapes inspire innovation. #citylife #dreams #innovation",
                likes: 1654,
                comments: 98,
                timestamp: "2024-08-06T21:45:00Z",
                location: "Downtown",
                hashtags: ["#citylife", "#dreams", "#innovation"]
            },
            {
                id: 7,
                username: "ramcharala",
                shortCode: "STU901",
                url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=600&fit=crop",
                caption: "Fuel for productivity. Great ideas often start with great coffee and quiet moments of reflection. The perfect blend of caffeine and creativity. #coffee #productivity #ideas",
                likes: 1456,
                comments: 87,
                timestamp: "2024-08-05T08:15:00Z",
                location: "Coffee Shop",
                hashtags: ["#coffee", "#productivity", "#ideas"]
            },
            {
                id: 8,
                username: "ramcharala",
                shortCode: "VWX234",
                url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop",
                caption: "Ocean therapy complete. Sometimes we need to disconnect from screens to reconnect with ourselves. The waves carry away all worries. #ocean #mindfulness #peace",
                likes: 2789,
                comments: 187,
                timestamp: "2024-08-04T17:30:00Z",
                location: "Beach",
                hashtags: ["#ocean", "#mindfulness", "#peace"]
            },
            {
                id: 9,
                username: "ramcharala",
                shortCode: "YZA567",
                url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
                caption: "Music and code have more in common than you think. Both are languages that can move people and create something beautiful. #music #code #creativity",
                likes: 2341,
                comments: 156,
                timestamp: "2024-08-03T22:00:00Z",
                location: "Music Studio",
                hashtags: ["#music", "#code", "#creativity"]
            },
            {
                id: 10,
                username: "ramcharala",
                shortCode: "BCD890",
                url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
                caption: "Style is a way to say who you are without having to speak. Today's inspiration from minimal aesthetics and clean design. #style #minimalism #design",
                likes: 1987,
                comments: 134,
                timestamp: "2024-08-02T14:20:00Z",
                location: "Fashion District",
                hashtags: ["#style", "#minimalism", "#design"]
            },
            {
                id: 11,
                username: "ramcharala",
                shortCode: "EFG123",
                url: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=600&fit=crop",
                caption: "Adventure awaits those who dare to seek it. Conquered another summit, both literally and metaphorically. The view from the top is always worth it. #adventure #summit #achievement",
                likes: 3456,
                comments: 267,
                timestamp: "2024-08-01T12:45:00Z",
                location: "Mountain Summit",
                hashtags: ["#adventure", "#summit", "#achievement"]
            },
            {
                id: 12,
                username: "ramcharala",
                shortCode: "HIJ456",
                url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
                caption: "Cooking is chemistry you can eat. Experimenting with new recipes and flavors tonight. There's something magical about creating with your hands. #cooking #chemistry #creativity",
                likes: 1723,
                comments: 112,
                timestamp: "2024-07-31T18:30:00Z",
                location: "Home Kitchen",
                hashtags: ["#cooking", "#chemistry", "#creativity"]
            }
        ]
    },
    
    // Error Messages
    MESSAGES: {
        LOADING: "Loading premium experience...",
        ERROR_GENERIC: "Something went wrong. Please try again.",
        ERROR_NETWORK: "Network error. Please check your connection.",
        ERROR_API: "Unable to fetch posts. Please try again later.",
        EMPTY_FEED: "No posts found for this user.",
        RETRY: "Retry"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
    
