---
name: Phase 12 - Health Check
description: Kiểm tra độ mạnh mật khẩu, phát hiện trùng lặp và theo dõi thời gian hết hạn.
triggers:
  - phase-12
  - health-check
---

# Skill: Phase 12 - Health Check & Insights

Mục tiêu: Cung cấp thông tin chi tiết về độ an toàn và "sức khỏe" của các bí mật trong vault.

## Instructions for the Assistant

1. **Strength Analysis**:
   - Tích hợp logic đánh giá độ mạnh của mật khẩu (Password Strength).
   - Hiển thị thanh trạng thái bảo mật trong màn hình chi tiết Service.
2. **Duplicate Detection**:
   - Quét và cảnh báo người dùng nếu có các Secret bị dùng lặp lại giữa các service.
3. **Expiration Tracking**:
   - Thêm trường ngày hết hạn cho Secret và gửi thông báo khi sắp đến hạn.
4. **Insights Dashboard**:
   - Xây dựng màn hình tổng quan về điểm số bảo mật (Security Score) của toàn bộ Workspace.

## Final Verification (MANDATORY)
Trước khi kết thúc Phase, bạn phải chạy:
1. `npm run lint` để kiểm tra lỗi cú pháp.
2. `npm run build` để đảm bảo ứng dụng có thể build thành công.
3. Tạo `walkthrough.md` và đính kèm kết quả build.
