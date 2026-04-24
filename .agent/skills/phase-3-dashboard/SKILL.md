---
name: Phase 3 - Dashboard UI
description: Hoàn thiện giao diện Quản lý Project và Service (Thêm/Sửa/Xóa Secret).
triggers:
  - phase-3
  - setup-dashboard
---

# Skill: Phase 3 - Dashboard Implementation

Mục tiêu: Xây dựng hoàn chỉnh giao diện Dashboard để người dùng có thể quản lý các Secret một cách trực quan.

## Instructions for the Assistant

1. **Service Form Enhancements**:
   - Hoàn thiện `ServiceConfigForm.tsx` để hỗ trợ tất cả các loại provider (Vercel, Supabase, Upstash...).
   - Thêm tính năng ẩn/hiện (Masking) cho các giá trị nhạy cảm.
2. **Project Management**:
   - Triển khai giao diện danh sách Project.
   - Cho phép người dùng chuyển đổi giữa các Project khác nhau trong Workspace.
3. **Encryption Bridge**:
   - Đảm bảo dữ liệu luôn được mã hóa TRƯỚC khi gửi lên bất kỳ cloud provider nào (Zero-Knowledge).
4. **Data Persistence**:
   - Đảm bảo mỗi thay đổi trong Dashboard đều được lưu lại thông qua `WorkspaceContext` và Adapter hiện tại.
5. **Visuals**:
   - Sử dụng các hiệu ứng gradient và shadow để làm sơ đồ trông cao cấp (Premium feel).
   - Thêm Toast thông báo khi lưu thành công hoặc có lỗi.
   - Đảm bảo các hiệu ứng hover/transition theo chuẩn `AGENTS.md`.

## Final Verification (MANDATORY)
Trước khi kết thúc Phase, bạn phải chạy:
1. `npm run lint` để kiểm tra lỗi cú pháp.
2. `npm run build` để đảm bảo ứng dụng có thể build thành công.
3. Tạo `walkthrough.md` và đính kèm kết quả build.
