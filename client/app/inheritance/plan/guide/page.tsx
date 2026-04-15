import { Lightbulb, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import styles from './page.module.css';

export default function InheritanceGuidePage() {
  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <Header title="상속 설계 가이드" showBackButton={true} />

        <div className="app-main no-scrollbar">
          <div className={styles.container}>
            <header className="mb-10">
              <h1 className={styles.pageTitle}>
                법적으로 안전한{'\n'}
                <span className="text-[var(--color-hana-ez-600)]">
                  상속 비율
                </span>
                을 확인하세요
              </h1>
              <p className={styles.description}>
                상속인들의 권리를 보호하기 위해{'\n'}
                법으로 정해진 최소한의 비율이 있어요.
              </p>
            </header>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}>
                  <Scale
                    size={18}
                    className="text-[var(--color-hana-ez-600)]"
                  />
                </div>
                <h2 className={styles.sectionTitle}>법정상속분</h2>
              </div>
              <div className={styles.infoBox}>
                <p className="mb-4 text-gray-600 text-sm leading-relaxed">
                  상속인들 사이에 협의가 되지 않을 때{'\n'}
                  법이 정한 상속 비율이에요.
                </p>
                <div className={styles.ratioCard}>
                  <div className={styles.ratioRow}>
                    <span className={styles.label}>배우자</span>
                    <span className={styles.value}>1.5</span>
                  </div>
                  <div className={styles.ratioRow}>
                    <span className={styles.label}>자녀</span>
                    <span className={styles.value}>1.0</span>
                  </div>
                  <p className="mt-3 text-[11px] text-gray-400">
                    * 배우자는 자녀보다 50%를 더 상속받게 됩니다.
                  </p>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.iconBox}>
                  <ShieldCheck
                    size={18}
                    className="text-[var(--color-hana-ez-600)]"
                  />
                </div>
                <h2 className={styles.sectionTitle}>유류분</h2>
              </div>
              <div className={styles.infoBox}>
                <p className="mb-4 text-gray-600 text-sm leading-relaxed">
                  상속인의 생계를 보호하기 위해{'\n'}
                  법으로 보장된 최소한의 상속 금액이에요.
                </p>
                <div className={styles.uBox}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-[var(--color-hana-black-900)] text-sm">
                      법정상속분의 1/2
                    </span>
                    <span className="rounded-full bg-[var(--color-hana-red-50)] px-3 py-1 font-bold text-[11px] text-[var(--color-hana-red-500)]">
                      최소 보장
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-snug">
                    상속인이 법정상속분의 절반도 받지 못하면,{'\n'}
                    다른 상속인에게 부족한 만큼 돌려받을 수 있어요.
                  </p>
                </div>
              </div>
            </section>

            <div className={styles.tipBox}>
              <div className="mb-1 flex items-center gap-1">
                <Lightbulb
                  size={14}
                  className="text-[var(--color-hana-ez-600)]"
                />
                <p className="font-bold text-[var(--color-hana-ez-600)] text-sm">
                  꼭 알아두세요!
                </p>
              </div>
              <p className="text-[12px] text-gray-500 leading-snug">
                내 마음대로 상속 비율을 정하더라도, 유류분을 침해하면 나중에
                가족 간 분쟁이 생길 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-gray-100 border-t bg-white p-6 pb-10">
          <Link href="/inheritance/plan/1">
            <PrimaryButton label="확인했습니다" />
          </Link>
        </footer>
      </div>
    </div>
  );
}
