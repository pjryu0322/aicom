# 사용자 등록 API 계약 (DB 스키마·DTO 기반)

이 문서는 다음 컴포넌트가 “서로 모순되지 않는 요청/응답 필드 계약”을 갖도록 정리한 계약서입니다.

- DB 저장: `src/db/migrations/001_create_users_for_user_registration.sql`
- 요청 스키마: `src/api/contracts/userRegistration.request.schema.json`
- 응답 스키마: `src/api/contracts/userRegistration.response.schema.json`

## 1) Endpoint (가정)

- `POST /api/admin/users`

## 2) 요청 (Request Body)

아래 필드는 요청 바디에 **반드시 포함**되어야 하며, 타입/제약은 JSON Schema를 따릅니다.

- `email` (string, required, format: email)
- `fullName` (string, required, minLength: 1)
- `password` (string, required, minLength: 8)
- `phoneNumber` (string, optional)
- `role` (string, optional; enum: `USER` | `ADMIN`, default: `USER`)
- `status` (string, optional; enum: `ACTIVE` | `DISABLED`, default: `ACTIVE`)

### 비고
- `password`는 애플리케이션 계층에서 해시되어 DB의 `password_hash`로 저장된다고 가정합니다.

## 3) 응답 (Response Body)

요청이 성공하면 다음 응답 바디가 반환됩니다.

- `id` (string, required, uuid)
- `email` (string, required)
- `fullName` (string, required)
- `phoneNumber` (string, optional)
- `role` (string, required; enum: `USER` | `ADMIN`)
- `status` (string, required; enum: `ACTIVE` | `DISABLED`)
- `registeredBy` (string, optional, uuid)
- `createdAt` (string, required, format: date-time)
- `updatedAt` (string, required, format: date-time)

