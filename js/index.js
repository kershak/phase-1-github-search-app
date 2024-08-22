const searchForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');
const toggleSearchButton = document.getElementById('toggle-search');
let searchType = 'user'; // Default search type

// Function to fetch data from GitHub API
async function fetchGitHubData(endpoint, query) {
  const response = await fetch(`https://api.github.com/${endpoint}?q=${query}`);
  const data = await response.json();
  return data;
}

// Function to display user search results
function displayUsers(users) {
  userList.innerHTML = ''; // Clear previous results
  users.forEach(user => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" height="30">
      <a href="#" data-username="${user.login}">${user.login}</a>
    `;
    userList.appendChild(listItem);
  });
}

// Function to display repository search results
function displayRepos(repos) {
  reposList.innerHTML = ''; // Clear previous results
  repos.forEach(repo => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
    `;
    reposList.appendChild(listItem);
  });
}

// Function to handle user clicks on user list items
userList.addEventListener('click', async (event) => {
    if (event.target.tagName === 'A') {
      const username = event.target.dataset.username;
      const repos = await fetchGitHubData(`users/${username}/repos`, ''); 
      displayRepos(repos);
    }
  });
  
// Function to handle form submission
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = searchInput.value;
  let endpoint = 'search/users'; 
  if (searchType === 'repo') {
    endpoint = 'search/repositories'; 
  }

  const data = await fetchGitHubData(endpoint, query);
  if (searchType === 'user') {
    displayUsers(data.items);
  } else {
    displayRepos(data.items);
  }
});

// Function to toggle between user and repo search
toggleSearchButton.addEventListener('click', () => {
  searchType = searchType === 'user' ? 'repo' : 'user';
  toggleSearchButton.textContent = `Search ${searchType === 'user' ? 'Repos' : 'Users'}`;
  searchInput.value = ''; // Clear the input
  userList.innerHTML = ''; // Clear the user list
  reposList.innerHTML = ''; // Clear the repo list
});