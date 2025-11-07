export const tours = [
  {
    id: 'ha-giang-vong-cung',
    name: 'Hà Giang - Vòng Cung Đá Đồng Văn',
    slug: 'ha-giang-vong-cung',
    destination: 'Hà Giang, Việt Nam',
    duration: 4,
    groupSize: '8-12 khách',
    difficulty: 'adventure',
    difficultyLabel: 'Phiêu lưu mạo hiểm',
    price: 8290000,
    reviewsCount: 186,
    thumbnail: 'https://images.unsplash.com/photo-1517821365732-61113c912358?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494475673543-6a6a27143fc8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Đông Bắc', 'Phong cảnh', 'Bản làng'],
    highlights: [
      'Chinh phục đèo Mã Pí Lèng và ngắm sông Nho Quế từ du thuyền',
      'Trải nghiệm chợ phiên vùng cao và văn hoá đồng bào H\'Mông',
      'Check-in cột cờ Lũng Cú - điểm cực Bắc của Tổ quốc'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Hà Nội - Hà Giang - Quản Bạ',
        items: [
          'Khởi hành bằng xe Limousine cao cấp từ Hà Nội',
          'Dừng chân ngắm Núi Đôi Quản Bạ và nhà trình tường người Dao',
          'Đêm lưu trú tại homestay bản Nặm Đăm'
        ]
      },
      {
        day: 2,
        title: 'Quản Bạ - Đồng Văn',
        items: [
          'Thăm cổng trời Cán Tỷ và làng dệt lanh Lũng Tám',
          'Tham quan dinh thự họ Vương và phố cổ Đồng Văn',
          'Thưởng thức đặc sản thắng cố, bánh cuốn trứng'
        ]
      },
      {
        day: 3,
        title: 'Đèo Mã Pí Lèng - Sông Nho Quế',
        items: [
          'Đi thuyền khám phá hẻm Tu Sản',
          'Check-in Skywalk Mã Pí Lèng Panorama',
          'Trải nghiệm buổi tối lửa trại cùng người bản địa'
        ]
      },
      {
        day: 4,
        title: 'Đồng Văn - Lũng Cú - Hà Nội',
        items: [
          'Leo 389 bậc đá lên cột cờ Lũng Cú',
          'Tham quan làng Lô Lô Chải',
          'Kết thúc hành trình, trở lại Hà Nội'
        ]
      }
    ],
    description:
      'Hành trình 4 ngày 3 đêm đưa bạn khám phá cung đường Hạnh Phúc hùng vĩ, hòa mình vào đời sống miền đá Hà Giang cùng những trải nghiệm văn hoá bản địa khó quên.',
    includes: [
      'Xe Limousine Hà Nội - Hà Giang khứ hồi',
      '03 đêm lưu trú homestay/boutique lodge chuẩn địa phương',
      'Ăn sáng, 3 bữa chính mỗi ngày với đặc sản vùng cao',
      'Vé thuyền sông Nho Quế và vé tham quan theo chương trình',
      'Hướng dẫn viên bản địa giàu kinh nghiệm'
    ],
    excludes: [
      'Chi phí cá nhân, đồ uống ngoài chương trình',
      'Tiền tip cho hướng dẫn viên và lái xe (không bắt buộc)',
      'Bảo hiểm du lịch mở rộng'
    ],
    policies: {
      cancellation: 'Hoàn tiền 100% trước ngày khởi hành 10 ngày. Từ 4-9 ngày hoàn 50%. Từ 3 ngày trở xuống không hoàn.',
      requirements: 'Sức khoẻ tốt, có thể di chuyển nhiều bậc đá. Nên mang áo ấm, giày thể thao và giấy tờ tuỳ thân.',
      payment: 'Đặt cọc 2.000.000đ/khách. Thanh toán phần còn lại trước ngày khởi hành 5 ngày.'
    }
  },
  {
    id: 'phu-quoc-nghi-duong',
    name: 'Phú Quốc - Nghỉ Dưỡng Biển Hoàng Hôn',
    slug: 'phu-quoc-nghi-duong',
    destination: 'Phú Quốc, Việt Nam',
    duration: 3,
    groupSize: '2-20 khách',
    difficulty: 'easy',
    difficultyLabel: 'Thư giãn cao cấp',
    price: 9450000,
    reviewsCount: 204,
    thumbnail: 'https://images.unsplash.com/photo-1526481280695-3c4693f26e90?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515020842583-2d87b14302b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Biển đảo', 'Nghỉ dưỡng', 'Ẩm thực'],
    highlights: [
      'Check-in hoàng hôn tại Sunset Town và bữa tối BBQ hải sản riêng',
      'Trải nghiệm cáp treo Hòn Thơm được Guinness ghi nhận',
      'Lặn ngắm san hô Nam Đảo và chèo kayak vịnh xanh'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Đến đảo ngọc',
        items: [
          'Đón sân bay và nhận phòng resort 5 sao bãi Kem',
          'Thư giãn spa thảo mộc, tắm hồ bơi vô cực',
          'Dùng bữa tối BBQ hải sản tại bãi biển riêng'
        ]
      },
      {
        day: 2,
        title: 'Khám phá Nam Đảo',
        items: [
          'Đi cano riêng đến Hòn Móng Tay - Hòn Gầm Ghì',
          'Lặn ngắm san hô, chèo SUP và chụp ảnh flycam',
          'Chiều ghé Sunset Town, xem show Kiss of The Sea'
        ]
      },
      {
        day: 3,
        title: 'Cáp treo Hòn Thơm - Tạm biệt Phú Quốc',
        items: [
          'Vui chơi Aquatopia hoặc công viên nước tại Hon Thom Paradise Island',
          'Dùng bữa trưa đặc sản gỏi cá trích, bánh khéo',
          'Xe riêng tiễn sân bay'
        ]
      }
    ],
    description:
      'Chuyến nghỉ dưỡng sang trọng tại Phú Quốc với resort biển cao cấp, lịch trình linh hoạt, phù hợp cặp đôi và gia đình muốn nạp lại năng lượng cùng khoảnh khắc hoàng hôn lãng mạn.',
    includes: [
      'Vé máy bay khứ hồi Hà Nội/TP.HCM - Phú Quốc',
      '02 đêm resort 5 sao kèm buffet sáng',
      'Cano riêng tham quan Nam Đảo và các dụng cụ lặn biển',
      'Vé cáp treo Hòn Thơm và các vé tham quan',
      'Xe riêng đón tiễn sân bay, hướng dẫn viên nhiệt tình'
    ],
    excludes: [
      'Bữa trưa ngày 3 và chi phí ăn uống ngoài chương trình',
      'Chi phí nâng hạng phòng, dịch vụ spa tự chọn',
      'Bảo hiểm du lịch cá nhân'
    ],
    policies: {
      cancellation: 'Đổi ngày miễn phí trước 7 ngày. Huỷ trước 5 ngày hoàn 70%. Sau 5 ngày không hoàn tiền.',
      requirements: 'Mang theo CCCD/Passport, đồ bơi, kem chống nắng. Khuyến khích mang thiết bị chống nước cho điện thoại.',
      payment: 'Thanh toán 100% để giữ chỗ ưu đãi vé máy bay. Hỗ trợ trả góp lãi suất 0% qua thẻ tín dụng.'
    }
  },
  {
    id: 'hue-hoian-di-san',
    name: 'Huế - Hội An - Dấu Ấn Di Sản Miền Trung',
    slug: 'hue-hoian-di-san',
    destination: 'Huế & Hội An, Việt Nam',
    duration: 4,
    groupSize: '10-18 khách',
    difficulty: 'moderate',
    difficultyLabel: 'Khám phá nhẹ nhàng',
    price: 7590000,
    reviewsCount: 167,
    thumbnail: 'https://images.unsplash.com/photo-1533636721434-0e2d61030955?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533676602870-4bbf4a1d2c1f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526481280695-3c4693f26e90?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494475673543-6a6a27143fc8?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Di sản', 'Ẩm thực', 'Văn hóa'],
    highlights: [
      'Tham quan Đại Nội về đêm với hướng dẫn viên thuyết minh riêng',
      'Trải nghiệm làm đèn lồng, thưởng trà và nghe bài chòi',
      'Du thuyền sông Hương và thả hoa đăng cầu bình an'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Cố đô Huế',
        items: [
          'Tham quan Đại Nội, lăng Khải Định, lăng Minh Mạng',
          'Dùng bữa trưa cơm Vua và học làm bánh Huế',
          'Tối xem múa cung đình, dạo phố đêm Huế'
        ]
      },
      {
        day: 2,
        title: 'Huế - Hội An',
        items: [
          'Du thuyền nghe ca Huế trên sông Hương, thả hoa đăng',
          'Khởi hành qua đèo Hải Vân, check-in Lăng Cô',
          'Tham gia workshop làm đèn lồng tại Hội An'
        ]
      },
      {
        day: 3,
        title: 'Phố cổ Hội An',
        items: [
          'Tham quan chùa Cầu, hội quán Phúc Kiến, nhà cổ Tấn Ký',
          'Đi thuyền trên sông Hoài lúc hoàng hôn',
          'Dạo chợ đêm, thưởng thức cao lầu, bánh mì Phượng'
        ]
      },
      {
        day: 4,
        title: 'Rừng dừa Bảy Mẫu - Tạm biệt',
        items: [
          'Chèo thuyền thúng, xem múa rối nước mini tại rừng dừa',
          'Mua sắm đặc sản Mè xửng, mứt sen Huế',
          'Trả khách sân bay Đà Nẵng hoặc Huế'
        ]
      }
    ],
    description:
      'Khám phá hai di sản thế giới Huế - Hội An qua hành trình đậm văn hoá, ẩm thực tinh tế và những trải nghiệm nghệ thuật truyền thống hiếm có.',
    includes: [
      'Xe du lịch đời mới, nước uống và khăn lạnh suốt hành trình',
      '03 đêm khách sạn 4 sao trung tâm Huế & Hội An',
      'Vé tham quan danh thắng, show nghệ thuật theo lịch trình',
      '04 bữa sáng buffet, 06 bữa chính đặc sản miền Trung',
      'Hướng dẫn viên thuyết minh chuyên sâu về di sản'
    ],
    excludes: [
      'Vé máy bay khứ hồi (có thể hỗ trợ đặt theo yêu cầu)',
      'Chi phí cá nhân, giặt ủi, đồ uống gọi thêm',
      'Phụ thu phòng đơn 1.200.000đ/khách'
    ],
    policies: {
      cancellation: 'Hoàn tiền 80% trước ngày khởi hành 7 ngày. Hoàn 40% trước 3 ngày. Sau đó không hoàn.',
      requirements: 'Trang phục lịch sự khi vào Đại Nội, nên mang áo khoác mỏng buổi tối.',
      payment: 'Đặt cọc 50%. Thanh toán đủ trước ngày đi 7 ngày.'
    }
  },
  {
    id: 'tay-nguyen-van-hoa',
    name: 'Tây Nguyên - Sử Thi & Cà Phê Buôn Ma Thuột',
    slug: 'tay-nguyen-van-hoa',
    destination: 'Đắk Lắk, Pleiku, Việt Nam',
    duration: 4,
    groupSize: '12-18 khách',
    difficulty: 'moderate',
    difficultyLabel: 'Khám phá thiên nhiên',
    price: 6890000,
    reviewsCount: 128,
    thumbnail: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1474403533418-00c44bd9c1fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526481280695-3c4693f26e90?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Tây Nguyên', 'Văn hóa', 'Ẩm thực'],
    highlights: [
      'Tham quan Bảo tàng Cà phê Thế Giới và nếm thử Arabica Đắk Lắk',
      'Nghe sử thi kể khan, giao lưu cồng chiêng cùng người Êđê',
      'Khám phá thác Dray Nur hùng vĩ và hồ Lak thơ mộng'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Buôn Ma Thuột - Hành trình cà phê',
        items: [
          'Tham quan Buôn Đôn và cầu treo bắc qua sông Sêrêpốk',
          'Check-in bảo tàng Thế giới Cà phê, workshop rang xay thủ công',
          'Dùng cơm lam, gà nướng bản địa'
        ]
      },
      {
        day: 2,
        title: 'Thác Dray Nur - Hồ Lak',
        items: [
          'Khám phá hệ thống thác Dray Nur - Dray Sấp',
          'Đi thuyền độc mộc trên hồ Lak, thăm buôn M\'Liêng',
          'Thưởng thức đêm văn hoá cồng chiêng, uống rượu cần'
        ]
      },
      {
        day: 3,
        title: 'Pleiku - Biển Hồ',
        items: [
          'Di chuyển Pleiku, tham quan Biển Hồ T’Nưng',
          'Thăm nhà rông Kon Tum, nhà thờ gỗ hơn 100 tuổi',
          'Dạo chợ đêm Pleiku thưởng thức phở khô hai tô'
        ]
      },
      {
        day: 4,
        title: 'Gia Lai - Hà Nội/TP.HCM',
        items: [
          'Tham quan đồi chè Tân Sơn và vườn tiêu',
          'Mua cà phê, mật ong rừng về làm quà',
          'Tiễn sân bay Pleiku kết thúc hành trình'
        ]
      }
    ],
    description:
      'Đắm mình trong không gian văn hoá cồng chiêng Tây Nguyên, thưởng thức cà phê nguyên bản và khám phá những câu chuyện sử thi được kể giữa núi rừng đại ngàn.',
    includes: [
      'Xe du lịch đời mới di chuyển xuyên tuyến',
      '03 đêm khách sạn 4 sao tại Buôn Ma Thuột và Pleiku',
      'Ăn 3 bữa/ngày với đặc sản Tây Nguyên và cà phê tasting',
      'Vé tham quan bảo tàng, thác nước, hồ Lak, show cồng chiêng',
      'Hướng dẫn viên am hiểu văn hoá dân tộc bản địa'
    ],
    excludes: [
      'Vé máy bay/xe khách đến Buôn Ma Thuột và về từ Pleiku',
      'Chi phí tự chọn như cưỡi voi, đồ uống gọi thêm',
      'Phí phụ thu phòng đơn 900.000đ/khách'
    ],
    policies: {
      cancellation: 'Huỷ trước 10 ngày hoàn 90%. Huỷ 5-9 ngày hoàn 50%. Sau 5 ngày không hoàn.',
      requirements: 'Mang áo khoác nhẹ cho buổi tối, giày đi bộ chống trượt, không mang đồ nhạy cảm với nước tới thác.',
      payment: 'Đặt cọc 40%. Thanh toán đủ trước 6 ngày khởi hành.'
    }
  }
];

export const featuredTours = tours.slice(0, 2);

export const curatedCollections = [
  {
    id: 'bien-dao',
    title: 'Biển đảo cao cấp',
    description: 'Trải nghiệm nghỉ dưỡng sang trọng ở những vùng biển đẹp nhất Việt Nam.',
    tours: tours.filter((tour) => tour.tags.includes('Biển đảo'))
  },
  {
    id: 'van-hoa-ban-dia',
    title: 'Văn hoá bản địa',
    description: 'Hòa mình vào đời sống cộng đồng, nghe sử thi và thưởng thức ẩm thực truyền thống.',
    tours: tours.filter((tour) =>
      tour.tags.some((tag) =>
        ['Văn hóa', 'Văn hoá', 'Bản làng', 'Tây Nguyên'].includes(tag)
      )
    )
  }
];

