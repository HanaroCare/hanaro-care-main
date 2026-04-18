SET FOREIGN_KEY_CHECKS = 0;

-- 2. 이제 안전하게 비웁니다.
TRUNCATE TABLE TB_USER_SIMPLE_AUTH;
TRUNCATE TABLE TB_ASSET_TRANS;
TRUNCATE TABLE TB_USER_PROD;
TRUNCATE TABLE TB_USER_LOGIN_LOG;
TRUNCATE TABLE TB_FAMILY_AUTH;
TRUNCATE TABLE TB_CARD;
TRUNCATE TABLE TB_CARD_USAGE;
TRUNCATE TABLE TB_ASSET_SIMULATION;
TRUNCATE TABLE TB_TRUST_SIMULATION;
TRUNCATE TABLE TB_PENSION_SIMULATION;
TRUNCATE TABLE TB_ACCOUNT;
TRUNCATE TABLE TB_INHERIT_LETTER;
TRUNCATE TABLE TB_INHERIT_DETAIL;
TRUNCATE TABLE TB_INHERIT_PLAN;
TRUNCATE TABLE TB_REAL_ASSET;
TRUNCATE TABLE TB_REFRESH_TOKEN;
TRUNCATE TABLE TB_PRODUCT;
TRUNCATE TABLE TB_USER;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================
-- TB_USER
-- 비밀번호: $2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su
-- ========================
INSERT INTO TB_USER (USER_ID, LOGIN_ID, USER_NM, USER_PWD, USER_PHONE, USER_AGE,
                     IS_HANA_CERT, USER_STAT_CD, AUTH_MEANS_CD, USER_ROLE, LAST_LOGIN_AT,
                     PWD_CHANGED_AT, USER_ADDR)
