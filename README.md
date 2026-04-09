# 🚀 Hana Care Project (Team Name)

**Next.js + Spring Boot MSA**

---

## 🛠 Tech Stack

### Frontend & BFF
* **Framework:** Next.js 15+ (App Router)
* **Language:** TypeScript
* **ORM:** Prisma (MySQL)
* **Lint/Format:** Biome (nursery, javascript sorting 적용)
* **Package Manager:** pnpm

### Backend
* **Framework:** Spring Boot 4.x
* **Language:** Java 21+
* **Documentation:** Swagger (SpringDoc), Javadoc
* **Test:** JUnit 5, Mockito, JaCoCo (Coverage 80% 목표)

### Infrastructure (Post-April)
* **Cloud:** AWS 
* **Container:** Docker 
* **Network:** Private IP 기반 통신 

---

## 🤝 Collaboration & Git Convention

### 1. Branch Strategy (TBD)
* **Main/Develop:** 모든 작업의 통합 브랜치입니다.
* **Rule:** 기능을 쪼개어 **4시간 미만 단위로 `Push`** 하고, 수시로 `Pull` 받아 충돌을 방지

### 2. Commit Message (Angular Style)
`jira issue num-type: description` 형식으로 작

| Type | Description |
| :--- | :--- |
| **feat** | 새로운 기능 추가 |
| **fix** | 버그 수정 |
| **docs** | 문서 수정 (README, Swagger 등) |
| **style** | 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음) |
| **refactor** | 코드 리팩토링 |
| **test** | 테스트 코드 추가/수정 |
| **chore** | 빌드 설정, 패키지 매니저, .gitignore 수정 등 |

*예시: `HN-123-feat: add user authentication via next-auth`*

### 3. PR & Code Review
* **제목:** [Type] 기능 요약 (예: [Feat] 로그인 API 연동)
* **본문:** 변경 사항, 관련 이슈, 테스트 결과 포함.
* **보안:** API Key, DB 패스워드 등

---

### 📂 Repository Structure

```text
hanaro-care-main/
├── client/                 # Next.js + Prisma 
│   ├── src/
│   │   └── app/
│   │       └── {domain}/   # 도메인 단위 (ex: saving, asset)
│   │           ├─ actions/ # 도메인 전용 서버 액션 (데이터 조회/변경)
│   │           ├─ components/ # 도메인 전용 UI 컴포넌트 (PascalCase)
│   │           ├─ hooks/   # 도메인 전용 커스텀 훅 (use 접두사)
│   │           └─ page.tsx # 페이지 단위 레이아웃 및 데이터 조합
│   ├── prisma/             # Database Schema & Migrations
│   └── biome.json          # Lint/Format 설정 (Biome)
│
└── server/                 # Spring Boot
    ├── src/main/java/com/server
    │   ├── common/         # 공통 유틸리티, 예외 처리, 상수
    │   ├── config/         # Security, Swagger, DB 등 설정 클래스
    │   ├── controller/     # API 엔드포인트 (REST Controller)
    │   ├── dto/            # 계층 간 데이터 전송 객체 (Request/Response)
    │   ├── entity/         # JPA 엔티티 (Database Table Mapping)
    │   ├── mapper/         # Entity ↔ DTO 변환 로직 (MapStruct 등)
    │   ├── repository/     # DB 접근 인터페이스 (Spring Data JPA)
    │   ├── security/       # 인증/인가 및 보안 관련 로직
    │   ├── service/        # 비즈니스 로직 및 트랜잭션 관리
    │   └── HanaCareApplication.java # 애플리케이션 메인 클래스
    └── build.gradle        # 의존성 관리 및 빌드 설정 (JaCoCo 포함)