// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const navbarMenu = document.querySelector('.navbar-menu');
  const navbarAuth = document.querySelector('.navbar-auth');

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      navbarMenu.style.display = navbarMenu.style.display === 'flex' ? 'none' : 'flex';
      navbarAuth.style.display = navbarAuth.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Load all communities
  const allCommunities = [
    {
      id: 1,
      name: 'Web Development',
      description: 'Discuss modern web technologies and best practices',
      memberCount: 1234,
      topics: ['JavaScript', 'HTML', 'CSS', 'React', 'Node.js']
    },
    {
      id: 2,
      name: 'AI/ML',
      description: 'Explore artificial intelligence and machine learning concepts',
      memberCount: 987,
      topics: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning']
    },
    {
      id: 3,
      name: 'Cybersecurity',
      description: 'Learn about security practices and latest threats',
      memberCount: 756,
      topics: ['Network Security', 'Cryptography', 'Ethical Hacking']
    },
    {
      id: 4,
      name: 'Mobile Development',
      description: 'Build amazing mobile applications for iOS and Android',
      memberCount: 892,
      topics: ['iOS', 'Android', 'React Native', 'Flutter']
    },
    {
      id: 5,
      name: 'Cloud Computing',
      description: 'Master cloud platforms and serverless architecture',
      memberCount: 645,
      topics: ['AWS', 'Azure', 'GCP', 'DevOps']
    },
    {
      id: 6,
      name: 'Game Development',
      description: 'Create engaging games and learn game design principles',
      memberCount: 534,
      topics: ['Unity', 'Unreal Engine', 'Game Design', '3D Modeling']
    }
  ];

  // Function to create a community card
  function createCommunityCard(community, isJoined = false) {
    const card = document.createElement('div');
    card.className = 'community-card';
    card.innerHTML = `
      <h3>${community.name}</h3>
      <p>${community.description}</p>
      <div class="topics">
        ${community.topics.slice(0, 3).map(topic => 
          `<span class="topic">${topic}</span>`
        ).join(', ')}
      </div>
      <div class="community-meta">
        <span class="member-count">${community.memberCount} members</span>
        ${isJoined ? `
          <a href="/community.html?id=${community.id}" class="button button-success">Open Chat</a>
        ` : `
          <button 
            class="button button-primary"
            data-community-id="${community.id}"
            onclick="toggleJoinCommunity(${community.id})"
          >
            Join
          </button>
        `}
      </div>
    `;
    return card;
  }

  // Load communities into the page
  const allCommunitiesContainer = document.getElementById('allCommunities');
  const myCommunitiesSection = document.getElementById('myCommunities');
  const myCommunitiesContainer = myCommunitiesSection?.querySelector('.community-grid');

  // Get joined communities from localStorage
  const joinedCommunities = JSON.parse(localStorage.getItem('joinedCommunities') || '[]');

  // Display all communities
  if (allCommunitiesContainer) {
    allCommunities.forEach(community => {
      const isJoined = joinedCommunities.includes(community.id);
      allCommunitiesContainer.appendChild(createCommunityCard(community, isJoined));
    });
  }

  // Display joined communities if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && myCommunitiesSection && myCommunitiesContainer) {
    myCommunitiesSection.style.display = 'block';
    const userCommunities = allCommunities.filter(community => 
      joinedCommunities.includes(community.id)
    );

    if (userCommunities.length > 0) {
      userCommunities.forEach(community => {
        myCommunitiesContainer.appendChild(createCommunityCard(community, true));
      });
    } else {
      myCommunitiesContainer.innerHTML = `
        <div class="empty-state">
          <p>You haven't joined any communities yet.</p>
        </div>
      `;
    }
  }
});

// Function to toggle joining a community
function toggleJoinCommunity(communityId) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  let joinedCommunities = JSON.parse(localStorage.getItem('joinedCommunities') || '[]');
  const isJoined = joinedCommunities.includes(communityId);

  if (isJoined) {
    joinedCommunities = joinedCommunities.filter(id => id !== communityId);
  } else {
    joinedCommunities.push(communityId);
  }

  localStorage.setItem('joinedCommunities', JSON.stringify(joinedCommunities));

  // Refresh the page to update the UI
  window.location.reload();
}