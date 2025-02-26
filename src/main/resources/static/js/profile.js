// profile.js - Updated for better interactivity and UI

// --- Dark Mode Toggle ---
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark-mode');
}

// --- Profile Editing ---
const editPanel = document.getElementById('edit-panel');
const editPersonalInfoBtn = document.getElementById('edit-personal-info-btn');
const closeEditBtn = document.getElementById('close-edit-btn');
const saveEditBtn = document.getElementById('save-edit-btn');

editPersonalInfoBtn.addEventListener('click', () => {
  document.getElementById('edit-name').value = document.getElementById('display-name').textContent;
  document.getElementById('edit-email').value = document.getElementById('display-email').textContent;
  document.getElementById('edit-university').value = document.getElementById('display-university').textContent;
  editPanel.classList.add('open');
});

closeEditBtn.addEventListener('click', () => {
  editPanel.classList.remove('open');
});

saveEditBtn.addEventListener('click', () => {
  const newName = document.getElementById('edit-name').value.trim();
  const newEmail = document.getElementById('edit-email').value.trim();
  const newUniversity = document.getElementById('edit-university').value.trim();

  if (newName) document.getElementById('display-name').textContent = newName;
  if (newEmail) document.getElementById('display-email').textContent = newEmail;
  if (newUniversity) document.getElementById('display-university').textContent = newUniversity;
  
  localStorage.setItem('profileData', JSON.stringify({ name: newName, email: newEmail, university: newUniversity }));
  
  editPanel.classList.remove('open');
  showNotification('Profile updated successfully!');
});

// --- Community Search & Filtering ---
const communitySearch = document.getElementById('community-search');
const communityList = document.getElementById('community-list');
communitySearch.addEventListener('input', () => {
  const filter = communitySearch.value.toLowerCase();
  Array.from(communityList.getElementsByTagName('li')).forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(filter) ? 'block' : 'none';
  });
});

// --- Notification System ---
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Load stored profile data
const storedData = JSON.parse(localStorage.getItem('profileData'));
if (storedData) {
  document.getElementById('display-name').textContent = storedData.name;
  document.getElementById('display-email').textContent = storedData.email;
  document.getElementById('display-university').textContent = storedData.university;
}
