document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  let hoTenDem = document.getElementById('hoTenDem').value.trim();
  let ten = document.getElementById('ten').value.trim();
  let email = document.getElementById('email').value.trim();
  let password = document.getElementById('password').value;
  let confirmPassword = document.getElementById('confirmPassword').value;

  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (hoTenDem === '' || ten === '') {
    alert('Họ và tên không được để trống');
    return;
  }

  if (email === '') {
    alert('Email không được để trống');
    return;
  }

  if (!emailRegex.test(email)) {
    alert('Email không đúng định dạng');
    return;
  }

  if (password === '') {
    alert('Mật khẩu không được để trống');
    return;
  }

  if (password.length < 8) {
    alert('Mật khẩu phải có ít nhất 8 ký tự');
    return;
  }

  if (confirmPassword === '') {
    alert('Xác nhận mật khẩu không được để trống');
    return;
  }

  if (password !== confirmPassword) {
    alert('Mật khẩu và xác nhận mật khẩu không khớp');
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(user => user.email === email)) {
    alert('Email này đã được đăng ký.');
    return;
  }

  let newUser = {
    hoTenDem,
    ten,
    email,
    password
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  alert('Đăng ký thành công!');
  window.location.href = "login.html";
});



// document.getElementById('registerForm').addEventListener('submit', function (e) {
//   //ngăn chặn sự kiện thực thi luôn
//   e.preventDefault();

//   // khai báo biến để chứa đữ liệu người dùng vừa gửi
//   const hoTenDem = document.getElementById('hoTenDem').value.trim();
//   const ten = document.getElementById('ten').value.trim();
//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value;
//   const confirmPassword = document.getElementById('confirmPassword').value;

//   console.log('Họ tên:', hoTenDem, 'Tên', ten, 'email:', email, 'mật khẩu:', password, 'xác nhận:', confirmPassword)

//   // Biểu thức kiểm tra định dạng email
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   /// === dấu này có ý nghĩa là giống 100% trùng hoặc là
//   // ==! dấu này có nghĩa là khác nhau
//   // ! dấu này là phủ định (!linh = linh)

//   // 1. Họ và tên không được để trống
//   // khi họ tên đệm bằng rỗng ( chưa nhập gì) và tên bằng rỗng ( chưa nhập gì)
//   if (hoTenDem === '' || ten === '') {
//     // thì in ra thông báo 
//     alert('Họ và tên không được để trống');
//     // và không làm gì
//     return;
//   }

//   // 2. Email không được để trống
//   if (email === '') {
//     alert('Email không được để trống');
//     return;
//   }

//   // 3. Email phải đúng định dạng
//   // nếu  kiểm tra không đúng định dạng thì in ra
//   if (!emailRegex.test(email)) {
//     alert('Email không đúng định dạng');
//     return;
//   }

//   // 4. Mật khẩu không được để trống
//   if (password === '') {
//     alert('Mật khẩu không được để trống');
//     return;
//   }

//   // 5. Mật khẩu tối thiểu 8 ký tự
//   if (password.length < 8) {
//     alert('Mật khẩu phải có ít nhất 8 ký tự');
//     return;
//   }

//   // 6. Mật khẩu xác nhận không được để trống
//   if (confirmPassword === '') {
//     alert('Xác nhận mật khẩu không được để trống');
//     return;
//   }

//   // 7. Mật khẩu và xác nhận không trùng khớp
//   if (password !== confirmPassword) {
//     alert('Mật khẩu và xác nhận mật khẩu không khớp');
//     return;
//   }
//   //  Nếu qua tất cả kiểm tra
//   alert('Đăng ký thành công!');

//   // khi đăng ký tài khoản thành công sẽ đặt lại dữ liệu về trắng để đki tài khoản mới
//   document.getElementById('hoTenDem').value = '';
//   document.getElementById('ten').value = '';
//   document.getElementById('email').value = '';
//   document.getElementById('password').value = '';
//   document.getElementById('confirmPassword').value = '';

//   // danh sách userdata có các trường hoTendem...
//   const userData = [
//     {
//       hoTenDem: hoTenDem,
//       ten: ten,
//       email: email,
//       password: password,
//       confirmPassword: confirmPassword
//     }
//   ];
//   console.log(userData);

//   localStorage.setItem("userData", JSON.stringify(userData));

//   // chuyển đến trang login
//   window.location.href = "login.html";

// });






