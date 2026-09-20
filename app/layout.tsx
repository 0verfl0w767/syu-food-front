import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import type { ReactNode } from 'react'

import '../styles/base.css'
import '../styles/places.css'
import '../styles/menu-dialog.css'
import '../styles/menus.css'
import '../styles/random-dialog.css'
import '../styles/about.css'
import '../styles/responsive.css'

const siteUrl = 'https://food.syu.kr'
const title = '후문한끼 | 삼육대학교 후문 맛집·카페 추천'
const description =
  '삼육대학교 후문 400m 이내 맛집과 카페를 메뉴로 검색하세요. 사진, 거리, 방문자 후기와 전체 메뉴·가격을 한눈에 보여드려요.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s | 후문한끼',
  },
  description,
  applicationName: '후문한끼',
  alternates: { canonical: '/' },
  formatDetection: { telephone: false },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '후문한끼',
    title,
    description: '오늘 뭐 먹지? 당기는 메뉴를 검색하고 삼육대 후문 근처의 가게를 찾아보세요.',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '밥그릇과 위치 핀으로 표현한 후문한끼 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '후문한끼 | 삼육대 후문 맛집 추천',
    description: '삼육대 후문 근처 맛집과 카페를 사진·거리·후기와 함께 탐색해보세요.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#c9fa64',
  colorScheme: 'light',
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: '후문한끼',
      alternateName: '한끼',
      description: '삼육대학교 후문 근처 음식점과 카페를 가까운 순으로 보여주는 맛집 큐레이션',
      image: `${siteUrl}/icon-512.png`,
      inLanguage: 'ko-KR',
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#app`,
      url: `${siteUrl}/`,
      name: '후문한끼',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      image: `${siteUrl}/icon-512.png`,
      inLanguage: 'ko-KR',
      areaServed: {
        '@type': 'Place',
        name: '삼육대학교 후문 400m 이내',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 37.6438462,
          longitude: 127.1092622,
        },
      },
    },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CJLF7EXNPZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CJLF7EXNPZ');
          `}
        </Script>
      </body>
    </html>
  )
}
