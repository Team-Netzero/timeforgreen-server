# TimeForGreen Server

NestJS 기반의 에너지 절약 미션/방/유저 관리 백엔드 서버입니다.

---

## Entity 구조

### User
| 필드명         | 타입      | 설명                |
| -------------- | --------- | ------------------- |
| username       | string    | 유저 ID (PK)        |
| profileImage   | string    | 프로필 이미지 URL   |
| hashedPassword | string    | 해시된 비밀번호     |
| refreshToken   | string    | 리프레시 토큰       |
| userRoomRelations | UserRoomRelation[] | 유저-방 관계 |
| missions       | Mission[] | 유저가 수행한 미션  |

---

### Room
| 필드명             | 타입      | 설명                |
| ------------------ | --------- | ------------------- |
| id                 | string    | 방 ID (PK, UUID)    |
| title              | string    | 방 이름             |
| activated          | boolean   | 활성화 여부         |
| allowNotificationAt| string    | 알림 허용 시간      |
| userRoomRelations  | UserRoomRelation[] | 방-유저 관계 |
| missions           | Mission[] | 방 내 미션          |

---

### Mission
| 필드명    | 타입      | 설명                |
| --------- | --------- | ------------------- |
| id        | string    | 미션 ID (PK, UUID)  |
| subject   | Subject   | 미션 주제           |
| createdAt | Date      | 생성일시            |
| user      | User      | 미션 수행 유저      |
| room      | Room      | 미션이 속한 방      |

#### Subject Enum
- `AIR_CONDITIONER`
- `LIGHT`
- `PLUG`

---

### UserRoomRelation
| 필드명    | 타입      | 설명                |
| --------- | --------- | ------------------- |
| id        | string    | 관계 ID (PK, UUID)  |
| user      | User      | 유저                |
| room      | Room      | 방                  |
| role      | Role      | 역할                |

#### Role Enum
- `HOST`
- `PARTICIPANT`

---

## 주요 API

### Auth (인증)
- `POST /auth/join` : 회원가입 (body: { createUserDto })
- `POST /auth/login` : 로그인 (body: { username, password })
- `POST /auth/logout` : 로그아웃

---

### User (유저)
- `POST /user/:username/room` : 방 생성 (body: { createRoomDto })
- `POST /user/:username/mission` : 미션 생성 (body: { createMissionDto })
- `GET /user/:username/mission/today` : 오늘의 미션 조회
- `GET /user/:username/missions` : 전체 미션 조회
- `GET /user/:username/rooms` : 유저가 속한 방 목록 조회
- `DELETE /user/:username` : 유저 삭제

---

### Room (방)
- `GET /room/search` : 방 검색 (body: { search })
- `GET /room/:id` : 방 상세 조회
- `GET /room/:id/missions` : 방 내 미션 목록 조회
- `GET /room/:id/users` : 방 내 유저 목록 조회
- `POST /room/:id/user` : 방에 유저 추가 (body: { username })
- `DELETE /room/:id/user` : 방에서 유저 제거 (body: { username })

---

### Files (파일)
- `POST /files/upload` : 파일 업로드 (multipart/form-data)
- `POST /files/check-plugged` : 플러그 연결 여부 체크 (multipart/form-data)
- `GET /files/sas-url?fileName=xxx` : 파일 SAS URL 발급

---

## DTO 예시

- **CreateUserDto**
  ```ts
  {
    username: string;
    password: string;
  }
  ```
- **CreateRoomDto**
  ```ts
  {
    title: string;
    allowNotificationAt: string;
  }
  ```
- **CreateMissionDto**
  ```ts
  {
    subject: "AIR_CONDITIONER" | "LIGHT" | "PLUG";
    roomId: string;
  }
  ```

---

필요에 따라 예시 응답, 인증 방식, 에러 코드 등도 추가할 수 있습니다.
