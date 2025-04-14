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

localStorage.setItem('products', JSON.stringify(pro));


// DOM
const btnAddProduct = document.getElementById('btn-add-product');
const modal = document.getElementById('product-modal');
const form = document.getElementById('product-form');
const cancelBtn = document.getElementById('cancel-btn');
const productBody = document.getElementById('product-body');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');
const paginationContainer = document.getElementById('pagination');

// Biến toàn cục
let productList = [];
const PRODUCTS_PER_PAGE = 5;
let currentPage = 1;

// Load dữ liệu ban đầu
window.addEventListener('DOMContentLoaded', () => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    productList = JSON.parse(storedProducts);
    handleFilter(); // hiển thị phân trang đúng
  }
});

// Mở modal
btnAddProduct.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// Hủy modal
cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  form.reset();
});

// Thêm sản phẩm mới
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById('product-id').value.trim());
  const product_code = document.getElementById('product-id').value.trim(); // giống id để đơn giản
  const product_name = document.getElementById('product-name').value.trim();
  const category_id = parseInt(document.getElementById('product-category').value);
  const stock = parseInt(document.getElementById('product-quantity').value);
  const price = parseInt(document.getElementById('product-price').value.replace(/\D/g, ''));
  const discount = parseInt(document.getElementById('product-discount').value);
  const image = document.getElementById('product-image').value.trim();
  const description = document.getElementById('product-detail').value.trim();
  const status = document.querySelector('input[name="status"]:checked').value.toUpperCase();

  if (!id || !product_name || isNaN(price)) {
    alert("Vui lòng điền đầy đủ Mã, Tên và Giá sản phẩm!");
    return;
  }

  const newProduct = {
    id,
    product_code,
    product_name,
    category_id,
    stock,
    price,
    discount,
    image,
    status,
    description,
    created_at: new Date().toISOString()
  };

  if (editingIndex !== null) {
    // Cập nhật sản phẩm
    newProduct.created_at = productList[editingIndex].created_at; // giữ nguyên ngày tạo
    productList[editingIndex] = newProduct;
    editingIndex = null;
  } else {
    // Thêm sản phẩm mới
    productList.push(newProduct);
    currentPage = 1;
  }

  localStorage.setItem('products', JSON.stringify(productList));
  handleFilter();
  form.reset();
  modal.classList.add('hidden');
});


// Hiển thị danh sách sản phẩm
function renderProductTable(data) {
  productBody.innerHTML = "";

  data.forEach((product, index) => {
    const isActive = product.status === 'ACTIVE';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.product_name}</td>
      <td>${product.price.toLocaleString()} đ</td>
      <td>${product.stock}</td>
      <td>${product.discount}%</td>
      <td><span style="color: ${isActive ? 'green' : 'red'};">${isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span></td>
      <td>
        <button onclick="editProduct(${index})">✏️</button>
        <button onclick="deleteProduct(${index})">🗑️</button>
      </td>
    `;
    productBody.appendChild(row);
  });
}

// Xoá sản phẩm
function deleteProduct(index) {
  if (confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
    productList.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(productList));
    handleFilter();
  }
}

// Lọc & Phân trang
searchInput.addEventListener('input', handleFilter);
categoryFilter.addEventListener('change', handleFilter);
statusFilter.addEventListener('change', handleFilter);

function handleFilter() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;

  const filtered = productList.filter(product => {
    const matchKeyword =
      product.product_name.toLowerCase().includes(keyword) ||
      product.product_code.toLowerCase().includes(keyword) ||
      product.id.toString().includes(keyword) ||
      product.category_id.toString().includes(keyword);

    const matchCategory = selectedCategory === 'all' || product.category_id == selectedCategory;
    const matchStatus = selectedStatus === 'all' || product.status === selectedStatus;

    return matchKeyword && matchCategory && matchStatus;
  });

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedData = filtered.slice(start, start + PRODUCTS_PER_PAGE);

  renderProductTable(paginatedData);
  renderPagination(filtered.length);
}

// Phân trang
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  const createPageButton = (text, page, disabled = false, active = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (disabled) btn.disabled = true;
    if (active) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentPage = page;
      handleFilter();
    });
    return btn;
  };

  paginationContainer.appendChild(createPageButton("«", currentPage - 1, currentPage === 1));

  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.appendChild(createPageButton(i, i, false, i === currentPage));
  }

  paginationContainer.appendChild(createPageButton("»", currentPage + 1, currentPage === totalPages));
}


let editingIndex = null; // chỉ số sản phẩm đang chỉnh sửa


function editProduct(index) {
  const product = productList[index];
  editingIndex = index;

  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.product_name;
  document.getElementById('product-category').value = product.category_id;
  document.getElementById('product-quantity').value = product.stock;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-discount').value = product.discount;
  document.getElementById('product-image').value = product.image;
  document.getElementById('product-detail').value = product.description;

  document.querySelector(`input[name="status"][value="${product.status}"]`).checked = true;

  modal.classList.remove('hidden');
}
