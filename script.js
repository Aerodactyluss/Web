const adminUser = "admin";
const adminPass = "admin123";
let currentUser = "";

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username && password) {
        localStorage.setItem("currentUser", username);
        currentUser = username;

        if (username === adminUser && password === adminPass) {
            localStorage.setItem("isAdmin", true);
        } else {
            localStorage.removeItem("isAdmin");
        }

        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("forumContainer").style.display = "block";
        loadThreads();
    } else {
        alert("Masukkan username dan password!");
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    location.reload();
}

function addThread() {
    let title = document.getElementById("threadTitle").value;
    let content = document.getElementById("threadContent").value;

    if (title && content) {
        let threads = JSON.parse(localStorage.getItem("threads")) || [];
        threads.push({ title, content, author: currentUser, logs: [] });
        localStorage.setItem("threads", JSON.stringify(threads));
        loadThreads();
    }
}

function loadThreads() {
    let threads = JSON.parse(localStorage.getItem("threads")) || [];
    let threadList = document.getElementById("threadList");
    threadList.innerHTML = "";

    threads.forEach((thread, index) => {
        let threadDiv = document.createElement("div");
        threadDiv.classList.add("thread");
        threadDiv.innerHTML = `<b>${thread.title}</b> <br> <i>by ${thread.author}</i>`;
        threadDiv.onclick = function() {
            openModal(thread.title, thread.content, index, thread.author);
        };
        threadList.appendChild(threadDiv);
    });
}

function openModal(title, content, index, author) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalContent").innerText = content;
    document.getElementById("modal").style.display = "block";

    document.getElementById("viewLogsBtn").setAttribute("data-index", index);
}

function editThread() {
    let newContent = prompt("Edit isi thread:");
    if (newContent) {
        let index = document.getElementById("viewLogsBtn").getAttribute("data-index");
        let threads = JSON.parse(localStorage.getItem("threads"));
        let thread = threads[index];

        thread.logs.push({ time: new Date().toLocaleString(), oldContent: thread.content });
        thread.content = newContent;

        localStorage.setItem("threads", JSON.stringify(threads));
        closeModal();
        loadThreads();
    }
}

function viewLogs() {
    let index = document.getElementById("viewLogsBtn").getAttribute("data-index");
    let logs = JSON.parse(localStorage.getItem("threads"))[index].logs;
    let logsList = document.getElementById("logsList");
    logsList.innerHTML = logs.map(log => `<li>${log.time}: ${log.oldContent}</li>`).join("");
    document.getElementById("logsModal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function closeLogsModal() {
    document.getElementById("logsModal").style.display = "none";
                             }
            
