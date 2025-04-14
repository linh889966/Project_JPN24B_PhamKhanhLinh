document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  console.log(email,password)

  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let userLogin = users.find(user =>
    user.email === email && user.password === password
  );

// for (let i = 0; i < userDate.length; i++) {
//   if (email === userData[i]) { 
//     // alert("Đăng nhập thành công!");
//     window.location.href = "manage.html";

//   } else {
//     alert("Sai email hoặc mật khẩu. Vui lòng thử lại!");
//   }
// }

if(!userLogin){
  alert("Đăng nhập thành công!");
     window.location.href = "manage.html";
}else{
  alert("Sai email hoặc mật khẩu. Vui lòng thử lại!");
}
});


// document.getElementById("loginForm").addEventListener("submit", function (e) {
//   e.preventDefault();

//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (email === '') {
//       alert('Email không được để trống');
//       return;
//   }

//   if (!emailRegex.test(email)) {
//       alert('Email không đúng định dạng');
//       return;
//   }

//   if (password === '') {
//       alert('Mật khẩu không được để trống');
//       return;
//   }

//   let users = JSON.parse(localStorage.getItem("users")) || [];

//   let userLogin = users.find(user => 
//       user.email === email && user.password === password
//   );

//   for (let i = 0; i < userData.length; i++) {
//     let element = userData [i];
//     if (userLogin) {
//       alert("Đăng nhập thành công!");
//       window.location.href = "manage.html";
//     } else {
//         alert("Sai email hoặc mật khẩu. Vui lòng thử lại!");
//     }
//   }
// });

// // // tạo 1 funtion đăng nhập của form... nếu người dùng submit dữ liệu sẽ thực hiện những cái bên trong
// // document.getElementById("loginForm").addEventListener("submit", function (e) {
// //     e.preventDefault();

// //     // lấy dữ liệu từ local store xuống để kiểm tra dữ liệu đăng nhập
// //     const dataloginget = localStorage.getItem('userData')
// //     console.log(dataloginget)

// //     // kiểm tra và ép kiểu lại thành json( nếu có dữ liệu từ local với ép kiểu còn không để null)
// //     const datalogin = dataloginget ? JSON.parse(dataloginget) : null;

// //     console.log(datalogin)

// //     const email = document.getElementById("email").value;
// //     const password = document.getElementById("password").value;

// //      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// //        // 2. Email không được để trống
// //        if (email === '') {
// //         alert('Email không được để trống');
// //         return;
// //       }
  
// //       // 3. Email phải đúng định dạng
// //       // nếu  kiểm tra không đúng định dạng thì in ra
// //       if (!emailRegex.test(email)) {
// //         alert('Email không đúng định dạng');
// //         return;
// //       }
  
// //       // 4. Mật khẩu không được để trống
// //       if (password === '') {
// //         alert('Mật khẩu không được để trống');
// //         return;
// //       }

// //       let users = JSON.parse(localStorage.getItem("users")) || [];

// //       let userLogin = users.find(user => 
// //           user.email === email && user.password === password
// //       );
      
// //       if (userLogin) {
// //           alert("Đăng nhập thành công!");
// //           window.location.href = "manage.html";
// //       } else {
// //           alert("Sai email hoặc mật khẩu. Vui lòng thử lại!");
// //       }
      
// // });
