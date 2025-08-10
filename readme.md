# Netflix-Style Instagram Feed for @ramcharala

A premium, Netflix-inspired Instagram feed viewer with smooth animations, responsive design, and real-time data integration using Apify.

## 🚀 Features

- **Netflix-style UI**: Dark theme with red accents and smooth hover effects
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Real Instagram Data**: Integration with Apify Instagram Scraper API
- **Smart Caching**: Optimized performance with intelligent data caching
- **Interactive Modals**: Click posts for detailed view with full captions
- **Smooth Animations**: Fade-in effects and sliding transitions
- **Auto-refresh**: Automatically updates feed every 5 minutes
- **Keyboard Shortcuts**: Navigate with keyboard for power users
- **Performance Optimized**: Lazy loading, image optimization, and memory management

## 📁 Project Structure

```
ramcharala-instagram-feed/
├── index.html              # Main HTML file
├── styles.css              # All CSS styling
├── js/
│   ├── config.js          # Configuration and settings
│   ├── api.js             # Apify API integration
│   ├── ui.js              # UI management and interactions
│   └── app.js             # Main application logic
├── README.md              # This file
└── .gitignore             # Git ignore file
```

## 🛠️ Setup Instructions

### 1. Get Your Apify Token

1. Sign up at [Apify.com](https://apify.com)
2. Go to your [API tokens page](https://console.apify.com/account/integrations)
3. Create a new token or copy your existing token

### 2. Configure the Application

Open `js/config.js` and replace `YOUR_APIFY_TOKEN_HERE` with your actual Apify token:

```javascript
APIFY: {
    TOKEN: 'apify_api_xxxxxxxxxxxxxxxxxxxxxxxx', // Your real token here
    ACTOR_ID: 'apify/instagram-scraper',
    BASE_URL: 'https://api.apify.com/v2',
},
```

### 3. Deploy to GitHub Pages

1. **Create a new repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Netflix-style Instagram feed"
   git branch -M main
   git remote add origin https://github.com/ramcharala/Ramcharala-feed.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Your site will be available at**:
   `https://ramcharala.github.io/Ramcharala-feed/`

### 4. Alternative Deployment Options

#### Netlify
1. Drag and drop the entire folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site will be instantly live with a custom URL

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

#### Traditional Web Hosting
Upload all files to your web hosting provider's public HTML directory.

## ⚙️ Configuration Options

### Basic Settings (js/config.js)

```javascript
// Instagram Configuration
INSTAGRAM: {
    USERNAME: 'ramcharala',        // Change to any Instagram username
    MAX_POSTS: 50,                 // Maximum posts to fetch
    INCLUDE_STORIES: false,        // Include stories (if available)
    INCLUDE_HIGHLIGHTS: false,     // Include highlights (if available)
},

// UI Configuration
UI: {
    POSTS_PER_SECTION: 8,         // Posts shown per section
    LOADING_DELAY: 1000,          // Loading screen duration
    ANIMATION_DURATION: 300,      // Animation speed
    SCROLL_THRESHOLD: 200,        // When to show scroll-to-top button
    AUTO_REFRESH_INTERVAL: 300000, // Auto-refresh every 5 minutes
},
```

### Cache Settings

```javascript
CACHE: {
    ENABLED: true,                 // Enable/disable caching
    DURATION: 600000,             // Cache duration (10 minutes)
    KEY_PREFIX: 'insta_feed_',    // Cache key prefix
},
```

### Fallback Data

For development or when API is unavailable:

```javascript
FALLBACK_DATA: {
    USE_FALLBACK: false,          // Set to true for demo mode
    // ... demo posts data
}
```

## 🎨 Customization

### Colors and Theme

Edit CSS custom properties in `styles.css`:

```css
:root {
    --netflix-red: #e50914;       /* Primary brand color */
    --netflix-dark: #141414;      /* Background color */
    --text-primary: #ffffff;      /* Primary text color */
    --text-secondary: #cccccc;    /* Secondary text color */
}
```

### Layout and Spacing

Adjust post card dimensions:

```css
.post-card {
    min-width: 320px;             /* Card width */
    height: 450px;                /* Card height */
}
```

### Animation Speed

Modify transition durations:

```css
:root {
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🔧 Development

### Running Locally

Since this is a static site, you can serve it with any local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server

# Live Server (VS Code extension)
# Right-click index.html → "Open with Live Server"
```

### Development Mode

The app includes development helpers accessible via browser console:

```javascript
// Available in console when running on localhost
devTools.refreshFeed()           // Manually refresh feed
devTools.clearCache()            // Clear all cached data
devTools.getHealthStatus()       // Get app health information
devTools.toggleFallbackData()    // Switch between real/demo data
devTools.simulateError()         // Test error handling
```

### Browser Support

- **Recommended**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Minimum**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## 🔍 Troubleshooting

### Images Not Loading

1. **Check CORS**: Some Instagram images may have CORS restrictions
2. **Verify API Response**: Ensure Apify is returning valid image URLs
3. **Network Issues**: Check browser dev tools for failed requests

### API Not Working

1. **Check Token**: Verify your Apify token is correct and has sufficient credits
2. **Rate Limits**: Apify has rate limits - wait and try again
3. **Fallback Mode**: Set `USE_FALLBACK: true` in config for demo data

### Performance Issues

1. **Reduce Posts**: Lower `MAX_POSTS` and `POSTS_PER_SECTION` in config
2. **Disable Cache**: Set `CACHE.ENABLED: false` if having storage issues
3. **Image Optimization**: Images are automatically optimized via Unsplash

### Mobile Issues

1. **Viewport**: Ensure proper viewport meta tag in HTML
2. **Touch Events**: All interactions work with touch
3. **Performance**: Consider reducing animation complexity on mobile

## 📱 Features by Device

### Desktop
- Hover effects on post cards
- Keyboard shortcuts (R=refresh, 1-3=sections, ESC=close)
- Mouse wheel horizontal scrolling
- Full modal experience

### Mobile & Tablet
- Touch-optimized interactions
- Swipe scrolling for post containers
- Responsive modal sizing
- Optimized touch targets

## 🚀 Performance Tips

1. **Image Loading**: Images are lazy-loaded and optimized
2. **Caching Strategy**: Intelligent caching reduces API calls
3. **Memory Management**: Automatic cleanup prevents memory leaks
4. **Network Optimization**: Requests are batched and optimized

## 📊 Analytics Integration

Ready for analytics integration. Add your tracking code:

```javascript
// In app.js, modify logPerformanceMetric function
logPerformanceMetric(name, value, extra = {}) {
    // Google Analytics
    gtag('event', name, { value, ...extra });
    
    // Mixpanel
    mixpanel.track(name, { value, ...extra });
}
```

## 🛡️ Security Considerations

- API tokens are client-side visible (use server proxy for production)
- No user authentication required
- All data is public Instagram content
- HTTPS recommended for production

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 