SET FOREIGN_KEY_CHECKS = 0;

-- 2. 이제 안전하게 비웁니다.
TRUNCATE TABLE TB_USER_SIMPLE_AUTH;
TRUNCATE TABLE TB_ASSET_TRANS;
TRUNCATE TABLE TB_USER_PROD;
TRUNCATE TABLE TB_USER_LOGIN_LOG;
TRUNCATE TABLE TB_FAMILY_AUTH;
TRUNCATE TABLE TB_CARD;
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
INSERT INTO TB_USER (USER_ID, USER_NM, USER_PWD, USER_PHONE, USER_AGE, IS_HANA_CERT,
                     USER_STAT_CD, AUTH_MEANS_CD, USER_ROLE, LAST_LOGIN_AT, PWD_CHANGED_AT)
VALUES
    -- 1. 정상 유저 (최근 로그인)
    (1001, '홍길동', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01011112222', 65, 1, 'ACTIVE', 'PASSWORD', 'ROLE_USER', NOW(), NOW()),
    -- 2. 휴면 후보 유저 (마지막 로그인이 7개월 전이라 로그인 시점에 DORMANT로 바뀔 대상)
    (1002, '김철수', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01022223333', 40, 0, 'ACTIVE', 'PASSWORD', 'ROLE_USER', DATE_SUB(NOW(), INTERVAL 7 MONTH),
     DATE_SUB(NOW(), INTERVAL 7 MONTH)),
    -- 3. 이미 휴면 상태인 유저
    (1003, '이영희', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01033334444', 63, 1, 'DORMANT', 'PASSWORD', 'ROLE_USER', DATE_SUB(NOW(), INTERVAL 8 MONTH),
     DATE_SUB(NOW(), INTERVAL 8 MONTH)),
    -- 4. 관리자
    (1004, '박관리', '$2a$12$ki4mfDlCBGUZLbiPDXIsCu.TVymeZGMU7BmQeEjdUXkq21CHws2Su',
     '01055556666', 35, 1, 'ACTIVE', 'PASSWORD', 'ROLE_ADMIN', NOW(), NOW());

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
                        EXPIRE_DT, LIMIT_AMT)
VALUES (2001, 1001, '하나은행', '하나 자유입출금', '111-222-333333', 50000000.00, 'CASH', 0.10, 1, 0.00, 0.00,
        '2020-01-01', '2099-12-31', 0.00),
       (2002, 1001, '하나은행', '하나 정기예금', '111-222-444444', 30000000.00, 'CASH', 3.50, 1, 0.00, 0.00,
        '2024-01-01', '2025-01-01', 0.00),
       (2003, 1001, '하나증권', '삼성전자 외 3종목', '444-555-666666', 72000000.00, 'STOCK', 5.20, 1, 0.00,
        0.00, '2023-05-10', '2099-12-31', 0.00),
       (2004, 1001, '국민연금공단', '국민연금 수령 예정', '777-888-999999', 30000000.00, 'PENSION', 0.00, 25,
        1300000.00, 0.00, '1990-01-01', '2045-01-01', 0.00),
       (2005, 1001, '하나생명', '하나 건강보험', '111-222-555555', 42000000.00, 'INSURANCE', 0.00, 1, 0.00,
        150000.00, '2021-03-15', '2051-03-15', 100000000.00);

-- ========================
-- TB_REAL_ASSET
-- ========================
INSERT INTO TB_REAL_ASSET (REAL_ASSET_ID, USER_ID, ASSET_NM, ASSET_CATE_CD, EVAL_AMT, ADDR,
                           ASSET_SIZE, ASSET_DESC)
VALUES (3001, 1001, '역삼동 아파트', 'REAL_ESTATE', 920000000.00, '서울 강남구 역삼동 123-45', 84.00,
        '자가 거주 중인 아파트'),
       (3002, 1001, '그랜저 IG 2021', 'VEHICLE', 28500000.00, '서울 강남구 역삼동 주차장', 0.00,
        '2021년식 · 37,200km'),
       (3003, 1001, '금 · 37.5g', 'GOLD', 4380000.00, '하나은행 대여금고', 37.50, 'KRX 금시장 구매분');

-- ========================
-- TB_CARD
-- ========================
INSERT INTO TB_CARD (CARD_ID, ACCOUNT_ID, CARD_NM, LIMIT_AMT, AUTO_TRANS_AMT, IS_USE)
VALUES (4001, 2001, '하나 시니어 행복카드', 5000000.00, 0.00, 1),
       (4002, 2001, '하나 요양비 전용카드', 2000000.00, 500000.00, 1);

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
       (2, 1001, 1004, 'CHILD', 1, 1, 1, 1);

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
INSERT INTO TB_USER_SIMPLE_AUTH (SIMPLE_AUTH_ID, USER_ID, AUTH_VALUE, AUTH_MEANS_CD)
VALUES (8001, 1001, '$2a$12$R9h/lSAbvI7.Ctf386zUn.9v78RREI7K7T9I.X06C58L4iFm3lG8i',
        'SIMPLE_PASSWORD'),
       (8002, 1002, 'BIO_TOKEN_VALUE', 'FACEID');

-- ========================
-- TB_REFRESH_TOKEN
-- ========================
INSERT INTO TB_REFRESH_TOKEN (USER_ID, TOKEN_VAL, EXPIRY_DT)
VALUES (1001, 'dummy-refresh-token-1001', '2026-05-14 13:00:00'),
       (1002, 'dummy-refresh-token-1002', '2026-05-14 13:00:00');
