class ApifyInstagramFetcher {
    constructor(token) {
        this.token = token;
        this.baseUrl = 'https://api.apify.com/v2';
    }

    async fetchUserPosts(username, maxPosts = 24) {
        try {
            const runInput = {
                usernames: [username],
                resultsLimit: maxPosts,
                addParentData: false
            };

            // Start the actor run
            const runResponse = await fetch(`${this.baseUrl}/acts/apify~instagram-scraper/runs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ input: runInput })
            });

            const runData = await runResponse.json();
            const runId = runData.data.id;

            // Wait for completion
            await this.waitForRun(runId);

            // Get results
            const resultsResponse = await fetch(
                `${this.baseUrl}/acts/apify~instagram-scraper/runs/${runId}/dataset/items`,
                {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }
            );

            const results = await resultsResponse.json();
            return this.transformData(results);

        } catch (error) {
            throw new Error(`Apify fetch failed: ${error.message}`);
        }
    }

    async waitForRun(runId, maxWait = 60000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWait) {
            const response = await fetch(`${this.baseUrl}/acts/apify~instagram-scraper/runs/${runId}`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            const runInfo = await response.json();
            
            if (runInfo.data.status === 'SUCCEEDED') return;
            if (runInfo.data.status === 'FAILED') throw new Error('Run failed');
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        throw new Error('Run timeout');
    }

    transformData(rawData) {
        const posts = rawData
            .filter(item => item.type === 'post')
            .map(item => ({
                id: item.shortCode || item.id,
                imageUrl: item.displayUrl || item.url,
                caption: item.caption || '',
                timestamp: item.timestamp || new Date().toISOString(),
                likes: item.likesCount || 0,
                comments: item.commentsCount || 0,
                permalink: item.url || `https://instagram.com/p/${item.shortCode}/`
            }));

        return {
            posts,
            profile: {
                username: rawData[0]?.ownerUsername || 'ramcharala',
                postsCount: posts.length,
                followersCount: '12.4K',
                followingCount: '1.2K'
            }
        };
    }
}
