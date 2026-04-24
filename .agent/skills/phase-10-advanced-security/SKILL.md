---
name: Phase 10 - Advanced Security
description: Quản lý đa kho lưu trữ (Multi-Vault), chế độ tự hủy và xuất dữ liệu an toàn.
triggers:
  - phase-10
  - harden-security
---

# Skill: Phase 10 - Advanced Security & Resilience

Mục tiêu: Nâng cấp bảo mật lên mức chuyên nghiệp và đảm bảo tính linh hoạt của dữ liệu.

## Instructions for the Assistant

1. **Multi-Vault Support**:
   - Chỉnh sửa `StorageConfig` để hỗ trợ nhiều profile (vault) khác nhau.
   - Xây dựng giao diện chuyển đổi Vault (Switch Vault).
2. **Self-Destruct Mode**:
   - Triển khai bộ đếm số lần nhập sai mật khẩu.
   - Xóa sạch dữ liệu cục bộ (và cloud nếu được cấu hình) sau N lần sai.
3. **Data Portability**:
   - Phát triển tính năng xuất dữ liệu sang CSV/JSON tương thích với Bitwarden/1Password.
4. **Privacy Shield**:
   - Tự động làm mờ (Blur) giao diện khi tab trình duyệt không được active.

## Final Verification (MANDATORY)
Trước khi kết thúc Phase, bạn phải chạy:
1. `npm run lint` để kiểm tra lỗi cú pháp.
2. `npm run build` để đảm bảo ứng dụng có thể build thành công.
3. Tạo `walkthrough.md` và đính kèm kết quả build.
