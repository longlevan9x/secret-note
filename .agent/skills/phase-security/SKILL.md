---
name: Phase Security - Zero-Knowledge Flow
description: Triển khai hệ thống Master Password và bảo mật đầu cuối.
triggers:
  - phase-security
  - setup-auth
---

# Skill: Phase Security Implementation

Mục tiêu: Đảm bảo dữ liệu người dùng được bảo vệ tuyệt đối bằng cơ chế Zero-Knowledge.

## Instructions for the Assistant

1. **Master Password System**:
   - Xây dựng giao diện `VaultLock` (Overlay hoặc Page) để yêu cầu người dùng nhập Master Password.
   - Lưu trữ Master Password trong memory (không lưu vào localStorage hay cookie).
2. **Encryption Service**:
   - Hoàn thiện logic trong `crypto.ts` để sử dụng Master Password làm salt/key cho AES-256.
3. **Auto-Lock**:
   - Tự động xóa Master Password khỏi bộ nhớ sau một khoảng thời gian không hoạt động.

## Final Verification (MANDATORY)
Trước khi kết thúc Phase, bạn phải chạy:
1. `npm run lint` để kiểm tra lỗi cú pháp.
2. `npm run build` để đảm bảo ứng dụng có thể build thành công.
3. Tạo `walkthrough.md` và đính kèm kết quả build.
4. **Onboarding Flow**:
   - Giao diện cho người dùng thiết lập Master Password lần đầu tiên và hướng dẫn lưu trữ Recovery Key.
