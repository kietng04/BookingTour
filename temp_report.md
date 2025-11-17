**TRƯỜNG ĐẠI HỌC SÀI GÒN**

**KHOA CÔNG NGHỆ THÔNG TIN**

![](media/image1.jpeg){width="1.9047626859142608in"
height="1.9148884514435696in"}

**BÁO CÁO ĐỒ ÁN**

**HỌC PHẦN: CHUYÊN ĐỀ J2EE**

**ĐỀ TÀI: XÂY DỰNG HỆ THỐNG ĐẶT VÉ TÀU HOẢ**

**GVHD:** ThS. Nguyễn Thanh Phước

**Nhóm sinh viên thực hiện**

1.  3121410139 - Tăng Hồng Nguyên Đán

2.  3121410375 - Lê Quan Phát

3.  3121410422 - Trần Nhật Sinh

**TP. HCM THÁNG 12/2024**

# LỜI CAM ĐOAN

Nhóm em xin cam đoan nội dung trong Đồ án học phần Chuyên Đề J2EE về đề
tài "Xây dựng hệ thống đặt vé tàu hoả" là sản phẩm của nhóm. Những vấn
đề được trình bày trong báo cáo là quá trình học tập, nghiên cứu, làm
việc của nhóm. Tất cả các tài liệu tham khảo đều có xuất xứ rõ ràng và
được trích dẫn hợp pháp.

Nhóm em xin chịu hoàn toàn trách nhiệm cho lời cam đoan của mình.

*TP. Hồ Chí Minh, ngày 14 tháng 12 năm 2024*

Người cam đoan

**Tăng Hồng Nguyên Đán**

**Lê Quan Phát**

**Trần Nhật Sinh**

**\**

# MỤC LỤC

