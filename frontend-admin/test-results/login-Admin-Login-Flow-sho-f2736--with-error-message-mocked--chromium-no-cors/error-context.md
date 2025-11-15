# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - img [ref=e7]
    - heading "BookingTour Admin" [level=1] [ref=e10]
    - paragraph [ref=e11]: Đăng nhập để quản lý tours, bookings, và concierge workflows.
  - generic [ref=e12]:
    - generic [ref=e13]:
      - generic [ref=e14]: Email / Tên đăng nhập
      - textbox "Email / Tên đăng nhập" [ref=e15]:
        - /placeholder: admin@gmail.com
    - generic [ref=e16]:
      - generic [ref=e17]: Mật khẩu
      - textbox "Mật khẩu" [ref=e18]:
        - /placeholder: ••••••••
    - generic [ref=e19]:
      - checkbox "Ghi nhớ đăng nhập" [ref=e20]
      - text: Ghi nhớ đăng nhập
    - button "Đăng nhập" [ref=e21] [cursor=pointer]
  - generic [ref=e22]:
    - paragraph [ref=e23]: "Thông tin đăng nhập mặc định:"
    - paragraph [ref=e24]: "Email: admin@gmail.com"
    - paragraph [ref=e25]: "Password: admin"
    - paragraph [ref=e26]: "💡 Để tạo tài khoản admin, gọi: POST /api/users/init-admin"
```