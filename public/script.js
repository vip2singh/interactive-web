// DOM Elements
const dataTable = document.getElementById('dataTable');
const tableBody = document.getElementById('tableBody');
const addRowBtn = document.getElementById('addRowBtn');
const refreshBtn = document.getElementById('refreshBtn');
const editModal = document.getElementById('editModal');
const addModal = document.getElementById('addModal');
const editForm = document.getElementById('editForm');
const addForm = document.getElementById('addForm');
const closeButtons = document.querySelectorAll('.close');

// Load and display data
async function loadData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    renderTable(data);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Render table
function renderTable(data) {
  tableBody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    const statusClass = row.status === 'Active' ? 'active' : 'inactive';
    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.name}</td>
      <td>${row.email}</td>
      <td><span class="status ${statusClass}">${row.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-info" onclick="openEditModal(${row.id}, '${row.name}', '${row.email}', '${row.status}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteRow(${row.id})">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Open edit modal
function openEditModal(id, name, email, status) {
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editEmail').value = email;
  document.getElementById('editStatus').value = status;
  editModal.style.display = 'block';
}

// Close edit modal
function closeModal() {
  editModal.style.display = 'none';
}

// Open add modal
function openAddModal() {
  addForm.reset();
  addModal.style.display = 'block';
}

// Close add modal
function closeAddModal() {
  addModal.style.display = 'none';
}

// Add row
addRowBtn.addEventListener('click', openAddModal);

// Add form submit
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newRow = {
    name: document.getElementById('addName').value,
    email: document.getElementById('addEmail').value,
    status: document.getElementById('addStatus').value
  };

  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRow)
    });
    if (response.ok) {
      closeAddModal();
      loadData();
    }
  } catch (error) {
    console.error('Error adding row:', error);
  }
});

// Edit form submit
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const updatedRow = {
    name: document.getElementById('editName').value,
    email: document.getElementById('editEmail').value,
    status: document.getElementById('editStatus').value
  };

  try {
    const response = await fetch(`/api/data/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRow)
    });
    if (response.ok) {
      closeModal();
      loadData();
    }
  } catch (error) {
    console.error('Error updating row:', error);
  }
});

// Delete row
async function deleteRow(id) {
  if (confirm('Are you sure you want to delete this row?')) {
    try {
      const response = await fetch(`/api/data/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  }
}

// Refresh button
refreshBtn.addEventListener('click', loadData);

// Close modal when clicking close button
closeButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (e.target.closest('#editModal')) closeModal();
    if (e.target.closest('#addModal')) closeAddModal();
  });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === editModal) closeModal();
  if (e.target === addModal) closeAddModal();
});

// Initial load
loadData();
