// Secure way to get JWT from cookies
function getToken() {
    return document.cookie.split('; ').find(row => row.startsWith('jwt_token='))?.split('=')[1];
}

// Debounced Search API Calls
let debounceTimer;
document.getElementById("search-bar").addEventListener("input", (event) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => searchCommunities(event.target.value), 300);
});

// Pagination for Posts
let currentPage = 1;
const POSTS_PER_PAGE = 10;

async function fetchPosts(update = false) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts?page=${currentPage}&limit=${POSTS_PER_PAGE}`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const posts = await response.json();

        const postsSection = document.getElementById("posts");
        if (update) postsSection.innerHTML = "";

        posts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post-item");
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button onclick="likePost(${post.id}, this)">Like (${post.likes})</button>
            `;
            postsSection.appendChild(postDiv);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Load More Button for Posts
document.getElementById("load-more-btn").addEventListener("click", () => {
    currentPage++;
    fetchPosts();
});

// Optimized Like Function
async function likePost(postId, button) {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to like post");

        const data = await response.json();
        button.textContent = `Like (${data.likes})`;
    } catch (error) {
        console.error("Error liking post:", error);
    }
}

// Fetch Only Relevant Announcements
async function fetchAnnouncements() {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/announcements?joinedOnly=true`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch announcements");

        const announcements = await response.json();
        const announcementSection = document.getElementById("announcements");
        announcementSection.innerHTML = "";

        announcements.forEach(ann => {
            const div = document.createElement("div");
            div.classList.add("announcement-item");
            div.innerHTML = `<h4>${ann.title}</h4><p>${ann.content}</p>`;
            announcementSection.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching announcements:", error);
    }
}

// Real-Time Notifications Using WebSockets
function setupWebSocket() {
    const token = getToken();
    if (!token) return;

    const socket = new WebSocket(`wss://your-backend-url.com/notifications?token=${token}`);

    socket.onmessage = (event) => {
        const notificationsData = JSON.parse(event.data);
        const notificationsCount = notificationsData.count || 0;

        const badgeElement = document.querySelector(".badge");
        badgeElement.textContent = notificationsCount;
        badgeElement.style.display = notificationsCount > 0 ? "inline-block" : "none";
    };

    socket.onerror = (error) => console.error("WebSocket Error:", error);
}

document.addEventListener("DOMContentLoaded", setupWebSocket);
