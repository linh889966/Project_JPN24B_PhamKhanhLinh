// DOM
const btnAddCategory = document.getElementById('btn-add-product');
const modal = document.getElementById('product-modal');
const form = document.getElementById('product-form');
const cancelBtn = document.getElementById('cancel-btn');
const categoryBody = document.getElementById('product-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const paginationContainer = document.getElementById('pagination');
const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const deleteMessage = document.getElementById('delete-message');

// Biến toàn cục
let categoryList =  [];
const CATEGORIES_PER_PAGE = 5;
let currentPage = 1;
let editingIndex = null; // vị tri thể loại đang chỉnh sửa
let deleteIndex = null;

// Load dữ liệu ban đầu
window.addEventListener('DOMContentLoaded', () => {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    categoryList = JSON.parse(storedCategories);
    // categoryList = categoryList.sort((a, b) => {
    //   const nameA = a.category_name.toUpperCase(); // ignore upper and lowercase
    //   const nameB = b.category_name.toUpperCase(); // ignore upper and lowercase
    //   if (nameA > nameB) {
    //     return -1;
    //   }
    //   if (nameA < nameB) {
    //     return 1;
    //   }
    
    //   // names must be equal
    //   return 0;
    // });

    handleFilter(); // hiển thị phân trang đúng
  }
});

// Mở modal
btnAddCategory.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// Hủy modal
cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  editingIndex = null;
  form.reset();
});

