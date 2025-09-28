export const getOptimizedImageUrl = (url, width = 400, quality = 80) => {
  if (!url) return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80';
  
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&q=${quality}&auto=format&fit=crop`;
  }
  
  return url;
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};