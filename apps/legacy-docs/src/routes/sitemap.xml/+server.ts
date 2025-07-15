export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- 루트 경로 -->
  <url>
    <loc>https://ssgoi.dev/</loc>
    <priority>1.0</priority>
  </url>

  <!-- 문서 페이지 -->
  <url>
    <loc>https://ssgoi.dev/docs</loc>
    <priority>0.8</priority>
  </url>

  <!-- 문서 페이지 목록 -->
  <url>
    <loc>https://ssgoi.dev/docs/troubleshooting-guide</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/configuring-transition</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/basic-usage</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/introduction</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/build-in-transition</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/performance-optimization</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/installing</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/contributing-to-ssgoi</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/implementing-hero</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/custom-transition</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/docs/api-reference</loc>
    <priority>0.7</priority>
  </url>

  <!-- 데모 페이지 -->
  <url>
    <loc>https://ssgoi.dev/demo</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/demo/blog</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/demo/post</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/demo/image</loc>
    <priority>0.7</priority>
  </url>
  <!-- 예시로 몇 가지 색상 페이지 추가 -->
  <url>
    <loc>https://ssgoi.dev/demo/image/ff0000</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/demo/image/00ff00</loc>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://ssgoi.dev/demo/pinterest</loc>
    <priority>0.7</priority>
  </url>
  <!-- 예시로 몇 가지 색상 페이지 추가 -->
  <url>
    <loc>https://ssgoi.dev/demo/pinterest/tomato</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ssgoi.dev/demo/pinterest/dodgerblue</loc>
    <priority>0.6</priority>
  </url>

</urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}
