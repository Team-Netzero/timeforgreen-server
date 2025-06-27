<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

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
