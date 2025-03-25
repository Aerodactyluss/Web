document.addEventListener("DOMContentLoaded", function() {
    const postForm = document.getElementById('postForm');
    const postTitle = document.getElementById('postTitle');
    const postContent = document.getElementById('postContent');
    const postTags = document.getElementById('postTags');
    const postsContainer = document.getElementById('postsContainer');
    const searchInput = document.getElementById('searchInput');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    let currentUser = null;

    loginLink.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    registerLink.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });

    closeLogin.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    closeRegister.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target == registerModal) {
            registerModal.style.display = 'none';
        }
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        registerUser(username, password);
        registerModal.style.display = 'none';
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        loginUser(username, password);
        loginModal.style.display = 'none';
    });

    logoutLink.addEventListener('click', () => {
        logoutUser();
    });

    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (currentUser) {
            addPost(postTitle.value, postContent.value, postTags.value);
            postTitle.value = '';
            postContent.value = '';
            postTags.value = '';
        } else {
            alert('You must be logged in to create a post.');
        }
    });

    searchInput.addEventListener('input', () => {
        displayPosts();
    });

    function registerUser(username, password) {
        const users = getUsers();
        if (users.find(user => user.username === username)) {
            alert('Username already exists.');
            return;
        }
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful.');
    }

    function loginUser(username, password) {
        const users = getUsers();
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            currentUser = user;
            alert('Login successful.');
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            logoutLink.style.display = 'block';
            profileLink.style.display = 'block';
        } else {
            alert('Invalid username or password.');
        }
    }

    function logoutUser() {
        currentUser = null;
        alert('Logout successful.');
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutLink.style.display = 'none';
        profileLink.style.display = 'none';
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    function addPost(title, content, tags) {
        const posts = getPosts();
        const newPost = {
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()),
            date: new Date().toLocaleString(),
            comments: [],
            likes: 0
        };
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }

    function getPosts() {
        return JSON.parse(localStorage.getItem('posts')) || [];
    }

    function displayPosts() {
        const posts = getPosts();
        const searchTerm = searchInput.value.toLowerCase();
        postsContainer.innerHTML = '';
        posts.filter(post => post.title.toLowerCase().includes(searchTerm) || post.content.toLowerCase().includes(searchTerm) || post.tags.some(tag => tag.toLowerCase().includes(searchTerm))).forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>${post.date}</small>
                <p>Tags: ${post.tags.join(', ')}</p>
                <button onclick="likePost(${index})">Like (${post.likes})</button>
                <div class="comments">
                    <h4>Comments</h4>
                    <div class="commentsContainer"></div>
                    <form class="commentForm">
                        <input type="text" class="commentInput" placeholder="Write a comment" required>
                        <button type="submit">Comment</button>
                    </form>
                </div>
            `;
            const commentsContainer = postElement.querySelector('.commentsContainer');
            const commentForm = postElement.querySelector('.commentForm');
            const commentInput = postElement.querySelector('.commentInput');

            commentForm.addEventListener('submit', function(event) {
                event.preventDefault();
                addComment(index, commentInput.value);
                commentInput.value = '';
            });

            displayComments(commentsContainer, post.comments);
            postsContainer.appendChild(postElement);
        });
    }

    function addComment(postIndex, comment) {
        const posts = getPosts();
        posts[postIndex].comments.push({ content: comment, date: new Date().toLocaleString() });
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }

    function displayComments(container, comments) {
        container.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `<p>${comment.content}</p><small>${comment.date}</small>`;
            container.appendChild(commentElement);
        });
    }

    function likePost(index) {
        const posts = getPosts();
        posts[index].likes++;
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }

    displayPosts();
});
