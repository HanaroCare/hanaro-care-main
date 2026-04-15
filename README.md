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

[참고문서]https://skinny-shovel-fc4.notion.site/33b4a434c07c800385a4ec4fafa29407?pvs=143

```text
hanaro-care-main/
├── client/                 # Next.js + Prisma 
│   ├── src/
│   │   └── app/
│   │       └── {domain}/   # 도메인 단위 (ex: saving, asset)
│   │           ├─ actions/ # 여기서 Spring Boot API를 호출 (Server Action)
│   │           ├─ components/ # 도메인 전용 UI 컴포넌트 (PascalCase)
│   │           ├─ hooks/   # 도메인 전용 커스텀 훅 (use 접두사)
│   │           └─ page.tsx # 서버 액션을 호출하여 화면에 데이터 전달
│   ├── prisma/             # Database Schema & Migrations
│   └── biome.json          # Lint/Format 설정 (Biome)
│
└── server/src/main/java/com/server/
    ├── common/                  # 도메인 전반에 쓰이는 공통 요소
    │   ├── exception/           # GlobalExceptionHandler, CustomException
    │   ├── response/            # 공통 응답 규격 (ApiResponse)
    │   ├── util/                # 날짜 계산, 문자열 처리 등 유틸
    │   └── constant/            # 공통 코드, Enum 등
    │
    ├── config/                  # 애플리케이션 전역 설정
    │   ├── security/            # JWT, SecurityConfig
    │   ├── database/            # Querydsl, JPA 설정
    │   └── swagger/             # API 문서 설정
    │
    ├── domain/                  
    │   ├── asset/               
    │   │   ├── controller/      # Next.js BFF 서버의 요청 받는 곳
    │   │   ├── service/         
    │   │   ├── repository/     
    │   │   ├── entity/          
    │   │   ├── dto/             # Next.js 서버가 받게 될 데이터 규격
    │   │   └── mapper/          # AssetMapper
    │
    └── ServerApplication.java  # 메인 실행 클래스
