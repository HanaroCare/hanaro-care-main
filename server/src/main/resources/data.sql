

INSERT INTO TB_USER (USER_ID, USER_NM, USER_AGE, USER_PHONE, USER_PWD, HANA_CERT_YN, USER_STAT_CD,
                     USER_ROLE)
VALUES (12345678, 'min', 25, '01012345678',
        '$2a$12$Pet4YZqRx2T9JUnS/Xv9L.VN4NkDPEjwi6lcG2gn7o5ushhL30jnK', true, 'ACTIVE',
        'ROLE_USER');


INSERT INTO TB_USER_SIMPLE_AUTH (SIMPLE_AUTH_ID, USER_ID, AUTH_MEANS_CD, AUTH_VALUE)
VALUES (3, 12345678, 'SIMPLE_PASSWORD',
        '$2a$12$vobmM3uRVFkpxmZtUm0j7O6cvlJiuhS.501d3rsLFkCFMOaveg3Su');

INSERT INTO TB_PRODUCT (PROD_NM, PROD_DESC, PROD_CATE_CD)
VALUES ('하나 주택연금', '내 집을 담보로 받는 평생 연금', 'PENSION'),
       ('하나 가족신탁', '대대손손 안전한 자산 관리', 'TRUST');

INSERT INTO TB_ACCOUNT (ACCOUNT_ID, USER_ID, ACCOUNT_NM, ACCOUNT_NUM, INST_NM, ASSET_CATE_CD, BALANCE_AMT, CONTR_DT, EXPIRE_DT)
VALUES (1, 1, '하나 급여통장', '123-456789-01107', '하나은행', 'CASH', 5500000.00, '2023-01-01', NULL),
       (2, 1, '하나 연금저축', '987-654321-55507', '하나은행', 'PENSION', 12000000.00, '2024-05-10', '2044-05-10'),
       (3, 1, '삼성전자 주식계좌', '110-220-330440', '삼성증권', 'STOCK', 25400000.00, '2025-02-15', NULL),
       (4, 2, '하나 자유적금', '445-998877-11207', '하나은행', 'CASH', 3000000.00, '2026-01-20', '2027-01-20');

INSERT INTO TB_REAL_ASSET (REAL_ASSET_ID, USER_ID, ASSET_NM, ASSET_CATE_CD, EVAL_AMT, ASSET_SIZE, ADDR, ASSET_DESC)
VALUES (1, 1, '반포 자이 아파트', 'REAL_ESTATE', 2850000000.00, 84.95, '서울시 서초구 반포동', '거주 중인 자가 아파트'),
       (2, 1, '제네시스 GV80', 'VEHICLE', 75000000.00, NULL, '11가 1234', '2024년형 신차'),
       (3, 1, '보유 금괴', 'GOLD', 12000000.00, 0.15, NULL, '투자용 골드바 150g'),
       (4, 2, '용인 수지 아파트', 'REAL_ESTATE', 950000000.00, 59.90, '경기도 용인시 수지구', '전세 운용 중');

INSERT INTO TB_ASSET_SIMULATION (USER_ID, TARGET_AGE, MONTHLY_COST, LIVING_COST, MEDICAL_COST, CARE_COST, AGE_RANGE_DETAILS)
VALUES (1, 85, 3500000.00, 2000000.00, 1000000.00, 500000.00,
        '{"60s": {"living": 200, "medical": 20}, "70s": {"living": 180, "medical": 50}, "80s": {"living": 150, "medical": 100}}'),
       (2, 90, 4000000.00, 2500000.00, 800000.00, 700000.00,
        '{"60s": {"living": 250, "medical": 15}, "70s": {"living": 220, "medical": 40}, "80s": {"living": 180, "medical": 80}}');

INSERT INTO TB_CARD (CARD_ID, ACCOUNT_ID, CARD_NM, LIMIT_AMT, AUTO_TRANS_AMT, USE_YN)
VALUES (1, 1, '하나 ANY CARD', 5000000.00, 0.00, 'Y'),
       (2, 1, '하나 CLUB SK', 10000000.00, 0.00, 'Y');
