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
let categoryList = [];
const PRODUCTS_PER_PAGE = 5;
let currentPage = 1;

// Load dữ liệu ban đầu
window.addEventListener('DOMContentLoaded', () => {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    categoryList = JSON.parse(storedCategories);
  }
 
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    productList = JSON.parse(storedProducts);
    handleFilter(); // hiển thị phân trang đúng
  }

  let row = '<option value="all">Tất cả danh mục</option>'
  categoryList.forEach((category, index) => {
    row += `<option value='${category.id}'>${category.category_name}</option>`
  });
  categoryFilter.innerHTML = row;
});
function showCartNotification(message, type = 'success') {
  const container = document.getElementById('notifications-container');

  if (!container) {
      console.error('Notification container not found!');
      return;
  }

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;

  const content = document.createElement('div');
  content.className = 'notification-content';

  const icon = document.createElement('i');
  icon.className = type === 'success' ? 'fa fa-check-circle' : 'fa fa-exclamation-circle';

  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  content.appendChild(icon);
  content.appendChild(textSpan);
  notification.appendChild(content);
  container.appendChild(notification);

  // Force reflow to ensure animation starts
  void notification.offsetHeight;

  notification.classList.add('show');

  setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
          notification.remove();
      }, 300); 
  }, 3000);
}


// Mở modal
btnAddProduct.addEventListener('click', () => {
  const product_category_dom = document.getElementById('product-category');

  let row = ''
  categoryList.forEach((category, index) => {
    row += `<option value='${category.id}'>${category.category_name}</option>`
  });
  product_category_dom.innerHTML = row;

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
  form.classList.add('was-validated');
  const id = document.getElementById('product-id').value.trim();
  const product_code = document.getElementById('product-id').value.trim(); // giống id để đơn giản
  const product_name = document.getElementById('product-name').value.trim();
  const category_id = parseInt(document.getElementById('product-category').value);

  const stock = parseInt(document.getElementById('product-quantity').value);
  const price = parseInt(document.getElementById('product-price').value.replace(/\D/g, ''));
  const discount = parseInt(document.getElementById('product-discount').value);
  const image = document.getElementById('product-image');
  const description = document.getElementById('product-detail').value.trim();
  const status = document.querySelector('input[name="status"]:checked').value.toUpperCase();

  // if (!id || !product_name || isNaN(price) || !image || !description) {
  
  //   var forms = document.querySelectorAll('.needs-validation')
  image.addEventListener('change',)
  let isValid = true;

  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (input.required && !input.value.trim()) {
      input.classList.add('is-invalid'); 
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.style.display = 'block'; 
      }
      isValid = false;
    } else {
      input.classList.remove('is-invalid'); 
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.style.display = 'none'; 
      }
    }
  });
  if (!isValid || !form.checkValidity()) {
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
    showCartNotification('success','Cập nhật thành công')

  } else {
  
    // Thêm sản phẩm 
    newProduct['index']=productList.length+1

    showCartNotification('success','Thêm sản xuất thành công')

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
  const selectedCategory = categoryFilter.value ? categoryFilter.value : 'all';
  const selectedStatus = statusFilter.value ? statusFilter.value : 'all';
  
  const filtered = productList.filter(product => {
    const matchKeyword =
      product.product_name.toLowerCase().includes(keyword) ||
      product.product_code.toLowerCase().includes(keyword) ||
      product.id.toString().includes(keyword) ||
      product.category_id.toString().includes(keyword);

    const matchCategory = selectedCategory === 'all'
    const matchStatus = selectedStatus === 'all'

    return matchKeyword && matchCategory && matchStatus;
  });

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedData = filtered.slice(start, start + PRODUCTS_PER_PAGE);

  console.log(paginatedData);
  
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
const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const deleteMessage = document.getElementById('delete-message');

let deleteIndex = null;

// Hiện popup xác nhận xoá
function deleteProduct(index) {
  deleteIndex = index;
  const product = productList[index];
  deleteMessage.textContent = `Bạn có chắc chắn muốn xoá sản phẩm "${product.product_name}" khỏi hệ thống không?`;
  confirmDeleteModal.classList.remove('hidden');
}

// Xác nhận xoá
confirmDeleteBtn.addEventListener('click', () => {
  if (deleteIndex !== null) {
    productList.splice(deleteIndex, 1);
    localStorage.setItem('products', JSON.stringify(productList));
    handleFilter();
    deleteIndex = null;
  }
  confirmDeleteModal.classList.add('hidden');
});

// Hủy xoá
cancelDeleteBtn.addEventListener('click', () => {
  confirmDeleteModal.classList.add('hidden');
  deleteIndex = null;
});