-- ========================
-- 0. 초기화 및 설정
-- ========================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE TB_ASSET_TRANS;
TRUNCATE TABLE TB_USER_PROD;
TRUNCATE TABLE TB_USER_SIMPLE_AUTH;
TRUNCATE TABLE TB_USER_LOGIN_LOG;
TRUNCATE TABLE TB_FAMILY_AUTH;
TRUNCATE TABLE TB_CARD;
TRUNCATE TABLE TB_ASSET_SIMULATION;
TRUNCATE TABLE TB_TRUST_SIMULATION;
TRUNCATE TABLE TB_ACCOUNT;
TRUNCATE TABLE TB_INHERIT_LETTER;
TRUNCATE TABLE TB_INHERIT_DETAIL;
TRUNCATE TABLE TB_INHERIT_PLAN;
TRUNCATE TABLE TB_REAL_ASSET;
TRUNCATE TABLE TB_REFRESH_TOKEN;
TRUNCATE TABLE TB_PRODUCT;
TRUNCATE TABLE TB_USER;

SET FOREIGN_KEY_CHECKS = 1;
SET time_zone = 'Asia/Seoul';

-- ========================
-- 1. TB_USER (암호화 적용)
-- 비밀번호: test1234 (BCrypt)
-- ========================
INSERT INTO TB_USER (USER_ID, USER_NM, USER_PWD, USER_PHONE, USER_AGE, HANA_CERT_YN, USER_STAT_CD,
                     USER_ROLE)
VALUES (12345678, 'testUser', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
        '01012345678', 25, 1, 'ACTIVE', 'ROLE_ADMIN'),
       (1001, '유재석', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su', '01011112222',
        54, 1, 'ACTIVE', 'ROLE_USER'),
       (1002, '김하나', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su', '01022223333',
        50, 0, 'ACTIVE', 'ROLE_USER'),
       (1003, '김하윤', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su', '01033334444',
        23, 1, 'ACTIVE', 'ROLE_USER');
-- ========================
-- 2. TB_REFRESH_TOKEN (인증 토큰)
-- ========================
INSERT INTO TB_REFRESH_TOKEN (USER_ID, TOKEN_VAL, EXPIRY_DT)
VALUES (12345678, 'dummy-refresh-token-val-min', '2026-12-31 23:59:59'),
       (1001, 'dummy-refresh-token-val-hong', '2026-12-31 23:59:59');

-- ========================
-- 3. TB_PRODUCT (금융 상품 마스터)
-- ========================
INSERT INTO TB_PRODUCT (PRODUCT_ID, PROD_NM, PROD_DESC, PROD_CATE_CD)
VALUES (1, '하나 연금신탁', '안정적인 노후 연금 상품', 'PENSION'),
       (2, '하나 유언대용신탁', '상속 설계를 위한 신탁 상품', 'TRUST'),
       (3, '하나 주택연금', '내 집으로 받는 평생 월급', 'PENSION');

-- ========================
-- 4. TB_ACCOUNT (금융 계좌/자산)
-- ========================
INSERT INTO TB_ACCOUNT (ACCOUNT_ID, USER_ID, INST_NM, ACCOUNT_NM, ACCOUNT_NUM, BALANCE_AMT,
                        ASSET_CATE_CD, PROFIT_RATE, PAY_DAY, PAY_AMT, MONTHLY_PREM_AMT)
VALUES (2001, 1001, '하나은행', '하나 자유입출금', '111-222-333333', 50000000.00, 'CASH', NULL, NULL, NULL,
        NULL),
       (2002, 1001, '하나은행', '하나 정기예금', '111-222-444444', 30000000.00, 'CASH', 3.50, NULL, NULL,
        NULL),
       (2003, 1001, '하나증권', '삼성전자 외 3종목', '444-555-666666', 72000000.00, 'STOCK', 5.20, NULL, NULL,
        NULL),
       (2004, 1001, '국민연금공단', '국민연금 수령 예정', '777-888-999999', 30000000.00, 'PENSION', NULL, 25,
        1300000.00, NULL),
       (2005, 1001, '하나생명', '하나 건강보험', '111-222-555555', 42000000.00, 'INSURANCE', NULL, NULL, NULL,
        150000.00),
       (2006, 1001, '하나카드', '하나마나카드', '111-222-666666', 8000000.00, 'CARD', NULL, NULL, NULL, NULL),
       (2007, 1002, '국민은행', 'KB 자유입출금', '222-333-444444', 20000000.00, 'CASH', NULL, NULL, NULL,
        NULL);

-- ========================
-- 5. TB_CARD (카드 상세)
-- ========================
INSERT INTO TB_CARD (CARD_ID, ACCOUNT_ID, CARD_NM, LIMIT_AMT, AUTO_TRANS_AMT, USE_YN)
VALUES (1, 2006, '하나 시니어 행복카드', 2000000.00, 500000.00, 'Y');

