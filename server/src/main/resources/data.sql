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
                     PWD_CHANGED_AT)
VALUES
    -- 1. 홍길동: 일반 비밀번호 유저
    (1001, 'hong123', '홍길동', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01011112222', 65, 0, 'ACTIVE', 'PASSWORD', 'ROLE_USER', NOW(), NOW()),

    -- 2. 김철수: 간편 비밀번호 유저
    (1002, 'chulsoo7', '김철수', '$2a$12$sjg9Nyjde9D6CuiqmfOHpOHv5Ep7SLXt4bwnTl7.5uLSaUxs1rGM2',
     '01022223333', 40, 1, 'ACTIVE', 'SIMPLE_PASSWORD', 'ROLE_USER', NOW(), NOW()),

    -- 3. 이영희: 휴면 계정 예시
    (1003, 'younghee9', '이영희', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01033334444', 63, 0, 'DORMANT', 'PASSWORD', 'ROLE_USER',
     DATE_SUB(NOW(), INTERVAL 7 MONTH), DATE_SUB(NOW(), INTERVAL 7 MONTH)),

    -- 4. 박관리: 관리자 계정
    (1004, 'testUser', '박관리', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01055556666', 35, 0, 'ACTIVE', 'PASSWORD', 'ROLE_ADMIN', NOW(), NOW()),

    -- 5. 시뮬레이션 테스트용 부모 유저
    (1005, 'jung8', '정순자', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01066667777', 68, 0, 'ACTIVE', 'PASSWORD', 'ROLE_USER', NOW(), NOW()),

    -- 6. 시뮬레이션 테스트용 자녀 유저
    (1006, 'minjun9', '정민준', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01077778888', 38, 0, 'ACTIVE', 'PASSWORD', 'ROLE_USER', NOW(), NOW()),

    -- 7. Tsid: 간편비밀번호(654321) 테스트 유저 / SIMPLE_AUTH 테이블에 별도 등록
    (1007, 'Tsid', '하나테스터', '$2a$12$BYTWmmP4M2n/t2Fb/L.QnOejBuoHqILdK1syQ1rk62sfWBKtam9Ji',
     '01012345678', 30, 1, 'ACTIVE', 'SIMPLE_PASSWORD', 'ROLE_USER', NOW(), NOW()),

    -- 8. TsidZ: 패턴(Z모양: 0124678) 테스트 유저 / SIMPLE_AUTH 테이블에 별도 등록
    (1008, 'TsidZ', '패턴Z테스터', '$2a$12$1Sk8P7kehKkY933ANOAj1.AC52WVGH2/SB54gyil1Go.SMIm7IJKm',
     '01012345678', 30, 1, 'ACTIVE', 'PATTERN', 'ROLE_USER', NOW(), NOW()),

    -- 9. TsidL: 패턴(ㄴ모양: 03678) 테스트 유저 / SIMPLE_AUTH 테이블에 별도 등록
    (1009, 'TsidL', '패턴L테스터', '$2a$12$heAv.jDZ5PHLQ.fupN2e.uRIbjWd7o7PfYiTSkc5XFyDvXd7/jQ7q',
     '01012345678', 30, 1, 'ACTIVE', 'PATTERN', 'ROLE_USER', NOW(), NOW());


-- ========================
-- TB_PRODUCT
-- ========================
INSERT INTO TB_PRODUCT (PRODUCT_ID, PROD_NM, PROD_DESC, PROD_CATE_CD)
VALUES (1, '하나 연금신탁', '안정적인 노후 연금 상품', 'PENSION'),
       (2, '하나 유언대용신탁', '상속 설계를 위한 신탁 상품', 'TRUST');

-- ========================
-- TB_ACCOUNT
-- ========================
INSERT INTO TB_ACCOUNT (ACCOUNT_ID, USER_ID, INST_NM, ACCOUNT_NM, ACCOUNT_NUM, BALANCE_AMT,
                        ASSET_CATE_CD, PROFIT_RATE, PAY_DAY, PAY_AMT, MONTHLY_PREM_AMT, CONTR_DT,
                        EXPIRE_DT, LIMIT_AMT, IS_LINKED)
VALUES
    -- [1001 홍길동] 자산가 시나리오
    (2001, 1001, '하나은행', '하나 자유입출금', '111-222-100101', 55000000.00, 'CASH', 0.1, 1, 0, 0,
     '2020-01-01', '2099-12-31', 0, 1),
    (2002, 1001, '하나증권', '국내주식 종합계좌', '444-555-100102', 120000000.00, 'STOCK', 8.5, 1, 0, 0,
     '2021-05-10', '2099-12-31', 0, 1),
    (2003, 1001, '하나생명', '무배당 하나연금보험', '111-222-100103', 85000000.00, 'INSURANCE', 0, 1, 0, 300000,
     '2015-03-20', '2045-03-20', 200000000, 1),
    (2004, 1001, '하나카드', '하나 CLUB H 카드', '1234-5678-****-1001', 2450000.00, 'CARD', 0, 13, 0, 0,
     '2022-01-15', '2027-01-15', 10000000, 1),

    -- [1002 김철수] 일반 유저 시나리오
    (2005, 1002, '신한은행', '신한 주거래 우대통장', '333-444-100201', 8200000.00, 'CASH', 0.1, 1, 0, 0,
     '2018-11-01', '2099-12-31', 0, 1),
    (2006, 1002, '미래에셋증권', '해외주식 소수점투자', '555-666-100202', 15000000.00, 'STOCK', -2.3, 1, 0, 0,
     '2023-01-10', '2099-12-31', 0, 1),
    (2007, 1002, '현대해상', '무배당 하이카운전자보험', '777-888-100203', 3000000.00, 'INSURANCE', 0, 5, 0, 55000,
     '2022-06-01', '2042-06-01', 50000000, 1),
    (2008, 1002, '현대카드', '현대카드 M Edition3', '9876-5432-****-1002', 4580000.00, 'CARD', 0, 25, 0, 0,
     '2021-09-01', '2026-09-01', 15000000, 1),

    -- [1003 이영희] 휴면 계정
    (2009, 1003, '국민은행', 'KB스타트예금', '666-777-100301', 125000.00, 'CASH', 0.1, 1, 0, 0, '2019-02-15',
     '2099-12-31', 0, 1),
    (2010, 1003, '삼성증권', 'CMA 계좌', '888-999-100302', 54000.00, 'STOCK', 1.2, 1, 0, 0, '2020-05-20',
     '2099-12-31', 0, 1),

    -- [1004 박관리] 테스트용 관리자
    (2011, 1004, '하나은행', '관리자 테스트 통장', '000-000-100401', 10000000.00, 'CASH', 0.1, 1, 0, 0,
     '2024-01-01', '2099-12-31', 0, 1),
    (2012, 1004, '하나증권', '테스트 주식계좌', '000-000-100402', 5000000.00, 'STOCK', 10.0, 1, 0, 0,
     '2024-01-01', '2099-12-31', 0, 1),
    (2013, 1004, '하나생명', '테스트 보험상품', '000-000-100403', 1000000.00, 'INSURANCE', 0, 1, 0, 100000,
     '2024-01-01', '2044-01-01', 10000000, 1),
    (2014, 1004, '하나카드', '테스트 신용카드', '0000-0000-****-1004', 500000.00, 'CARD', 0, 15, 0, 0,
     '2024-01-01', '2029-01-01', 5000000, 1),

    -- [1005 정순자] 시뮬레이션 부모
    (2015, 1005, '하나은행', '하나 연금통장', '111-333-100501', 35000000.00, 'CASH', 0.1, 1, 0, 0,
     '2018-06-01', '2099-12-31', 0, 1),
    (2016, 1005, '하나증권', '하나OCIO알아서펀드', '444-111-100502', 15000000.00, 'STOCK', 2.8, 1, 0, 0,
     '2024-01-10', '2099-12-31', 0, 1),
    (2017, 1005, '삼성생명', '삼성 종신보험', '222-333-100503', 30000000.00, 'INSURANCE', 0, 15, 0, 120000,
     '2010-05-01', '2045-05-01', 80000000, 1);

-- ========================
-- TB_REAL_ASSET
-- ========================
INSERT INTO TB_REAL_ASSET (REAL_ASSET_ID, USER_ID, ASSET_NM, ASSET_CATE_CD, EVAL_AMT, ADDR,
                           ASSET_SIZE, ASSET_DESC)
VALUES (3001, 1001, '역삼동 아파트', 'REAL_ESTATE', 920000000.00, '서울 강남구 역삼동 123-45', 84.00,
        '자가 거주 중인 아파트'),
       (3002, 1001, '그랜저 IG 2021', 'VEHICLE', 28500000.00, '서울 강남구 역삼동 주차장', 0.00,
        '2021년식 · 37,200km'),
       (3003, 1001, '금 · 37.5g', 'GOLD', 4380000.00, '하나은행 대여금고', 37.50, 'KRX 금시장 구매분'),
       (3004, 1005, '마포구 아파트', 'REAL_ESTATE', 780000000.00, '서울 마포구 공덕동 456-78', 76.00,
        '자가 거주 중인 아파트'),
       (3005, 1005, '아반떼 CN7 2022', 'VEHICLE', 18000000.00, '서울 마포구 공덕동 주차장', 0.00,
        '2022년식 · 22,500km');

-- ========================
-- TB_CARD
-- ========================
INSERT INTO TB_CARD (CARD_ID, ACCOUNT_ID, CARD_NM, LIMIT_AMT, AUTO_TRANS_AMT, IS_USE, BALANCE_AMT, PAY_DAY)
VALUES (4001, 2001, '한금순 요양보호사 간병비 카드', 5000000.00, 0.00, 1, 320000.00, 15),
       (4002, 2001, '최고운 요양보호사 생활비 카드', 2000000.00, 500000.00, 1, 150000.00, 20);

-- ========================
-- TB_CARD_USAGE
-- ========================
INSERT INTO TB_CARD_USAGE (CARD_USAGE_ID, CARD_ID, USAGE_NM, USAGE_LOC, USAGE_TYPE_CD, USAGE_AMT, ABNML_YN, APRVL_YN)
VALUES
    (9001, 4001, '강남성심병원', '서울 강남구 도곡동', 'SPEND', 25000.00, 'N', 'Y'),
    (9002, 4001, '홍길동', NULL, 'CHARGE', 300000.00, 'N', 'Y'),
    (9003, 4001, '네일샵 강남점', '서울 강남구 강남대로', 'SPEND', 45000.00, 'Y', 'Y'),
    (9004, 4001, '삼성서울병원 약국', '서울 강남구 일원동', 'SPEND', 18500.00, 'N', 'Y'),
    (9005, 4001, '강남구보건소', '서울 강남구 삼성동', 'SPEND', 5000.00, 'N', 'Y'),
    (9006, 4001, '온누리약국 역삼점', '서울 강남구 역삼동', 'SPEND', 12800.00, 'N', 'Y'),
    (9007, 4001, '노래방 강남점', '서울 강남구 역삼동', 'SPEND', 35000.00, 'Y', 'Y'),
    (9008, 4001, '의료기기센터 강남', '서울 강남구 논현동', 'SPEND', 45000.00, 'N', 'Y'),
    (9009, 4001, '강남재활의학과', '서울 강남구 역삼동', 'SPEND', 32000.00, 'N', 'Y'),
    (9010, 4001, '한마음약국', '서울 강남구 대치동', 'SPEND', 9500.00, 'N', 'Y'),
    (9011, 4002, '이마트 도곡점', '서울 강남구 도곡동', 'SPEND', 62000.00, 'N', 'Y'),
    (9012, 4002, '홍길동', NULL, 'CHARGE', 200000.00, 'N', 'Y'),
    (9013, 4002, 'GS25 역삼점', '서울 강남구 역삼동', 'SPEND', 7500.00, 'N', 'Y'),
    (9014, 4002, '올리브영 강남점', '서울 강남구 강남대로', 'SPEND', 28000.00, 'N', 'Y'),
    (9015, 4002, '코리아마트 논현점', '서울 강남구 논현동', 'SPEND', 41000.00, 'N', 'Y'),
    (9016, 4002, '홍길동', NULL, 'CHARGE', 150000.00, 'N', 'Y'),
    (9017, 4002, 'CU 논현점', '서울 강남구 논현동', 'SPEND', 5800.00, 'N', 'Y'),
    (9018, 4002, '롯데마트 강남점', '서울 강남구 대치동', 'SPEND', 55000.00, 'N', 'Y'),
    (9019, 4002, '강남세탁소', '서울 강남구 역삼동', 'SPEND', 15000.00, 'N', 'Y'),
    (9020, 4002, '한강공원 편의점', '서울 강남구 강남대로', 'SPEND', 8200.00, 'N', 'Y');

-- ========================
-- TB_ASSET_SIMULATION
-- ========================
INSERT INTO TB_ASSET_SIMULATION (SIMULATION_ID, USER_ID, TARGET_AGE, CARE_TYPE_CD, TOTAL_INCOME_AMT,
                                 SHORTAGE_AMT, IS_SUFFICIENT, LIVING_COST, MEDICAL_COST, CARE_COST,
                                 MONTHLY_COST, AGE_RANGE_DETAILS)
VALUES (1, 1001, 85, 'CENTER', 1450000.00, 850000.00, 0, 1500000.00, 500000.00, 300000.00,
        2300000.00, '{
    "income_breakdown": {
      "national_pension": 1300000,
      "local_subsidy": 150000,
      "subsidy_name": "서울시 고령자 지원금"
    },
    "segments": [
      {
        "age_range": "65-70",
        "monthly_income": 1450000,
        "monthly_expense": 2300000,
        "details": {
          "living": 1500000,
          "medical": 500000,
          "care": 300000
        }
      },
      {
        "age_range": "70-75",
        "monthly_income": 1450000,
        "monthly_expense": 2600000,
        "details": {
          "living": 1400000,
          "medical": 700000,
          "care": 500000
        }
      }
    ],
    "ai_opinion": "현재 자산으로는 70세 이후 병원비 상승 폭을 감당하기에 월 약 85만원이 부족할 것으로 예측됩니다."
  }'),
       (2, 1003, 90, 'HOME', 1800000.00, 0.00, 1, 1200000.00, 400000.00, 200000.00, 1800000.00, '{
         "income_breakdown": {
           "national_pension": 1600000,
           "local_subsidy": 200000,
           "subsidy_name": "경기도 노인 기본소득"
         },
         "segments": [
           {
             "age_range": "63-68",
             "monthly_income": 1800000,
             "monthly_expense": 1800000,
             "details": {
               "living": 1200000,
               "medical": 400000,
               "care": 200000
             }
           }
         ],
         "ai_opinion": "현재 연금 수령액만으로도 계획하신 재가 요양 생활비를 충분히 충당 가능합니다. 여유 자산은 신탁을 통해 관리하시는 것을 추천합니다."
       }');

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
      {
        "year": 1,
        "monthlyAmount": 2050000,
        "cumulativeAmount": 24600000
      },
      {
        "year": 4,
        "monthlyAmount": 2050000,
        "cumulativeAmount": 98400000
      },
      {
        "year": 7,
        "monthlyAmount": 2050000,
        "cumulativeAmount": 172200000
      },
      {
        "year": 10,
        "monthlyAmount": 2050000,
        "cumulativeAmount": 246000000
      },
      {
        "year": 13,
        "monthlyAmount": 2050000,
        "cumulativeAmount": 319800000
      },
      {
        "year": 16,
        "monthlyAmount": 2050000,
        "cumulativeAmount": 393600000
      },
      {
        "year": 19,
        "monthlyAmount": 2050000,
        "cumulativeAmount": 467400000
      },
      {
        "year": 20,
        "monthlyAmount": 2050000,
        "cumulativeAmount": 492000000
      }
    ]
  },
  {
    "type": "FRONT_LOADED",
    "label": "초기증액형",
    "monthlyAmount": 2870000,
    "cumulativeAmount": 447720000,
    "yearlyData": [
      {
        "year": 1,
        "monthlyAmount": 2870000,
        "cumulativeAmount": 34440000
      },
      {
        "year": 4,
        "monthlyAmount": 2870000,
        "cumulativeAmount": 137760000
      },
      {
        "year": 7,
        "monthlyAmount": 2870000,
        "cumulativeAmount": 241080000
      },
      {
        "year": 10,
        "monthlyAmount": 2009000,
        "cumulativeAmount": 310188000
      },
      {
        "year": 13,
        "monthlyAmount": 2009000,
        "cumulativeAmount": 382512000
      },
      {
        "year": 16,
        "monthlyAmount": 2009000,
        "cumulativeAmount": 410196000
      },
      {
        "year": 19,
        "monthlyAmount": 2009000,
        "cumulativeAmount": 434448000
      },
      {
        "year": 20,
        "monthlyAmount": 2009000,
        "cumulativeAmount": 447720000
      }
    ]
  },
  {
    "type": "GROWING",
    "label": "정기증가형",
    "monthlyAmount": 2583000,
    "cumulativeAmount": 495936000,
    "yearlyData": [
      {
        "year": 1,
        "monthlyAmount": 1640000,
        "cumulativeAmount": 19680000
      },
      {
        "year": 4,
        "monthlyAmount": 1853000,
        "cumulativeAmount": 89484000
      },
      {
        "year": 7,
        "monthlyAmount": 2094000,
        "cumulativeAmount": 170712000
      },
      {
        "year": 10,
        "monthlyAmount": 2367000,
        "cumulativeAmount": 265404000
      },
      {
        "year": 13,
        "monthlyAmount": 2674000,
        "cumulativeAmount": 376704000
      },
      {
        "year": 16,
        "monthlyAmount": 3023000,
        "cumulativeAmount": 445380000
      },
      {
        "year": 19,
        "monthlyAmount": 3416000,
        "cumulativeAmount": 478524000
      },
      {
        "year": 20,
        "monthlyAmount": 3416000,
        "cumulativeAmount": 495936000
      }
    ]
  }
]');

-- ========================
-- TB_USER_PROD
-- ========================
INSERT INTO TB_USER_PROD (USER_PROD_ID,
                          USER_ID,
                          PRODUCT_ID,
                          CLAIM_AGENT_ID,
                          TARGET_ASSET_ID,
                          PRINCIPAL_AMOUNT,
                          MONTHLY_PAYOUT,
                          PROFIT,
                          PROFIT_RATE,
                          PROD_STAT_CD,
                          PROD_TYPE_CD,
                          INVEST_TYPE_CD,
                          PAYOUT_TYPE_CD,
                          PENSION_PAYOUT_TYPE_CD,
                          START_TYPE,
                          START_DATE,
                          IS_AGENT_VIEW,
                          PAYOUT_SETTINGS)
VALUES (5001, 1001, 1, 1002, NULL, 50000000.00, 1500000.00, 5000000.00, 3.20, 'IN_PROGRESS',
        'TRUST', 'LUMP_SUM', 'PENSION', NULL, 'SCHEDULED', '2026-05-01', 1, '{
    "monthly": 2000000
  }'),
       (5002, 1001, 2, NULL, 3001, 920000000.00, 2050000.00, 0.00, 0.00, 'IN_PROGRESS',
        'HOUSING_PENSION', NULL, 'PENSION', 'FIXED', 'NOW', NULL, 0, NULL);

-- ========================
-- TB_ASSET_TRANS
-- ========================
INSERT INTO TB_ASSET_TRANS (TRANS_ID, USER_PROD_ID, TRANS_AMT, TRANS_STAT_CD, TRANS_TYPE_CD,
                            TRANS_DT)
VALUES (6001, 5001, 1500000.00, 'COMPLETED', 'PAYMENT', '2026-04-10 10:00:00'),
       (6002, 5001, 150000.00, 'COMPLETED', 'INTEREST', '2026-04-12 15:30:00');

-- ========================
-- TB_INHERIT_PLAN
-- ========================
INSERT INTO TB_INHERIT_PLAN (INHERIT_PLAN_ID, USER_ID, TOTAL_INHERIT_AMT, ESTI_TAX_AMT)
VALUES (1, 1001, 1000000000.00, 45000000.00);

-- ========================
-- TB_INHERIT_DETAIL
-- ========================
INSERT INTO TB_INHERIT_DETAIL (INHERIT_DETAIL_ID, INHERIT_PLAN_ID, USER_ID, RELATION_CD, DIST_RATIO)
VALUES (1, 1, 1002, 'CHILD', 0.50),
       (2, 1, 1003, 'SPOUSE', 0.50),
       (3, 1, 1004, 'CHILD', 0.00);

-- ========================
-- TB_INHERIT_LETTER
-- ========================
INSERT INTO TB_INHERIT_LETTER (LETTER_ID, INHERIT_DETAIL_ID, LETTER_CONT, VOICE_URL, LETTER_TYPE_CD)
VALUES (1, 1, '아들아, 건강하게 잘 살아라.', 'https://s3.aws.com/voice/letter1.mp3', 'VOICE'),
       (2, 2, '여보, 그동안 고마웠소.', 'https://s3.aws.com/voice/letter2.mp3', 'WRITING');

-- ========================
-- TB_FAMILY_AUTH
-- =====================
INSERT INTO TB_FAMILY_AUTH (FAMILY_AUTH_ID, USER_GRANTOR_ID, USER_GRANTEE_ID,
                            RELATION_CD, IS_INS_VIEW, IS_CARD_VIEW, IS_PROXY_CLAIM, IS_TRUST_VIEW)
VALUES (1, 1001, 1002, 'CHILD', 1, 1, 1, 1),
       (2, 1005, 1006, 'CHILD', 0, 0, 0, 0),
       (3, 1001, 1004, 'CHILD', 1, 1, 1, 1);

-- ========================
-- TB_USER_LOGIN_LOG
-- ========================
INSERT INTO TB_USER_LOGIN_LOG (USER_LOG_ID, USER_ID, IS_SUCCESS, USER_MEANS_CD, ACCESS_IP_ADDR,
                               ACCESS_DEV_NM)
VALUES (7001, 1001, 1, 'SIMPLE_PASSWORD', '192.168.0.1', 'iPhone 15 Pro'),
       (7002, 1002, 1, 'FACEID', '192.168.0.5', 'Galaxy S24 Ultra');

-- ========================
-- TB_USER_SIMPLE_AUTH
-- ========================
-- 평문 → BCrypt(strength=12) 매핑
-- 1002 chulsoo7 : SIMPLE_PASSWORD (기존)
-- 1007 Tsid     : SIMPLE_PASSWORD "654321"
-- 1008 TsidZ    : PATTERN         "0124678"  (Z모양)
-- 1009 TsidL    : PATTERN         "03678"    (ㄴ모양)
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
