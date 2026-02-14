/**
 * Dashboard JavaScript - Handles all dashboard functionality
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!authManager.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize dashboard
    initDashboard();
    
    // Load user faces
    loadUserFaces();
    
    // Load events
    loadEvents();
    
    // Setup tab navigation
    setupTabs();
    
    // Setup face upload
    setupFaceUpload();
    
    // Setup profile forms
    setupProfileForms();
    
    // Setup photo search
    setupPhotoSearch();
});

/**
 * Initialize Dashboard
 */
function initDashboard() {
    // Update user info in UI
    authManager.updateUI();
}

/**
 * Setup Tab Navigation
 */
function setupTabs() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.dataset.tab;
            
            // Update active states
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Load User Faces
 */
async function loadUserFaces() {
    const facesGrid = document.getElementById('facesGrid');
    if (!facesGrid) return;
    
    try {
        const data = await authManager.apiRequest('/photos/my-faces');
        
        if (data.success && data.data.length > 0) {
            facesGrid.innerHTML = data.data.map(face => `
                <div class="face-card ${face.is_primary ? 'primary' : ''}" data-face-id="${face.id}">
                    <img src="http://localhost:5000/uploads/${face.image_path}" alt="Face">
                    ${face.is_primary ? '<span class="face-badge">Primary</span>' : ''}
                    <button class="face-delete" data-face-id="${face.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
            
            // Setup delete handlers
            facesGrid.querySelectorAll('.face-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const faceId = btn.dataset.faceId;
                    deleteFace(faceId);
                });
            });
        } else {
            facesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-user-circle"></i>
                    <p>No faces registered yet</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading faces:', error);
        facesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load faces</p>
            </div>
        `;
    }
}

/**
 * Delete Face
 */
async function deleteFace(faceId) {
    if (!confirm('Are you sure you want to delete this face?')) return;
    
    try {
        const data = await authManager.apiRequest(`/photos/delete-face/${faceId}`, {
            method: 'DELETE'
        });
        
        if (data.success) {
            authManager.showToast('Face deleted successfully', 'success');
            loadUserFaces();
        } else {
            authManager.showToast(data.message || 'Failed to delete face', 'error');
        }
    } catch (error) {
        console.error('Delete face error:', error);
        authManager.showToast('Error deleting face', 'error');
    }
}

/**
 * Setup Face Upload
 */
function setupFaceUpload() {
    const dropzone = document.getElementById('faceDropzone');
    const fileInput = document.getElementById('faceFileInput');
    const preview = document.getElementById('facePreview');
    const previewGrid = document.getElementById('facePreviewGrid');
    const faceCount = document.getElementById('faceCount');
    const uploadBtn = document.getElementById('uploadFacesBtn');
    const clearBtn = document.getElementById('clearFacesBtn');
    
    if (!dropzone || !fileInput) return;
    
    let selectedFiles = [];
    
    // Click to select files
    dropzone.addEventListener('click', () => fileInput.click());
    
    // File selection
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    function handleFiles(files) {
        const validFiles = Array.from(files).filter(file => {
            return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024;
        });
        
        if (validFiles.length === 0) {
            authManager.showToast('Please select valid image files (max 10MB each)', 'warning');
            return;
        }
        
        selectedFiles = [...selectedFiles, ...validFiles];
        
        if (selectedFiles.length > 10) {
            selectedFiles = selectedFiles.slice(0, 10);
            authManager.showToast('Maximum 10 photos allowed', 'warning');
        }
        
        updatePreview();
    }
    
    function updatePreview() {
        if (selectedFiles.length === 0) {
            preview.style.display = 'none';
            return;
        }
        
        preview.style.display = 'block';
        faceCount.textContent = selectedFiles.length;
        
        previewGrid.innerHTML = selectedFiles.map((file, index) => `
            <div class="preview-item">
                <img src="${URL.createObjectURL(file)}" alt="Preview ${index + 1}">
                <button class="preview-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Setup remove handlers
        previewGrid.querySelectorAll('.preview-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                selectedFiles.splice(index, 1);
                updatePreview();
            });
        });
    }
    
    // Clear all
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            selectedFiles = [];
            updatePreview();
        });
    }
    
    // Upload faces
    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            if (selectedFiles.length === 0) {
                authManager.showToast('Please select at least one photo', 'warning');
                return;
            }
            
            uploadBtn.classList.add('loading');
            
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('faces', file);
            });
            
            try {
                const data = await authManager.uploadFormData('/photos/upload-faces', formData);
                
                if (data.success) {
                    authManager.showToast(`Successfully uploaded ${data.data.uploaded_faces.length} face(s)`, 'success');
                    selectedFiles = [];
                    updatePreview();
                    loadUserFaces();
                } else {
                    authManager.showToast(data.message || 'Upload failed', 'error');
                }
            } catch (error) {
                console.error('Upload error:', error);
                authManager.showToast('Error uploading faces', 'error');
            } finally {
                uploadBtn.classList.remove('loading');
            }
        });
    }
}

/**
 * Load Events
 */
async function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const photoEventSelect = document.getElementById('photoEventSelect');
    
    if (!eventsGrid) return;
    
    try {
        const data = await authManager.apiRequest('/photos/events');
        
        if (data.success && data.data.events.length > 0) {
            // Render events grid
            eventsGrid.innerHTML = data.data.events.map(event => `
                <div class="event-card" data-event-id="${event.id}">
                    <div class="event-image">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="event-content">
                        <span class="event-type">${event.event_type || 'Event'}</span>
                        <h3 class="event-title">${event.name}</h3>
                        <div class="event-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${event.location || 'Location TBD'}</span>
                            <span><i class="fas fa-calendar"></i> ${event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Date TBD'}</span>
                        </div>
                        <div class="event-stats">
                            <div class="event-stat">
                                <span class="event-stat-value">${event.photo_count || 0}</span>
                                <span class="event-stat-label">Photos</span>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="selectEventForSearch(${event.id})">
                                Find My Photos
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Populate event select dropdown
            if (photoEventSelect) {
                photoEventSelect.innerHTML = `
                    <option value="">Choose an event...</option>
                    ${data.data.events.map(event => `
                        <option value="${event.id}">${event.name}</option>
                    `).join('')}
                `;
            }
        } else {
            eventsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No Events Available</h3>
                    <p>Check back later for upcoming events</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading events:', error);
        eventsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load events</p>
            </div>
        `;
    }
}

/**
 * Select Event for Photo Search
 */
function selectEventForSearch(eventId) {
    const photoEventSelect = document.getElementById('photoEventSelect');
    const findMyPhotosBtn = document.getElementById('findMyPhotosBtn');
    
    if (photoEventSelect) {
        photoEventSelect.value = eventId;
        
        // Switch to My Photos tab
        const myPhotosTab = document.querySelector('[data-tab="my-photos"]');
        if (myPhotosTab) {
            myPhotosTab.click();
        }
        
        if (findMyPhotosBtn) {
            findMyPhotosBtn.disabled = false;
        }
    }
}

/**
 * Setup Photo Search
 */
function setupPhotoSearch() {
    const photoEventSelect = document.getElementById('photoEventSelect');
    const findMyPhotosBtn = document.getElementById('findMyPhotosBtn');
    const photosFilters = document.getElementById('photosFilters');
    const photosResults = document.getElementById('photosResults');
    const qualityFilter = document.getElementById('qualityFilter');
    const qualityValue = document.getElementById('qualityValue');
    const cameraFilter = document.getElementById('cameraFilter');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    
    if (!photoEventSelect || !findMyPhotosBtn) return;
    
    let currentMatches = [];
    
    // Enable/disable find button based on selection
    photoEventSelect.addEventListener('change', () => {
        findMyPhotosBtn.disabled = !photoEventSelect.value;
    });
    
    // Update quality value display
    if (qualityFilter && qualityValue) {
        qualityFilter.addEventListener('input', () => {
            qualityValue.textContent = qualityFilter.value + '+';
            filterPhotos();
        });
    }
    
    // Filter photos
    if (cameraFilter) {
        cameraFilter.addEventListener('change', filterPhotos);
    }
    
    function filterPhotos() {
        if (!currentMatches.length) return;
        
        const minQuality = parseInt(qualityFilter?.value || 0);
        const selectedCamera = cameraFilter?.value || '';
        
        const filtered = currentMatches.filter(photo => {
            const qualityMatch = !minQuality || (photo.quality_score || 0) >= minQuality;
            const cameraMatch = !selectedCamera || photo.camera_model === selectedCamera;
            return qualityMatch && cameraMatch;
        });
        
        renderPhotos(filtered);
    }
    
    // Find photos button
    findMyPhotosBtn.addEventListener('click', async () => {
        const eventId = photoEventSelect.value;
        
        if (!eventId) {
            authManager.showToast('Please select an event', 'warning');
            return;
        }
        
        findMyPhotosBtn.classList.add('loading');
        photosResults.innerHTML = `
            <div class="loading-events">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Searching for your photos...</span>
            </div>
        `;
        
        try {
            const data = await authManager.apiRequest('/photos/match', {
                method: 'POST',
                body: JSON.stringify({ event_id: parseInt(eventId) })
            });
            
            if (data.success) {
                currentMatches = data.data.matches;
                
                if (currentMatches.length > 0) {
                    photosFilters.style.display = 'flex';
                    
                    // Populate camera filter
                    const cameras = [...new Set(currentMatches.map(p => p.camera_model).filter(Boolean))];
                    if (cameraFilter) {
                        cameraFilter.innerHTML = `
                            <option value="">All Cameras</option>
                            ${cameras.map(camera => `<option value="${camera}">${camera}</option>`).join('')}
                        `;
                    }
                    
                    renderPhotos(currentMatches);
                    authManager.showToast(`Found ${currentMatches.length} photos with your face!`, 'success');
                } else {
                    photosFilters.style.display = 'none';
                    photosResults.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-search"></i>
                            <h3>No Photos Found</h3>
                            <p>We couldn't find any photos with your face in this event. Try registering more face angles.</p>
                        </div>
                    `;
                }
            } else {
                authManager.showToast(data.message || 'Search failed', 'error');
                photosResults.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${data.message}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Search error:', error);
            authManager.showToast('Error searching photos', 'error');
        } finally {
            findMyPhotosBtn.classList.remove('loading');
        }
    });
    
    function renderPhotos(photos) {
        if (photos.length === 0) {
            photosResults.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-filter"></i>
                    <h3>No Photos Match Filters</h3>
                    <p>Try adjusting your filter criteria</p>
                </div>
            `;
            return;
        }
        
        photosResults.innerHTML = `
            <div class="photos-grid">
                ${photos.map(photo => `
                    <div class="photo-card" data-photo-id="${photo.id}">
                        <img src="http://localhost:5000/uploads/${photo.file_path}" alt="Photo">
                        <span class="photo-confidence">${Math.round(photo.match_confidence || 0)}%</span>
                        <div class="photo-overlay">
                            <div class="photo-info">
                                <p><i class="fas fa-camera"></i> ${photo.camera_model || 'Unknown'}</p>
                                <p><i class="fas fa-star"></i> Quality: ${Math.round(photo.quality_score || 0)}/100</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add click handlers
        photosResults.querySelectorAll('.photo-card').forEach(card => {
            card.addEventListener('click', () => {
                const photoId = card.dataset.photoId;
                const photo = photos.find(p => p.id == photoId);
                if (photo) {
                    openPhotoModal(photo);
                }
            });
        });
    }
    
    // Download all
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', async () => {
            if (currentMatches.length === 0) return;
            
            authManager.showToast('Preparing download...', 'info');
            
            // Download photos one by one
            for (const photo of currentMatches) {
                try {
                    const response = await fetch(`http://localhost:5000/api/photos/download/${photo.id}`, {
                        headers: {
                            'Authorization': `Bearer ${authManager.getToken()}`
                        }
                    });
                    
                    if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = photo.file_name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }
                } catch (error) {
                    console.error('Download error:', error);
                }
            }
            
            authManager.showToast('Download complete!', 'success');
        });
    }
}

