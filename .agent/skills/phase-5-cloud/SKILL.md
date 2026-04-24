---
name: Phase 5 - Cloud Storage Adapters
description: Triển khai GitHub và Supabase Adapters để đồng bộ dữ liệu lên đám mây.
triggers:
  - phase-5
  - setup-cloud
---

# Skill: Phase 5 - Cloud Storage Implementation

Mục tiêu: Mở rộng khả năng lưu trữ của ứng dụng sang GitHub và Supabase.

## Instructions for the Assistant

1. **GitHub Adapter**:
   - Hoàn thiện `GitHubAdapter.ts` sử dụng Octokit.
   - Triển khai logic: Fetch file từ repo -> Decrypt -> Load; Save data -> Encrypt -> Commit to repo.
2. **Supabase Adapter**:
   - Tạo file `SupabaseAdapter.ts`.
   - Sử dụng Supabase Client để lưu trữ dữ liệu JSON vào một bảng chỉ định.
3. **Storage Switcher UI**:
   - Xây dựng trang `Settings` để người dùng có thể cấu hình API Token và chọn Adapter mong muốn.
4. **Encryption Bridge**:
   - Đảm bảo dữ liệu luôn được mã hóa TRƯỚC khi gửi lên bất kỳ cloud provider nào (Zero-Knowledge).

## Final Verification (MANDATORY)
Trước khi kết thúc Phase, bạn phải chạy:
1. `npm run lint` để kiểm tra lỗi cú pháp.
2. `npm run build` để đảm bảo ứng dụng có thể build thành công.
3. Tạo `walkthrough.md` và đính kèm kết quả build.
