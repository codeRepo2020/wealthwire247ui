class NewsCache {
  constructor() {
    this.cache = new Map();
    this.intervals = new Map();
    this.CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  }

  getCacheKey(region, category = 'all') {
    return `${region}-${category}`;
  }

  isExpired(timestamp) {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  get(region, category = 'all') {
    const key = this.getCacheKey(region, category);
    const cached = this.cache.get(key);
    
    if (cached && !this.isExpired(cached.timestamp)) {
      console.log(`📦 Using cached data for ${key}`);
      return cached.data;
    }
    
    return null;
  }

  set(region, data, category = 'all') {
    const key = this.getCacheKey(region, category);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`💾 Cached data for ${key}`);
  }

  scheduleRefresh(region, fetchFunction, category = 'all') {
    const key = this.getCacheKey(region, category);
    
    // Clear existing interval
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key));
    }

    // Set new interval
    const intervalId = setInterval(async () => {
      try {
        console.log(`🔄 Scheduled refresh for ${key}`);
        const data = await fetchFunction();
        this.set(region, data, category);
      } catch (error) {
        console.error(`❌ Scheduled refresh failed for ${key}:`, error.message);
      }
    }, this.CACHE_DURATION);

    this.intervals.set(key, intervalId);
  }

  clear() {
    this.cache.clear();
    this.intervals.forEach(intervalId => clearInterval(intervalId));
    this.intervals.clear();
  }
}

export default new NewsCache();