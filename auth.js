document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Anda telah logout.");
    location.reload();
});

function checkLogin() {
    let user = localStorage.getItem("currentUser");
    if (!user) {
        let username = prompt("Masukkan username untuk login:");
        if (username) {
            localStorage.setItem("currentUser", username);
        }
    }
}
checkLogin();
