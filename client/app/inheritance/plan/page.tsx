'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function InheritancePlanPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/inheritance/intro" className={styles.headerBtn} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className={styles.headerTitle}>상속 설계</span>
        <button className={styles.headerBtn} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <main className={styles.content}>
        <p className={styles.customerName}>권하나 손님의 상속설계를 도와드릴게요</p>
        <h1 className={styles.pageTitle}>상속할 자산을 확인해주세요</h1>

        {/* Financial assets card */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>연동 총 자산</p>
          <p className={styles.cardTitle}>13.4억원</p>

          <div className={styles.divider} />

          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.itemName}>예·적금</span>
              <span className={styles.itemValue}>2,800만원</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>주식·펀드</span>
              <span className={styles.itemValue}>7,200만원</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>연금</span>
              <span className={styles.itemValue}>2,300만원</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>보통예금</span>
              <span className={styles.itemValue}>1,680만원</span>
            </li>
          </ul>
        </div>

        {/* Real estate card */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>부동산</p>
          <div className={styles.listItem}>
            <span className={styles.itemName}>아파트 (서울 강남구)</span>
            <span className={styles.highlightValue}>12.0억원</span>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <Link href="/inheritance/plan/1" className={styles.nextBtn}>
          다음으로
        </Link>
      </footer>
    </div>
  );
}
