// ======================= CẤU HÌNH ===========================
const PAGE_SIZE = 8;
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let currentPage = 1;
let currentSearch = "";
let currentSort = "name-asc";
let currentFilter = "all";
let editMode = false;
let editIndex = -1;
let deleteIndex = -1; // Dùng cho modal xoá

// ======================= HÀM HỖ TRỢ ===========================
function saveToLocalStorage() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

function showBootstrapToast(message, type = "success") {
    const toastEl = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;

    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// ======================= FORM HIỂN THỊ ===========================
function hienthi() {
    document.querySelector(".category-form").classList.remove("hide");
    editMode = false;
    document.querySelector(".category-form form").reset();
}

function an() {
    document.querySelector(".category-form").classList.add("hide");
    editMode = false;
    editIndex = -1;
}

function moFormCapNhat(index) {
    const category = categories[index];
    hienthi();
    document.getElementById("code").value = category.code;
    document.getElementById("name").value = category.name;
    document.querySelector(`input[name="status"][value="${category.status}"]`).checked = true;
    editMode = true;
    editIndex = index;
}

// ======================= THÊM / CẬP NHẬT ===========================
document.querySelector(".category-form form").addEventListener("submit", function (e) {
    e.preventDefault();

    const code = document.getElementById("code").value.trim();
    const name = document.getElementById("name").value.trim();
    const status = document.querySelector("input[name='status']:checked").value;

    if (!code || !name) {
        showBootstrapToast("Không được để trống mã hoặc tên danh mục!", "error");
        return;
    }

    const existedCode = categories.find((c, idx) => c.code === code && (!editMode || idx !== editIndex));
    const existedName = categories.find((c, idx) => c.name === name && (!editMode || idx !== editIndex));

    if (existedCode) {
        showBootstrapToast("Mã danh mục đã tồn tại!", "error");
        return;
    }

    if (existedName) {
        showBootstrapToast("Tên danh mục đã tồn tại!", "error");
        return;
    }

    if (editMode) {
        categories[editIndex].code = code;
        categories[editIndex].name = name;
        categories[editIndex].status = status;
        showBootstrapToast("Cập nhật danh mục thành công!");
    } else {
        categories.push({
            code,
            name,
            status,
            createdAt: new Date().toISOString()
        });
        showBootstrapToast("Thêm danh mục thành công!");
    }

    saveToLocalStorage();
    renderTable();
    an();
});

// ======================= XOÁ DANH MỤC ===========================
function xoaDanhMuc(index) {
    const hasProduct = false; // Giả lập kiểm tra nếu có sản phẩm liên quan
    if (hasProduct) {
        showBootstrapToast("Không thể xoá danh mục đã có sản phẩm!", "error");
        return;
    }

    deleteIndex = index;
    const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    modal.show();
}

// Xử lý khi nhấn nút "Xoá" trong modal
document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    if (deleteIndex !== -1) {
        categories.splice(deleteIndex, 1);
        saveToLocalStorage();
        renderTable();
        showBootstrapToast("Đã xoá danh mục thành công!", "success");

        const modalEl = document.getElementById("confirmDeleteModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();

        deleteIndex = -1;
    }
});

// ======================= LỌC, TÌM, SẮP XẾP ===========================
document.querySelector(".seach-input")?.addEventListener("input", function () {
    currentSearch = this.value.trim().toLowerCase();
    renderTable();
});

document.getElementById("filter-status")?.addEventListener("change", function () {
    currentFilter = this.value;
    renderTable();
});

document.getElementById("sort")?.addEventListener("change", function () {
    currentSort = this.value;
    renderTable();
});

// ======================= PHÂN TRANG ===========================
function paginate(data) {
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
}

// ======================= RENDER DỮ LIỆU ===========================
function renderTable() {
    let data = [...categories];

    // Lọc
    if (currentFilter !== "all") {
        data = data.filter(c => c.status === currentFilter);
    }

    // Tìm kiếm
    if (currentSearch) {
        data = data.filter(c => c.name.toLowerCase().includes(currentSearch));
    }

    // Sắp xếp
    if (currentSort === "name-asc") {
        data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === "name-desc") {
        data.sort((a, b) => b.name.localeCompare(a.name));
    } else if (currentSort === "date-asc") {
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (currentSort === "date-desc") {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const tableBody = document.querySelector(".category-code table");
    tableBody.innerHTML = `
        <tr>
            <th>Mã danh mục</th>
            <th>Tên danh mục</th>
            <th>Trạng thái</th>
            <th>Chức năng</th>
        </tr>
    `;

    const currentData = paginate(data);
    currentData.forEach((cat, index) => {
        const absoluteIndex = categories.findIndex(c => c.code === cat.code);
        tableBody.innerHTML += `
            <tr>
                <td>${cat.code}</td>
                <td>${cat.name}</td>
                <td>
                    <span class="${cat.status === "active" ? "badge-active" : "badge-inactive"}">
                        ${cat.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <i class="fa-solid fa-pen edit-icon" onclick="moFormCapNhat(${absoluteIndex})"></i>
                        <i class="fa-solid fa-trash delete-icon" onclick="xoaDanhMuc(${absoluteIndex})"></i>
                    </div>
                </td>
            </tr>
        `;
    });

    // Phân trang
    const frame = document.querySelector(".frame");
    frame.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        if (i === currentPage) btn.disabled = true;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderTable();
        });
        frame.appendChild(btn);
    }
}

// ======================= KHỞI ĐỘNG ===========================
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
});

//thêm sản phẩm
let form = document.getElementById("productForm");
let tableBody = document.getElementById("productTableBody");

// Lấy danh sách sản phẩm từ localStorage
let products = JSON.parse(localStorage.getItem("products")) || [];

// Hàm hiển thị Toast
function showToast(message, type = "success") {
  let toastEl = document.getElementById("liveToast");
  let toastMsg = document.getElementById("toastMessage");

  toastMsg.textContent = message;

  toastEl.classList.remove("bg-success", "bg-danger");
  toastEl.classList.add(type === "success" ? "bg-success" : "bg-danger");

  let toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// Render bảng danh sách sản phẩm
function renderProducts() {
  tableBody.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    let prod = products[i];

    tableBody.innerHTML += `
      <tr>
        <td>${prod.code}</td>
        <td>${prod.name}</td>
        <td><img src="${prod.image}" width="60" height="60" style="object-fit:cover" /></td>
        <td>${prod.category}</td>
        <td>${prod.price}</td>
        <td>${prod.discount}%</td>
        <td>
          <span class="badge ${prod.status === 'active' ? 'bg-success' : 'bg-secondary'}">
            ${prod.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </span>
        </td>
      </tr>
    `;
  }
}

// Xử lý khi form được submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let product = {
    code: document.getElementById("productCode").value.trim(),
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value,
    status: document.querySelector("input[name='status']:checked").value,
    quantity: parseInt(document.getElementById("productQuantity").value),
    price: document.getElementById("productPrice").value.trim(),
    discount: parseInt(document.getElementById("productDiscount").value),
    image: document.getElementById("productImage").value.trim(),
    description: document.getElementById("productDescription").value.trim(),
    createdAt: new Date().toISOString()
  };

  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();

  // Đóng modal
  let modal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
  modal.hide();

  // Reset form
  form.reset();

  showToast("Thêm sản phẩm thành công!", "success");
});

// Khi trang load lần đầu
document.addEventListener("DOMContentLoaded", renderProducts);


