document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  // Mock posts data
  const posts = [
    {
      id: 1,
      title: 'Getting Started with React',
      content: 'React is a popular JavaScript library for building user interfaces...',
      author: 'john@example.com',
      communityId: 1,
      communityName: 'Web Development',
      timestamp: '2024-02-01T10:00:00Z',
      likes: 15
    },
    {
      id: 2,
      title: 'Introduction to Machine Learning',
      content: 'Machine learning is a subset of artificial intelligence...',
      author: 'sarah@example.com',
      communityId: 2,
      communityName: 'AI/ML',
      timestamp: '2024-02-02T15:30:00Z',
      likes: 23
    },
    // Add more mock posts as needed
  ];

  // Communities data (reusing from main.js)
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

  // Get joined communities from localStorage
  const joinedCommunities = JSON.parse(localStorage.getItem('joinedCommunities') || '[]');

  // Navigation
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.dashboard-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = item.dataset.section;

      // Update active states
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(targetSection).classList.add('active');
    });
  });

  // Load posts
  const recentPosts = document.getElementById('recentPosts');
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.innerHTML = `
      <div class="post-header">
        <span class="post-community">${post.communityName}</span>
        <span class="post-time">${new Date(post.timestamp).toLocaleDateString()}</span>
      </div>
      <h3 class="post-title">${post.title}</h3>
      <p class="post-content">${post.content}</p>
      <div class="post-footer">
        <span class="post-author">Posted by ${post.author}</span>
        <span class="post-likes">${post.likes} likes</span>
      </div>
    `;
    recentPosts.appendChild(postElement);
  });

  // Load all communities
  const allCommunitiesContainer = document.getElementById('allCommunities');
  allCommunities.forEach(community => {
    const isJoined = joinedCommunities.includes(community.id);
    const communityElement = document.createElement('div');
    communityElement.className = 'community-card';
    communityElement.innerHTML = `
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
    allCommunitiesContainer.appendChild(communityElement);
  });

  // Load joined communities
  const myCommunitiesContainer = document.getElementById('myCommunities');
  const userCommunities = allCommunities.filter(community => 
    joinedCommunities.includes(community.id)
  );

  if (userCommunities.length > 0) {
    userCommunities.forEach(community => {
      const communityElement = document.createElement('div');
      communityElement.className = 'community-card';
      communityElement.innerHTML = `
        <h3>${community.name}</h3>
        <p>${community.description}</p>
        <div class="topics">
          ${community.topics.slice(0, 3).map(topic => 
            `<span class="topic">${topic}</span>`
          ).join(', ')}
        </div>
        <div class="community-meta">
          <span class="member-count">${community.memberCount} members</span>
          <a href="/community.html?id=${community.id}" class="button button-success">Open Chat</a>
        </div>
      `;
      myCommunitiesContainer.appendChild(communityElement);
    });
  } else {
    myCommunitiesContainer.innerHTML = `
      <div class="empty-state">
        <p>You haven't joined any communities yet.</p>
      </div>
    `;
  }
});