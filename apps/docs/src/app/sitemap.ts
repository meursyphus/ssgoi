import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ssgoi.dev'
  const languages = ['en', 'ko', 'ja', 'zh']
  
  // Define all documentation paths
  const docPaths = [
    'getting-started/introduction',
    'getting-started/quick-start',
    'core-concepts/element-transitions',
    'core-concepts/view-transitions',
  ]
  
  // Generate sitemap entries for all languages and paths
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Add homepage
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  })
  
  // Add language-specific homepages
  languages.forEach(lang => {
    sitemapEntries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
    
    // Add docs landing page for each language
    sitemapEntries.push({
      url: `${baseUrl}/${lang}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
    
    // Add all documentation pages for each language
    docPaths.forEach(path => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/docs/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })
  
  return sitemapEntries
}