[LỜI CAM ĐOAN [1](#lời-cam-đoan)](#lời-cam-đoan)

[MỤC LỤC [2](#mục-lục)](#mục-lục)

[DANH MỤC HÌNH ẢNH [3](#danh-mục-hình-ảnh)](#danh-mục-hình-ảnh)

[CHƯƠNG 1: CHỨC NĂNG HỆ THỐNG
[5](#chương-1-chức-năng-hệ-thống)](#chương-1-chức-năng-hệ-thống)

[1.1. Chức năng cơ bản [5](#chức-năng-cơ-bản)](#chức-năng-cơ-bản)

[1.2. Chức năng nâng cao [6](#chức-năng-nâng-cao)](#chức-năng-nâng-cao)

[CHƯƠNG 2: THIẾT KẾ HỆ THỐNG
[7](#chương-2-thiết-kế-hệ-thống)](#chương-2-thiết-kế-hệ-thống)

[2.1. Cơ sở dữ liệu [7](#cơ-sở-dữ-liệu)](#cơ-sở-dữ-liệu)

[2.2. Công nghệ sử dụng [8](#công-nghệ-sử-dụng)](#công-nghệ-sử-dụng)

[2.3. Backend [8](#backend)](#backend)

[2.4. Database [9](#database)](#database)

[2.5. Frontend [9](#frontend)](#frontend)

[2.6. Các công nghệ khác [9](#các-công-nghệ-khác)](#các-công-nghệ-khác)

[CHƯƠNG 3: CẤU TRÚC DỰ ÁN
[10](#chương-3-cấu-trúc-dự-án)](#chương-3-cấu-trúc-dự-án)

[3.1. Backend [10](#backend-1)](#backend-1)

[3.2. Frontend [24](#frontend-1)](#frontend-1)

[CHƯƠNG 4: THỰC NGHIỆM VÀ KẾT QUẢ
[28](#chương-4-thực-nghiệm-và-kết-quả)](#chương-4-thực-nghiệm-và-kết-quả)

[4.1. Giao diện khách [28](#giao-diện-khách)](#giao-diện-khách)

[4.2. Giao diện quản trị [39](#giao-diện-quản-trị)](#giao-diện-quản-trị)

[CHƯƠNG 5: KẾT LUẬN [52](#chương-5-kết-luận)](#chương-5-kết-luận)

[5.1. Đóng góp của thành viên
[52](#đóng-góp-của-thành-viên)](#đóng-góp-của-thành-viên)

[5.2. Hướng phát triển [52](#hướng-phát-triển)](#hướng-phát-triển)

# DANH MỤC HÌNH ẢNH

[Hình 1. Cơ sở dữ liệu [7](#_Toc185028653)](#_Toc185028653)

[Hình 2. Tổng quan về công nghệ được sử dụng trong dự án
[8](#_Toc185028654)](#_Toc185028654)

[Hình 3. Cấu trúc tổng quát của dụng backend
[10](#_Toc185028655)](#_Toc185028655)

[Hình 4. Các class trong thư mục configurations
[11](#_Toc185028656)](#_Toc185028656)

[Hình 5. Các class trong thư mục controller
[12](#_Toc185028657)](#_Toc185028657)

[Hình 6. Cấu trúc thư mục DTO [13](#_Toc185028658)](#_Toc185028658)

[Hình 7. Các enums [14](#_Toc185028659)](#_Toc185028659)

[Hình 8. Các class trong thư mục exceptions
[15](#_Toc185028660)](#_Toc185028660)

[Hình 9. Các interface trong thư mục mappers
[16](#_Toc185028661)](#_Toc185028661)

[Hình 10. Các model/entity trong thư mục models
[17](#_Toc185028662)](#_Toc185028662)

[Hình 11. Các interface trong thư mục repositories
[18](#_Toc185028663)](#_Toc185028663)

[Hình 12. Cấu trúc thư mục con, class trong thư mục security
[19](#_Toc185028664)](#_Toc185028664)

[Hình 13. Cấu trúc thư mục services 1
[20](#_Toc185028665)](#_Toc185028665)

[Hình 14. Cấu trúc thư mục services 2
[21](#_Toc185028666)](#_Toc185028666)

[Hình 15. Cấu trúc thư mục strategies
[22](#_Toc185028667)](#_Toc185028667)

[Hình 16. Các class trong thư mục utils
[23](#_Toc185028668)](#_Toc185028668)

[Hình 17. Cấu trúc dự án frontend [24](#_Toc185028669)](#_Toc185028669)

[Hình 18. Cấu trúc thư mục app [25](#_Toc185028670)](#_Toc185028670)

[Hình 19. Cấu trúc các thư mục khác
[26](#_Toc185028671)](#_Toc185028671)

[Hình 20. Cấu trúc thư mục feature [27](#_Toc185028672)](#_Toc185028672)

[Hình 21. Giao diện màn hình đăng nhập
[28](#_Toc185028673)](#_Toc185028673)

[Hình 22. Giao diện màn hình đăng ký
[29](#_Toc185028674)](#_Toc185028674)

[Hình 23. Giao diện xác nhận email thành công
[30](#_Toc185028675)](#_Toc185028675)

[Hình 24. Giao diện màn hình trang chủ
[30](#_Toc185028676)](#_Toc185028676)

[Hình 25. Giao diện màn hình chọn chuyến
[31](#_Toc185028677)](#_Toc185028677)

[Hình 26. Giao diện màn hình chọn chỗ
[32](#_Toc185028678)](#_Toc185028678)

[Hình 27. Giao diện điền thông tin hành khách
[33](#_Toc185028679)](#_Toc185028679)

[Hình 28. Giao diện xác nhận thông tin thanh toán
[34](#_Toc185028680)](#_Toc185028680)

[Hình 29. Giao diện thanh toán Paypal
[35](#_Toc185028681)](#_Toc185028681)

[Hình 30. Giao diện màn hình thanh toán thành công
[35](#_Toc185028682)](#_Toc185028682)

[Hình 31. Giao diện nhận email sau khi thanh toán thành công
[36](#_Toc185028683)](#_Toc185028683)

[Hình 32. Giao diện đặt vé không thành công
[36](#_Toc185028684)](#_Toc185028684)

[Hình 33. Giao diện xem hóa đơn đã đặt
[37](#_Toc185028685)](#_Toc185028685)

[Hình 34. Giao diện tra cứu vé đã đặt
[38](#_Toc185028686)](#_Toc185028686)

[Hình 35. Giao điện trang chủ - Admin
[39](#_Toc185028687)](#_Toc185028687)

[Hình 36. Giao diện tạo lịch trình tàu -- Admin
[40](#_Toc185028688)](#_Toc185028688)

[Hình 37. Giao diện quản lý lịch trình tàu
[40](#_Toc185028689)](#_Toc185028689)

[Hình 38. Giao diện xem chi tiết lịch trình tàu
[41](#_Toc185028690)](#_Toc185028690)

[Hình 39. Giao diện quản lý hóa đơn
[42](#_Toc185028691)](#_Toc185028691)

[Hình 40. Giao diện quản lý hành khách đặt vé
[43](#_Toc185028692)](#_Toc185028692)

[Hình 41. Giao diện quản lý khách hàng
[43](#_Toc185028693)](#_Toc185028693)

[Hình 42. Giao diện quản lý loại ghế ngồi
[44](#_Toc185028694)](#_Toc185028694)

[Hình 43. Giao diện tạo loại ghế ngồi mới
[45](#_Toc185028695)](#_Toc185028695)

[Hình 44. Giao diện quản lý toa tàu
[45](#_Toc185028696)](#_Toc185028696)

[Hình 45. Giao diện thêm khung toa tàu mới
[46](#_Toc185028697)](#_Toc185028697)

[Hình 46. Giao diện kéo thả sắp xếp toa tàu
[47](#_Toc185028698)](#_Toc185028698)

[Hình 47. Giao diện quản lý tàu hỏa
[48](#_Toc185028699)](#_Toc185028699)

[Hình 48. Giao diện thêm tàu hỏa mới
[48](#_Toc185028700)](#_Toc185028700)

[Hình 49. Giao diện kéo thả sắp xếp toa tàu hỏa
[49](#_Toc185028701)](#_Toc185028701)

[Hình 50. Giao diện thiết lập lịch trình tàu hỏa
[50](#_Toc185028702)](#_Toc185028702)

[Hình 51. Giao diện báo cáo và thống kê
[50](#_Toc185028703)](#_Toc185028703)

[Hình 52. Giao diện cài đặt hệ thống - quản lý đối tượng
[51](#_Toc185028704)](#_Toc185028704)

# CHƯƠNG 1: CHỨC NĂNG HỆ THỐNG

## Chức năng cơ bản

> **Đối với khách hàng có thể sử dụng các chức năng:**

- Xem trang chủ và các thông tin về hệ thống đặt vé tàu hoả.

- Đăng ký / Đăng nhập vào hệ thống bằng nhiều tuỳ chọn

  - Tài khoản hệ thống

  - Tài khoản Facebook

  - Tài khoản Google

- Đăng xuất.

- Tìm kiếm và xem danh sách chuyến tàu (lịch trình, giá vé, thông tin
  tàu,...).

- Xem chi tiết tuyến tàu.

- Đặt vé một chiều và khứ hồi.

- Khoá ghế, giữ chỗ khi đặt vé (mặc định 10 phút, sau 10 phút thì ghế sẽ
  được giải phóng cho người dùng khác)

- Thanh toán sau khi đặt vé (VNPAY, PayPal).

- Xem, tìm kiếm vé tàu đã mua.

- Xem, tìm kiếm hoá đơn của bản thân trong hệ thống.

**Đối với người quản trị:**

- Đăng nhập với tài khoản được cấp quyền quản trị.

- Đăng xuất.

- Quản lý tàu hoả.

  - Quản lý loại ghế.

  - Quản lý loại toa tàu.

  - Quản lý từng tàu (toa tàu, ghế ngồi, giá ghế).

  - Quản lý giờ tàu.

- Quản lý lịch trình.

  - Tạo lịch trình.

  - Xem lịch trình.

- Quản lý khách hàng.

- Quản lý nhân viên.

- Quản lý đặt vé.

  - Quản lý hành khách .

  - Quản lý hoá đơn.

- Báo cáo, thống kê.

  - Thống kê số lượng vé.

  - Thống kê doanh thu.

- Quản lý đối tượng.

## Chức năng nâng cao

- Kéo thả tạo tàu, toa tàu, danh sách sách ghế

- Đăng nhập Google, Facebook

- Cập nhật realtime khi người dùng chọn ghế, mua vé

- Khoá ghế khi người dùng chọn ghế

- Thanh toán VNPAY, PayPal

# CHƯƠNG 2: THIẾT KẾ HỆ THỐNG

1.  

2.  

## Cơ sở dữ liệu

![](media/image2.png){width="6.270138888888889in"
height="7.133333333333334in"}

[]{#_Toc185028653 .anchor}Hình 1. Cơ sở dữ liệu

1.  

    1.  

## Công nghệ sử dụng

![[]{#_Toc185028654 .anchor}Hình 2. Tổng quan về công nghệ được sử dụng
trong dự án](media/image3.png){width="5.976953193350831in"
height="3.362159886264217in"}

### **Backend**

- Spring Boot: Là nền tảng cốt lõi, cung cấp cấu hình tự động, tích hợp
  các công nghệ khác một cách dễ dàng.

- Spring Security: Sử dụng kết hợp với JWT để xác thực và phân quyền
  người dùng.

- Spring Mail: Sử dụng để gửi email thực, danh sách vé,...

- Thymeleaf: Kết hợp với Spring Mail để xây dựng các template email

- Websocket: Cung cấp tính năng thời gian thực, đảm bảo rằng thông tin
  luôn được cập nhật cho người dùng. Khi một người đặt vé, thông tin về
  ghế sẽ được cập nhật ngay lập tức cho các người dùng khác, tránh tình
  trạng trùng lặp. Redis được sử dụng để lưu trữ thông tin tạm thời về
  các ghế đã bị khóa, giúp quản lý hiệu quả quá trình đặt vé.

- RabbitMQ: Được sử dụng để làm message broker khi gửi mail xác nhận tài
  khoản, xác nhận mua vé, danh sách vé sau khi thanh toán thành công.

- Redis: Được sử dụng để caching các dữ liệu ít thay đổi như ga tàu,
  tỉnh, thông tin các chuyến đi,...

- Docker: Sử dụng để container hoá ứng dụng, giúp dễ dàng triển khai và
  quản lý ứng dụng trên nhiều môi trường khác nhau.

### **Database**

- MySQL

### **Frontend**

- ReactJs: là Framework Javascript, giúp xây dựng ứng dụng nhanh chóng
  và hiệu quả.

- Ant Design: Thư viện component được thiết kế sẵn, hỗ trợ xây dựng
  nhanh ứng dụng.

- Tailwind: Sử dụng để style CSS cho các component.

- React Query: Giúp việc fetch dữ liệu lên server hiệu quả, bao gồm
  caching, refretching, và error handling.

- Zustand: Là một state management library nhẹ nhàng và dễ sử dụng, giúp
  quản lý global state của ứng dụng.

### **Các công nghệ khác**

- Tích hợp xác thực người dùng với Facebook, Google.

- Tích hợp thanh toán online với VnPay, PayPal.

# CHƯƠNG 3: CẤU TRÚC DỰ ÁN

1.  

2.  

3.  

## Backend

![[]{#_Toc185028655 .anchor}Hình 3. Cấu trúc tổng quát của dụng
backend](media/image4.png){width="3.819070428696413in"
height="7.805749125109362in"}

![[]{#_Toc185028656 .anchor}Hình 4. Các class trong thư mục
configurations](media/image5.png){width="4.750662729658792in"
height="8.51160433070866in"}

![[]{#_Toc185028657 .anchor}Hình 5. Các class trong thư mục
controller](media/image6.png){width="4.969443350831146in"
height="9.355472440944881in"}

![[]{#_Toc185028658 .anchor}Hình 6. Cấu trúc thư mục
DTO](media/image7.png){width="4.417283464566929in"
height="9.261709317585302in"}

![[]{#_Toc185028659 .anchor}Hình 7. Các
enums](media/image8.png){width="4.865262467191601in"
height="8.209479440069991in"}

![[]{#_Toc185028660 .anchor}Hình 8. Các class trong thư mục
exceptions](media/image9.png){width="4.792335958005249in"
height="8.43867782152231in"}

![[]{#_Toc185028661 .anchor}Hình 9. Các interface trong thư mục
mappers](media/image10.png){width="4.865262467191601in"
height="9.345054680664918in"}

![[]{#_Toc185028662 .anchor}Hình 10. Các model/entity trong thư mục
models](media/image11.png){width="4.865262467191601in"
height="9.376307961504812in"}

![[]{#_Toc185028663 .anchor}Hình 11. Các interface trong thư mục
repositories](media/image12.png){width="4.834008092738408in"
height="9.18878280839895in"}

![[]{#_Toc185028664 .anchor}Hình 12. Cấu trúc thư mục con, class trong
thư mục security](media/image13.png){width="4.8027537182852145in"
height="9.334635826771654in"}

![[]{#_Toc185028665 .anchor}Hình 13. Cấu trúc thư mục services
1](media/image14.png){width="4.823590332458442in"
height="9.30338145231846in"}

![[]{#_Toc185028666 .anchor}Hình 14. Cấu trúc thư mục services
2](media/image15.png){width="4.813171478565179in"
height="9.313800306211723in"}

![[]{#_Toc185028667 .anchor}Hình 15. Cấu trúc thư mục
strategies](media/image16.png){width="4.691150481189851in"
height="9.337727471566055in"}

![[]{#_Toc185028668 .anchor}Hình 16. Các class trong thư mục
utils](media/image17.png){width="4.427701224846894in"
height="7.323939195100612in"}

## Frontend

![](media/image18.png){width="3.3650524934383204in"
height="8.667876202974629in"}

![[]{#_Toc185028669 .anchor}Hình 17. Cấu trúc dự án
frontend](media/image19.png){width="3.43798009623797in"
height="8.980419947506562in"}

![[]{#_Toc185028670 .anchor}Hình 18. Cấu trúc thư mục
app](media/image20.png){width="3.6463418635170606in"
height="8.970002187226596in"}

![[]{#_Toc185028671 .anchor}Hình 19. Cấu trúc các thư mục
khác](media/image21.png){width="3.6775962379702536in"
height="8.90749343832021in"}

[]{#_Toc185028672 .anchor}Hình 20. Cấu trúc thư mục feature

# CHƯƠNG 4: THỰC NGHIỆM VÀ KẾT QUẢ

1.  

2.  

3.  

4.  

## Giao diện khách

![[]{#_Toc185028673 .anchor}Hình 21. Giao diện màn hình đăng
nhập](media/image22.png){width="3.303086176727909in"
height="4.221559492563429in"}

- Cho phép người dùng đăng nhập theo phương pháp truyền thống qua
  email + mật khẩu.

- Tích hợp xác thực OAuth, cho phép đăng nhập bằng Google và Facebook.

<figure>
<img src="media/image23.png" style="width:3.84902in;height:4.41363in"
alt="A screenshot of a login form Description automatically generated" />
<figcaption><p><span id="_Toc185028674" class="anchor"></span>Hình 22.
Giao diện màn hình đăng ký</p></figcaption>
</figure>

- Cho phép người dùng đăng ký tài khoản với các thông tin cơ bản như họ
  tên, email, mật khẩu.

- Sau khi đăng kí tài khoản, hệ thống sẽ gửi liên kết xác nhận đến email
  của người dùng.

![[]{#_Toc185028675 .anchor}Hình 23. Giao diện xác nhận email thành
công](media/image24.png){width="3.4496380139982503in"
height="3.426010498687664in"}

- Sau khi nhấn vào đường dẫn liên kết xác thực email, người dùng sẽ được
  chuyển đến giao diện xác nhận tài khoản thành công và có thể đăng nhập
  vào hệ thống.

<figure>
<img src="media/image25.png" style="width:6.5in;height:4.26736in"
alt="A screenshot of a website Description automatically generated" />
<figcaption><p><span id="_Toc185028676" class="anchor"></span>Hình 24.
Giao diện màn hình trang chủ</p></figcaption>
</figure>

- Màn hình trang chủ cho phép tìm kiếm chuyến tàu một cách linh hoạt, dễ
  dàng sử dụng.

- Sau khi điền các thông tin cần tìm, nhấn nút tìm chuyến tìm để tiến
  đến giao diện chọn chuyến tàu.

<figure>
<img src="media/image26.png" style="width:6.29593in;height:4.19258in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028677" class="anchor"></span>Hình 25.
Giao diện màn hình chọn chuyến</p></figcaption>
</figure>

- Màn hình chọn chuyến cho hiển thị các chuyến tàu chạy dựa trên thông
  tin tìm kiếm mà người dùng đã chọn.

![[]{#_Toc185028678 .anchor}Hình 26. Giao diện màn hình chọn
chỗ](media/image27.png){width="6.5in" height="4.174305555555556in"}

- Giao diện màn hình chọn chỗ, hiển thị toa tàu một cách trực quan, cho
  phép chọn ghế dễ dàng.

- Tích hợp websocket, cho phép người dùng chọn vé, lock vé theo thời
  gian thực.

<figure>
<img src="media/image28.png" style="width:6.5in;height:4.21736in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028679" class="anchor"></span>Hình 27.
Giao diện điền thông tin hành khách</p></figcaption>
</figure>

- Hiển thị thông tin các vé dưới dạng hàng, cho phép người dùng nhập các
  thông tin hành khách một cách dễ dàng.

- Cho phép chọn loại đối tượng với các mức giảm giá khác nhau bao gồm:

<!-- -->

- Người Việt Nam:

> \+ Trẻ em: giảm giá **5%** (Trẻ em dưới 6 tuổi không cần phải mua vé,
> trẻ em từ 6 tuổi đến 10 tuổi được mua vé trẻ em)
>
> \+ Người lớn: không có giảm giá
>
> \+ Người cao tuổi: giảm giá **5%** (Người cao tuổi (người từ 60 tuổi
> trở lên) được hưởng chính sách giảm giá theo quy định của Tổng công ty
> Đường sắt Việt Nam.)
>
> \+ Đoàn viên công đoàn: giảm giá **5%** (Đoàn viên công đoàn (phải có
> Thẻ Đoàn viên hợp lệ mang kèm khi đi tàu) được hưởng chính sách ưu đãi
> giảm giá theo quy định của Tổng công ty Đường sắt Việt Nam)

- Người nước ngoài:

> \+ Trẻ em: giảm giá **5%** (Trẻ em dưới 6 tuổi không cần phải mua vé,
> trẻ em từ 6 tuổi đến 10 tuổi được mua vé trẻ em)

\+ Người lớn: không có giảm giá.

<figure>
<img src="media/image29.png" style="width:6.5in;height:4.47361in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028680" class="anchor"></span>Hình 28.
Giao diện xác nhận thông tin thanh toán</p></figcaption>
</figure>

- Sau khi đã điền thông tin hành khách và thông tin người đặt vé, tiến
  đến màn hình thanh toán để xác nhận lại thông tin và chọn phương thức
  thanh toán (hỗ trợ VNPay và Paypal)

- Chọn phương thức thanh toán và chọn vào ô xác nhận các điều khoản và
  nhấn nút xác nhận đặt vé

<figure>
<img src="media/image30.png" style="width:6.5in;height:3.92778in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028681" class="anchor"></span>Hình 29.
Giao diện thanh toán Paypal</p></figcaption>
</figure>

<figure>
<img src="media/image31.png" style="width:6.5in;height:4.17639in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028682" class="anchor"></span>Hình 30.
Giao diện màn hình thanh toán thành công</p></figcaption>
</figure>

- Sau khi đã thanh toán thành công, người dùng được chuyển đến giao diện
  hiển thị thông tin đơn hành đã đặt cùng với thông tin chi tiết vé

![[]{#_Toc185028683 .anchor}Hình 31. Giao diện nhận email sau khi thanh
toán thành công](media/image32.png){width="6.5in"
height="3.0145833333333334in"}

- Sau khi đặt hóa đơn thành công, email về thông tin hóa đơn sẽ được gửi
  đến email của người dùng (cho phép người dùng không đăng nhập có thể
  kiểm tra lưu trữ đơn hành của họ)

![[]{#_Toc185028684 .anchor}Hình 32. Giao diện đặt vé không thành
công](media/image33.png){width="6.5in" height="3.082638888888889in"}

- Nếu quá trình thanh toán không thành công (không đủ tiền trong tài
  khoản, vấn đề về mạng, thanh toán bị hủy,..), người dùng sẽ được trả
  về giao diện đặt vé không thành công để thông báo cho người dùng

<figure>
<img src="media/image34.png" style="width:6.5in;height:4.28056in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028685" class="anchor"></span>Hình 33.
Giao diện xem hóa đơn đã đặt</p></figcaption>
</figure>

- Giao diện hiển thị các hóa đơn người dùng đã đặt, bao gồm các thông
  tin cơ bản như thông tin khách hàng, phương thức thanh toán, trạng
  thái đơn hành, tổng giá và ngày đặt hóa đơn

<figure>
<img src="media/image35.png" style="width:6.5in;height:4.81736in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028686" class="anchor"></span>Hình 34.
Giao diện tra cứu vé đã đặt</p></figcaption>
</figure>

- Giao diện hiển thị các vé người dùng dã đặt với các thông tin cơ bản
  như ga đi, ga đến, ngày đi, ngày đến, mã vé, mác tàu, tên hành khách,
  giá vé.

- Hiển thị mã QR cho phép quét mã nhanh để lên tàu.

1.  

2.  

3.  

4.  1.  

## Giao diện quản trị

![[]{#_Toc185028687 .anchor}Hình 35. Giao điện trang chủ -
Admin](media/image36.png){width="6.5in" height="3.279166666666667in"}

- Giao diện hiển thị một số biểu đồ thể hiện doanh thu và tình hình kinh
  doanh cơ bản trong tuần.

- Biểu đồ tròn góc trên trái thể hiện số hóa đơn được đặt bởi khách hàng
  có tài khoản và khách hàng vãn lai (không có tài khoản)

- Biểu đồ cột góc trên phải thể hiện tổng doanh thu theo từng ngày trong
  tuần

- Biểu đồ cột bên dưới thể hiện tổng số vé và tổng doan thu theo từng
  tàu trong tuần (cột xanh dương thể hiện số vé, cột xanh lá thể hiện
  doanh thu)

<figure>
<img src="media/image37.png" style="width:6.5in;height:3.25139in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028688" class="anchor"></span>Hình 36.
Giao diện tạo lịch trình tàu – Admin</p></figcaption>
</figure>

- Giao diện cho phép tạo nhanh lịch trình tàu trong một khoảng thời gian
  và được ràng buộc theo thứ, ví dụ có các tàu chỉ chạy vào thứ bảy, chủ
  nhật... Khi tạo, nếu tàu đã có lịch chạy trùng với khoảng thời gian
  được chọn thì hệ thống sẽ cảnh báo lịch bị trùng và không cho phép
  tạo.

<figure>
<img src="media/image38.png" style="width:6.5in;height:3.26736in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028689" class="anchor"></span>Hình 37.
Giao diện quản lý lịch trình tàu</p></figcaption>
</figure>

- Giao diện hiển thị lịch tàu, bao gồm số chuyến chạy trong ngày, nếu
  muốn xem chi tiết các chuyến đi thì nhấn vào ngày đó.

<figure>
<img src="media/image39.png" style="width:6.5in;height:3.26875in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028690" class="anchor"></span>Hình 38.
Giao diện xem chi tiết lịch trình tàu</p></figcaption>
</figure>

- Giao diện hiển thị danh sách những chuyến tàu trong ngày, có thể thêm,
  xoá chuyến tàu khác trong trường hợp đột ngột có lượng khách đột biến,
  sự cố xảy ra,... Tại giao diện này cũng có các button để điều hướng
  sang các trang khác để xem chi tiết lịch trình của một chuyến, danh
  sách hành khách

<figure>
<img src="media/image40.png" style="width:6.5in;height:3.27569in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028691" class="anchor"></span>Hình 39.
Giao diện quản lý hóa đơn</p></figcaption>
</figure>

- Giao diện hiển thị danh sách các hóa đơn với các thông tin cơ bản như
  thông tin khách hàng, phương thức thanh toán, tổng giá của hóa đơn,
  trạng thái hóa đơn, ngày đặt hóa đơn

- Mỗi hóa đơn hiển thị thông tin chi tiết các vé đã đặt bao gồm: thông
  tin hành khách, tuyến đường, chỗ ngồi, giá vé

- Cho phép người dùng tìm kiếm hóa đơn theo tên, email, SDT, định danh
  của hành khách

- Cho phép người dùng lọc theo phương thức thanh toán, trạng thái hóa
  đơn

- Cho phép người dùng lọc theo khoảng thời gian (trong tuần, trong tháng
  hoặc tùy chỉnh thời gian)

![[]{#_Toc185028692 .anchor}Hình 40. Giao diện quản lý hành khách đặt
vé](media/image41.png){width="6.5in" height="3.26875in"}

- Cho phép quản trị viên lọc danh sách hành khách theo nhiều tiêu chí,
  bao gồm tìm kiếm theo mã vé, tên hành khách, chuyến tàu, ngày đi, ngày
  đến, đối tượng, toa tàu, ga đi, ga đến. Tại giao diện này hỗ trợ phân
  trang để tránh hiển thị quá nhiều dữ liệu.

<figure>
<img src="media/image42.png" style="width:6.5in;height:3.25694in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028693" class="anchor"></span>Hình 41.
Giao diện quản lý khách hàng</p></figcaption>
</figure>

- Cho phép quản trị viên quản lý thông tin khách hàng, bao gồm tên, giới
  tính, số điện thoại, địa chỉ

![[]{#_Toc185028694 .anchor}Hình 42. Giao diện quản lý loại ghế
ngồi](media/image43.png){width="6.5in" height="3.2736111111111112in"}

- Hiển thị danh sách loại ghế ngồi với các thông tin cơ bản bao gồm: tên
  ghế, mã ghế, giá ghế, mô tả, trạng thái.

- Cho phép quản trị viên tìm kiếm, tạo mới, chỉnh sửa, xóa loại ghế.

<figure>
<img src="media/image44.png" style="width:6.5in;height:3.28611in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028695" class="anchor"></span>Hình 43.
Giao diện tạo loại ghế ngồi mới</p></figcaption>
</figure>

- Cho phép quản trị viên nhập các thông tin tên loại ghế, mô tả, mã ghế,
  giá để tạo một loại ghế mới

<figure>
<img src="media/image45.png" style="width:6.5in;height:3.24792in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028696" class="anchor"></span>Hình 44.
Giao diện quản lý toa tàu</p></figcaption>
</figure>

- Hiển thị danh sách toa tàu với các thông tin cơ bản như: tên toa tàu,
  kết cấu toa, số chỗ, trạng thái.

![[]{#_Toc185028697 .anchor}Hình 45. Giao diện thêm khung toa tàu
mới](media/image46.png){width="6.5in" height="3.2534722222222223in"}

- Cho phép quản trị viên nhập các thông tin tên toa tàu, số tầng, số
  hàng ghế, chọn các loại ghế ngồi để tạo một cấu trúc toa tàu mới

- Cho phép quản trị viên kéo thả các ghế ngồi để tạo khung toa tàu theo
  ý muốn

<figure>
<img src="media/image47.png" style="width:4.83622in;height:5.29198in"
alt="A screenshot of a cell phone Description automatically generated" />
<figcaption><p><span id="_Toc185028698" class="anchor"></span>Hình 46.
Giao diện kéo thả sắp xếp toa tàu</p></figcaption>
</figure>

<figure>
<img src="media/image48.png" style="width:6.5in;height:3.25833in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028699" class="anchor"></span>Hình 47.
Giao diện quản lý tàu hỏa</p></figcaption>
</figure>

- Hiển thị danh sách tàu hỏa với các thông tin cơ bản như tên tàu hỏa,
  số toa tàu, số chỗ, tuyến đường tàu chạy, trạng thái tàu

<figure>
<img src="media/image49.png" style="width:6.5in;height:3.27917in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028700" class="anchor"></span>Hình 48.
Giao diện thêm tàu hỏa mới</p></figcaption>
</figure>

- Cho phép quản trị viên nhập các thông tin tên tàu, chọn tuyến đường,
  chọn các loại toa để tạo tàu mới

- Cho phép quản trị viên kéo thả các toa tàu để tạo nên cấu trúc tàu hỏa
  theo ý muốn

<figure>
<img src="media/image50.png" style="width:4.26543in;height:5.66536in"
alt="A screenshot of a phone Description automatically generated" />
<figcaption><p><span id="_Toc185028701" class="anchor"></span>Hình 49.
Giao diện kéo thả sắp xếp toa tàu hỏa</p></figcaption>
</figure>

![[]{#_Toc185028702 .anchor}Hình 50. Giao diện thiết lập lịch trình tàu
hỏa](media/image51.png){width="6.5in" height="3.2930555555555556in"}

- Giao diện hiển thị thông tin cơ bản của tàu và thời gian đi, thời gian
  đến, cự ly từng ga trong suốt chặng đường.

![[]{#_Toc185028703 .anchor}Hình 51. Giao diện báo cáo và thống
kê](media/image52.png){width="6.5in" height="3.2895833333333333in"}

- Giao diện thống kê hiển thị các biểu đồ thống kê vé và doanh thu của
  hệ thống

- Biểu đồ cột góc trên trái hiển thị tổng vé đã bán theo từng ngày

- Biểu dồ cột góc trên phải hiển thị tổng doanh thu theo từng ngày

- Biểu đồ cột bên dưới hiển thị tổng vé đã bán và tổng doanh thu theo
  từng tàu (cột xanh dương thể hiện tổng vé đã bán, cột xanh lá thể hiện
  tổng doanh thu)

- Cho phép quản trị viên lọc theo khoảng thời gian để thống kê (trong
  tuần, trong tháng hoặc tùy chỉnh)

<figure>
<img src="media/image53.png" style="width:6.5in;height:3.24306in"
alt="A screenshot of a computer Description automatically generated" />
<figcaption><p><span id="_Toc185028704" class="anchor"></span>Hình 52.
Giao diện cài đặt hệ thống - quản lý đối tượng</p></figcaption>
</figure>

- Cho phép quản trị viên quản lý các đối tượng có trong hệ thống, quản
  lý mức giảm giá cho từng đối tượng

# CHƯƠNG 5: KẾT LUẬN

5.  

## Đóng góp của thành viên

  --------------------------------------------------------------------------------
   **STT**  **Mã sinh viên**      **Họ và tên**                  **Đánh giá (%)**
  --------- --------------------- ------------------------------ -----------------
      1     3121410139            Tăng Hồng Nguyên Đán           30%

      2     [3121410375]{.mark}   Lê Quan Phát                   35%

      3     3121410422            Trần Nhật Sinh                 35%
  --------------------------------------------------------------------------------

## Hướng phát triển

Do hạn chế về thời gian nghiên cứu và nguồn lực của nhóm, đề tài "Xây
dựng hệ thống đặt vé tàu hỏa" hiện vẫn còn một số điểm cần cải thiện:

**Hạn chế:**

Chức năng chưa hoàn thiện:

- Chưa tích hợp quản lý các loại chi phí phát sinh như phí dịch vụ,
  thuế, hoặc các phụ phí khác.

- Chưa phát triển tính năng hỗ trợ thẻ tích điểm và chương trình khuyến
  mãi hiệu quả.

- Chưa có chức năng tải lên tập tin và hình ảnh phục vụ quản lý thông
  tin.

Dữ liệu chưa thực tế: Hệ thống dữ liệu hiện tại chỉ mang tính mô phỏng,
chưa phản ánh đầy đủ và chính xác so với tình hình thực tế.

**Hướng hoàn thiện**

Để nâng cao chất lượng và đáp ứng tốt hơn nhu cầu của người dùng, nhóm
sẽ tiếp tục cải thiện và bổ sung các chức năng còn thiếu, đồng thời tập
trung phát triển thêm các tính năng như:

- Ứng dụng di động: Phát triển phiên bản dành cho điện thoại nhằm nâng
  cao tính linh hoạt và tiện dụng cho người dùng.

- Công cụ tìm kiếm nâng cao: Bổ sung các tính năng tìm kiếm thông minh,
  giúp người dùng dễ dàng truy xuất thông tin cần thiết.

- Tối ưu hiệu suất: Tinh chỉnh mã nguồn và tối ưu hệ thống để giảm tải
  thời gian phản hồi, tránh tình trạng quá tải khi có nhiều người dùng
  cùng truy cập.

- Tăng cường bảo mật: Nâng cấp các biện pháp bảo mật, ngăn chặn tối đa
  nguy cơ xâm nhập và bảo vệ thông tin nhạy cảm của người dùng.

- Cập nhật dữ liệu: Thực hiện khảo sát thực tế và cập nhật thông tin hệ
  thống để phản ánh đúng tình trạng sử dụng, mang lại trải nghiệm chính
  xác hơn.
