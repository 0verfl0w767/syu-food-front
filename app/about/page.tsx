import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '서비스 소개',
  description: '삼육대학교 후문 근처 맛집과 카페를 쉽게 찾도록 돕는 후문한끼 서비스입니다.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: '서비스 소개 | 후문한끼',
    description: '삼육대 후문 맛집·카페 큐레이션 서비스, 후문한끼를 소개합니다.',
    url: '/about',
  },
}

export default function AboutPage() {
  return (
    <main className="aboutContainer">
      <div className="aboutCard">
        <header className="aboutHeader">
          <div className="aboutMarkWrap">
            <Image
              src="/favicon.svg"
              alt="후문한끼"
              className="aboutMarkImg"
              width={88}
              height={88}
            />
          </div>
          <h1 className="aboutTitle">후문한끼</h1>
          <p className="aboutSub">삼육대학교 후문 400m 맛집·카페 큐레이션</p>
        </header>

        <section className="aboutSection">
          <h2>서비스 소개</h2>
          <p>
            &lsquo;후문한끼&rsquo;는 공강 시간이나 점심시간에 &ldquo;오늘 후문에서 뭐 먹지?&rdquo;를
            고민하는 삼육대학교 학우들을 위해 제작된 로컬 푸드 큐레이션 서비스입니다.
          </p>
          <p>
            삼육대 후문 기준 <strong>400m</strong> 이내에 위치한 실제 식당과 카페의 최신 정보,
            메뉴판, 방문자 리뷰를 한눈에 둘러보고 검색할 수 있습니다.
          </p>
        </section>

        <section className="aboutSection">
          <h2>주요 기능</h2>
          <div className="aboutFeatureList">
            <div className="aboutFeatureItem">
              <span className="aboutFeatureIcon">🚶‍♂️</span>
              <div>
                <strong>후문 400m 도보권 큐레이션</strong>
                <p>
                  후문 기준 실제 도보 이동 거리를 바로 확인하고 가까운 곳부터 탐색할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="aboutFeatureItem">
              <span className="aboutFeatureIcon">🍜</span>
              <div>
                <strong>상세 메뉴판 & 메뉴 검색</strong>
                <p>
                  가게별 전체 메뉴와 가격을 카테고리별로 모아보고, 먹고 싶은 음식명으로 바로 검색할
                  수 있습니다.
                </p>
              </div>
            </div>

            <div className="aboutFeatureItem">
              <span className="aboutFeatureIcon">🎲</span>
              <div>
                <strong>랜덤 메뉴 뽑기</strong>
                <p>
                  결정이 어려울 때 한식, 중식, 양식, 일식 등 원하는 카테고리에서 메뉴를 랜덤으로
                  추천받을 수 있습니다.
                </p>
              </div>
            </div>

            <div className="aboutFeatureItem">
              <span className="aboutFeatureIcon">♥</span>
              <div>
                <strong>하루 3곳 맛집 응원</strong>
                <p>
                  내가 좋아하는 맛집에 매일 하트를 눌러 학우들과 함께 추천 순위를 만들어갈 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="aboutSection">
          <h2>데이터 출처 및 문의</h2>
          <p className="aboutMetaInfo">
            정보 제공: 네이버 플레이스
            <br />
            실제 메뉴 및 가격은 매장 사정에 따라 변동될 수 있습니다.
          </p>
          <p className="aboutContact">
            오류 제보 및 제휴 문의: <a href="mailto:support_team@syu.kr">support_team@syu.kr</a>
          </p>
        </section>

        <footer className="aboutFooter">
          <Link href="/" className="aboutBackLink">
            ← 메인 화면으로 돌아가기
          </Link>
          <p className="aboutCopyright">© 2026 SYU KR. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
