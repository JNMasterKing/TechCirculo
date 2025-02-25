document.addEventListener('DOMContentLoaded', () => {
  // Get community ID from URL
  const params = new URLSearchParams(window.location.search);
  const communityId = params.get('id');
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  // Get community details
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

  // Mock members data
  const communityMembers = [
    { id: 1, email: 'john@example.com', role: 'teacher', joinedAt: '2024-01-15' },
    { id: 2, email: 'sarah@example.com', role: 'student', joinedAt: '2024-01-16' },
    { id: 3, email: 'mike@example.com', role: 'alumni', joinedAt: '2024-01-17' },
    { id: 4, email: 'emma@example.com', role: 'student', joinedAt: '2024-01-18' },
    { id: 5, email: user.email, role: user.role || 'student', joinedAt: '2024-01-19' }
  ];

  const community = allCommunities.find(c => c.id === parseInt(communityId));
  if (!community) {
    window.location.href = '/';
    return;
  }

  // Update community details in the UI
  document.getElementById('communityName').textContent = community.name;
  document.getElementById('communityDescription').textContent = community.description;
  document.getElementById('memberCount').textContent = community.memberCount;
  document.getElementById('topicsList').textContent = community.topics.join(', ');

  // Load and display members
  const membersList = document.getElementById('membersList');
  communityMembers.forEach(member => {
    const memberElement = document.createElement('div');
    memberElement.className = 'member-item';
    memberElement.innerHTML = `
      <div class="member-info">
        <span class="member-email">${member.email}</span>
        <span class="member-role ${member.role}">${member.role}</span>
      </div>
      <span class="member-joined">Joined ${new Date(member.joinedAt).toLocaleDateString()}</span>
    `;
    membersList.appendChild(memberElement);
  });

  // Load messages from localStorage
  const chatKey = `chat_${communityId}`;
  let messages = JSON.parse(localStorage.getItem(chatKey) || '[]');
  const chatMessages = document.getElementById('chatMessages');

  // Load announcements from localStorage
  const announcementKey = `announcements_${communityId}`;
  let announcements = JSON.parse(localStorage.getItem(announcementKey) || '[]');
  const announcementsContainer = document.getElementById('announcements');

  function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${message.userId === user.email ? 'own-message' : ''}`;
    messageElement.innerHTML = `
      <div class="message-header">
        <span class="message-author">${message.userId}</span>
        <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
      <div class="message-content">${message.content}</div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addAnnouncement(announcement) {
    const announcementElement = document.createElement('div');
    announcementElement.className = 'announcement-item';
    announcementElement.innerHTML = `
      <div class="announcement-header">
        <span class="announcement-author">${announcement.userId}</span>
        <span class="announcement-time">${new Date(announcement.timestamp).toLocaleDateString()}</span>
      </div>
      <div class="announcement-content">${announcement.content}</div>
    `;
    announcementsContainer.insertBefore(announcementElement, announcementsContainer.firstChild);
  }

  // Display existing messages and announcements
  messages.forEach(addMessage);
  announcements.forEach(addAnnouncement);

  // Handle new messages
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (!content) return;

    const message = {
      userId: user.email,
      content,
      timestamp: new Date().toISOString()
    };

    messages.push(message);
    localStorage.setItem(chatKey, JSON.stringify(messages));
    addMessage(message);
    messageInput.value = '';
  });

  // Handle new announcements
  const announcementForm = document.getElementById('announcementForm');
  const announcementInput = document.getElementById('announcementInput');

  // Only show announcement form for teachers
  if (user.role !== 'teacher') {
    announcementForm.style.display = 'none';
  }

  announcementForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = announcementInput.value.trim();
    if (!content) return;

    const announcement = {
      userId: user.email,
      content,
      timestamp: new Date().toISOString()
    };

    announcements.unshift(announcement);
    localStorage.setItem(announcementKey, JSON.stringify(announcements));
    addAnnouncement(announcement);
    announcementInput.value = '';
  });
});