-- ========================
-- 6. TB_REAL_ASSET (실물 자산)
-- ========================
INSERT INTO TB_REAL_ASSET (REAL_ASSET_ID, USER_ID, ASSET_NM, ASSET_CATE_CD, EVAL_AMT, ADDR,
                           ASSET_SIZE, ASSET_DESC)
VALUES (3001, 1001, '역삼동 아파트', 'REAL_ESTATE', 920000000.00, '서울 강남구 역삼동 123-45', 84.00, '홍길동 자택'),
       (3002, 1001, '그랜저 IG 2021', 'VEHICLE', 28500000.00, NULL, NULL, '2021년식 · 37,200km'),
       (3003, 1001, '금 · 37.5g', 'GOLD', 4380000.00, NULL, 37.50, 'KRX 금시장 기준');

-- ========================
-- 7. TB_ASSET_SIMULATION (자산 시뮬레이션)
-- ========================
INSERT INTO TB_ASSET_SIMULATION (USER_ID, TARGET_AGE, LIVING_COST, MEDICAL_COST, CARE_COST,
                                 MONTHLY_COST, AGE_RANGE_DETAILS)
VALUES (1001, 85, 1500000.00, 500000.00, 300000.00, 2300000.00, '{
  "70s": 200,
  "80s": 250
}');

-- ========================
-- 8. TB_TRUST_SIMULATION (신탁 시뮬레이션)
-- ========================
INSERT INTO TB_TRUST_SIMULATION (USER_ID, PRINCIPAL_AMOUNT, INVEST_TYPE, PAYOUT_TYPE, START_TYPE,
                                 START_DATE, PAYOUT_SETTINGS)
VALUES (1001, 100000000.00, 'LUMP_SUM', 'PENSION', 'NOW', '2026-04-14', '{
  "monthly": 150
}');

-- ========================
-- 9. TB_FAMILY_AUTH (가족 권한)
-- ========================
INSERT INTO TB_FAMILY_AUTH (USER_GRANTOR_ID, USER_GRANTEE_ID, RELATION_CD, AUTH_STATUS,
                            CARD_VIEW_YN, INS_VIEW_YN, CARD_ID)
VALUES (1001, 12345678, 1, 1, 'Y', 'Y', 1);

-- ========================
-- 10. TB_INHERIT_PLAN (상속 설계 메인)
-- ========================
INSERT INTO TB_INHERIT_PLAN (USER_ID, TOTAL_INHERIT_AMT, ESTI_TAX_AMT)
VALUES (1001, 1000000000.00, 45000000.00);

-- ========================
-- 11. TB_INHERIT_DETAIL (상속 대상 지분)
-- ========================
INSERT INTO TB_INHERIT_DETAIL (INHERIT_DETAIL_ID, INHERIT_PLAN_ID, USER_ID, RELATION_CD, DIST_RATIO)
VALUES (1, 1, 1002, 'CHILD', 0.5),
       (2, 1, 1003, 'SPOUSE', 0.5);

-- ========================
-- 12. TB_INHERIT_LETTER (상속 편지)
-- ========================
INSERT INTO TB_INHERIT_LETTER (INHERIT_DETAIL_ID, LETTER_CONT, VOICE_URL, LETTER_TYPE_CD)
VALUES (1, '아들아, 건강하게만 자라다오.', 'http://s3.aws.com/voice1.mp3', 'VOICE');

-- ========================
-- 13. TB_USER_PROD (가입 상품)
-- ========================
INSERT INTO TB_USER_PROD (USER_PROD_ID, USER_ID, PRODUCT_ID, PROD_STAT_CD, PROD_TYPE_CD,
                          PAYOUT_TYPE_CD, PRINCIPAL_AMOUNT, START_DATE)
VALUES (1, 1001, 1, 'IN_PROGRESS', 'TRUST', 'PENSION', 50000000.00, '2026-01-01');

-- ========================
-- 14. TB_ASSET_TRANS (자산 거래 내역)
-- ========================
INSERT INTO TB_ASSET_TRANS (USER_PRODUT_ID, TRANS_AMT, TRANS_STAT_CD, TRANS_TYPE_CD)
VALUES (1, 1500000.00, 'COMPLETED', 'PAYMENT');

-- ========================
-- 15. TB_USER_SIMPLE_AUTH (간편 인증)
-- ========================
INSERT INTO TB_USER_SIMPLE_AUTH (SIMPLE_AUTH_ID, USER_ID, AUTH_MEANS_CD, AUTH_VALUE)
VALUES (3, 12345678, 'SIMPLE_PASSWORD',
        '$2a$12$vobmM3uRVFkpxmZtUm0j7O6cvlJiuhS.501d3rsLFkCFMOaveg3Su');

-- ========================
-- 16. TB_USER_LOGIN_LOG (로그인 로그)
-- ========================
INSERT INTO TB_USER_LOGIN_LOG (USER_LOG_ID, USER_ID, USER_RESULT_YN, USER_MEANS_CD, ACCESS_IP_ADDR,
                               ACCESS_DEV_NM)
VALUES (4001, 1001, 1, 'SIMPLE_PASSWORD', '192.168.0.1', 'iPhone 15');
