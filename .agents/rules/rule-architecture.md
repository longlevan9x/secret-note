---
name: Rule-Architecture
description: "Architecture rules"
---

# Quy tắc Kiến trúc Dự án (Frontend/Backend & Client/Server)

## 1. Nguyên tắc Phân lớp (Layered Architecture)

Mọi logic phía Server phải được chia thành các lớp sau:
- **Repository**: Chỉ chịu trách nhiệm giao tiếp với nguồn dữ liệu (Database, Storage, API bên thứ ba). Không chứa logic nghiệp vụ.
  - Vị trí: `src/server/repositories/`
- **Service**: Chứa logic nghiệp vụ, xử lý dữ liệu, kiểm tra quyền, mã hóa. Gọi đến Repository để lấy/lưu dữ liệu.
  - Vị trí: `src/server/services/`
- **API Routes**: Chỉ đóng vai trò điều hướng (Routing), nhận request và trả về response. Gọi đến Service để xử lý. Không viết logic trực tiếp trong route.
  - Vị trí: `src/app/api/`

## 2. Phân tách Client/Server/Shared

Dự án được chia thành 3 khu vực chính:
- **src/server/**: Chỉ chứa mã nguồn chạy trên Server (Node.js environment).
- **src/client/**: Chứa mã nguồn chạy trên Trình duyệt (React components, hooks, context).
- **src/shared/**: Chứa mã nguồn dùng chung (Types, constants, shared utils). Không được chứa các logic phụ thuộc vào môi trường (như `fs` hoặc `window`).

## 3. Quy tắc Import

Sử dụng Path Aliases để giữ import sạch sẽ:
- `@/server/*`: Trỏ đến `src/server/*`
- `@/client/*`: Trỏ đến `src/client/*`
- `@/shared/*`: Trỏ đến `src/shared/*`
- `@/client/components/*`: Trỏ đến `src/client/components/*`

**Cấm**:
- Import trực tiếp từ `src/core/*` (thư mục này đã bị xóa).
- Viết logic mã hóa/giải mã trực tiếp trong API Routes.
- Sử dụng `localStorage` hoặc `sessionStorage` trong thư mục `src/server/`.

## 4. Quản lý trạng thái (Client-side)

Sử dụng `WorkspaceContext` nằm tại `src/client/context/WorkspaceContext.tsx` để quản lý trạng thái toàn cục của ứng dụng. Mọi tương tác với API nên thông qua Context này.
