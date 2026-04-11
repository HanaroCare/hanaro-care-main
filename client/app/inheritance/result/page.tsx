'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import styles from './page.module.css';

export default function InheritanceResultPage() {
  const router = useRouter();

  useEffect(() => {
    // 페이지 진입 시 완료 상태 저장
    localStorage.setItem('inheritance_completed', 'true');
  }, []);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('상속 설계를 처음부터 다시 시작하시겠습니까?')) {
      localStorage.removeItem('inheritance_completed');
      router.push('/inheritance/plan');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.scrollArea}>
        {/* Header Tabs */}
        <header className={styles.header}>
          <Link href="/inheritance/plan" className={styles.tab}>
            자산
          </Link>
          <Link href="/inheritance/result" className={`${styles.tab} ${styles.activeTab}`}>
            상속
          </Link>
        </header>

        <main className={styles.content}>
          <h1 className={styles.title}>상속설계 결과</h1>
          {/* ... (중략: 카드 및 차트 내용) */}
          <section className={styles.chartSection}>
            <div className={styles.chartWrapper}>
              <Image 
                src="/images/inheritance/chart.svg" 
                alt="상속 비율 차트" 
                width={150} 
                height={150} 
                className={styles.chartImage}
              />
              <span className={styles.chartLabel}>상속비율</span>
            </div>

            <div className={styles.legendGrid}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#015E5F' }} />
                <span>배우자 ( 30% )</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#1EB1B2' }} />
                <span>자녀1 ( 30% )</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#8DC8C8' }} />
                <span>자녀2 ( 30% )</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#BDAE7F' }} />
                <span>자녀3 ( 30% )</span>
              </div>
            </div>
          </section>

          {/* Member Details */}
          <div className={styles.memberList}>
            {/* Spouse Card */}
            <div className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <div className={styles.memberInfo}>
                  <div className={styles.avatar}>
                    <Image src="/images/inheritance/home-icon.svg" alt="배우자" width={16} height={16} />
                  </div>
                  <span className={styles.memberName}>배우자</span>
                </div>
                <div className={`${styles.statusBadge} ${styles.statusPositive}`}>
                  유류분보다 +7,000만원
                </div>
              </div>
              <div className={styles.memberDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>내가 정한 금액</span>
                  <span className={styles.highlightValue}>3.35억원</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>법정상속분</span>
                  <span className={styles.detailValue}>6.0억원</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>유류분</span>
                  <span className={styles.detailValue}>3.0억원</span>
                </div>
              </div>
              <Link href="#" className={styles.letterLink}>상속편지 남기기 &gt;</Link>
            </div>

            {/* Child 1 Card */}
            <div className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <div className={styles.memberInfo}>
                  <div className={styles.avatar}>
                    <Image src="/images/inheritance/home-icon.svg" alt="자녀1" width={16} height={16} />
                  </div>
                  <span className={styles.memberName}>자녀1</span>
                </div>
                <div className={`${styles.statusBadge} ${styles.statusPositive}`}>
                  유류분보다 +7,000만원
                </div>
              </div>
              <div className={styles.memberDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>내가 정한 금액</span>
                  <span className={styles.highlightValue}>3.35억원</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>법정상속분</span>
                  <span className={styles.detailValue}>6.0억원</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>유류분</span>
                  <span className={styles.detailValue}>3.0억원</span>
                </div>
              </div>
              <Link href="#" className={styles.letterLink}>상속편지 남기기 &gt;</Link>
            </div>

            {/* Child 2 Card */}
            <div className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <div className={styles.memberInfo}>
                  <div className={styles.avatar}>
                    <Image src="/images/inheritance/home-icon.svg" alt="자녀2" width={16} height={16} />
                  </div>
                  <span className={styles.memberName}>자녀2</span>
                </div>
                <div className={`${styles.statusBadge} ${styles.statusNegative}`}>
                  유류분보다 -500만원
                </div>
              </div>
              <div className={styles.memberDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>내가 정한 금액</span>
                  <span className={styles.highlightValue}>3.35억원</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>법정상속분</span>
                  <span className={styles.detailValue}>6.0억원</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>유류분</span>
                  <span className={styles.detailValue}>3.0억원</span>
                </div>
              </div>
              <Link href="#" className={styles.letterLink}>상속편지 남기기 &gt;</Link>
            </div>
          </div>

          <Link href="/inheritance/plan" className={styles.actionButton} onClick={handleReset}>
            상속 설계 다시하기
          </Link>
        </main>
      </div>

      {/* Bottom Navigation: scrollArea 외부에 위치하여 원천적으로 고정 */}
      <div className={styles.navWrapper}>
        <BottomNav activePath="/inheritance" />
      </div>
    </div>
  );
}
