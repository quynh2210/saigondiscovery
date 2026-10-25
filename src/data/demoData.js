/**
 * Bộ dữ liệu mẫu xác thực (Demo Data) cho Thành phố Hồ Chí Minh (tập trung Quận 1 và Quận 3).
 * Dữ liệu này được tách riêng, có thể dùng trực tiếp khi chưa kết nối Firebase
 * hoặc dùng để seed (đồng bộ) lên Cloud Firestore chỉ với 1 click trong trang Admin.
 */

export const DEMO_PLACES = [
  {
    id: "dinh-doc-lap",
    slug: "dinh-doc-lap",
    published: true,
    category: "historical",
    district: "Quận 1",
    name: {
      vi: "Dinh Độc Lập (Hội trường Thống Nhất)",
      en: "Independence Palace (Reunification Hall)"
    },
    address: {
      vi: "135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
      en: "135 Nam Ky Khoi Nghia St, Ben Thanh Ward, District 1, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.77695,
      lng: 106.69534
    },
    openingHours: {
      vi: "8:00 - 16:30 hàng ngày",
      en: "8:00 AM - 4:30 PM daily"
    },
    phone: "(028) 3822 3652",
    ticketPrice: {
      vi: "40.000 VNĐ - 65.000 VNĐ (tùy khu vực tham quan)",
      en: "40,000 VND - 65,000 VND (depending on exhibition areas)"
    },
    summary: {
      vi: "Di tích lịch sử quốc gia đặc biệt, nơi chứng kiến thời khắc lịch sử kết thúc chiến tranh Việt Nam vào ngày 30/4/1975.",
      en: "A special national historic monument that witnessed the historic moment marking the end of the Vietnam War on April 30, 1975."
    },
    description: {
      vi: "Dinh Độc Lập được khởi công xây dựng vào năm 1962 trên nền Dinh Norodom cũ, theo thiết kế của kiến trúc sư tài ba Ngô Viết Thụ. Công trình kết hợp hài hòa giữa kiến trúc hiện đại phương Tây và triết lý phong thủy phương Đông (hình chữ CÁT, KHẨU, TRUNG, CHỦ). Tòa dinh thự có diện tích sàn 20.000m² với hơn 100 phòng ốc được trang trí lộng lẫy cùng hệ thống hầm ngầm kiên cố chịu bom đạn.",
      en: "The Independence Palace was designed by architect Ngo Viet Thu and constructed in 1962 on the site of the former Norodom Palace. The building harmoniously blends modern Western architecture with Eastern Feng Shui philosophy. It encompasses 20,000 m² of floor space with over 100 richly decorated rooms and a fortified underground bunker network."
    },
    history: {
      vi: "Trước đây là Dinh Norodom xây dựng năm 1868 thời Pháp thuộc. Năm 1955, dinh được đổi tên thành Dinh Độc Lập dưới thời chính quyền Việt Nam Cộng Hòa. Ngày 30/4/1975, xe tăng của Quân Giải phóng tiến vào húc đổ cổng chính, đánh dấu thời khắc thống nhất đất nước.",
      en: "Originally built in 1868 during the French colonial era as Norodom Palace, it was renamed Independence Palace in 1955. On April 30, 1975, liberation tanks breached the palace gates, marking the end of the war and the reunification of Vietnam."
    },
    highlights: {
      vi: [
        "Phòng Khánh tiết tráng lệ nơi tổ chức các sự kiện ngoại giao quốc gia",
        "Khu hầm ngầm tác chiến kiên cố với hệ thống bản đồ và thiết bị vô tuyến nguyên bản",
        "Sân bay trực thăng trên tầng thượng và chiếc trực thăng UH-1 lịch sử",
        "Khuôn viên công viên rợp bóng cây cổ thụ hơn trăm tuổi"
      ],
      en: [
        "Magnificent Banquet Chamber for diplomatic banquets",
        "Fortified wartime communication bunker with authentic maps and radio equipment",
        "Rooftop helipad featuring an authentic UH-1 helicopter",
        "Lush 12-hectare park with century-old tropical trees"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Dinh Độc Lập",
        url: "",
        duration: "3:45"
      },
      en: {
        title: "Independence Palace Audio Tour",
        url: "",
        duration: "3:30"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để xem nguồn thông tin",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to listen to full guide",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["quan-an-ngon", "the-workshop-coffee", "cong-caphe-ly-tu-trong", "banh-mi-huynh-hoa"],
    sources: "Trung tâm Bảo tồn Di tích TP.HCM & Dữ liệu xác thực du lịch"
  },
  {
    id: "nha-tho-duc-ba",
    slug: "nha-tho-duc-ba",
    published: true,
    category: "architecture",
    district: "Quận 1",
    name: {
      vi: "Nhà thờ Đức Bà Sài Gòn",
      en: "Notre-Dame Cathedral Basilica of Saigon"
    },
    address: {
      vi: "01 Công xã Paris, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      en: "01 Cong xa Paris, Ben Nghe Ward, District 1, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.77978,
      lng: 106.69902
    },
    openingHours: {
      vi: "Đang trong quá trình đại trùng tu (Tham quan bên ngoài)",
      en: "Currently undergoing major restoration (External view available)"
    },
    phone: "(028) 3822 0477",
    ticketPrice: {
      vi: "Miễn phí",
      en: "Free"
    },
    summary: {
      vi: "Biểu tượng kiến trúc Công giáo La Mã cổ kính giữa lòng Sài Gòn, xây dựng bằng toàn bộ gạch ngói và vật liệu nhập từ Marseille và Toulouse (Pháp).",
      en: "An iconic Neo-Romanesque cathedral in the heart of Saigon, built with specialized red bricks and materials imported from France."
    },
    description: {
      vi: "Nhà thờ Chính tòa Đức Bà Sài Gòn được khánh thành năm 1880 do kiến trúc sư J. Bourard thiết kế. Công trình nổi bật với hai tháp chuông cao 60,5m và tường gạch đỏ Marseille trần không tô vữa nhưng vẫn giữ nguyên màu sắc tươi tắn qua hơn 140 năm. Trước nhà thờ là công viên nhỏ với tượng Đức Mẹ Hòa Bình tạc bằng đá cẩm thạch trắng Carrara từ Ý.",
      en: "Inaugurated in 1880 and designed by architect J. Bourard, the cathedral features two 60.5m bell towers and exterior walls made from distinctive red bricks imported from Marseille that have retained their vibrant color for over 140 years. In front stands a peaceful square with the statue of Our Lady of Peace sculpted from Italian Carrara marble."
    },
    history: {
      vi: "Được đặt viên đá đầu tiên năm 1877 bởi Giám mục Colombert. Năm 1959, nhà thờ được Tòa Thánh Vatican phong tặng danh hiệu Vương cung Thánh đường.",
      en: "The foundation stone was laid in 1877 by Bishop Colombert. In 1959, the Holy See elevated the church to the rank of Minor Basilica."
    },
    highlights: {
      vi: [
        "Tường gạch đỏ Marseille không bám rêu phong qua hàng thế kỷ",
        "Hai tháp chuông vươn cao với 6 quả chuông đồng nặng gần 30 tấn",
        "Tượng Đức Mẹ Hòa Bình tạc bằng cẩm thạch trắng Carrara",
        "Vị trí đắc địa nhìn thẳng sang Bưu điện Trung tâm và Đường sách"
      ],
      en: [
        "Unplastered Marseille red bricks resisting moss and weather for over a century",
        "Twin bell towers housing six bronze bells weighing nearly 30 tons",
        "Statue of Our Lady of Peace carved from Carrara marble",
        "Prime location right across from the Central Post Office and Book Street"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Nhà thờ Đức Bà",
        url: "",
        duration: "3:10"
      },
      en: {
        title: "Notre-Dame Cathedral Audio Guide",
        url: "",
        duration: "3:00"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để xem nguồn thông tin",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to listen to architectural tour",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["cong-caphe-ly-tu-trong", "the-workshop-coffee", "okio-caffe", "quan-an-ngon"],
    sources: "Giáo phận Sài Gòn & Cục Di sản Văn hóa"
  },
  {
    id: "buu-dien-trung-tam",
    slug: "buu-dien-trung-tam",
    published: true,
    category: "architecture",
    district: "Quận 1",
    name: {
      vi: "Bưu điện Trung tâm Sài Gòn",
      en: "Saigon Central Post Office"
    },
    address: {
      vi: "02 Công xã Paris, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      en: "02 Cong xa Paris, Ben Nghe Ward, District 1, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.77984,
      lng: 106.69996
    },
    openingHours: {
      vi: "7:30 - 18:00 (Thứ 2 - Thứ 7), 8:00 - 17:00 (Chủ nhật)",
      en: "7:30 AM - 6:00 PM (Mon-Sat), 8:00 AM - 5:00 PM (Sun)"
    },
    phone: "(028) 3822 1677",
    ticketPrice: {
      vi: "Miễn phí",
      en: "Free"
    },
    summary: {
      vi: "Công trình bưu điện biểu tượng phong cách Phục Hưng kết hợp Gothic và hoa văn phương Đông, xây dựng vào cuối thế kỷ 19.",
      en: "An iconic late-19th-century post office building combining French Renaissance, Gothic, and Asian decorative motifs."
    },
    description: {
      vi: "Xây dựng từ năm 1886 đến 1891 theo đồ án thiết kế của kiến trúc sư Marie-Alfred Foulhoux (chịu ảnh hưởng phong cách Gustave Eiffel). Điểm nhấn độc đáo là vòm trần nhà bằng khung sắt uốn cong tinh xảo, nền gạch hoa cổ, hai bản đồ lịch sử vẽ tay trên tường và các bốt điện thoại gỗ cổ điển vẫn còn nguyên vẹn.",
      en: "Constructed between 1886 and 1891 based on design by architect Marie-Alfred Foulhoux. Key highlights include the breathtaking vaulted iron barrel ceiling, ornate tile floors, two large historic hand-painted maps on the walls, and classic wooden telephone booths."
    },
    history: {
      vi: "Bưu điện ban đầu là một nhà bưu điện dây thép đơn sơ được người Pháp dựng năm 1860. Đến năm 1886, tòa nhà nguy nga hiện tại mới được khởi công xây dựng và hoàn thành năm 1891.",
      en: "Originally a modest telegraph building erected in 1860, the current magnificent structure commenced construction in 1886 and was inaugurated in 1891."
    },
    highlights: {
      vi: [
        "Vòm trần uốn cong bằng khung thép chịu lực độc đáo",
        "Hai bản đồ cổ vẽ tay: Sài Gòn 1892 và mạng lưới điện tín Nam Kỳ - Campuchia",
        "Các quầy dịch vụ bưu chính gỗ cổ điển vẫn hoạt động gửi thư và bưu thiếp",
        "Đồng hồ lớn ngay mặt tiền với các tên nhà khoa học nổi tiếng được khắc danh"
      ],
      en: [
        "Grand vaulted iron-frame barrel ceiling",
        "Two hand-painted antique maps of Saigon (1892) and Indochina telegraph lines",
        "Working vintage wooden counters where you can still send postcards worldwide",
        "Historic facade clock engraved with names of prominent inventors and scientists"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Bưu điện Trung tâm Sài Gòn",
        url: "",
        duration: "2:50"
      },
      en: {
        title: "Saigon Central Post Office Audio Guide",
        url: "",
        duration: "2:40"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để tìm hiểu lịch sử bưu điện",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to discover post office heritage",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["okio-caffe", "cong-caphe-ly-tu-trong", "the-workshop-coffee", "quan-an-ngon"],
    sources: "Bưu chính Viễn thông Việt Nam & Di tích Kiến trúc Nghệ thuật TP.HCM"
  },
  {
    id: "cho-ben-thanh",
    slug: "cho-ben-thanh",
    published: true,
    category: "culture",
    district: "Quận 1",
    name: {
      vi: "Chợ Bến Thành",
      en: "Ben Thanh Market"
    },
    address: {
      vi: "Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
      en: "Le Loi St, Ben Thanh Ward, District 1, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.77254,
      lng: 106.69804
    },
    openingHours: {
      vi: "6:00 - 18:00 (chợ ngày), 18:00 - 22:00 (chợ đêm)",
      en: "6:00 AM - 6:00 PM (day market), 6:00 PM - 10:00 PM (night market)"
    },
    phone: "(028) 3829 2096",
    ticketPrice: {
      vi: "Miễn phí vào cổng",
      en: "Free admission"
    },
    summary: {
      vi: "Ngôi chợ sầm uất hơn 100 năm tuổi với tháp đồng hồ bốn mặt nổi tiếng - linh hồn thương mại và văn hóa ẩm thực Sài Gòn.",
      en: "A vibrant century-old market with the iconic four-faced clock tower—the commercial soul and street food heaven of Saigon."
    },
    description: {
      vi: "Chợ Bến Thành được xây dựng từ năm 1912 đến 1914 bởi hãng thầu Brossard et Maupin. Chợ có 4 cổng chính nhìn ra các hướng: Cửa Nam (tháp đồng hồ nhìn ra Quảng trường Quách Thị Trang), Cửa Bắc (đường Lê Thánh Tôn), Cửa Đông (đường Phan Bội Châu) và Cửa Tây (đường Phan Chu Trinh). Bên trong có hơn 1.400 sạp hàng kinh doanh vải vóc, đồ lưu niệm, đặc sản khô và khu ẩm thực phong phú.",
      en: "Constructed between 1912 and 1914 by French contractor Brossard et Maupin. The market features four main gates facing cardinal directions: South Gate with the famous clock tower, North Gate, East Gate, and West Gate. Inside are more than 1,400 stalls offering silk, souvenirs, local delicacies, and a buzzing street food court."
    },
    history: {
      vi: "Ban đầu chợ nằm bên bờ sông Bến Nghé gần thành Bát Quái nên gọi là Bến Thành. Sau khi dời về vị trí hiện tại đầm lầy Bồ Rục vào năm 1912, chợ trở thành trung tâm giao thương sầm uất bậc nhất phương Nam.",
      en: "Originally established along the Ben Nghe River near the Bat Quai citadel, hence the name Ben Thanh. Relocated to its current site in 1912, it quickly became the commercial heartbeat of Southern Vietnam."
    },
    highlights: {
      vi: [
        "Tháp đồng hồ Cửa Nam - hình ảnh biểu tượng của Thành phố Hồ Chí Minh",
        "Khu ẩm thực trứ danh với chè Sài Gòn, bún suông, bánh bèo, nem nướng",
        "Thế giới đồ thủ công mỹ nghệ, đồ gốm và lụa tơ tằm truyền thống",
        "Không khí buôn bán tấp nập đặc trưng nét văn hóa Sài Gòn"
      ],
      en: [
        "South Gate clock tower—an enduring emblem of Ho Chi Minh City",
        "Famous food hall serving authentic Vietnamese desserts, noodles, and delicacies",
        "Artisan handicrafts, lacquerware, ceramics, and traditional silk",
        "Bustling, lively merchant atmosphere capturing genuine southern hospitality"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Chợ Bến Thành",
        url: "",
        duration: "3:00"
      },
      en: {
        title: "Ben Thanh Market Audio Guide",
        url: "",
        duration: "2:50"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để khám phá ẩm thực Chợ Bến Thành",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to discover market highlights",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["banh-mi-huynh-hoa", "quan-an-ngon", "the-workshop-coffee", "trung-nguyen-legend-dong-khoi"],
    sources: "Ban Quản lý Chợ Bến Thành & Sở Du lịch TP.HCM"
  },
  {
    id: "bao-tang-chung-tich-chien-tranh",
    slug: "bao-tang-chung-tich-chien-tranh",
    published: true,
    category: "historical",
    district: "Quận 3",
    name: {
      vi: "Bảo tàng Chứng tích Chiến tranh",
      en: "War Remnants Museum"
    },
    address: {
      vi: "28 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
      en: "28 Vo Van Tan St, Vo Thi Sau Ward, District 3, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.77943,
      lng: 106.69209
    },
    openingHours: {
      vi: "7:30 - 17:30 hàng ngày",
      en: "7:30 AM - 5:30 PM daily"
    },
    phone: "(028) 3930 5587",
    ticketPrice: {
      vi: "40.000 VNĐ / lượt",
      en: "40,000 VND / person"
    },
    summary: {
      vi: "Bảo tàng thu hút đông đảo du khách quốc tế nhất tại Việt Nam, truyền tải thông điệp sâu sắc về hòa bình và hậu quả chiến tranh.",
      en: "The most visited museum in Vietnam by international tourists, delivering a powerful message of peace and reconciliation."
    },
    description: {
      vi: "Thành lập năm 1975, bảo tàng hiện lưu giữ hơn 20.000 tài liệu, hiện vật và phim ảnh. Khu trưng bày ngoài trời giới thiệu nhiều phương tiện quân sự cỡ lớn như máy bay trực thăng Chinook, máy bay phản lực F-5A, xe tăng M48. Các phòng trưng bày chuyên đề bên trong tái hiện chân thực những nỗi đau từ chất độc da cam và tôn vinh phong trào phản chiến quốc tế.",
      en: "Established in 1975, the museum houses over 20,000 artifacts, documents, and documentary films. Outdoor exhibits display major military hardware including Chinook helicopters, F-5A jets, and M48 tanks. Indoor galleries movingly portray the enduring effects of Agent Orange and commemorate international anti-war movements."
    },
    history: {
      vi: "Ban đầu có tên là 'Nhà trưng bày tội ác Mỹ - Ngụy', sau đổi tên thành 'Nhà trưng bày tội ác chiến tranh xâm lược' năm 1990 và chính thức mang tên 'Bảo tàng Chứng tích Chiến tranh' từ năm 1995 trong bối cảnh bình thường hóa quan hệ ngoại giao.",
      en: "Originally opened in 1975 under the name Exhibition House for US and Puppet Crimes, it was officially renamed the War Remnants Museum in 1995 as diplomatic relations normalized."
    },
    highlights: {
      vi: [
        "Khu trưng bày ngoài trời với máy bay UH-1, pháo tự hành và xe tăng chiến đấu",
        "Triển lãm ảnh 'Hồi niệm' (Requiem) của các phóng viên chiến trường quốc tế",
        "Khu chuyên đề hậu quả chất độc da cam / Dioxin",
        "Mô hình 'Chuồng cọp' nhà tù Côn Đảo được phục dựng chân thực"
      ],
      en: [
        "Outdoor collection of UH-1 helicopters, artillery, and armored vehicles",
        "Requiem photographic collection by renowned international war correspondents",
        "Poignant exhibition on the consequences of Agent Orange / Dioxin",
        "Authentic reconstruction of the Con Dao island 'Tiger Cages' prison cells"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Bảo tàng Chứng tích Chiến tranh",
        url: "",
        duration: "4:15"
      },
      en: {
        title: "War Remnants Museum Audio Tour",
        url: "",
        duration: "4:00"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để xem nguồn thông tin",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to listen to exhibition commentary",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["pho-hoa-pasteur", "com-tam-dai-han", "quan-an-ngon", "cong-caphe-ly-tu-trong"],
    sources: "Bảo tàng Chứng tích Chiến tranh TP.HCM"
  },
  {
    id: "ho-con-rua",
    slug: "ho-con-rua",
    published: true,
    category: "culture",
    district: "Quận 3",
    name: {
      vi: "Hồ Con Rùa (Công trường Quốc tế)",
      en: "Turtle Lake (International Square)"
    },
    address: {
      vi: "Vòng xoay Phạm Ngọc Thạch - Võ Văn Tần - Trần Cao Vân, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
      en: "Pham Ngoc Thach - Vo Van Tan Roundabout, Vo Thi Sau Ward, District 3, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.78274,
      lng: 106.69595
    },
    openingHours: {
      vi: "Mở cửa tự do 24/7",
      en: "Open 24/7 free access"
    },
    phone: "Đang cập nhật",
    ticketPrice: {
      vi: "Miễn phí",
      en: "Free"
    },
    summary: {
      vi: "Vòng xoay đài phun nước gắn liền với ký ức tuổi trẻ Sài Gòn, thiên đường ăn vặt đường phố và kiến trúc hoa xòe độc đáo.",
      en: "A beloved roundabout fountain rich in student nostalgia, street food delights, and iconic flower-shaped modernist architecture."
    },
    description: {
      vi: "Hồ Con Rùa có tên chính thức là Công trường Quốc tế, được xây dựng từ năm 1965 đến 1967 theo thiết kế của kiến trúc sư Nguyễn Kỳ. Công trình gồm tháp bê tông cao 34m tượng trưng cho bông hoa nở xòe bên trên hồ nước nhân tạo hình bát giác với lối đi bộ uốn lượn. Về đêm, nơi đây trở thành điểm hẹn ăn vặt sôi động với bánh tráng nướng, bắp xào, trà sữa.",
      en: "Officially named International Square, Turtle Lake was built between 1965 and 1967 based on the concept of architect Nguyen Ky. The structure features a 34-meter soaring concrete tower resembling an unfurled flower above an octagonal fountain basin with intertwining pedestrian footbridges. At night, it transforms into a bustling youth street snack hub."
    },
    history: {
      vi: "Khu vực này ban đầu là cổng thành Khảm Khuyết của thành Gia Định xưa. Thời Pháp đặt tượng đài binh lính Pháp. Năm 1970 đúc thêm con rùa bằng đồng đội tấm bia đá ghi danh các nước viện trợ, từ đó nhân dân quen gọi là Hồ Con Rùa.",
      en: "Historically the Kham Khuyet gate of ancient Gia Dinh citadel. In 1970, a bronze turtle bearing a stone stele was placed here, giving rise to the popular local name 'Turtle Lake'."
    },
    highlights: {
      vi: [
        "Kiến trúc đài hoa bê tông modernist độc đáo của thập niên 1960",
        "Hồ nước bát giác xanh mát với những lối đi bộ trên mặt nước",
        "Thiên đường ăn vặt nức tiếng: Bánh tráng trộn, bắp xào, hồ lô nướng",
        "Không gian râm mát bên dưới hàng cây me xanh cổ thụ"
      ],
      en: [
        "Iconic 1960s modernist concrete flower tower architecture",
        "Tranquil octagonal water basin with elevated pedestrian pathways",
        "Renowned street food culture: rice paper salad, butter-corn, grilled skewers",
        "Shaded green canopy under century-old tamarind trees"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Hồ Con Rùa",
        url: "",
        duration: "2:30"
      },
      en: {
        title: "Turtle Lake Audio Story",
        url: "",
        duration: "2:20"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để xem câu chuyện Hồ Con Rùa",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to learn about Turtle Lake",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["pho-hoa-pasteur", "cong-caphe-ly-tu-trong", "okio-caffe", "quan-an-ngon"],
    sources: "Trung tâm Văn hóa Quận 3 & Ký ức Đô thị Sài Gòn"
  },
  {
    id: "chua-vinh-nghiem",
    slug: "chua-vinh-nghiem",
    published: true,
    category: "spiritual",
    district: "Quận 3",
    name: {
      vi: "Chùa Vĩnh Nghiêm",
      en: "Vinh Nghiem Pagoda"
    },
    address: {
      vi: "339 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
      en: "339 Nam Ky Khoi Nghia St, Vo Thi Sau Ward, District 3, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.79155,
      lng: 106.68305
    },
    openingHours: {
      vi: "7:00 - 18:00 hàng ngày (các ngày Rằm, Mùng 1 mở sớm hơn)",
      en: "7:00 AM - 6:00 PM daily (extended on 1st & 15th lunar days)"
    },
    phone: "(028) 3848 3153",
    ticketPrice: {
      vi: "Miễn phí",
      en: "Free"
    },
    summary: {
      vi: "Ngôi đại tự Phật giáo phái Trúc Lâm đầu tiên tại Việt Nam được xây dựng hoàn toàn bằng bê tông cốt thép theo phong cách cổ điển miền Bắc.",
      en: "The foremost Truc Lam Buddhist pagoda in Ho Chi Minh City, constructed with reinforced concrete in traditional northern Vietnamese temple architecture."
    },
    description: {
      vi: "Khởi công năm 1964 và hoàn thành năm 1971 do kiến trúc sư Nguyễn Bá Lăng thiết kế. Khuôn viên chùa rộng lớn có Tòa Phật điện trang nghiêm, Tháp Quán Thế Âm cao 7 tầng (40m) và Tháp đá Vĩnh Nghiêm bằng đá nguyên khối cao 14m chạm khắc tinh xảo. Đây là trung tâm sinh hoạt tâm linh và từ thiện tiêu biểu của Phật tử phương Nam.",
      en: "Constructed between 1964 and 1971 and designed by architect Nguyen Ba Lang. The temple grounds feature a grand Main Sanctuary, a seven-story 40-meter Avalokiteshvara Tower, and a 14-meter monolithic granite tower. It stands as a major center for Buddhist worship, meditation, and charity in southern Vietnam."
    },
    history: {
      vi: "Chùa được sáng lập bởi hai vị Trưởng lão Hòa thượng Thích Tâm Giác và Thích Thanh Kiểm, lấy nguyên mẫu từ chốn tổ Vĩnh Nghiêm (Bắc Giang) để phật tử miền Bắc di cư có nơi gửi gắm niềm tin tâm linh.",
      en: "Founded by Venerable Thich Tam Giac and Thich Thanh Kiem, inspired by the ancestral Vinh Nghiem monastery in Bac Giang to preserve Truc Lam Zen traditions."
    },
    highlights: {
      vi: [
        "Tháp Quán Thế Âm 7 tầng thanh thoát soi bóng bên rặng cây xanh",
        "Tháp đá Vĩnh Nghiêm bằng đá hoa cương nguyên khối chạm hoa sen và Tứ linh",
        "Bức đại hồng chung nặng hơn 1 tấn với tiếng chuông ngân vang an lạc",
        "Kiến trúc mái cong đầu đao vươn cao đậm nét đền chùa Thăng Long xưa"
      ],
      en: [
        "Seven-story Avalokiteshvara Tower rising gracefully above tropical gardens",
        "Monolithic granite tower intricately carved with lotus and sacred animals",
        "Grand bronze peace bell weighing over 1 ton",
        "Sweeping curved tiled roofs reminiscent of traditional northern shrines"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Chùa Vĩnh Nghiêm",
        url: "",
        duration: "3:30"
      },
      en: {
        title: "Vinh Nghiem Pagoda Audio Tour",
        url: "",
        duration: "3:20"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để tìm hiểu lịch sử chùa Vĩnh Nghiêm",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to learn about temple history",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["pho-hoa-pasteur", "com-tam-dai-han", "cafe-vot-phan-dinh-phung", "quan-an-ngon"],
    sources: "Giáo hội Phật giáo Việt Nam & Ban Quản trị Chùa Vĩnh Nghiêm"
  },
  {
    id: "duong-sach-nguyen-van-binh",
    slug: "duong-sach-nguyen-van-binh",
    published: true,
    category: "culture",
    district: "Quận 1",
    name: {
      vi: "Đường Sách Nguyễn Văn Bình",
      en: "Nguyen Van Binh Book Street"
    },
    address: {
      vi: "Đường Nguyễn Văn Bình, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      en: "Nguyen Van Binh St, Ben Nghe Ward, District 1, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.78112,
      lng: 106.69970
    },
    openingHours: {
      vi: "8:00 - 22:00 hàng ngày",
      en: "8:00 AM - 10:00 PM daily"
    },
    phone: "(028) 3824 8888",
    ticketPrice: {
      vi: "Miễn phí vào cổng",
      en: "Free admission"
    },
    summary: {
      vi: "Tuyến đường đi bộ văn hóa rợp bóng mát cây xanh, nơi hội tụ hơn 20 nhà xuất bản hàng đầu và các quán cà phê sách thư thái.",
      en: "A pedestrian cultural street shaded by lush trees, featuring over 20 renowned publishers, book stalls, and open-air book cafes."
    },
    description: {
      vi: "Khai trương vào đầu năm 2016, Đường Sách dài hơn 100m nằm nép mình bên hông Bưu điện Trung tâm và Nhà thờ Đức Bà. Đây là không gian đọc sách công cộng kiểu mẫu, thường xuyên diễn ra các buổi ra mắt sách, triển lãm tranh ảnh và giao lưu văn hóa nghệ thuật.",
      en: "Inaugurated in early 2016, this 100-meter pedestrian avenue is nestled between the Central Post Office and Notre-Dame Cathedral. It serves as a flagship public reading sanctuary, hosting frequent author book launches, photography exhibitions, and cultural exchanges."
    },
    history: {
      vi: "Trước năm 1975 có tên là đường Hong Kong, sau đổi tên theo Linh mục Nguyễn Văn Bình. Năm 2016 được chuyển đổi thành Đường Sách phức hợp đầu tiên tại Việt Nam.",
      en: "Formerly known as Hong Kong Street before 1975, it was named after Archbishop Nguyen Van Binh and transformed into Vietnam's first pedestrian book street in 2016."
    },
    highlights: {
      vi: [
        "Hơn 20 gian hàng sách bằng gỗ xinh xắn dưới tán cây dầu cổ thụ",
        "Không gian cà phê sách ngoài trời thoáng đãng và yên bình",
        "Khu vực trưng bày sách cổ, bản đồ hiếm và đồ lưu niệm thủ công",
        "Các sự kiện giao lưu tác giả và workshop văn hóa cuối tuần"
      ],
      en: [
        "Over 20 charming wooden book stalls nestled under heritage trees",
        "Relaxing open-air cafes where you can read and enjoy local drip coffee",
        "Antique books, historical maps, and artisan bookmark collections",
        "Weekend literary talks, author signings, and calligraphy workshops"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Đường Sách TP.HCM",
        url: "",
        duration: "2:40"
      },
      en: {
        title: "Book Street Audio Tour",
        url: "",
        duration: "2:30"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để xem lịch sự kiện đường sách",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan for upcoming literary events",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["okio-caffe", "cong-caphe-ly-tu-trong", "the-workshop-coffee", "quan-an-ngon"],
    sources: "Công ty Đường Sách TP.HCM & Hội Xuất bản Việt Nam"
  },
  {
    id: "nha-hat-thanh-pho",
    slug: "nha-hat-thanh-pho",
    published: true,
    category: "culture",
    district: "Quận 1",
    name: {
      vi: "Nhà hát Thành phố (Nhà hát Lớn Sài Gòn)",
      en: "Municipal Theatre (Saigon Opera House)"
    },
    address: {
      vi: "07 Công trường Lam Sơn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      en: "07 Lam Son Square, Ben Nghe Ward, District 1, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.77665,
      lng: 106.70318
    },
    openingHours: {
      vi: "Mở cửa theo lịch biểu diễn kịch và hòa nhạc (Tham quan bên ngoài)",
      en: "Open according to performance schedules (Exterior view available)"
    },
    phone: "(028) 3829 9976",
    ticketPrice: {
      vi: "Tùy theo vé biểu diễn (khoảng 300.000 VNĐ - 1.200.000 VNĐ)",
      en: "Depending on performance tickets (approx. 300,000 - 1,200,000 VND)"
    },
    summary: {
      vi: "Kiệt tác kiến trúc phong cách Flamboyant phương Tây khánh thành năm 1900, trung tâm biểu diễn nghệ thuật hàn lâm của thành phố.",
      en: "A late-19th-century Flamboyant architectural gem completed in 1900, hosting premier ballet, opera, and traditional symphonic concerts."
    },
    description: {
      vi: "Nhà hát do kiến trúc sư Eugène Ferret thiết kế theo phong cách 'Opéra Garnier' của Paris với 500 chỗ ngồi. Mặt tiền tráng lệ nổi bật với các phù điêu thần Vệ Nữ, thiên thần và các cột trụ Corinthian tinh xảo. Bên trong có hệ thống âm thanh vòm tự nhiên xuất sắc.",
      en: "Designed by French architect Eugène Ferret in the grand Flamboyant style reminiscent of Paris's Palais Garnier. The facade is adorned with stone reliefs of Roman goddesses and cherubs, with a 500-seat auditorium renowned for its natural acoustics."
    },
    history: {
      vi: "Khởi công xây dựng năm 1898 và khánh thành vào ngày 1/1/1900. Từng được sử dụng làm Trụ sở Hạ nghị viện trước năm 1975, sau ngày giải phóng được phục hồi chức năng nhà hát biểu diễn nghệ thuật.",
      en: "Construction began in 1898 and opened on January 1, 1900. Restored to its original theatrical purpose following national reunification."
    },
    highlights: {
      vi: [
        "Mặt tiền kiến trúc Pháp cổ kính với các tượng nữ thần nghệ thuật",
        "Khán phòng sang trọng với ghế nhung đỏ và trần vẽ bích họa châu Âu",
        "Chương trình xiếc tre 'À Ố Show' vang danh quốc tế",
        "Vị trí đắc địa tại giao lộ Đồng Khởi - Lê Lợi lung linh ánh đèn về đêm"
      ],
      en: [
        "Classic French colonial facade with statues of Greek and Roman deities",
        "Opulent red velvet theater auditorium with European ceiling frescos",
        "Home to the internationally acclaimed 'À Ố Show' bamboo circus",
        "Prime location at the intersection of Dong Khoi and Le Loi boulevards"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Nhà hát Thành phố",
        url: "",
        duration: "3:00"
      },
      en: {
        title: "Saigon Opera House Audio Tour",
        url: "",
        duration: "2:50"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để xem lịch biểu diễn",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to check performance timetable",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["the-workshop-coffee", "trung-nguyen-legend-dong-khoi", "la-rotonde-saigon", "quan-an-ngon"],
    sources: "Nhà hát Giao hưởng Nhạc Vũ kịch TP.HCM"
  },
  {
    id: "thpt-le-quy-don",
    slug: "thpt-le-quy-don",
    published: true,
    category: "historical",
    district: "Quận 3",
    yearEstablished: "1874",
    heritageRank: {
      vi: "Di tích Kiến trúc Nghệ thuật cấp Thành phố",
      en: "Municipal Architectural & Artistic Heritage Site"
    },
    name: {
      vi: "Trường THPT Lê Quý Đôn (Collège Chasseloup-Laubat)",
      en: "Le Quy Don High School (Collège Chasseloup-Laubat)"
    },
    address: {
      vi: "110 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
      en: "110 Nguyen Thi Minh Khai St, Vo Thi Sau Ward, District 3, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.77884,
      lng: 106.69315
    },
    openingHours: {
      vi: "7:00 - 17:30 (Thứ Hai - Thứ Bảy)",
      en: "7:00 AM - 5:30 PM (Monday - Saturday)"
    },
    phone: "(028) 3930 4608",
    ticketPrice: {
      vi: "Miễn phí tham quan kiến trúc (theo quy định nhà trường)",
      en: "Free admission for architecture viewing (campus regulations apply)"
    },
    summary: {
      vi: "Ngôi trường trung học đầu tiên và lâu đời nhất tại Sài Gòn (thành lập năm 1874), sở hữu kiến trúc Pháp thuộc cổ kính hơn 150 năm tuổi và là Di tích Kiến trúc Nghệ thuật cấp Thành phố.",
      en: "The oldest high school in Saigon and southern Vietnam (founded in 1874), boasting 150+ years of classical French colonial architecture and designated a Municipal Heritage site."
    },
    description: {
      vi: "Trường THPT Lê Quý Đôn được thành lập năm 1874 với tên gọi ban đầu là Collège Indigène (Trường Bản Xứ), sau đó đổi tên thành Collège Chasseloup-Laubat, Trung học Jean-Jacques Rousseau, và từ năm 1967 mang tên nhà bác học Lê Quý Đôn. Ngôi trường tọa lạc trên khuôn viên rợp bóng mát cổ thụ ngay trung tâm Quận 3, liền kề Dinh Độc Lập và Công viên Tao Đàn. Về mặt kiến trúc, trường mang đậm dấu ấn kiến trúc trường học thời Đệ Tam Cộng Hòa Pháp: các dãy phòng học hai tầng lợp ngói đỏ, hành lang vòm (arcades) dài và thoáng mát giúp che chắn mưa nắng nhiệt đới, cửa sổ lá sách gỗ màu xanh ngọc bích cổ điển, và các hàng cột chịu lực thanh thoát.",
      en: "Founded in 1874 initially as Collège Indigène and later Collège Chasseloup-Laubat, then Jean-Jacques Rousseau, and named after polymath Le Quy Don in 1967. Situated on a serene tree-lined campus adjacent to Independence Palace and Tao Dan Park, the school is an extraordinary masterpiece of French Third Republic colonial educational architecture, featuring arched arcades, terracotta tiled roofs, and iconic emerald-green louvers."
    },
    history: {
      vi: "Khởi công xây dựng vào năm 1874 và hoàn thành năm 1877, đây là cơ sở giáo dục trung học đầu tiên của Sài Gòn và toàn xứ Nam Kỳ. Trong hơn 150 năm lịch sử, trường đã đào tạo nhiều thế hệ nhân tài kiệt xuất của đất nước như Giáo sư Trần Văn Giàu (nhà cách mạng, nhà sử học và triết học lỗi lạc), Nhà khảo cứu văn hóa Vương Hồng Sển, Nhạc sĩ Trịnh Công Sơn, Nhà toán học đầu ngành Lê Văn Thiêm, Giáo sư Phạm Thiều, Nhà nghiên cứu Nguyễn Đình Đầu, cùng cựu Quốc vương Campuchia Norodom Sihanouk. Năm 2020, trường chính thức được UBND TP.HCM công nhận và xếp hạng là Di tích Kiến trúc Nghệ thuật cấp Thành phố.",
      en: "Completed in 1877 after construction began in 1874, it is the first secondary school established in Saigon and Cochinchina. Over its 150-year legacy, the school educated generations of Vietnam's distinguished leaders, philosophers, and artists including revolutionary scholar Tran Van Giau, cultural historian Vuong Hong Sen, legendary composer Trinh Cong Son, pioneer mathematician Le Van Thiem, and King Norodom Sihanouk of Cambodia. In 2020, it was awarded official Municipal Architectural & Artistic Heritage status."
    },
    highlights: {
      vi: [
        "Ngôi trường trung học đầu tiên và lâu đời nhất TP.HCM với bề dày lịch sử hơn 150 năm (từ 1874)",
        "Di tích Kiến trúc Nghệ thuật cấp Thành phố với dãy hành lang vòm (arcades) kiểu Pháp cổ điển độc đáo",
        "Khuôn viên xanh rợp bóng các cây cổ thụ xà cừ, phượng vĩ trăm năm tuổi",
        "Nơi lưu dấu kỷ niệm học tập của nhiều danh nhân: GS. Trần Văn Giàu, nhạc sĩ Trịnh Công Sơn, học giả Vương Hồng Sển",
        "Phòng truyền thống trưng bày hàng trăm tư liệu, hiện vật quý báu qua ba thế kỷ giáo dục",
        "Vị trí đắc địa tại góc phố Nguyễn Thị Minh Khai - Lê Quý Đôn liền kề Dinh Độc Lập và Tao Đàn"
      ],
      en: [
        "Oldest secondary educational institution in Ho Chi Minh City with 150+ years of heritage (since 1874)",
        "Designated Municipal Architectural Heritage site showcasing classic French colonial arcaded corridors",
        "Lush tranquil courtyard shaded by century-old tropical mahogany and flamboyant trees",
        "Alma mater to legendary figures including scholar Tran Van Giau, composer Trinh Cong Son, and polymath Vuong Hong Sen",
        "School Heritage Museum curating historic memorabilia across three centuries",
        "Prime location at the corner of Nguyen Thi Minh Khai & Le Quy Don streets next to Independence Palace"
      ]
    },
    alumni: [
      { name: "GS. Trần Văn Giàu", role: "Nhà cách mạng, Nhà sử học & Triết học lỗi lạc" },
      { name: "Học giả Vương Hồng Sển", role: "Nhà văn hóa, Nhà khảo cứu cổ ngoạn danh tiếng" },
      { name: "Nhạc sĩ Trịnh Công Sơn", role: "Nhạc sĩ thiên tài của nền tân nhạc Việt Nam" },
      { name: "GS. Lê Văn Thiêm", role: "Tiến sĩ Toán học đầu tiên của Việt Nam" },
      { name: "Norodom Sihanouk", role: "Cựu Quốc vương Campuchia (thời Chasseloup-Laubat)" }
    ],
    coverImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Di tích Lịch sử Kiến trúc Trường THPT Lê Quý Đôn",
        url: "/assets/audio/Attention.mp3",
        duration: "3:45"
      },
      en: {
        title: "Le Quy Don High School Heritage & Architecture Tour",
        url: "/assets/audio/Attention.mp3",
        duration: "3:30"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã tìm hiểu lịch sử 150 năm Trường THPT Lê Quý Đôn",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to discover 150-year history of Le Quy Don High School",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: [
      "bun-bo-hue-le-quy-don",
      "quan-an-ngon",
      "tram-cafe-ngo-thoi-nhiem",
      "okio-caffe",
      "tra-sua-bo-gia-le-quy-don"
    ],
    sources: "Sở Văn hóa & Thể thao TP.HCM - Hồ sơ Di tích Kiến trúc Nghệ thuật THPT Lê Quý Đôn (2020)"
  },
  {
    id: "bao-tang-my-thuat",
    slug: "bao-tang-my-thuat",
    published: true,
    category: "culture",
    district: "Quận 1",
    name: {
      vi: "Bảo tàng Mỹ thuật TP. Hồ Chí Minh",
      en: "Ho Chi Minh City Museum of Fine Arts"
    },
    address: {
      vi: "97A Phó Đức Chính, Phường Nguyễn Thái Bình, Quận 1, TP. Hồ Chí Minh",
      en: "97A Pho Duc Chinh St, Nguyen Thai Binh Ward, District 1, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.7699,
      lng: 106.6998
    },
    openingHours: {
      vi: "8:00 - 17:00 hàng ngày",
      en: "8:00 AM - 5:00 PM daily"
    },
    phone: "(028) 3829 4441",
    ticketPrice: {
      vi: "30.000 VNĐ / người",
      en: "30,000 VND / person"
    },
    summary: {
      vi: "Dinh thự cổ lộng lẫy kết hợp tinh hoa kiến trúc Pháp - Hoa từng thuộc sở hữu của thương nhân Hứa Bổn Hỏa (Chú Hỏa), lưu giữ hơn 20.000 tác phẩm mỹ thuật quý giá.",
      en: "A stunning mansion blending French and Chinese architectural aesthetics once owned by tycoon Hui Bon Hoa, housing over 20,000 prized works of art."
    },
    description: {
      vi: "Bảo tàng gồm ba tòa nhà tráng lệ xây dựng từ năm 1929 đến 1934 theo thiết kế của kiến trúc sư người Pháp Rivera. Nơi đây sở hữu chiếc thang máy cổ bằng gỗ đầu tiên tại Sài Gòn cùng hệ thống cửa kính màu Art Nouveau rực rỡ.",
      en: "Comprising three grand buildings constructed between 1929 and 1934 by French architect Rivera, featuring Saigon's earliest antique wooden elevator and luminous Art Nouveau stained glass."
    },
    history: {
      vi: "Từng là tư dinh và trụ sở kinh doanh của gia tộc Chú Hỏa - một trong tứ đại phú hộ Sài Gòn xưa. Sau năm 1975, tòa nhà được chuyển giao làm Bảo tàng Mỹ thuật và mở cửa đón công chúng từ năm 1991.",
      en: "Originally the opulent residence and headquarters of tycoon Hui Bon Hoa's enterprise. Converted into the Fine Arts Museum in 1987 and inaugurated in 1991."
    },
    highlights: {
      vi: [
        "Kiến trúc biệt thự thuộc địa lộng lẫy với thang máy gỗ cổ nhất Sài Gòn",
        "Bộ sưu tập tranh sơn mài, lụa và tác phẩm của các danh họa trường Mỹ thuật Đông Dương",
        "Các ô cửa kính màu và nền gạch bông hoa văn châu Âu tuyệt đẹp",
        "Không gian chụp ảnh nghệ thuật được yêu thích hàng đầu thành phố"
      ],
      en: [
        "Grand colonial mansion featuring Saigon's oldest antique wooden elevator",
        "Masterpiece collections of lacquer, silk, and Indochina Fine Arts College masters",
        "Vibrant Art Nouveau stained glass and heritage European mosaic tiles",
        "One of the city's premier artistic photography landmarks"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Bảo tàng Mỹ thuật TP.HCM",
        url: "/assets/audio/Attention.mp3",
        duration: "3:15"
      },
      en: {
        title: "HCMC Fine Arts Museum Audio Tour",
        url: "/assets/audio/Attention.mp3",
        duration: "3:00"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để xem các triển lãm hiện hành",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to view ongoing exhibitions",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["quan-an-ngon", "banh-mi-huynh-hoa", "the-workshop-coffee"],
    sources: "Bảo tàng Mỹ thuật TP. Hồ Chí Minh"
  },
  {
    id: "chua-xa-loi",
    slug: "chua-xa-loi",
    published: true,
    category: "spiritual",
    district: "Quận 3",
    name: {
      vi: "Chùa Xá Lợi",
      en: "Xa Loi Pagoda"
    },
    address: {
      vi: "89 Bà Huyện Thanh Quan, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
      en: "89 Ba Huyen Thanh Quan St, Vo Thi Sau Ward, District 3, Ho Chi Minh City"
    },
    coordinates: {
      lat: 10.7781,
      lng: 106.6872
    },
    openingHours: {
      vi: "6:00 - 11:30 & 14:00 - 19:30 hàng ngày",
      en: "6:00 AM - 11:30 AM & 2:00 PM - 7:30 PM daily"
    },
    phone: "(028) 3930 0114",
    ticketPrice: {
      vi: "Miễn phí",
      en: "Free"
    },
    summary: {
      vi: "Ngôi chùa lịch sử nổi tiếng tại Quận 3 với tháp chuông 7 tầng cao 32m và chiếc chuông đồng nặng 2 tấn, từng là trung tâm của phong trào Phật giáo năm 1963.",
      en: "A historic pagoda in District 3 famous for its 32-meter 7-story bell tower and 2-ton bronze bell, historic center of the 1963 Buddhist movement."
    },
    description: {
      vi: "Chùa Xá Lợi được khởi công xây dựng năm 1956 để tôn thờ ngọc Xá lợi của Đức Phật Thích Ca. Chùa mang phong cách kiến trúc hiện đại kết hợp đường nét truyền thống Á Đông, khuôn viên rợp bóng mát cây bồ đề thanh tịnh giữa lòng Quận 3.",
      en: "Constructed in 1956 to enshrine sacred Buddha relics. Designed in an elegant modern Buddhist style with lush Bodhi trees providing peace in the heart of District 3."
    },
    history: {
      vi: "Chùa là cái nôi lịch sử của cuộc đấu tranh Phật giáo năm 1963 đòi bình đẳng tôn giáo. Tháp chuông 7 tầng khánh thành năm 1961 là tháp chuông cao nhất Việt Nam lúc bấy giờ.",
      en: "The historic headquarters of the 1963 Buddhist movement for religious equality. Its 7-story bell tower opened in 1961 was the tallest in Vietnam at the time."
    },
    highlights: {
      vi: [
        "Tháp chuông 7 tầng cao 32m với đại hồng chung nặng hơn 2 tấn",
        "Nơi tôn thờ ngọc Xá lợi Phật tôn kính thiêng liêng",
        "Bộ tranh tường bích họa cuộc đời Đức Phật Thích Ca của họa sĩ Nguyễn Văn Long",
        "Không gian thiền tịnh, yên bình giữa trung tâm Quận 3"
      ],
      en: [
        "32-meter 7-story bell tower housing a 2-ton bronze bell",
        "Sacred shrine safeguarding holy Buddha relics",
        "Magnificent wall murals depicting Buddha's life by artist Nguyen Van Long",
        "Tranquil spiritual oasis in the heart of District 3"
      ]
    },
    coverImageUrl: "https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    audioGuide: {
      vi: {
        title: "Thuyết minh Chùa Xá Lợi",
        url: "/assets/audio/Attention.mp3",
        duration: "3:00"
      },
      en: {
        title: "Xa Loi Pagoda Audio Tour",
        url: "/assets/audio/Attention.mp3",
        duration: "2:50"
      }
    },
    qrGuide: {
      vi: {
        title: "Quét mã để tìm hiểu lịch sử Chùa Xá Lợi",
        imageUrl: "/assets/qr/sample-qr.svg"
      },
      en: {
        title: "Scan to learn about Xa Loi Pagoda",
        imageUrl: "/assets/qr/sample-qr.svg"
      }
    },
    venueIds: ["pho-hoa-pasteur", "quan-an-ngon"],
    sources: "Giáo hội Phật giáo Việt Nam - Chùa Xá Lợi TP.HCM"
  }
];

export const DEMO_VENUES = [
  {
    id: "quan-an-ngon",
    published: true,
    type: "restaurant",
    category: "Vietnamese Traditional",
    name: {
      vi: "Quán Ăn Ngon - Nam Kỳ Khởi Nghĩa",
      en: "Quan An Ngon Restaurant"
    },
    address: {
      vi: "138 Nam Kỳ Khởi Nghĩa, Phường Bến Nghé, Quận 1, TP.HCM",
      en: "138 Nam Ky Khoi Nghia St, Ben Nghe Ward, District 1, HCMC"
    },
    description: {
      vi: "Không gian biệt thự Pháp cổ kính phục vụ hàng trăm món ngon truyền thống ba miền Bắc - Trung - Nam ngay đối diện Dinh Độc Lập.",
      en: "Set in a charming French colonial villa serving authentic specialties from all three regions of Vietnam, right opposite the Independence Palace."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7761,
      lng: 106.69615
    },
    googleMapsQuery: "Quan An Ngon 138 Nam Ky Khoi Nghia Quan 1",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Quan+An+Ngon+138+Nam+Ky+Khoi+Nghia+Quan+1",
    placeIds: ["dinh-doc-lap", "bao-tang-chung-tich-chien-tranh", "ho-con-rua", "nha-tho-duc-ba", "thpt-le-quy-don", "place-1792160140411"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  },
  {
    id: "bun-bo-hue-le-quy-don",
    published: true,
    type: "restaurant",
    category: "Traditional Noodle",
    name: {
      vi: "Bún bò Huế Lê Quý Đôn",
      en: "Le Quy Don Hue Beef Noodle"
    },
    address: {
      vi: "48 Lê Quý Đôn, Phường Võ Thị Sáu, Quận 3, TP.HCM",
      en: "48 Le Quy Don St, Vo Thi Sau Ward, District 3, HCMC"
    },
    description: {
      vi: "Quán bún bò Huế thơm lừng ngay sát trường THPT Lê Quý Đôn (cách chỉ 80m). Nước dùng hầm xương ngọt thanh, chả cua giòn ngọt, bắp bò mềm và ớt sa tế cay nồng chuẩn vị cố đô.",
      en: "Savory Hue-style beef noodle soup located right beside Le Quy Don High School (80m away), famed for aromatic rich broth, handmade crab patties, and tender beef shank."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.77885,
      lng: 106.69175
    },
    googleMapsQuery: "Bun Bo Hue 48 Le Quy Don Quan 3",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bun+Bo+Hue+48+Le+Quy+Don+Quan+3",
    placeIds: ["thpt-le-quy-don", "place-1792160140411", "bao-tang-chung-tich-chien-tranh", "dinh-doc-lap"],
    sources: "Ẩm thực Quận 3 tuyển chọn"
  },
  {
    id: "tram-cafe-ngo-thoi-nhiem",
    published: true,
    type: "drink",
    category: "Heritage Vintage Cafe",
    name: {
      vi: "Trầm Cafe - Ngô Thời Nhiệm",
      en: "Tram Cafe - Ngo Thoi Nhiem"
    },
    address: {
      vi: "100 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM",
      en: "100 Ngo Thoi Nhiem St, Vo Thi Sau Ward, District 3, HCMC"
    },
    description: {
      vi: "Không gian cà phê gỗ trầm mặc, hồ nước rêu phong và tiếng nhạc Trịnh Công Sơn êm dịu, cách trường Lê Quý Đôn chỉ 200m. Điểm hẹn quen thuộc của giới văn nghệ sĩ và học sinh sinh viên.",
      en: "A secluded tranquil vintage wooden cafe with koi ponds and soothing acoustic melodies, located just 200m from Le Quy Don High School."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.77945,
      lng: 106.6891
    },
    googleMapsQuery: "Tram Cafe 100 Ngo Thoi Nhiem Quan 3",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tram+Cafe+100+Ngo+Thoi+Nhiem+Quan+3",
    placeIds: ["thpt-le-quy-don", "place-1792160140411", "ho-con-rua", "bao-tang-chung-tich-chien-tranh"],
    sources: "Cà phê Quận 3 tuyển chọn"
  },
  {
    id: "tra-sua-bo-gia-le-quy-don",
    published: true,
    type: "drink",
    category: "Student Street Drink",
    name: {
      vi: "Trà sữa & Ăn vặt Bố Già - Cổng trường Lê Quý Đôn",
      en: "Bo Gia Milk Tea & Snacks - Le Quy Don"
    },
    address: {
      vi: "Góc Lê Quý Đôn - Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
      en: "Corner of Le Quy Don & Nguyen Thi Minh Khai St, District 3, HCMC"
    },
    description: {
      vi: "Quán ăn vặt và trà sữa trứ danh gắn liền với tuổi học trò của bao thế hệ học sinh Lê Quý Đôn với trà đào, trà sữa thái xanh, bánh tráng trộn và cá viên chiên.",
      en: "A legendary street snack and milk tea stall beloved by generations of Le Quy Don students, serving signature iced peach teas and Vietnamese street snacks."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1558857563-b37cb3370f68?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7781,
      lng: 106.69245
    },
    googleMapsQuery: "Tra sua Bo Gia Le Quy Don Quan 3",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Le+Quy+Don+Nguyen+Thi+Minh+Khai+Quan+3",
    placeIds: ["thpt-le-quy-don", "place-1792160140411"],
    sources: "Ăn vặt tuổi học trò Sài Gòn"
  },
  {
    id: "banh-mi-huynh-hoa",
    published: true,
    type: "restaurant",
    category: "Street Food",
    name: {
      vi: "Bánh mì Huỳnh Hoa",
      en: "Banh Mi Huynh Hoa"
    },
    address: {
      vi: "26 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP.HCM",
      en: "26 Le Thi Rieng St, Ben Thanh Ward, District 1, HCMC"
    },
    description: {
      vi: "Thương hiệu bánh mì nổi tiếng nhất Sài Gòn với ổ bánh mì 'khổng lồ' đầy ắp pate béo ngậy, bơ hảo hạng, chả lụa và giăm bông.",
      en: "Saigon's most famous banh mi spot, loaded generously with rich house-made pate, creamy butter, Vietnamese ham, and crunchy pickles."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.77062,
      lng: 106.6924
    },
    googleMapsQuery: "Banh Mi Huynh Hoa 26 Le Thi Rieng Quan 1",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Banh+Mi+Huynh+Hoa+26+Le+Thi+Rieng+Quan+1",
    placeIds: ["cho-ben-thanh", "dinh-doc-lap"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  },
  {
    id: "pho-hoa-pasteur",
    published: true,
    type: "restaurant",
    category: "Traditional Noodle",
    name: {
      vi: "Phở Hòa Pasteur",
      en: "Pho Hoa Pasteur"
    },
    address: {
      vi: "260C Pasteur, Phường Võ Thị Sáu, Quận 3, TP.HCM",
      en: "260C Pasteur St, Vo Thi Sau Ward, District 3, HCMC"
    },
    description: {
      vi: "Quán phở truyền thống lâu đời bậc nhất Sài Gòn hơn 50 năm tuổi, nước dùng đậm đà hương thảo mộc, thịt bò mềm và đĩa rau thơm tươi ngon.",
      en: "One of Saigon's most storied pho establishments with over 50 years of tradition, renowned for deeply flavorful broth and fresh herbs."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7876,
      lng: 106.68865
    },
    googleMapsQuery: "Pho Hoa Pasteur 260C Pasteur Quan 3",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pho+Hoa+Pasteur+260C+Pasteur+Quan+3",
    placeIds: ["chua-vinh-nghiem", "bao-tang-chung-tich-chien-tranh", "ho-con-rua"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  },
  {
    id: "com-tam-dai-han",
    published: true,
    type: "restaurant",
    category: "Historical & Local Dish",
    name: {
      vi: "Cơm tấm Đại Hàn - Cà phê Đỗ Phủ",
      en: "Do Phu Cafe - Korean Style Broken Rice"
    },
    address: {
      vi: "113A Đặng Dung, Phường Tân Định, Quận 1, TP.HCM",
      en: "113A Dang Dung St, Tan Dinh Ward, District 1, HCMC"
    },
    description: {
      vi: "Địa chỉ độc nhất vô nhị: vừa thưởng thức cơm tấm sườn nướng kèm kim chi, vừa tham quan hầm bí mật của lực lượng Biệt động Sài Gòn năm xưa.",
      en: "A one-of-a-kind destination where you can savor delicious broken rice while exploring the secret underground bunker used by the Saigon Commandos."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7925,
      lng: 106.6898
    },
    googleMapsQuery: "Ca phe Do Phu Com tam Dai Han 113A Dang Dung Quan 1",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ca+phe+Do+Phu+Com+tam+Dai+Han+113A+Dang+Dung+Quan+1",
    placeIds: ["chua-vinh-nghiem", "bao-tang-chung-tich-chien-tranh"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  },
  {
    id: "the-workshop-coffee",
    published: true,
    type: "drink",
    category: "Specialty Coffee",
    name: {
      vi: "The Workshop Specialty Coffee",
      en: "The Workshop Specialty Coffee"
    },
    address: {
      vi: "Lầu 2, 27 Ngô Đức Kế, Phường Bến Nghé, Quận 1, TP.HCM",
      en: "2nd Floor, 27 Ngo Duc Ke St, Ben Nghe Ward, District 1, HCMC"
    },
    description: {
      vi: "Quán cà phê specialty tiên phong tại Sài Gòn với phong cách công nghiệp (industrial chic) cùng đa dạng phương pháp pha chế thủ công đỉnh cao.",
      en: "Saigon's pioneering specialty coffee roaster, featuring industrial-chic loft aesthetics and masterfully brewed pour-over selections."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7735,
      lng: 106.7042
    },
    googleMapsQuery: "The Workshop Coffee 27 Ngo Duc Ke Quan 1",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Workshop+Coffee+27+Ngo+Duc+Ke+Quan+1",
    placeIds: ["nha-hat-thanh-pho", "cho-ben-thanh", "dinh-doc-lap", "nha-tho-duc-ba"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  },
  {
    id: "cong-caphe-ly-tu-trong",
    published: true,
    type: "drink",
    category: "Retro Cafe",
    name: {
      vi: "Cộng Cà Phê - Lý Tự Trọng",
      en: "Cong Caphe - Ly Tu Trong"
    },
    address: {
      vi: "26 Lý Tự Trọng, Phường Bến Nghé, Quận 1, TP.HCM",
      en: "26 Ly Tu Trong St, Ben Nghe Ward, District 1, HCMC"
    },
    description: {
      vi: "Không gian hoài niệm thời bao cấp độc đáo, nổi tiếng với món Cà phê cốt dừa thơm béo và view nhìn thẳng ra khu trung tâm nhộn nhịp.",
      en: "Vintage retro ambiance inspired by Vietnam's subsidy era, famous for its signature rich iced coconut coffee."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7774,
      lng: 106.7018
    },
    googleMapsQuery: "Cong Caphe 26 Ly Tu Trong Quan 1",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Cong+Caphe+26+Ly+Tu+Trong+Quan+1",
    placeIds: ["nha-tho-duc-ba", "buu-dien-trung-tam", "duong-sach-nguyen-van-binh", "dinh-doc-lap"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  },
  {
    id: "okio-caffe",
    published: true,
    type: "drink",
    category: "Artisan Cafe & Bakery",
    name: {
      vi: "OKIO Caffe - Nguyễn Du",
      en: "OKIO Caffe - Nguyen Du"
    },
    address: {
      vi: "120 Nguyễn Du, Phường Bến Nghé, Quận 1, TP.HCM",
      en: "120 Nguyen Du St, Ben Nghe Ward, District 1, HCMC"
    },
    description: {
      vi: "Quán cà phê tối giản phong cách Nhật - Bắc Âu ẩn mình dưới bóng cây rợp mát bên cạnh Bưu điện Trung tâm và Nhà thờ Đức Bà.",
      en: "A serene minimalist cafe offering specialty brew and fresh pastries, nestled under heritage shade trees near the Central Post Office."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7792,
      lng: 106.6985
    },
    googleMapsQuery: "OKIO Caffe 120 Nguyen Du Quan 1",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=OKIO+Caffe+120+Nguyen+Du+Quan+1",
    placeIds: ["nha-tho-duc-ba", "buu-dien-trung-tam", "duong-sach-nguyen-van-binh", "ho-con-rua", "thpt-le-quy-don", "place-1792160140411"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  },
  {
    id: "cafe-vot-phan-dinh-phung",
    published: true,
    type: "drink",
    category: "Heritage Street Coffee",
    name: {
      vi: "Cà phê Vợt Phan Đình Phùng",
      en: "Vintage Net Filter Coffee"
    },
    address: {
      vi: "330/2 Phan Đình Phùng, Phường 1, Quận Phú Nhuận (Giáp ranh Quận 3), TP.HCM",
      en: "330/2 Phan Dinh Phung St, Ward 1, Phu Nhuan Dist (Bordering Dist 3), HCMC"
    },
    description: {
      vi: "Quán cà phê vợt thâm niên hơn 60 năm đỏ lửa 24/24 bằng bếp củi, lưu giữ hương vị cà phê mộc mạc nguyên bản của người Sài Gòn xưa.",
      en: "A 60-year-old traditional wood-fired net-filter coffee stall brewing around the clock, keeping authentic vintage Saigon coffee soul alive."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7962,
      lng: 106.6821
    },
    googleMapsQuery: "Ca phe Vot 330/2 Phan Dinh Phung",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ca+phe+Vot+330%2F2+Phan+Dinh+Phung",
    placeIds: ["chua-vinh-nghiem"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  },
  {
    id: "trung-nguyen-legend-dong-khoi",
    published: true,
    type: "drink",
    category: "Vietnamese Heritage Coffee",
    name: {
      vi: "Trung Nguyên Legend Café - Đồng Khởi",
      en: "Trung Nguyen Legend Cafe - Dong Khoi"
    },
    address: {
      vi: "80 Đồng Khởi, Phường Bến Nghé, Quận 1, TP.HCM",
      en: "80 Dong Khoi St, Ben Nghe Ward, District 1, HCMC"
    },
    description: {
      vi: "Không gian cà phê năng lượng sang trọng ngay trên con phố thời thượng bậc nhất Sài Gòn, phục vụ cà phê phin truyền thống và bộ sưu tập sách đổi đời.",
      en: "An elegant coffee lounge along fashionable Dong Khoi boulevard, serving rich traditional drip coffee alongside inspirational book libraries."
    },
    coverImageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    coordinates: {
      lat: 10.7748,
      lng: 106.7035
    },
    googleMapsQuery: "Trung Nguyen Legend 80 Dong Khoi Quan 1",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Trung+Nguyen+Legend+80+Dong+Khoi+Quan+1",
    placeIds: ["nha-hat-thanh-pho", "cho-ben-thanh"],
    sources: "Ẩm thực Sài Gòn chọn lọc"
  }
];

export const DEMO_SITE_CONTENT = {
  backgroundMusicUrl: "",
  mascotImageUrl: "/assets/mascot/guide-mascot.svg",
  hero: {
    coverImageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1800&q=80",
    title: {
      vi: "Khám Phá Sài Gòn - Thành Phố Hồ Chí Minh",
      en: "Explore Saigon - Ho Chi Minh City"
    },
    subtitle: {
      vi: "Bản đồ du lịch tương tác, câu chuyện lịch sử văn hóa và ẩm thực đặc sắc tại Quận 1 & Quận 3",
      en: "Interactive tourism map, cultural heritage stories, and culinary gems across District 1 & District 3"
    },
    exploreButton: {
      vi: "Khám phá bản đồ",
      en: "Explore the Map"
    }
  },
  about: {
    title: {
      vi: "Sài Gòn - Hòn Ngọc Viễn Đông",
      en: "Saigon - The Pearl of the Far East"
    },
    lead: {
      vi: "Thành phố Hồ Chí Minh là trung tâm kinh tế, văn hóa và giáo dục năng động bậc nhất Việt Nam. Trải qua hơn 300 năm hình thành và phát triển, thành phố là sự hòa quyện tuyệt đẹp giữa nét cổ kính phương Đông, kiến trúc tráng lệ của phương Tây và nhịp sống trẻ trung, hiếu khách thời hội nhập.",
      en: "Ho Chi Minh City is the vibrant economic, cultural, and educational hub of Vietnam. With over 300 years of rich history, it is an enchanting fusion of Eastern heritage, elegant French colonial architecture, and a dynamic, hospitable modern pulse."
    },
    timeline: [
      {
        era: "1698 - 1859",
        title: {
          vi: "Khai hoang mở cõi & Lập phủ Gia Định",
          en: "Frontier Settlement & Gia Dinh Prefecture"
        },
        desc: {
          vi: "Lễ Thành hầu Nguyễn Hữu Cảnh vào Nam kinh lược, đặt nền móng hành chính đầu tiên cho xứ Sài Gòn - Gia Định.",
          en: "General Nguyen Huu Canh established formal administration, laying the foundation for modern Saigon."
        }
      },
      {
        era: "1859 - 1954",
        title: {
          vi: "Thời kỳ Pháp thuộc & Hòn Ngọc Viễn Đông",
          en: "French Colonial Era & The Pearl of the Orient"
        },
        desc: {
          vi: "Quy hoạch đô thị hiện đại kiểu phương Tây với các đại lộ rợp bóng cây, Bưu điện Trung tâm, Nhà thờ Đức Bà, Nhà hát lớn.",
          en: "Western-style urban planning with tree-lined boulevards, grand cathedrals, post offices, and municipal theaters."
        }
      },
      {
        era: "1975 - Nay",
        title: {
          vi: "Đổi mới & Đô thị thông minh hiện đại",
          en: "Reunification & Dynamic Modern Metropolis"
        },
        desc: {
          vi: "Chuyển mình mạnh mẽ thành siêu đô thị năng động, hội nhập quốc tế nhưng vẫn nâng niu gìn giữ các giá trị di sản văn hóa cốt lõi.",
          en: "Rapid evolution into a modern global megacity while proudly cherishing and preserving its cultural roots."
        }
      }
    ]
  }
};
