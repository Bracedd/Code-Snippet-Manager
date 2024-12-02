// DOM Elements
const snippetForm = document.getElementById('snippet-form');
const snippetTitle = document.getElementById('snippet-title');
const snippetLanguage = document.getElementById('snippet-language');
const snippetCode = document.getElementById('snippet-code');
const snippetsContainer = document.getElementById('snippets-container');
const searchBar = document.getElementById('search-bar');

// Load snippets from localStorage
let snippets = JSON.parse(localStorage.getItem('snippets')) || [];

// Render snippets
function renderSnippets() {
    snippetsContainer.innerHTML = '';
    snippets.forEach((snippet, index) => {
        const snippetElement = document.createElement('div');
        snippetElement.classList.add('snippet');
        snippetElement.innerHTML = `
            <h3>${snippet.title}</h3>
            <p><strong>Language:</strong> ${snippet.language}</p>
            <pre><code>${escapeHtml(snippet.code)}</code></pre>
            <div class="snippet-actions">
                <button onclick="editSnippet(${index})"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteSnippet(${index})"><i class="fas fa-trash-alt"></i> Delete</button>
                <button onclick="copySnippet(${index})"><i class="fas fa-copy"></i> Copy</button>
            </div>
        `;
        snippetsContainer.appendChild(snippetElement);
    });
}

// Add new snippet
snippetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newSnippet = {
        title: snippetTitle.value,
        language: snippetLanguage.value,
        code: snippetCode.value
    };
    snippets.push(newSnippet);
    localStorage.setItem('snippets', JSON.stringify(snippets));
    snippetForm.reset();
    renderSnippets();
    showNotification('Snippet saved successfully!');
});

// Edit snippet
function editSnippet(index) {
    const snippet = snippets[index];
    snippetTitle.value = snippet.title;
    snippetLanguage.value = snippet.language;
    snippetCode.value = snippet.code;
    snippets.splice(index, 1);
    localStorage.setItem('snippets', JSON.stringify(snippets));
    renderSnippets();
    snippetTitle.focus();
    showNotification('Snippet ready for editing');
}

// Delete snippet
function deleteSnippet(index) {
    if (confirm('Are you sure you want to delete this snippet?')) {
        snippets.splice(index, 1);
        localStorage.setItem('snippets', JSON.stringify(snippets));
        renderSnippets();
        showNotification('Snippet deleted successfully!');
    }
}

// Copy snippet
function copySnippet(index) {
    const snippet = snippets[index];
    navigator.clipboard.writeText(snippet.code).then(() => {
        showNotification('Snippet copied to clipboard!');
    });
}

// Search snippets
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredSnippets = snippets.filter(snippet => 
        snippet.title.toLowerCase().includes(searchTerm) || 
        snippet.code.toLowerCase().includes(searchTerm)
    );
    renderFilteredSnippets(filteredSnippets);
});

function renderFilteredSnippets(filteredSnippets) {
    snippetsContainer.innerHTML = '';
    filteredSnippets.forEach((snippet, index) => {
        const snippetElement = document.createElement('div');
        snippetElement.classList.add('snippet');
        snippetElement.innerHTML = `
            <h3>${snippet.title}</h3>
            <p><strong>Language:</strong> ${snippet.language}</p>
            <pre><code>${escapeHtml(snippet.code)}</code></pre>
            <div class="snippet-actions">
                <button onclick="editSnippet(${snippets.indexOf(snippet)})"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteSnippet(${snippets.indexOf(snippet)})"><i class="fas fa-trash-alt"></i> Delete</button>
                <button onclick="copySnippet(${snippets.indexOf(snippet)})"><i class="fas fa-copy"></i> Copy</button>
            </div>
        `;
        snippetsContainer.appendChild(snippetElement);
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initial render
renderSnippets();

// Add this CSS to your styles.css file
const notificationStyles = `
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4a4e69;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: translateY(10px);
    animation: fadeInUp 0.3s ease forwards;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

const styleElement = document.createElement('style');
styleElement.textContent = notificationStyles;
document.head.appendChild(styleElement);