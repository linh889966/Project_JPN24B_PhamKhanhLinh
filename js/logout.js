document.getElementById("logout").addEventListener("click", function (e) {
    e.preventDefault(); 
    let isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất không?");

    if (isConfirmed) {

        window.location.href = "login.html"; // Chuyển hướng về trang đăng nhập
        
    } else {
        console.log("Người dùng hủy bỏ đăng xuất.");
    }
});
