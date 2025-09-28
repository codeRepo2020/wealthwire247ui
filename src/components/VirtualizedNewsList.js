import React, { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

const NewsItem = memo(({ index, style, data }) => {
  const { articles, NewsCard } = data;
  const article = articles[index];

  return (
    <div style={style}>
      <div style={{ padding: '1rem' }}>
        <NewsCard article={article} />
      </div>
    </div>
  );
});

NewsItem.displayName = 'NewsItem';

const VirtualizedNewsList = memo(({ articles, NewsCard, height = 600 }) => {
  const itemData = useMemo(() => ({
    articles,
    NewsCard
  }), [articles, NewsCard]);

  if (articles.length === 0) return null;

  return (
    <List
      height={height}
      itemCount={articles.length}
      itemSize={400}
      itemData={itemData}
      overscanCount={2}
    >
      {NewsItem}
    </List>
  );
});

VirtualizedNewsList.displayName = 'VirtualizedNewsList';

export default VirtualizedNewsList;