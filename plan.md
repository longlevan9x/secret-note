# Serverless Ecosystem Manager - Master Plan

## 1. Tổng quan Dự án (Project Overview)
Ứng dụng là một **Control Plane** cá nhân dùng để quản lý tập trung các dịch vụ Serverless (Vercel, Supabase, Upstash, GitLab...).
- **Vấn đề:** Khó nhớ mối liên kết giữa các service và quản lý hàng chục Secret Keys/API Keys.
- **Giải pháp:** Một Dashboard trực quan có sơ đồ mối quan hệ và khả năng lưu trữ linh hoạt.

## 2. Kiến trúc Hệ thống (Storage Agnostic Architecture)
Để đảm bảo ứng dụng không bị phụ thuộc vào bất kỳ công nghệ lưu trữ nào, chúng ta sử dụng **Repository Pattern**.



### Các thành phần chính:
- **Core Logic:** Xử lý hiển thị, mã hóa dữ liệu.
- **IStorage Interface:** Định nghĩa các hàm chuẩn `saveData()`, `loadData()`, `testConnection()`.
- **Adapters:**
    - `LocalAdapter`: Lưu/Tải file `.json` trực tiếp.
    - `GitHubAdapter`: Sử dụng GitHub API để lưu vào Private Repo.
    - `SupabaseAdapter`: Lưu vào PostgreSQL thông qua Supabase Client.
    - `DriveAdapter`: Đồng bộ qua Google Drive.

## 3. Mô hình Dữ liệu chuẩn (Unified Data Schema)
Dữ liệu được cấu hình dưới dạng JSON để có thể di chuyển giữa các loại Database khác nhau:

```json
{
  "version": "1.0",
  "lastUpdated": "2024-05-20T10:00:00Z",
  "projects": [
    {
      "id": "proj-01",
      "name": "My Awesome Webapp",
      "services": [
        {
          "id": "svc-supabase-01",
          "name": "Production DB",
          "provider": "Supabase",
          "secrets": [
            { "key": "SUPABASE_URL", "value": "encrypted_content", "isSensitive": false },
            { "key": "SERVICE_ROLE_KEY", "value": "encrypted_content", "isSensitive": true }
          ],
          "dependsOn": []
        },
        {
          "id": "svc-vercel-01",
          "name": "Frontend",
          "provider": "Vercel",
          "secrets": [],
          "dependsOn": ["svc-supabase-01"]
        }
      ]
    }
  ]
}
```

## 4. Chiến lược Bảo mật (Security Strategy)
Dự án áp dụng cơ chế **Zero-Knowledge**:
1. **Client-side Encryption:** Mã hóa dữ liệu bằng `AES-256` tại trình duyệt thông qua một **Master Password**.
2. **No Backend Storage of Keys:** Master Password không bao giờ được gửi lên server hay lưu vào bộ nhớ.
3. **Encrypted at Rest:** Dữ liệu dù lưu ở GitHub hay Supabase thì các giá trị Secret vẫn ở dạng đã mã hóa.

## 5. Tính năng chính (Key Features)
- **Dependency Graph:** Sử dụng `React Flow` để hiển thị sơ đồ mũi tên giữa các service.
- **Environment Sync:** Xuất file `.env` nhanh cho từng dự án.
- **Storage Switcher:** Cho phép thay đổi nơi lưu trữ (Database <-> GitHub) chỉ qua vài bước cấu hình.

## 6. Lộ trình triển khai (Implementation Roadmap)

### Giai đoạn 1: Khởi tạo (Phase 1)
- Setup Next.js 14+, Tailwind CSS, Shadcn UI.
- Định nghĩa TypeScript Interfaces cho Service, Secret và IStorage.

### Giai đoạn 2: Tầng Lưu trữ & Bảo mật (Phase 2)
- Cài đặt `crypto-js` cho logic mã hóa.
- Hoàn thiện `LocalFileAdapter` (cho phép lưu file JSON về máy).

### Giai đoạn 3: Giao diện Quản lý (Phase 3)
- Xây dựng trang Dashboard liệt kê Project và Service.
- Form thêm/sửa Secret với tính năng Masking (ẩn/hiện).

### Giai đoạn 4: Trực quan hóa (Phase 4)
- Tích hợp `React Flow`.
- Render các Service thành các Node và `dependsOn` thành các Edge (mũi tên).

### Giai đoạn 5: Mở rộng Cloud Storage (Phase 5)
- Viết `GitHubAdapter` (Octokit) và `SupabaseAdapter`.
- Thêm trang Settings để cấu hình API Key cho các storage này.
