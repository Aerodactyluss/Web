// Ambil Data User dari LocalStorage
let users = JSON.parse(localStorage.getItem("users")) || {};

// Registrasi Akun (Satu Username Unik)
document.getElementById("register-btn").addEventListener("click", function() {
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();

    if (!username || !password) {
        alert("Username dan password tidak boleh kosong!");
        return;
    }

    if (users[username]) {
        alert("Username sudah digunakan, pilih username lain!");
    } else {
        users[username] = { password, role: "user" };
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registrasi berhasil! Silakan login.");
    }
});

// Login Akun
document.getElementById("login-btn").addEventListener("click", function() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (users[username] && users[username].password === password) {
        localStorage.setItem("user", JSON.stringify({ username, role: users[username].role }));
        showForum();
    } else {
        alert("Login gagal! Periksa username & password.");
    }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("user");
    location.reload();
});

// Menampilkan Forum Setelah Login
function showForum() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("forum-container").style.display = "block";
    document.getElementById("logout-btn").style.display = "block";

    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "admin") {
        alert("Anda masuk sebagai Admin!");
    }

    document.getElementById("new-thread").style.display = "block";
    displayThreads();
}

// Posting Thread
document.getElementById("post-thread").addEventListener("click", function() {
    const title = document.getElementById("thread-title").value.trim();
    const content = document.getElementById("thread-content").value.trim();

    if (!title || !content) {
        alert("Judul dan isi thread tidak boleh kosong!");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const thread = { title, content, author: user.username, date: new Date().toLocaleString(), pinned: false };
    saveThread(thread);
    displayThreads();
});

// Simpan Thread ke LocalStorage
function saveThread(thread) {
    let threads = JSON.parse(localStorage.getItem("threads")) || [];
    threads.unshift(thread);
    localStorage.setItem("threads", JSON.stringify(threads));
}

// Menampilkan Thread untuk Semua Pengguna
function displayThreads() {
    const threadList = document.getElementById("thread-list");
    threadList.innerHTML = "";
    const threads = JSON.parse(localStorage.getItem("threads")) || [];

    threads.forEach((thread, index) => {
        const threadDiv = document.createElement("div");
        threadDiv.classList.add("thread");
        if (thread.pinned) threadDiv.classList.add("pinned");

        threadDiv.innerHTML = `
            <h3>${thread.title}</h3>
            <p>${thread.content}</p>
            <small>Oleh: ${thread.author} | ${thread.date}</small>
        `;

        // Admin Actions
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role === "admin") {
            const adminActions = document.createElement("div");
            adminActions.classList.add("admin-actions");
            adminActions.innerHTML = `
                <button onclick="deleteThread(${index})">Hapus</button>
                <button onclick="pinThread(${index})">${thread.pinned ? "Unpin" : "Pin"}</button>
            `;
            threadDiv.appendChild(adminActions);
        }

        threadList.appendChild(threadDiv);
    });
}

// Hapus Thread (Admin)
function deleteThread(index) {
    let threads = JSON.parse(localStorage.getItem("threads"));
    threads.splice(index, 1);
    localStorage.setItem("threads", JSON.stringify(threads));
    displayThreads();
}

// Pin Thread (Admin)
function pinThread(index) {
    let threads = JSON.parse(localStorage.getItem("threads"));
    threads[index].pinned = !threads[index].pinned;
    localStorage.setItem("threads", JSON.stringify(threads));
    displayThreads();
}

// Menampilkan Threads Saat Halaman Dibuka
displayThreads();
