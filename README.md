# MXH V1.1 - Nền tảng Mạng xã hội & Chat thông minh

Chào mừng bạn đến với dự án MXH V1.1. Đây là một ứng dụng mạng xã hội hiện đại được tích hợp hệ thống chat đa tính năng, tập trung vào trải nghiệm người dùng và cộng tác nhóm.

## 🚀 Tính năng nổi bật

### 💬 Hệ thống Chat cao cấp
- **Đa hội thoại**: Chuyển đổi linh hoạt giữa các nhóm chat (Fastdo AI, Team Design) và tin nhắn cá nhân (PC).
- **Luồng thảo luận (Threads)**: Cho phép thảo luận chuyên sâu về một tin nhắn cụ thể mà không làm trôi tin nhắn chính.
- **Tương tác tin nhắn**:
    - Thả cảm xúc (Reactions) đa dạng.
    - Trả lời trích dẫn (Reply/Quote).
    - Tích hợp Emoji Picker.
- **Công cụ cộng tác**:
    - Tạo bình chọn (Poll) trực quan.
    - Tích hợp phím tắt nhanh cho Action AI, Giao việc, Cuộc họp và Đính kèm file.
- **Giao diện thông minh (Smart UI)**: 
    - Tự động thay đổi bố cục và chức năng dựa trên loại hội thoại (Nhóm vs Cá nhân).
    - Sidebar chi tiết hiển thị thông tin thành viên, tệp đính kèm và cài đặt bảo mật.

### 📱 Trải nghiệm di động
- Tương thích hoàn toàn với các thiết bị di động.
- Các dialog và menu được tối ưu hóa cho tương tác chạm.

## 🛠 Công nghệ sử dụng

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Context API

## 🏃‍♂️ Hướng dẫn chạy thử

### 1. Cài đặt môi trường
Đảm bảo bạn đã cài đặt **Node.js** (Phiên bản v18 trở lên).

### 2. Cài đặt dependencies
Mở terminal tại thư mục dự án và chạy:
```bash
npm install
# hoặc nếu dùng pnpm
pnpm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Sau đó truy cập: [http://localhost:3000](http://localhost:3000)

### 4. Build cho Production
```bash
npm run build
npm run start
```

## 📁 Cấu trúc thư mục chính
- `/app`: Các route và layout của ứng dụng (Next.js App Router).
- `/components/chat`: Toàn bộ các component liên quan đến hệ thống chat.
- `/lib`: Các hàm tiện ích, cấu hình và store.
- `/public`: Chứa các tài nguyên tĩnh như hình ảnh, icons.

---
Được phát triển bởi **Cuong-Smith**.
