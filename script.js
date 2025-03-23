document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
    document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);
});

function addPost() {
    let user = localStorage.getItem("currentUser");
    let postText = document.getElementById("postText").value;
    let postFile = document.getElementById("postFile").files[0];

    if (!user) {
        alert("Login terlebih dahulu!");
        return;
    }

    if (!postText && !postFile) {
        alert("Masukkan teks atau unggah file!");
        return;
    }

    let reader = new FileReader();
    let newPost = { user, text: postText, file: null, type: null, likes: 0, dislikes: 0, comments: [] };

    if (postFile) {
        reader.onload = function(event) {
            newPost.file = event.target.result;
            newPost.type = postFile.type.includes("image") ? "image" : "video";
            savePost(newPost);
        };
        reader.readAsDataURL(postFile);
    } else {
        savePost(newPost);
    }

    document.getElementById("postText").value = "";
    document.getElementById("postFile").value = "";
}

function savePost(post) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
}

function loadPosts() {
    let postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = "";
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.forEach((post, index) => {
        let postElement = document.createElement("div");
        postElement.classList.add("card", "p-3", "mt-2");
        postElement.innerHTML = `<strong>${post.user}</strong><p>${post.text}</p>`;

        if (post.file) {
            if (post.type === "image") {
                postElement.innerHTML += `<img src="${post.file}" class="img-fluid">`;
            } else {
                postElement.innerHTML += `<video controls class="w-100"><source src="${post.file}" type="video/mp4"></video>`;
            }
        }

        postElement.innerHTML += `
            <button onclick="likePost(${index})">👍 ${post.likes}</button>
            <button onclick="dislikePost(${index})">👎 ${post.dislikes}</button>
            <button onclick="deletePost(${index})">🗑 Hapus</button>
            <div class="mt-2">
                <input type="text" placeholder="Komentar..." id="comment${index}">
                <button onclick="addComment(${index})">💬</button>
            </div>
            <div id="comments${index}">${post.comments.map(c => `<p>${c}</p>`).join("")}</div>
        `;

        postContainer.prepend(postElement);
    });
}

function likePost(index) {
    let posts = JSON.parse(localStorage.getItem("posts"));
    posts[index].likes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
}

function dislikePost(index) {
    let posts = JSON.parse(localStorage.getItem("posts"));
    posts[index].dislikes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
}

function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem("posts"));
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
}

function addComment(index) {
    let commentText = document.getElementById(`comment${index}`).value;
    if (!commentText) return;
    let posts = JSON.parse(localStorage.getItem("posts"));
    posts[index].comments.push(commentText);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
