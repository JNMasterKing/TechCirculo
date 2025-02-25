// TechCirculo Dashboard JavaScript File

// Constants
const API_BASE_URL = "https://your-backend-url.com/api";
const TOKEN_KEY = "jwt_token";

// Utility function to get token from localStorage
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Function to fetch user details and update UI
async function fetchUserDetails() {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html"; // Redirect to login if not authenticated
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/user/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch user details");
        const user = await response.json();
        document.getElementById("user-name").textContent = `Hello, ${user.name}`;
        document.getElementById("user-profile-pic").src = user.profilePicture;
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}

// Function to search communities
async function searchCommunities(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/communities/search?q=${query}`);
        if (!response.ok) throw new Error("Failed to search communities");
        const communities = await response.json();

        const searchResults = document.getElementById("search-results");
        searchResults.innerHTML = ""; // Clear previous results

        communities.forEach(comm => {
            const div = document.createElement("div");
            div.textContent = comm.name;
            div.classList.add("community-item");
            div.onclick = () => window.location.href = `community.html?id=${comm.id}`;
            searchResults.appendChild(div);
        });
    } catch (error) {
        console.error("Error searching communities:", error);
    }
}

// Function to fetch and display announcements
async function fetchAnnouncements() {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements`);
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

// Function to fetch and display posts
async function fetchPosts(update = false) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const posts = await response.json();

        const postsSection = document.getElementById("posts");
        postsSection.innerHTML = "";

        posts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post-item");
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button onclick="likePost(${post.id})">Like (${post.likes})</button>
            `;
            postsSection.appendChild(postDiv);
        });

        // If updating, reset localStorage flag
        if (update) {
            localStorage.removeItem("updateDashboardPosts");
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Function to notify that the dashboard needs an update
function notifyDashboardToUpdate() {
    localStorage.setItem("updateDashboardPosts", "true");
}

// Function to like a post
async function likePost(postId) {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to like post");

        fetchPosts(true); // Refresh posts after liking
    } catch (error) {
        console.error("Error liking post:", error);
    }
}

// Event Listeners
document.getElementById("search-bar").addEventListener("input", (event) => {
    searchCommunities(event.target.value);
});
document.addEventListener("DOMContentLoaded", async function () {
    try {
      // Fetch user details from backend
      const response = await fetch("https://api.techcirculo.com/user/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Assuming JWT authentication
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch user data");
  
      const userData = await response.json();
  
      // Update user profile details dynamically
      document.getElementById("user-profile-pic").src = userData.profilePic || "default-avatar.png";
      document.getElementById("user-name").textContent = userData.username || "User";
  
      // Fetch notifications count dynamically
      const notificationsResponse = await fetch("https://api.techcirculo.com/notifications", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!notificationsResponse.ok) throw new Error("Failed to fetch notifications");
  
      const notificationsData = await notificationsResponse.json();
      const notificationsCount = notificationsData.count || 0;
  
      // Update notifications badge dynamically
      const badgeElement = document.querySelector(".badge");
      badgeElement.textContent = notificationsCount;
      badgeElement.style.display = notificationsCount > 0 ? "inline-block" : "none"; // Hide if no notifications
  
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  });
  

// Initialize the dashboard on page load
window.onload = () => {
    fetchUserDetails();
    fetchAnnouncements();
    
    if (localStorage.getItem("updateDashboardPosts") === "true") {
        fetchPosts(true);
    } else {
        fetchPosts();
    }
};