/**
 * Open Photo Modal
 */
function openPhotoModal(photo) {
    const modal = document.getElementById('photoModal');
    const previewImage = document.getElementById('previewImage');
    const previewInfo = document.getElementById('previewInfo');
    
    if (!modal || !previewImage) return;
    
    previewImage.src = `http://localhost:5000/uploads/${photo.file_path}`;
    
    if (previewInfo) {
        previewInfo.innerHTML = `
            <h3>${photo.file_name}</h3>
            <p><i class="fas fa-camera"></i> ${photo.camera_model || 'Unknown Camera'}</p>
            <p><i class="fas fa-calendar"></i> ${photo.capture_date ? new Date(photo.capture_date).toLocaleString() : 'Date unknown'}</p>
            <p><i class="fas fa-star"></i> Quality Score: ${Math.round(photo.quality_score || 0)}/100</p>
            <p><i class="fas fa-percentage"></i> Match Confidence: ${Math.round(photo.match_confidence || 0)}%</p>
            <a href="http://localhost:5000/api/photos/download/${photo.id}" 
               class="btn btn-primary" 
               target="_blank"
               style="margin-top: 1rem;">
                <i class="fas fa-download"></i> Download Photo
            </a>
        `;
    }
    
    modal.classList.add('active');
    
    // Close handler
    const closeBtn = document.getElementById('closePhotoModal');
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }
}

