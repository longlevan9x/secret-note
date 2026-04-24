---
name: Phase 4 - Graph Visualization
description: Tích hợp React Flow để hiển thị sơ đồ mối quan hệ giữa các Service.
triggers:
  - phase-4
  - setup-graph
---

# Skill: Phase 4 - Graph Implementation

Mục tiêu: Sử dụng React Flow để trực quan hóa các service và sự phụ thuộc (dependsOn) giữa chúng.

## Instructions for the Assistant

1. **React Flow Setup**:
   - Cấu hình component React Flow trong route `/graph`.
   - Định nghĩa các loại Node tùy chỉnh (Custom Nodes) để hiển thị icon và thông tin service đẹp mắt.
2. **Data Mapping**:
   - Viết logic chuyển đổi từ `WorkspaceData` (services & projects) sang `Nodes` và `Edges` của React Flow.
   - Xử lý các đường nối (edges) dựa trên trường `dependsOn` của service.
3. **Interactivity**:
   - Cho phép người dùng click vào Node để xem chi tiết hoặc sửa service.
   - Triển khai tính năng tự động sắp xếp (Auto-layout) nếu cần thiết.
4. **Visuals**:
   - Sử dụng các hiệu ứng gradient và shadow để làm sơ đồ trông cao cấp (Premium feel).

## Final Verification (MANDATORY)
Trước khi kết thúc Phase, bạn phải chạy:
1. `npm run lint` để kiểm tra lỗi cú pháp.
2. `npm run build` để đảm bảo ứng dụng có thể build thành công.
3. Tạo `walkthrough.md` và đính kèm kết quả build.
