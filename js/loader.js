// Khởi tạo dữ liệu mẫu bán hoa quả
let pro = [
    {
        id: 1,
        product_code: "FR001",
        product_name: "Táo Mỹ",
        category_id: 1,
        stock: 150,
        price: 45000,
        discount: 10,
        image: "https://example.com/apple.jpg",
        status: "ACTIVE",
        description: "Táo Mỹ tươi giòn, ngọt tự nhiên, nhập khẩu chính ngạch.",
        created_at: "2023-01-01T00:00:00Z"
    },
    {
        id: 2,
        product_code: "FR002",
        product_name: "Cam Sành",
        category_id: 1,
        stock: 200,
        price: 30000,
        discount: 5,
        image: "https://example.com/orange.jpg",
        status: "ACTIVE",
        description: "Cam sành mọng nước, vị ngọt thanh, vỏ mỏng.",
        created_at: "2023-01-10T00:00:00Z"
    },
    {
        id: 3,
        product_code: "FR003",
        product_name: "Chuối Laba",
        category_id: 1,
        stock: 100,
        price: 25000,
        discount: 0,
        image: "https://example.com/banana.jpg",
        status: "ACTIVE",
        description: "Chuối Laba Đà Lạt, thơm ngon, nhiều dinh dưỡng.",
        created_at: "2023-02-01T00:00:00Z"
    },
    {
        id: 4,
        product_code: "FR004",
        product_name: "Xoài Cát Hòa Lộc",
        category_id: 1,
        stock: 120,
        price: 60000,
        discount: 8,
        image: "https://example.com/mango.jpg",
        status: "ACTIVE",
        description: "Xoài cát Hòa Lộc ngọt lịm, thơm đặc trưng.",
        created_at: "2023-02-15T00:00:00Z"
    },
    {
        id: 5,
        product_code: "FR005",
        product_name: "Nho Mỹ không hạt",
        category_id: 1,
        stock: 80,
        price: 110000,
        discount: 12,
        image: "https://example.com/grapes.jpg",
        status: "ACTIVE",
        description: "Nho Mỹ không hạt, ăn giòn ngọt, dùng ăn tươi hoặc ép nước.",
        created_at: "2023-03-01T00:00:00Z"
    },
    {
        id: 6,
        product_code: "FR006",
        product_name: "Dưa hấu ruột đỏ",
        category_id: 2,
        stock: 90,
        price: 20000,
        discount: 7,
        image: "https://example.com/watermelon.jpg",
        status: "ACTIVE",
        description: "Dưa hấu Long An ruột đỏ, ngọt mát, giải nhiệt cực tốt.",
        created_at: "2023-03-15T00:00:00Z"
    }
];

// Khởi tạo dữ liệu mẫu bán hoa quả
let cate = [
    {
        "id": 1,
        "category_code": "DM001",
        "category_name": "Hoa quả",
        "status": "ACTIVE",
        "created_at": "2021-01-01T00:00:00Z"
    },
    {
        "id": 2,
        "category_code": "DM002",
        "category_name": "Rau củ",
        "status": "INACTIVE",
        "created_at": "2021-01-01T00:00:00Z"
    }
]


//   Load dữ liệu ban đầu
window.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('products', JSON.stringify(pro));
    localStorage.setItem('categories', JSON.stringify(cate));
});