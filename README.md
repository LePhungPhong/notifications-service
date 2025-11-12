# Notifications Service (MongoDB + Express + Socket.io)

Microservice thông báo cho mạng xã hội. Hỗ trợ REST + realtime.

## Chạy bằng Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

- API: http://localhost:8080
- Mongo Express: http://localhost:8081

## API

### Tạo thông báo
`POST /api/notifications`
```json
{
  "userId": "receiver-123",
  "type": "like",
  "actorId": "user-456",
  "entityType": "post",
  "entityId": "post-789",
  "title": "Ai đó đã thích bài viết của bạn",
  "message": "user-456 vừa thả tim",
  "meta": { "preview": "..." },
  "dedupe": true
}
```

### Danh sách thông báo
`GET /api/notifications?userId=receiver-123&unread=true&page=1&limit=20`

### Đánh dấu đã đọc
`PATCH /api/notifications/:id/read` (yêu cầu header `X-User-Id`)

### Đánh dấu tất cả đã đọc
`PATCH /api/notifications/read-all?userId=receiver-123`

### Xoá 1 thông báo
`DELETE /api/notifications/:id` (yêu cầu header `X-User-Id`)

## Realtime (Socket.io)
Client kết nối:
```js
import { io } from "socket.io-client";
const s = io("http://localhost:8080", { query: { userId: "receiver-123" } });
s.on("notification:new", (n) => console.log("new notification", n));
```

## Tích hợp vào web hiện có
- Gọi `POST /api/notifications` từ các sự kiện: like, comment, follow, mention...
- Ở frontend, hiện badge đếm `unread`. Định kỳ gọi `GET /api/notifications?unread=true` hoặc dùng socket.
- Lưu ý: có chỉ số unique `(userId, type, actorId, entityId)` để tránh trùng.

## Dev local (không Docker)
```bash
npm i
npm run dev
# Mongo local: MONGO_URI=mongodb://localhost:27017/notifications_db
```