function showCartNotification(message, type = 'Thành công') {
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
  icon.className = type === 'Thành công' ? 'fa fa-check-circle' : 'fa fa-exclamation-circle';

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

// Thêm thể loại mới
form.addEventListener('submit', (e) => {
  e.preventDefault();
  categoryList = JSON.parse(localStorage.getItem('categories'));
  // categoryList = categoryList.sort((a, b) => {
  //   const nameA = a.category_name.toUpperCase(); // ignore upper and lowercase
  //   const nameB = b.category_name.toUpperCase(); // ignore upper and lowercase
  //   if (nameA > nameB) {
  //     return -1;
  //   }
  //   if (nameA < nameB) {
  //     return 1;
  //   }
  
  //   // names must be equal
  //   return 0;
  // });
  const code = document.getElementById('category-code').value.trim();
  const name = document.getElementById('category-name').value.trim();
  const status = document.querySelector('input[name="status"]:checked').value.toUpperCase();
  var checkCode = checkExists(code)
  var checkName = checkExists(name)
  if (!code ) {
    document.getElementById('error-code').textContent = 'Mã danh mục không được để trống'
    document.getElementById('error-code').style.display = 'block'
    document.getElementById('category-code').style.borderColor = 'red'
    return;
  }else{
    document.getElementById('error-code').style.display = 'none'
    document.getElementById('category-code').style.borderColor = 'black'
  }
  if (!name) {
     document.getElementById('error-name').textContent = 'Tên danh mục không được để trống'
    document.getElementById('category-name').style.borderColor = 'red'
    document.getElementById('error-name').style.display = 'block'
    return;
  }else{
    document.getElementById('error-name').style.display = 'none'
    document.getElementById('category-name').style.borderColor = 'black'
  }
  
  const newCategory = {
    category_code: code,
    category_name: name,
    status,
    created_at: new Date().toISOString()
  };
  

  if (editingIndex !== null) {
    if (checkCode.length > 1 || checkName.length > 1){
      alert("Mã hoặc Tên không được trùng nhau!");
      return;
    }
    // Cập nhật thể loại
    newCategory.id = categoryList[editingIndex].id;
    newCategory.created_at = categoryList[editingIndex].created_at; // giữ nguyên ngày tạo
    categoryList[editingIndex] = newCategory;
    editingIndex = null;
    showCartNotification('Thành công','Cập nhật thành công')
  } else {
    if (checkCode.length > 0) {
      document.getElementById('error-code').textContent = 'Mã code đã bị trùng!'
      document.getElementById('error-code').style.display = 'block'
      document.getElementById('category-code').style.borderColor = 'red'
      return;
    }else{
      document.getElementById('error-code').style.display = 'none'
      document.getElementById('category-code').style.borderColor = 'black'
    }
    if (checkName.length > 0) {
      document.getElementById('error-name').textContent = 'Tên đã bị trùng!'
      document.getElementById('error-name').style.display = 'block'
      document.getElementById('category-name').style.borderColor = 'red'
      return;
    }else{
      document.getElementById('error-name').style.display = 'none'
      document.getElementById('category-name').style.borderColor = 'black'
    }
    // Thêm thể loại mới
    newCategory.id = categoryList[categoryList.length - 1].id + 1,
    categoryList.push(newCategory);
    currentPage = 1;
    showCartNotification('Thành công','Thêm thành công')
  }

  localStorage.setItem('categories', JSON.stringify(categoryList));
  handleFilter();
  form.reset();
  modal.classList.add('hidden');
});

function checkExists(val){
  val = val.toLowerCase().trim();
  return categoryList.filter(item => item.category_code.toLowerCase()  == val || item.category_name.toLowerCase()  == val)
}

function findIndexById (id){
  categoryList = JSON.parse(localStorage.getItem('categories'));
  // categoryList = categoryList.sort((a, b) => {
  //   const nameA = a.category_name.toUpperCase(); // ignore upper and lowercase
  //   const nameB = b.category_name.toUpperCase(); // ignore upper and lowercase
  //   if (nameA > nameB) {
  //     return -1;
  //   }
  //   if (nameA < nameB) {
  //     return 1;
  //   }
  
  //   // names must be equal
  //   return 0;
  // });
  return categoryList.findIndex(item => item.id === id);
}


// Hiển thị danh sách thể loại
function renderCategoryTable(data) {
  categoryBody.innerHTML = "";
  data.forEach((category, index) => {
    const isActive = category.status === 'ACTIVE';
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${category.id}</td>
        <td>${category.category_code}</td>
        <td>${category.category_name}</td>
        <td><span style="color: ${isActive ? 'green' : 'red'};">${isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span></td>
        <td>${category.created_at}</td>
        
        <td>
          <button onclick="editCategory(${category.id})">✏️</button>
          <button onclick="deleteCategory(${category.id})">🗑️</button>
        </td>
      `;
    categoryBody.appendChild(row);
  });
}

// Lọc & Phân trang
searchInput.addEventListener('input', handleFilter);
statusFilter.addEventListener('change', handleFilter);

function handleFilter() {
  categoryList = JSON.parse(localStorage.getItem('categories'));
  categoryList = categoryList.reverse()

  const keyword = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const filtered = categoryList.filter(category => {
    const matchKeyword =
      category.category_name.toLowerCase().includes(keyword) ||
      category.category_code.toLowerCase().includes(keyword) ||
      category.id.toString().includes(keyword);

    const matchStatus = selectedStatus === 'all' || category.status === selectedStatus;

    return matchKeyword && matchStatus;
  });

  categoryList = filtered;
  const start = (currentPage - 1) * CATEGORIES_PER_PAGE;
  const paginatedData = filtered.slice(start, start + CATEGORIES_PER_PAGE);
  
  renderCategoryTable(paginatedData);
  renderPagination(filtered.length);
}

// Phân trang
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / CATEGORIES_PER_PAGE);
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

function editCategory(index) {
  modal.classList.remove('hidden');
  console.log(findIndexById(index));
  
  const category = categoryList[findIndexById(index)];
  editingIndex = findIndexById(index);
  document.getElementById('category-code').value = category.category_code;
  document.getElementById('category-name').value = category.category_name;
  document.querySelector(`input[name="status"][value="${category.status}"]`).checked = true;
  
  modal.classList.remove('hidden');
}

// Hiện popup xác nhận xoá
function deleteCategory(index) {
  deleteIndex = findIndexById(index);
  const category = categoryList[deleteIndex];
  deleteMessage.textContent = `Bạn có chắc chắn muốn xoá thể loại "${category.category_name}" khỏi hệ thống không?`;
  confirmDeleteModal.classList.remove('hidden');
}

// Xác nhận xoá
confirmDeleteBtn.addEventListener('click', () => {
  if (deleteIndex !== null) {
    categoryList.splice(deleteIndex, 1);
    localStorage.setItem('categories', JSON.stringify(categoryList));
    handleFilter();
    deleteIndex = null;
    showCartNotification('Thành công','Xóa thành công')
  }
  confirmDeleteModal.classList.add('hidden');
});

// Hủy xoá
cancelDeleteBtn.addEventListener('click', () => {
  confirmDeleteModal.classList.add('hidden');
  deleteIndex = null;
});