VALUES
    -- 1. 홍길동: 일반 비밀번호 유저
    (1001, 'hong123', '홍길동', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01011112222', 65, 0, 'ACTIVE', 'PASSWORD', 'ROLE_USER', NOW(), NOW(), '서울특별시 강남구 역삼동 123-45'),

    -- 2. 김철수: 간편 비밀번호 유저
    (1002, 'chulsoo7', '김철수', '$2a$12$sjg9Nyjde9D6CuiqmfOHpOHv5Ep7SLXt4bwnTl7.5uLSaUxs1rGM2',
     '01022223333', 40, 1, 'ACTIVE', 'SIMPLE_PASSWORD', 'ROLE_USER', NOW(), NOW(), NULL),

    -- 3. 이영희: 휴면 계정 예시 (7개월 전 활동)
    (1003, 'younghee9', '이영희', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01033334444', 63, 0, 'DORMANT', 'PASSWORD', 'ROLE_USER',
     '2025-09-17 00:00:00', '2025-09-17 00:00:00', NULL),
    -- 4. 박관리: 관리자 계정
    (1004, 'testUser', '박관리', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01055556666', 35, 0, 'ACTIVE', 'PASSWORD', 'ROLE_ADMIN', NOW(), NOW(), NULL),

    -- 5. 정순자: 시뮬레이션 테스트용 부모 유저
    (1005, 'jung8', '정순자', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01066667777', 68, 0, 'ACTIVE', 'PASSWORD', 'ROLE_USER', NOW(), NOW(), '서울특별시 마포구 공덕동 456-78'),

    -- 6. 정민준: 시뮬레이션 테스트용 자녀 유저
    (1006, 'minjun9', '정민준', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01077778888', 38, 0, 'ACTIVE', 'PASSWORD', 'ROLE_USER', NOW(), NOW(), NULL),

    -- 7. 하나테스터: 간편비밀번호(654321) 테스트 유저
    (1007, 'Tsid', '하나테스터', '$2a$12$BYTWmmP4M2n/t2Fb/L.QnOejBuoHqILdK1syQ1rk62sfWBKtam9Ji',
     '01012345678', 30, 1, 'ACTIVE', 'SIMPLE_PASSWORD', 'ROLE_USER', NOW(), NOW(), NULL),

    -- 8. 패턴Z테스터: 패턴(Z모양) 테스트 유저
    (1008, 'TsidZ', '패턴Z테스터', '$2a$12$1Sk8P7kehKkY933ANOAj1.AC52WVGH2/SB54gyil1Go.SMIm7IJKm',
     '01012345678', 30, 1, 'ACTIVE', 'PATTERN', 'ROLE_USER', NOW(), NOW(), NULL),

    -- 9. 패턴L테스터: 패턴(ㄴ모양) 테스트 유저
    (1009, 'TsidL', '패턴L테스터', '$2a$12$heAv.jDZ5PHLQ.fupN2e.uRIbjWd7o7PfYiTSkc5XFyDvXd7/jQ7q',
     '01012345678', 30, 1, 'ACTIVE', 'PATTERN', 'ROLE_USER', NOW(), NOW(), NULL),

    -- 10. 고하나: 비밀번호 변경 1년 경과 (시연 시 비밀번호 변경 팝업 노출용)
    (1010, 'oldUser', '고하나', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01099998888', 50, 0, 'ACTIVE', 'PASSWORD', 'ROLE_USER',
     NOW(), '2025-04-17 00:00:00', NULL);
-- ========================
-- TB_PRODUCT
-- ========================
INSERT INTO TB_PRODUCT (PRODUCT_ID, PROD_NM, PROD_DESC, PROD_CATE_CD)
VALUES (1, '하나 연금신탁', '안정적인 노후 연금 상품', 'PENSION'),
       (2, '하나 유언대용신탁', '상속 설계를 위한 신탁 상품', 'TRUST');

-- ========================
-- TB_ACCOUNT
-- ASSET_CATE_CD: CASH / STOCK / INSURANCE / CARD
--                PENSION          (주택연금 - 기존 호환)
--                PENSION_NATIONAL (국민연금)
--                PENSION_RETIRE   (퇴직연금 IRP/DC/DB)
--                PENSION_PERSONAL (개인연금 / 연금저축)
-- ========================
INSERT INTO TB_ACCOUNT (ACCOUNT_ID, USER_ID, INST_NM, ACCOUNT_NM, ACCOUNT_NUM, BALANCE_AMT,
                        ASSET_CATE_CD, PROFIT_RATE, PAY_DAY, PAY_AMT, MONTHLY_PREM_AMT, CONTR_DT,
                        EXPIRE_DT, LIMIT_AMT, IS_LINKED)
VALUES
    -- ── [1001 홍길동] 일반 금융 자산 ───────────────────────────────────────
    (2001, 1001, '하나은행',   '하나 자유입출금',        '111-222-100101', 55000000.00,  'CASH',      0.1,  1,  0,       0,      '2020-01-01', '2099-12-31', 0,           0),
    (2002, 1001, '하나증권',   '국내주식 종합계좌',      '444-555-100102', 120000000.00, 'STOCK',     8.5,  1,  0,       0,      '2021-05-10', '2099-12-31', 0,           0),
    (2003, 1001, '하나생명',   '무배당 하나연금보험',    '111-222-100103', 85000000.00,  'INSURANCE', 0,    1,  0,       300000, '2015-03-20', '2045-03-20', 200000000,   0),
    (2004, 1001, '하나카드',   '하나 CLUB H 카드',      '1234-5678-****-1001', 2450000.00, 'CARD',    0,   13,  0,       0,      '2022-01-15', '2027-01-15', 10000000,   0),

    -- ── [1001 홍길동] 연금 자산 (연동 완료) ───────────────────────────────
    -- 국민연금: PAY_AMT = 월 수령 예정액, BALANCE_AMT = 납부 누적액
    (2018, 1001, '국민연금공단', '국민연금',            '701-01-100101',  0.00,          'PENSION_NATIONAL', 0, 25, 1300000, 0, '2000-01-01', NULL, 0, 1),
    -- 퇴직연금 IRP: BALANCE_AMT = 현재 잔액 (목표나이까지 월할 분배)
    (2019, 1001, '하나은행',    'IRP 퇴직연금',        '702-01-100101',  144000000.00,  'PENSION_RETIRE',   3.5, NULL, 0, 0, '2010-01-01', NULL, 0, 1),

    -- ── [1002 김철수] ─────────────────────────────────────────────────────
    (2005, 1002, '신한은행',    '신한 주거래 우대통장', '333-444-100201', 8200000.00,   'CASH',      0.1,  1,  0,       0,      '2018-11-01', '2099-12-31', 0,           0),
    (2006, 1002, '미래에셋증권','해외주식 소수점투자',  '555-666-100202', 15000000.00,  'STOCK',     -2.3, 1,  0,       0,      '2023-01-10', '2099-12-31', 0,           0),
    (2007, 1002, '현대해상',    '무배당 하이카운전자보험','777-888-100203',3000000.00,  'INSURANCE', 0,    5,  0,       55000,  '2022-06-01', '2042-06-01', 50000000,    0),
    (2008, 1002, '현대카드',    '현대카드 M Edition3', '9876-5432-****-1002', 4580000.00,'CARD',     0,   25,  0,       0,      '2021-09-01', '2026-09-01', 15000000,    0),

    -- [1004 박관리] 테스트용 관리자
    (2011, 1004, '하나은행', '관리자 테스트 통장', '000-000-100401', 10000000.00, 'CASH', 0.1, 1, 0, 0,
     '2024-01-01', '2099-12-31', 0, 1),
    (2012, 1004, '하나증권', '테스트 주식계좌', '000-000-100402', 5000000.00, 'STOCK', 10.0, 1, 0, 0,
     '2024-01-01', '2099-12-31', 0, 1),
    (2013, 1004, '하나생명', '테스트 보험상품', '000-000-100403', 1000000.00, 'INSURANCE', 0, 1, 0, 100000,
     '2024-01-01', '2044-01-01', 10000000, 1),
    (2014, 1004, '하나카드', '테스트 신용카드', '0000-0000-****-1004', 500000.00, 'CARD', 0, 15, 0, 0,
     '2024-01-01', '2029-01-01', 5000000, 1),

    -- ── [1005 정순자] 시뮬레이션 부모 (연동 완료) ────────────────────────
    (2015, 1005, '하나은행',    '하나 연금통장',        '111-333-100501', 35000000.00,  'CASH',      0.1,  1,  0,       0,      '2018-06-01', '2099-12-31', 0,           1),
    (2016, 1005, '하나증권',    '하나OCIO알아서펀드',   '444-111-100502', 15000000.00,  'STOCK',     2.8,  1,  0,       0,      '2024-01-10', '2099-12-31', 0,           1),
    (2017, 1005, '삼성생명',    '삼성 종신보험',        '222-333-100503', 30000000.00,  'INSURANCE', 0,   15,  0,       120000, '2010-05-01', '2045-05-01', 80000000,    1),
    -- 국민연금 연동
    (2020, 1005, '국민연금공단','국민연금',             '701-01-100501',  0.00,          'PENSION_NATIONAL', 0, 25, 950000, 0, '2001-03-01', NULL, 0, 1),
    -- 퇴직연금 DC형 연동
    (2021, 1005, '삼성생명',    '퇴직연금(DC형)',       '702-01-100501',  68000000.00,  'PENSION_RETIRE',   2.8, NULL, 0, 0, '2008-03-01', NULL, 0, 1);

-- ========================
-- TB_REAL_ASSET
-- ID 체계 유지 및 ASSET_DESC JSON 데이터로 업데이트
-- ========================
INSERT INTO TB_REAL_ASSET (REAL_ASSET_ID, USER_ID, ASSET_NM, ASSET_CATE_CD, EVAL_AMT, ADDR,
                           ASSET_SIZE, ASSET_DESC)
VALUES
    -- 1. 역삼동 아파트 (홍길동)
    (3001, 1001, '역삼동 아파트', 'REAL_ESTATE', 920000000.00, '서울 강남구 역삼동 123-45', 84.00,
     '{"has_loan":true,"acquisition_year":2021,"housing_type":"아파트, 1주택"}'),

    -- 2. 그랜저 IG 2021 (홍길동)
    (3002, 1001, '그랜저 IG 2021', 'VEHICLE', 28500000.00, '서울 강남구 역삼동 주차장', 0.00,
     '{"car_number":"12가1234","model":"그랜저 IG","details":"2021년식 · 37,200km","brand":"현대"}'),

    -- 3. 금 · 37.5g (홍길동)
    (3003, 1001, '금 · 37.5g', 'GOLD', 4380000.00, '하나은행 대여금고', 37.50,
     '{"purity":"24K","price_per_gram":"116800","weight_g":"37.5"}'),

    -- 4. 마포구 아파트 (정순자)
    (3004, 1005, '마포구 아파트', 'REAL_ESTATE', 780000000.00, '서울 마포구 공덕동 456-78', 76.00,
     '{"has_loan":false,"acquisition_year":2015,"housing_type":"아파트"}'),

    -- 5. 아반떼 CN7 2022 (정순자)
    (3005, 1005, '아반떼 CN7 2022', 'VEHICLE', 18000000.00, '서울 마포구 공덕동 주차장', 0.00,
     '{"car_number":"34나5678","model":"아반떼 CN7","details":"2022년식 · 22,500km","brand":"현대"}');
-- ========================
-- TB_CARD
-- ========================
INSERT INTO TB_CARD (CARD_ID, ACCOUNT_ID, CARD_NM, LIMIT_AMT, AUTO_TRANS_AMT, IS_USE, BALANCE_AMT, PAY_DAY)
VALUES (4001, 2001, 'A::한금순 요양보호사 간병비 카드', 1500000.00, 0.00, 1, 320000.00, 15),
       (4002, 2001, 'B::최고운 요양보호사 생활비 카드', 2000000.00, 500000.00, 1, 150000.00, 20);

-- ========================
-- TB_CARD_USAGE
-- ========================
INSERT INTO TB_CARD_USAGE (CARD_USAGE_ID, CARD_ID, USAGE_NM, USAGE_LOC, USAGE_TYPE_CD, USAGE_AMT,
                           ABNML_YN, APRVL_YN)
VALUES
    (9001, 4001, '강남성심병원',      '서울 강남구 도곡로 117',      'SPEND',  25000.00, 'N', 'Y'),
    (9002, 4001, '홍길동',            NULL,                          'CHARGE', 300000.00,'N', 'Y'),
    (9003, 4001, '네일샵 강남점',     '서울 강남구 강남대로 396',    'SPEND',  45000.00, 'Y', 'Y'),
    (9004, 4001, '삼성서울병원 약국', '서울 강남구 일원로 81',       'SPEND',  18500.00, 'N', 'Y'),
    (9005, 4001, '강남구보건소',      '서울 강남구 삼성로 212',      'SPEND',   5000.00, 'N', 'Y'),
    (9006, 4001, '온누리약국 역삼점', '서울 강남구 역삼로 165',      'SPEND',  12800.00, 'N', 'Y'),
    (9007, 4001, '노래방 강남점',     '서울 강남구 역삼로 180',      'SPEND',  35000.00, 'Y', 'Y'),
    (9008, 4001, '의료기기센터 강남', '서울 강남구 논현로 508',      'SPEND',  45000.00, 'N', 'Y'),
    (9009, 4001, '강남재활의학과',    '서울 강남구 역삼로 146',      'SPEND',  32000.00, 'N', 'Y'),
    (9010, 4001, '한마음약국',        '서울 강남구 대치동 944-7',    'SPEND',   9500.00, 'N', 'Y'),
    (9011, 4002, '이마트 도곡점',     '서울 강남구 도곡로 130',      'SPEND',  62000.00, 'N', 'Y'),
    (9012, 4002, '홍길동',            NULL,                          'CHARGE', 200000.00,'N', 'Y'),
    (9013, 4002, 'GS25 역삼점',       '서울 강남구 역삼로 201',      'SPEND',   7500.00, 'N', 'Y'),
    (9014, 4002, '올리브영 강남점',   '서울 강남구 강남대로 438',    'SPEND',  28000.00, 'N', 'Y'),
    (9015, 4002, '코리아마트 논현점', '서울 강남구 논현로 430',      'SPEND',  41000.00, 'N', 'Y'),
    (9016, 4002, '홍길동',            NULL,                          'CHARGE', 150000.00,'N', 'Y'),
    (9017, 4002, 'CU 논현점',         '서울 강남구 논현로 412',      'SPEND',   5800.00, 'N', 'Y'),
    (9018, 4002, '롯데마트 강남점',   '서울 강남구 대치동 996',      'SPEND',  55000.00, 'N', 'Y'),
    (9019, 4002, '강남세탁소',        '서울 강남구 역삼로 153',      'SPEND',  15000.00, 'N', 'Y'),
    (9020, 4002, '한강공원 편의점',   '서울 강남구 강남대로 지하400', 'SPEND',  8200.00, 'N', 'Y');
-- ========================
-- TB_ASSET_SIMULATION
--
-- JSON 구조: SimulationDetailResponse 필드명 기준
--   income_details.national_pension   : 월 국민연금 수령액
--   income_details.retirement_pension : 초기 월 퇴직연금 분배액
--   income_details.local_subsidy_amt  : 지자체 월 지원금
--   income_details.local_subsidy_name : 지원금 명칭
--   income_details.total_monthly_income: 첫 구간 월 총수입
--   age_segments[].range              : "65-70세"
--   age_segments[].income             : 해당 구간 월 수입
--   age_segments[].income_detail      : { national, retirement, subsidy }
--   age_segments[].expense            : 해당 구간 월 지출
--   age_segments[].detail             : { living, medical, care }
--   ai_opinion                        : AI 분석 코멘트
--   is_linked                         : 연금 연동 여부
--
-- 컬럼 계산 기준 (SimulationService.accumulateSegments):
--   TOTAL_INCOME_AMT = Σ(income × months)
--   MONTHLY_COST     = Σ(expense × months)
--   SHORTAGE_AMT     = (MONTHLY_COST - TOTAL_INCOME_AMT) / 총개월수  [월 평균 부족액]
--   LIVING/MEDICAL/CARE_COST = Σ(각항목 × months)
-- ========================
INSERT INTO TB_ASSET_SIMULATION (SIMULATION_ID, USER_ID, TARGET_AGE, CARE_TYPE_CD,
                                 TOTAL_INCOME_AMT, SHORTAGE_AMT, IS_SUFFICIENT,
                                 LIVING_COST, MEDICAL_COST, CARE_COST, MONTHLY_COST,
                                 AGE_RANGE_DETAILS, IS_DEFAULT)
VALUES
    -- ──────────────────────────────────────────────────────────────────────
    -- [1] 홍길동 (1001, 65세 → 85세, CENTER 요양, 연금 연동 완료)
    --
    -- 국민연금:   1,300,000/월 (account 2018, PAY_AMT)
    -- 퇴직연금:   144,000,000 잔액 / 240개월 = 600,000/월 기본
    --             구간별 점감: 65~75 → 600,000 / 75~80 → 300,000 / 80~ → 0
    -- 지자체지원: 150,000/월
    --
    -- 구간별 수입/지출 (월):
    --   65-70: 수입 2,050,000 / 지출 2,300,000
    --   70-75: 수입 2,050,000 / 지출 2,600,000
    --   75-80: 수입 1,750,000 / 지출 3,000,000
    --   80-85: 수입 1,450,000 / 지출 3,500,000
    --   (각 구간 60개월, 합산 240개월)
    --
    -- TOTAL_INCOME_AMT = 60 × (2,050,000+2,050,000+1,750,000+1,450,000) = 438,000,000
    -- MONTHLY_COST     = 60 × (2,300,000+2,600,000+3,000,000+3,500,000) = 684,000,000
    -- SHORTAGE_AMT     = (684,000,000 - 438,000,000) / 240             =   1,025,000
    -- LIVING_COST      = 60 × (1,500,000+1,400,000+1,300,000+1,200,000) = 324,000,000
    -- MEDICAL_COST     = 60 × (  500,000+  700,000+1,000,000+1,300,000) = 210,000,000
    -- CARE_COST        = 60 × (  300,000+  500,000+  700,000+1,000,000) = 150,000,000
    -- ──────────────────────────────────────────────────────────────────────
    (1, 1001, 85, 'CENTER',
     438000000.00, 1025000.00, 0,
     324000000.00, 210000000.00, 150000000.00, 684000000.00,
     '{
       "income_details": {
         "national_pension": 1300000,
         "retirement_pension": 600000,
         "local_subsidy_amt": 150000,
         "local_subsidy_name": "서울시 고령자 지원금",
         "total_monthly_income": 2050000
       },
       "age_segments": [
         {
           "range": "65-70세",
           "income": 2050000,
           "income_detail": { "national": 1300000, "retirement": 600000, "subsidy": 150000 },
           "expense": 2300000,
           "detail": { "living": 1500000, "medical": 500000, "care": 300000 }
         },
         {
           "range": "70-75세",
           "income": 2050000,
           "income_detail": { "national": 1300000, "retirement": 600000, "subsidy": 150000 },
           "expense": 2600000,
           "detail": { "living": 1400000, "medical": 700000, "care": 500000 }
         },
         {
           "range": "75-80세",
           "income": 1750000,
           "income_detail": { "national": 1300000, "retirement": 300000, "subsidy": 150000 },
           "expense": 3000000,
           "detail": { "living": 1300000, "medical": 1000000, "care": 700000 }
         },
         {
           "range": "80-85세",
           "income": 1450000,
           "income_detail": { "national": 1300000, "retirement": 0, "subsidy": 150000 },
           "expense": 3500000,
           "detail": { "living": 1200000, "medical": 1300000, "care": 1000000 }
         }
       ],
       "ai_opinion": "퇴직연금이 소진되는 80세 이후 월 부족액이 약 205만원으로 증가합니다. 현재 연동된 IRP 잔액(1억 4,400만원)과 주식 자산을 활용한 추가 노후 준비를 권장합니다.",
       "is_linked": true
     }', 1),

    -- ──────────────────────────────────────────────────────────────────────
    -- [2] 이영희 (1003, 63세 → 90세, HOME 요양, 연금 미연동)
    --
    -- 국민연금:   연동 없음 → NationalPensionService 통계 추정치 450,000
    -- 퇴직연금:   연동 없음 → 통계 기반 (65~75: 1,200,000 / 75~80: 600,000 / 80~: 0)
    -- 지자체지원: 300,000/월
    --
    -- 구간별 수입/지출 (월, startAge=65):
    --   65-70: 수입 1,950,000 / 지출 1,600,000
    --   70-75: 수입 1,950,000 / 지출 1,700,000
    --   75-80: 수입 1,350,000 / 지출 1,900,000
    --   80-85: 수입   750,000 / 지출 2,200,000
    --   85-90: 수입   750,000 / 지출 2,600,000
    --   (각 구간 60개월, 합산 300개월)
    --
    -- TOTAL_INCOME_AMT = 60 × (1,950,000+1,950,000+1,350,000+750,000+750,000) = 405,000,000
    -- MONTHLY_COST     = 60 × (1,600,000+1,700,000+1,900,000+2,200,000+2,600,000) = 600,000,000
    -- SHORTAGE_AMT     = (600,000,000 - 405,000,000) / 300                        =     650,000
    -- LIVING_COST      = 60 × (1,200,000+1,200,000+1,100,000+1,000,000+900,000) = 324,000,000
    -- MEDICAL_COST     = 60 × (  400,000+  500,000+  600,000+  900,000+1,200,000) = 216,000,000
    -- CARE_COST        = 60 × (        0+        0+  200,000+  300,000+  500,000) =  60,000,000
    -- ──────────────────────────────────────────────────────────────────────
    (2, 1003, 90, 'HOME',
     405000000.00, 650000.00, 0,
     324000000.00, 216000000.00, 60000000.00, 600000000.00,
     '{
       "income_details": {
         "national_pension": 450000,
         "retirement_pension": 1200000,
         "local_subsidy_amt": 300000,
         "local_subsidy_name": "경기도 노인 기본소득",
         "total_monthly_income": 1950000
       },
       "age_segments": [
         {
           "range": "65-70세",
           "income": 1950000,
           "income_detail": { "national": 450000, "retirement": 1200000, "subsidy": 300000 },
           "expense": 1600000,
           "detail": { "living": 1200000, "medical": 400000, "care": 0 }
         },
         {
           "range": "70-75세",
           "income": 1950000,
           "income_detail": { "national": 450000, "retirement": 1200000, "subsidy": 300000 },
           "expense": 1700000,
           "detail": { "living": 1200000, "medical": 500000, "care": 0 }
         },
         {
           "range": "75-80세",
           "income": 1350000,
           "income_detail": { "national": 450000, "retirement": 600000, "subsidy": 300000 },
           "expense": 1900000,
           "detail": { "living": 1100000, "medical": 600000, "care": 200000 }
         },
         {
           "range": "80-85세",
           "income": 750000,
           "income_detail": { "national": 450000, "retirement": 0, "subsidy": 300000 },
           "expense": 2200000,
           "detail": { "living": 1000000, "medical": 900000, "care": 300000 }
         },
         {
           "range": "85-90세",
           "income": 750000,
           "income_detail": { "national": 450000, "retirement": 0, "subsidy": 300000 },
           "expense": 2600000,
           "detail": { "living": 900000, "medical": 1200000, "care": 500000 }
         }
       ],
       "ai_opinion": "현재 연금 수령액만으로도 계획하신 재가 요양 생활비를 충분히 충당 가능합니다. 여유 자산은 신탁을 통해 관리하시는 것을 추천합니다."
     }', 1);

-- ========================
-- TB_TRUST_SIMULATION
-- ========================
INSERT INTO TB_TRUST_SIMULATION (TRUST_SIMULATION_ID, USER_ID, PRINCIPAL_AMOUNT, CLAIM_AGENT_ID,
                                 START_DATE, START_TYPE, INVEST_TYPE, PAYOUT_TYPE, PAYOUT_SETTINGS)
VALUES (1, 1001, 100000000.00, 1002, '2026-05-01 00:00:00', 'SCHEDULED', 'LUMP_SUM', 'PENSION', '{
  "monthly": 2000000
}');

-- ========================
-- TB_PENSION_SIMULATION
-- ========================
INSERT INTO TB_PENSION_SIMULATION (PENSION_SIMULATION_ID, REAL_ASSET_ID, RECOMMENDED_TYPE,
                                   RECOMMENDED_MONTHLY_AMT, RECOMMENDED_CUMULATIVE_AMT,
                                   EVAL_AMT_SNAPSHOT, PLANS_JSON)
VALUES (1, 3001, 'FIXED', 2050000.00, 492000000.00, 920000000.00, '[
  {
    "type": "FIXED",
    "label": "정액형",
    "monthlyAmount": 2050000,
    "cumulativeAmount": 492000000,
    "yearlyData": [
      {"year": 1,  "monthlyAmount": 2050000, "cumulativeAmount": 24600000},
      {"year": 4,  "monthlyAmount": 2050000, "cumulativeAmount": 98400000},
      {"year": 7,  "monthlyAmount": 2050000, "cumulativeAmount": 172200000},
      {"year": 10, "monthlyAmount": 2050000, "cumulativeAmount": 246000000},
      {"year": 13, "monthlyAmount": 2050000, "cumulativeAmount": 319800000},
      {"year": 16, "monthlyAmount": 2050000, "cumulativeAmount": 393600000},
      {"year": 19, "monthlyAmount": 2050000, "cumulativeAmount": 467400000},
      {"year": 20, "monthlyAmount": 2050000, "cumulativeAmount": 492000000}
    ]
  },
  {
    "type": "FRONT_LOADED",
    "label": "초기증액형",
    "monthlyAmount": 2870000,
    "cumulativeAmount": 447720000,
    "yearlyData": [
      {"year": 1,  "monthlyAmount": 2870000, "cumulativeAmount": 34440000},
      {"year": 4,  "monthlyAmount": 2870000, "cumulativeAmount": 137760000},
      {"year": 7,  "monthlyAmount": 2870000, "cumulativeAmount": 241080000},
      {"year": 10, "monthlyAmount": 2009000, "cumulativeAmount": 310188000},
      {"year": 13, "monthlyAmount": 2009000, "cumulativeAmount": 382512000},
      {"year": 16, "monthlyAmount": 2009000, "cumulativeAmount": 410196000},
      {"year": 19, "monthlyAmount": 2009000, "cumulativeAmount": 434448000},
      {"year": 20, "monthlyAmount": 2009000, "cumulativeAmount": 447720000}
    ]
  },
  {
    "type": "GROWING",
    "label": "정기증가형",
    "monthlyAmount": 2583000,
    "cumulativeAmount": 495936000,
    "yearlyData": [
      {"year": 1,  "monthlyAmount": 1640000, "cumulativeAmount": 19680000},
      {"year": 4,  "monthlyAmount": 1853000, "cumulativeAmount": 89484000},
      {"year": 7,  "monthlyAmount": 2094000, "cumulativeAmount": 170712000},
      {"year": 10, "monthlyAmount": 2367000, "cumulativeAmount": 265404000},
      {"year": 13, "monthlyAmount": 2674000, "cumulativeAmount": 376704000},
      {"year": 16, "monthlyAmount": 3023000, "cumulativeAmount": 445380000},
      {"year": 19, "monthlyAmount": 3416000, "cumulativeAmount": 478524000},
      {"year": 20, "monthlyAmount": 3416000, "cumulativeAmount": 495936000}
    ]
  }
]');

-- ========================
-- TB_USER_PROD
-- ========================
INSERT INTO TB_USER_PROD (USER_PROD_ID, USER_ID, PRODUCT_ID, CLAIM_AGENT_ID, TARGET_ASSET_ID,
                          PRINCIPAL_AMOUNT, MONTHLY_PAYOUT, PROFIT, PROFIT_RATE,
                          PROD_STAT_CD, PROD_TYPE_CD, INVEST_TYPE_CD, PAYOUT_TYPE_CD,
                          PENSION_PAYOUT_TYPE_CD, START_TYPE, START_DATE, IS_AGENT_VIEW,
                          PAYOUT_SETTINGS, LAST_PAYOUT_DATE)
VALUES (5001, 1001, 1, 1002, NULL,   50000000.00, 1500000.00, 5000000.00, 3.20,
        'IN_PROGRESS', 'TRUST', 'LUMP_SUM', 'PENSION', NULL, 'SCHEDULED', '2026-05-01', 1,
        '{"monthly": 2000000}', NULL),
       (5002, 1001, 2, NULL,  3001, 920000000.00, 2050000.00,       0.00, 0.00,
        'IN_PROGRESS', 'HOUSING_PENSION', NULL, 'PENSION', 'FIXED', 'NOW', NULL, 0, NULL, NULL);

-- ========================
-- TB_ASSET_TRANS
-- ========================
INSERT INTO TB_ASSET_TRANS (TRANS_ID, USER_PROD_ID, TRANS_AMT, TRANS_STAT_CD, TRANS_TYPE_CD, TRANS_DT)
VALUES (6001, 5001, 1500000.00, 'COMPLETED', 'PAYMENT',  '2026-04-10 10:00:00'),
       (6002, 5001,  150000.00, 'COMPLETED', 'INTEREST', '2026-04-12 15:30:00');

-- ========================
-- TB_INHERIT_PLAN
-- ========================
INSERT INTO TB_INHERIT_PLAN (INHERIT_PLAN_ID, USER_ID, TOTAL_INHERIT_AMT, ESTI_TAX_AMT)
VALUES (1, 1001, 1000000000.00, 45000000.00);

-- ========================
-- TB_INHERIT_DETAIL
-- ========================
INSERT INTO TB_INHERIT_DETAIL (INHERIT_DETAIL_ID, INHERIT_PLAN_ID, USER_ID, RELATION_CD, DIST_RATIO)
VALUES (1, 1, 1002, 'CHILD',  0.50),
       (2, 1, 1003, 'SPOUSE', 0.50),
       (3, 1, 1004, 'CHILD',  0.00);

-- ========================
-- TB_INHERIT_LETTER
-- ========================
INSERT INTO TB_INHERIT_LETTER (LETTER_ID, INHERIT_DETAIL_ID, LETTER_CONT, VOICE_URL, LETTER_TYPE_CD)
VALUES (1, 1, '아들아, 건강하게 잘 살아라.',  'https://s3.aws.com/voice/letter1.mp3', 'VOICE'),
       (2, 2, '여보, 그동안 고마웠소.',       'https://s3.aws.com/voice/letter2.mp3', 'WRITING');

-- ========================
-- TB_FAMILY_AUTH
-- ========================
INSERT INTO TB_FAMILY_AUTH (FAMILY_AUTH_ID, USER_GRANTOR_ID, USER_GRANTEE_ID,
                            RELATION_CD, IS_INS_VIEW, IS_CARD_VIEW, IS_PROXY_CLAIM, IS_TRUST_VIEW, CARD_ID)
VALUES (1, 1001, 1002, 'CHILD', 1, 1, 1, 1, 4001),
       (2, 1005, 1006, 'CHILD', 0, 0, 0, 0, NULL),
       (3, 1001, 1004, 'CHILD', 1, 1, 1, 1, 4002),
       (4, 1001, 1005, 'PARENT', 1, 1, 1, 1, 4001);

-- ========================
-- TB_USER_LOGIN_LOG
-- ========================
INSERT INTO TB_USER_LOGIN_LOG (USER_LOG_ID, USER_ID, IS_SUCCESS, USER_MEANS_CD, ACCESS_IP_ADDR, ACCESS_DEV_NM)
VALUES (7001, 1001, 1, 'SIMPLE_PASSWORD', '192.168.0.1', 'iPhone 15 Pro'),
       (7002, 1002, 1, 'FACEID',          '192.168.0.5', 'Galaxy S24 Ultra');

-- ========================
-- TB_USER_SIMPLE_AUTH
-- ========================
INSERT INTO TB_USER_SIMPLE_AUTH (SIMPLE_AUTH_ID, USER_ID, AUTH_VALUE, AUTH_MEANS_CD)
VALUES (8001, 1002, '$2a$12$3vbJaMEQ0c8gmy8vOTUq4u0oKkUZEiI584xqRz1bFKHe.drWmV3/G',
        'SIMPLE_PASSWORD'),
       (8002, 1007, '$2b$12$AoCj7a0AsEeEjo5udi57AuuQF9epqRY39.HzYvcafdQ3Ck7MrL22e',
        'SIMPLE_PASSWORD'),
       (8003, 1008, '$2b$12$B07o/MgdB1C0JpHHj7OGuu0zoOTy6dTmNmZU2SXPqPQ9lP/Psjnkq', 'PATTERN'),
       (8004, 1009, '$2b$12$/8bGIb4EbZtDaFlFIe8uXeZM.vK5Mflt686CZb89q4Ax98KMnft4e', 'PATTERN');

-- ========================
-- TB_REFRESH_TOKEN
-- ========================
INSERT INTO TB_REFRESH_TOKEN (USER_ID, TOKEN_VAL, EXPIRY_DT)
VALUES (1001, 'dummy-refresh-token-1001', '2026-05-14 13:00:00'),
       (1002, 'dummy-refresh-token-1002', '2026-05-14 13:00:00');
