document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const announcementList = document.getElementById("announcement-list");
    const searchInput = document.getElementById("search");
    const filterSelect = document.getElementById("filter");
    const sortSelect = document.getElementById("sort");
    const loadMoreBtn = document.getElementById("load-more");

    let announcements = [];
    let visibleAnnouncements = 5;

    // Fetch announcements from backend
    async function fetchAnnouncements() {
        try {
            const response = await fetch("/api/announcements");
            announcements = await response.json();
            displayAnnouncements();
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    }

    // Update announcement in the backend
    async function updateAnnouncement(id, data) {
        try {
            await fetch(`/api/announcements/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            fetchAnnouncements(); // Refresh data after update
        } catch (error) {
            console.error("Error updating announcement:", error);
        }
    }

    // Display announcements dynamically
    function displayAnnouncements() {
        announcementList.innerHTML = "";
        const filtered = filterAnnouncements();
        const sorted = sortAnnouncements(filtered);

        sorted.slice(0, visibleAnnouncements).forEach(announcement => {
            const div = document.createElement("div");
            div.className = `announcement ${announcement.read ? '' : 'unread'}`;
            div.innerHTML = `
                <h3>${announcement.title}</h3>
                <p>${announcement.content}</p>
                <button onclick="toggleRead(${announcement.id})">
                    ${announcement.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <button onclick="toggleBookmark(${announcement.id})">
                    ${announcement.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
                </button>
            `;
            announcementList.appendChild(div);
        });
    }

    // Filter announcements based on user input
    function filterAnnouncements() {
        return announcements.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchInput.value.toLowerCase());
            const matchesFilter = (filterSelect.value === "unread" && !a.read) || 
                                  (filterSelect.value === "bookmarked" && a.bookmarked) ||
                                  (filterSelect.value === "all");
            return matchesSearch && matchesFilter;
        });
    }

    // Sort announcements based on selection
    function sortAnnouncements(list) {
        return list.sort((a, b) => sortSelect.value === "latest" ? b.date - a.date : a.date - b.date);
    }

    // Toggle read/unread state and send update to backend
    function toggleRead(id) {
        const announcement = announcements.find(a => a.id === id);
        if (announcement) {
            const newState = !announcement.read;
            announcement.read = newState;
            updateAnnouncement(id, { read: newState });
        }
    }

    // Toggle bookmark state and send update to backend
    function toggleBookmark(id) {
        const announcement = announcements.find(a => a.id === id);
        if (announcement) {
            const newState = !announcement.bookmarked;
            announcement.bookmarked = newState;
            updateAnnouncement(id, { bookmarked: newState });
        }
    }

    // Event Listeners for filtering, sorting, searching
    searchInput.addEventListener("input", displayAnnouncements);
    filterSelect.addEventListener("change", displayAnnouncements);
    sortSelect.addEventListener("change", displayAnnouncements);
    
    // Load more announcements dynamically
    loadMoreBtn.addEventListener("click", function () {
        visibleAnnouncements += 5;
        displayAnnouncements();
    });

    // Highlight active sidebar link
    function setActiveSidebar() {
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".sidebar nav a").forEach(link => {
            link.classList.toggle("active", link.getAttribute("href").split("/").pop() === currentPath);
        });
    }

    // Initialize page
    fetchAnnouncements();
    setActiveSidebar();
});
