# 🚀 Hana Care Project (Team Name)

**Next.js + Spring Boot MSA 프로젝트**입니다.

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

**Trunk-based Development (TBD)** 전략을 채택하여 속도감 있게 개발합니다.

### 1. Branch Strategy (TBD)
* **Main/Develop:** 모든 작업의 통합 브랜치입니다.
* **Rule:** 기능을 쪼개어 **4시간 미만 단위로 `Push`** 하고, 수시로 `Pull` 받아 충돌을 방지합니다.
* 틀 작업 기간(초기 2-3일) 외에는 복잡한 PR 리뷰보다 **페어 프로그래밍**과 **빠른 통합**에 집중합니다.

### 2. Commit Message (Angular Style)
`jira issue num-type: description` 형식으로 작성합니다.

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
* **보안:** API Key, DB 패스워드 등 **민감 정보 절대 포함 금지** (.env 활용).

---

## 📂 Repository Structure (Monorepo)

```text
hanaro-care-main/
├── client/          # Next.js + Prisma (BFF 및 프론트 로직)
│   ├── src/
│   ├── prisma/
│   └── biome.json
└── server/          # Spring Boot (Core API 및 비즈니스 로직)
    ├── src/
    └── build.gradle
