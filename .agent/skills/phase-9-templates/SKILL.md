---
name: Phase 9 - Advanced Templates
description: Triển khai hệ thống mẫu dịch vụ (Templates) cho AWS, GCP và tùy chỉnh giao diện.
triggers:
  - phase-9
  - setup-templates
---

# Skill: Phase 9 - Advanced Templates & Ecosystem

Mục tiêu: Đa dạng hóa các loại Service và tối ưu hóa việc nhập liệu bằng Template.

## Instructions for the Assistant

1. **Provider Templates**:
   - Xây dựng thư viện Template tại `src/core/templates`.
   - Tạo các form nhập liệu chuẩn cho: AWS (Access Keys), Supabase, GitHub, OpenAI.
2. **Custom Template Builder**:
   - Cho phép người dùng tự định nghĩa các trường dữ liệu (field) cho loại Service mới.
3. **Rich Documentation**:
   - Tích hợp Markdown editor vào phần "Notes" của Service để lưu trữ tài liệu.
4. **Visual Customization**:
   - Thêm tính năng chọn màu sắc và icon cho các Node trên Graph.

## Final Verification (MANDATORY)
Trước khi kết thúc Phase, bạn phải chạy:
1. `npm run lint` để kiểm tra lỗi cú pháp.
2. `npm run build` để đảm bảo ứng dụng có thể build thành công.
3. Tạo `walkthrough.md` và đính kèm kết quả build.