/**
 * Setup Profile Forms
 */
function setupProfileForms() {
    // Profile update form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                first_name: document.getElementById('settingsFirstName')?.value,
                last_name: document.getElementById('settingsLastName')?.value
            };
            
            try {
                const data = await authManager.apiRequest('/auth/profile', {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                
                if (data.success) {
                    authManager.showToast('Profile updated successfully', 'success');
                    authManager.user = data.data;
                    authManager.updateUI();
                } else {
                    authManager.showToast(data.message || 'Update failed', 'error');
                }
            } catch (error) {
                console.error('Profile update error:', error);
                authManager.showToast('Error updating profile', 'error');
            }
        });
    }
    
    // Password change form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword')?.value;
            const newPassword = document.getElementById('newPassword')?.value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;
            
            if (newPassword !== confirmPassword) {
                authManager.showToast('New passwords do not match', 'error');
                return;
            }
            
            try {
                const data = await authManager.apiRequest('/auth/change-password', {
                    method: 'PUT',
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword
                    })
                });
                
                if (data.success) {
                    authManager.showToast('Password changed successfully', 'success');
                    passwordForm.reset();
                } else {
                    authManager.showToast(data.message || 'Password change failed', 'error');
                }
            } catch (error) {
                console.error('Password change error:', error);
                authManager.showToast('Error changing password', 'error');
            }
        });
    }
}
