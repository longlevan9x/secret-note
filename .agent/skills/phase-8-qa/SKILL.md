---
name: Phase 8 - QA & Polish
description: Kiểm tra toàn diện, tối ưu hóa giao diện và xử lý lỗi để chuẩn bị release.
triggers:
  - phase-8
  - qa-polish
---

# Skill: Phase 8 - QA, Polish, and Release Readiness

Mục tiêu: Đảm bảo ứng dụng hoạt động ổn định, mượt mà và không còn các lỗi vặt (UI bugs).

## Instructions for the Assistant

1. **UI States Optimization**:
   - Cải thiện Loading states, Empty states và Error states cho tất cả các màn hình.
   - Thêm hộp thoại xác nhận (Confirmation) cho các hành động xóa quan trọng.
2. **Accessibility & Keyboard**:
   - Đảm bảo có thể điều hướng ứng dụng bằng bàn phím (Tab, Enter, Escape).
   - Kiểm tra các nhãn (labels) cho trình đọc màn hình.
3. **Smoke Testing**:
   - Kiểm tra các luồng chính: Tạo/Xóa Project, Sync Cloud, Khóa/Mở Vault.
   - Kiểm tra khả năng import/export file .env.
4. **Code Cleanup**:
   - Xóa bỏ các đoạn code thừa, các console.log và các UI placeholder.

## Final Verification (MANDATORY)
Trước khi kết thúc Phase, bạn phải chạy:
1. `npm run lint` để kiểm tra lỗi cú pháp.
2. `npm run build` để đảm bảo ứng dụng có thể build thành công.
3. Tạo `walkthrough.md` và đính kèm kết quả build.
