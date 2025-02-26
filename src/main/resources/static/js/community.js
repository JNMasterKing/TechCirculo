document.addEventListener("DOMContentLoaded", async function () {
    const API_BASE_URL = "http://localhost:8084"; // Replace with actual backend URL
    const userId = localStorage.getItem("userId");
    
    const communityList = document.getElementById("community-list");
    const joinedList = document.getElementById("joined-list");
    const postsSection = document.getElementById("posts-section");
    const announcementsSection = document.getElementById("announcements-section");
    const postsTab = document.getElementById("posts-tab");
    const announcementsTab = document.getElementById("announcements-tab");
    const postContentInput = document.getElementById("post-content");
    const addPostBtn = document.getElementById("add-post-btn");

    let currentCommunityId = null; // Store the selected community ID

    // Default: Show Posts, Hide Announcements
    postsSection.classList.add("active");
    
    // Fetch all communities
    async function fetchCommunities() {
        try {
            const response = await fetch(`${API_BASE_URL}/communities`);
            return response.ok ? await response.json() : [];
        } catch (error) {
            console.error("Error fetching communities:", error);
            return [];
        }
    }

    // Fetch joined communities for the user
    async function fetchJoinedCommunities() {
        try {
            const response = await fetch(`${API_BASE_URL}/communities/my`);
            return response.ok ? await response.json() : [];
        } catch (error) {
            console.error("Error fetching joined communities:", error);
            return [];
        }
    }

    // Render communities list
    async function renderCommunities() {
        const allCommunities = await fetchCommunities();
        const joinedCommunities = await fetchJoinedCommunities();
        communityList.innerHTML = "";
        joinedList.innerHTML = "";

        allCommunities.forEach(comm => {
            const li = document.createElement("li");
            li.textContent = comm.name;
            li.classList.add("community-item");
            li.onclick = () => displayCommunityData(comm.id);

            const button = document.createElement("button");
            button.classList.add("join-btn");
            button.textContent = "Join";
            button.onclick = (e) => {
                e.stopPropagation();
                joinCommunity(comm.id);
            };

            li.appendChild(button);
            communityList.appendChild(li);
        });

        joinedCommunities.forEach(comm => {
            const li = document.createElement("li");
            li.textContent = comm.name;
            li.classList.add("community-item");
            li.onclick = () => displayCommunityData(comm.id);

            const button = document.createElement("button");
            button.classList.add("remove-btn");
            button.textContent = "Remove";
            button.onclick = (e) => {
                e.stopPropagation();
                removeCommunity(comm.id);
            };

            li.appendChild(button);
            joinedList.appendChild(li);
        });
    }

    // Join a community
    async function joinCommunity(communityId) {
        try {
            const response = await fetch(`${API_BASE_URL}/communities/${communityId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ communityId })
            });

            if (response.ok) {
                await renderCommunities();
            } else {
                console.error("Error joining community:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Remove a community
    async function removeCommunity(communityId) {
        try {
            const response = await fetch(`${API_BASE_URL}/communities/${communityId}/leave`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ communityId })
            });

            if (response.ok) {
                await renderCommunities();
            } else {
                console.error("Error removing community:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Fetch and display posts & announcements for a community
    async function displayCommunityData(communityId) {
        sessionStorage.setItem("selectedCommunityId", communityId);
        currentCommunityId = communityId;

        try {
            const [postsResponse, announcementsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/posts/community/${communityId}`),
                fetch(`${API_BASE_URL}/community/${communityId}/announcements`)
            ]);

            const posts = await postsResponse.json();
            const announcements = await announcementsResponse.json();

            postsSection.innerHTML = "<h3>Posts</h3>";
            announcementsSection.innerHTML = "<h3>Announcements</h3>";

            posts.forEach(post => {
                const div = document.createElement("div");
                div.classList.add("post-item");
                div.textContent = post.content;
                postsSection.appendChild(div);
            });

            announcements.forEach(announcement => {
                const div = document.createElement("div");
                div.classList.add("announcement-item");
                div.textContent = announcement.content;
                announcementsSection.appendChild(div);
            });

        } catch (error) {
            console.error("Error fetching posts or announcements:", error);
        }
    }

    // Function to Add a Post
    async function addPostToCommunity() {
        const content = postContentInput.value.trim();
        if (!content || !currentCommunityId) {
            alert("Please enter a post and select a community.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
                },
                body: JSON.stringify({ userId, content })
            });

            if (response.ok) {
                postContentInput.value = ""; // Clear input field
                displayCommunityData(currentCommunityId); // Refresh posts
                notifyDashboardToUpdate(); // Notify dashboard
            } else {
                console.error("Error adding post:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Notify the dashboard to update posts
    function notifyDashboardToUpdate() {
        localStorage.setItem("updateDashboardPosts", "true");
    }

    // Tab Click Events
    postsTab.addEventListener("click", function () {
        postsSection.classList.add("active");
        announcementsSection.classList.remove("active");
        postsTab.classList.add("active");
        announcementsTab.classList.remove("active");
    });

    announcementsTab.addEventListener("click", function () {
        announcementsSection.classList.add("active");
        postsSection.classList.remove("active");
        announcementsTab.classList.add("active");
        postsTab.classList.remove("active");
    });

    // Attach event listener to Post button
    addPostBtn.addEventListener("click", addPostToCommunity);

    // Initial Render
    renderCommunities();
});
async function fetchCommunities() {
    try {
        const response = await fetch(`${API_BASE_URL}/communities`);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching communities:", error);
        alert("Failed to load communities. Please try again.");
        return [];
    }
}
async function displayCommunityData(communityId) {
    try {
        const [postsResponse, announcementsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/posts/community/${communityId}`),
            fetch(`${API_BASE_URL}/community/${communityId}/announcements`)
        ]);

        const posts = await postsResponse.json();
        const announcements = await announcementsResponse.json();

        renderPosts(posts);
        renderAnnouncements(announcements);
    } catch (error) {
        console.error("Error fetching community data:", error);
    }
}
function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// Example usage in API calls
async function fetchJoinedCommunities() {
    showLoader();
    try {
        const response = await fetch(`${API_BASE_URL}/communities/my`);
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error("Error fetching joined communities:", error);
        return [];
    } finally {
        hideLoader();
    }
}
async function joinCommunity(communityId, button) {
    button.disabled = true; // Disable button
    try {
        const response = await fetch(`${API_BASE_URL}/communities/${communityId}/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ communityId })
        });

        if (response.ok) {
            await renderCommunities();
        } else {
            console.error("Error joining community:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        button.disabled = false; // Re-enable button
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const postsTab = document.getElementById("posts-tab");
    const announcementsTab = document.getElementById("announcements-tab");
    const postsSection = document.getElementById("posts-section");
    const announcementsSection = document.getElementById("announcements-section");
    const addPostSection = document.getElementById("add-post-section"); // Get the Add Post Section

    // Function to switch tabs
    function switchTab(tab) {
        if (tab === "posts") {
            postsSection.classList.add("active");
            announcementsSection.classList.remove("active");
            addPostSection.style.display = "block"; // Show Add Post section
        } else if (tab === "announcements") {
            postsSection.classList.remove("active");
            announcementsSection.classList.add("active");
            addPostSection.style.display = "none"; // Hide Add Post section
        }
    }

    // Event Listeners for Tab Buttons
    postsTab.addEventListener("click", function () {
        switchTab("posts");
        postsTab.classList.add("active");
        announcementsTab.classList.remove("active");
    });

    announcementsTab.addEventListener("click", function () {
        switchTab("announcements");
        announcementsTab.classList.add("active");
        postsTab.classList.remove("active");
    });

    // Initialize with Posts Tab active
    switchTab("posts");
});
