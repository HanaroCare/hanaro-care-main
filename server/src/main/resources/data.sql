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
-- TB_USER
-- 비밀번호는 InitLoader에서 BCrypt 암호화 처리
-- 여기서는 평문으로 넣고 InitLoader에서 덮어씌움
INSERT INTO TB_USER (USER_ID, USER_NM, USER_PWD, USER_PHONE, USER_AGE, HANA_CERT_YN, USER_STAT_CD)
VALUES
    (1001, '홍길동', 'TEMP_PWD', '01011112222', 65, 'Y', 'ACTIVE'),
    (1002, '김철수', 'TEMP_PWD', '01022223333', 70, 'N', 'ACTIVE'),
    (1003, '이영희', 'TEMP_PWD', '01033334444', 68, 'Y', 'ACTIVE');

-- ========================
-- TB_PRODUCT
-- ========================
INSERT INTO TB_PRODUCT (PROD_NM, PROD_DESC, PROD_CATE_CD)
VALUES
    ('하나 연금신탁', '안정적인 노후 연금 상품', 'PENSION'),
    ('하나 유언대용신탁', '상속 설계를 위한 신탁 상품', 'TRUST');

-- ========================
-- TB_ACCOUNT (금융 자산)
-- ========================
INSERT INTO TB_ACCOUNT (ACCOUNT_ID, USER_ID, INST_NM, ACCOUNT_NM, ACCOUNT_NUM, BALANCE_AMT, ASSET_CATE_CD, PROFIT_RATE, PAY_DAY, PAY_AMT, MONTHLY_PREM_AMT)
VALUES
    -- 홍길동 금융 자산
    (2001, 1001, '하나은행',      '하나 자유입출금',       '111-222-333333', 50000000.00, 'CASH',      NULL,  NULL, NULL,       NULL),
    (2002, 1001, '하나은행',      '하나 정기예금',         '111-222-444444', 30000000.00, 'CASH',      3.50,  NULL, NULL,       NULL),
    (2003, 1001, '하나증권',      '삼성전자 외 3종목',     '444-555-666666', 72000000.00, 'STOCK',     5.20,  NULL, NULL,       NULL),
    (2004, 1001, '국민연금공단',  '국민연금 수령 예정',    '777-888-999999', 30000000.00, 'PENSION',   NULL,  25,   1300000.00, NULL),
    (2005, 1001, '하나생명',      '하나 건강보험',         '111-222-555555', 42000000.00, 'INSURANCE', NULL,  NULL, NULL,       150000.00),
    (2006, 1001, '하나카드',      '하나마나카드',          '111-222-666666', 8000000.00,  'CARD',      NULL,  NULL, NULL,       NULL),
    -- 김철수 금융 자산
    (2007, 1002, '국민은행',      'KB 자유입출금',         '222-333-444444', 20000000.00, 'CASH',      NULL,  NULL, NULL,       NULL),
    (2008, 1002, '삼성생명',      '삼성 종신보험',         '222-333-555555', 25000000.00, 'INSURANCE', NULL,  NULL, NULL,       200000.00);

-- ========================
-- TB_REAL_ASSET (실물 자산)
-- ========================
INSERT INTO TB_REAL_ASSET (REAL_ASSET_ID, USER_ID, ASSET_NM, ASSET_CATE_CD, EVAL_AMT, ADDR, ASSET_SIZE, ASSET_DESC)
VALUES
    -- 홍길동 실물 자산
    (3001, 1001, '역삼동 아파트',  'REAL_ESTATE', 920000000.00, '서울 강남구 역삼동 123-45', 84.00, NULL),
    (3002, 1001, '그랜저 IG 2021', 'VEHICLE',     28500000.00,  NULL,                         NULL,  '2021년식 · 37,200km'),
    (3003, 1001, '금 · 37.5g',     'GOLD',        4380000.00,   NULL,                         37.50, 'KRX 금시장 기준'),
    -- 김철수 실물 자산
    (3004, 1002, '분당구 아파트',  'REAL_ESTATE', 510000000.00, '경기 성남시 분당구 123-45', 59.00, NULL);

-- ========================
-- TB_ASSET_SIMULATION
-- ========================
INSERT INTO TB_ASSET_SIMULATION (USER_ID, TARGET_AGE, LIVING_COST, MEDICAL_COST, CARE_COST, MONTHLY_COST, AGE_RANGE_DETAILS)
VALUES
    (1001, 85, 1500000.00, 500000.00, 300000.00, 2300000.00, '[]'),
    (1003, 90, 1200000.00, 400000.00, 200000.00, 1800000.00, '[]');

-- ========================
-- TB_INHERIT_PLAN (상속 설계)
-- ========================
INSERT INTO TB_INHERIT_PLAN (USER_ID, TOTAL_INHERIT_AMT, ESTI_TAX_AMT)
VALUES
    (1001, 1000000000.00, 45000000.00);


-- ========================
-- TB_USER_LOGIN_LOG
-- ========================
INSERT INTO TB_USER_LOGIN_LOG (USER_LOG_ID, USER_ID, USER_RESULT_YN, USER_MEANS_CD, ACCESS_IP_ADDR, ACCESS_DEV_NM)
VALUES
    (4001, 1001, 1, 'SIMPLE_PASSWORD', '192.168.0.1', 'iPhone 15'),
    (4002, 1001, 1, 'FACEID',          '192.168.0.1', 'iPhone 15'),
    (4003, 1002, 0, 'SIMPLE_PASSWORD', '192.168.0.2', 'Galaxy S24');
