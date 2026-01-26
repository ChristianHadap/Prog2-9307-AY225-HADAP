// User Management System
class UserManager {
    constructor() {
        this.users = this.loadUsersFromStorage();
        this.currentUser = null;
        this.loginSessions = this.loadLoginSessionsFromStorage();
    }

    // Generate a unique User ID
    generateUserId() {
        return 'USR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Register a new user (adds a persistent digital signature)
    async registerUser(username, fullName, password) {
        // Check if username already exists
        if (this.users.some(user => user.username === username)) {
            return { success: false, message: 'Username already taken!' };
        }

        const newUser = {
            userId: this.generateUserId(),
            username: username,
            fullName: fullName,
            password: password, // In a real app, this should be hashed!
            accountCreatedDate: new Date().toLocaleString(),
            lastLogin: null,
            attendanceLog: [],
            digitalSignature: null
        };

        // Create a user-level digital signature over stable identity fields
        try {
            const payload = `USER|${newUser.userId}|${newUser.username}|${newUser.fullName}|${newUser.accountCreatedDate}`;
            newUser.digitalSignature = await signString(payload);
        } catch (e) {
            console.warn('Failed to create user digital signature', e);
        }

        this.users.push(newUser);
        this.saveUsersToStorage();
        return { success: true, message: 'Account created successfully!', user: newUser };
    }

    // Authenticate user during sign-in (records attendance with per-record signature)
    async authenticateUser(username, password) {
        const user = this.users.find(u => u.username === username);

        if (!user) {
            return { success: false, message: 'Username not found!' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Incorrect password!' };
        }

        // Update last login and record attendance
        const now = new Date().toLocaleString();
        user.lastLogin = now;
        
        if (!user.attendanceLog) {
            user.attendanceLog = [];
        }
        const record = {
            loginTime: now,
            timestamp: Date.now(),
            signature: null
        };
        try {
            const payload = `ATTEND|${user.userId}|${user.username}|${record.loginTime}|${record.timestamp}`;
            record.signature = await signString(payload);
        } catch (e) {
            console.warn('Failed to sign attendance record', e);
        }
        user.attendanceLog.push(record);
        
        this.saveUsersToStorage();

        // Record login session
        this.recordLoginSession(user);

        // Persist current session (remember user across reloads)
        try {
            localStorage.setItem('currentUserId', user.userId);
        } catch (e) {
            console.warn('Failed to persist current user', e);
        }

        return { success: true, message: 'Sign in successful!', user: user };
    }

    // Record login session
    recordLoginSession(user) {
        const session = {
            userId: user.userId,
            username: user.username,
            fullName: user.fullName,
            loginTime: new Date().toLocaleString(),
            sessionId: 'SESSION_' + Date.now()
        };

        this.loginSessions.push(session);
        this.saveLoginSessionsToStorage();
    }

    // Get login history for a specific user
    getLoginHistory(userId) {
        return this.loginSessions.filter(session => session.userId === userId);
    }

    // Get user by ID
    getUserById(userId) {
        return this.users.find(user => user.userId === userId);
    }

    // Save users to localStorage
    saveUsersToStorage() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Load users from localStorage
    loadUsersFromStorage() {
        const data = localStorage.getItem('users');
        return data ? JSON.parse(data) : [];
    }

    // Save login sessions to localStorage
    saveLoginSessionsToStorage() {
        localStorage.setItem('loginSessions', JSON.stringify(this.loginSessions));
    }

    // Load login sessions from localStorage
    loadLoginSessionsFromStorage() {
        const data = localStorage.getItem('loginSessions');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize User Manager
const userManager = new UserManager();

// Admin settings
const ADMIN_PASSWORD = '12345';
let isAdminLoggedIn = false;

// ------------------ Digital signature & JSON export helpers ------------------
// Uses Web Crypto API (ECDSA P-256 + SHA-256). Keys are stored as exportable JWKs in localStorage (demo only).
async function generateAndStoreKeyPair() {
    try {
        const keyPair = await window.crypto.subtle.generateKey(
            { name: 'ECDSA', namedCurve: 'P-256' },
            true,
            ['sign', 'verify']
        );

        const privateJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
        const publicJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);

        localStorage.setItem('signingKeyPrivateJwk', JSON.stringify(privateJwk));
        localStorage.setItem('signingKeyPublicJwk', JSON.stringify(publicJwk));

        return { privateJwk, publicJwk };
    } catch (e) {
        console.error('Key generation failed', e);
        return null;
    }
}

async function importPrivateKeyFromJwk(jwk) {
    return await window.crypto.subtle.importKey(
        'jwk', jwk,
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['sign']
    );
}

async function importPublicKeyFromJwk(jwk) {
    return await window.crypto.subtle.importKey(
        'jwk', jwk,
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['verify']
    );
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

async function signString(message) {
    // Ensure key exists
    let privateJwk = localStorage.getItem('signingKeyPrivateJwk');
    if (!privateJwk) {
        await generateAndStoreKeyPair();
        privateJwk = localStorage.getItem('signingKeyPrivateJwk');
    }
    const jwk = JSON.parse(privateJwk);
    const key = await importPrivateKeyFromJwk(jwk);

    const enc = new TextEncoder();
    const msgBuffer = enc.encode(message);
    const signature = await window.crypto.subtle.sign({ name: 'ECDSA', hash: { name: 'SHA-256' } }, key, msgBuffer);
    return arrayBufferToBase64(signature);
}

async function getPublicJwk() {
    let publicJwk = localStorage.getItem('signingKeyPublicJwk');
    if (!publicJwk) {
        const keys = await generateAndStoreKeyPair();
        if (!keys) return null;
        publicJwk = JSON.stringify(keys.publicJwk);
    }
    return JSON.parse(publicJwk);
}

function downloadJSON(filename, obj) {
    const content = JSON.stringify(obj, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

async function createSignedExport(payloadData, exportedBy) {
    // payloadData is a JS object (attendance data)
    const exportedAtISO = new Date().toISOString();
    const exportedAtLocal = new Date().toLocaleString();

    const dataToSign = JSON.stringify({ payload: payloadData, exportedAtISO, exportedBy });
    const signature = await signString(dataToSign);
    const publicJwk = await getPublicJwk();

    return {
        meta: {
            exportedBy: exportedBy || 'unknown',
            exportedAtISO,
            exportedAtLocal
        },
        data: payloadData,
        signature,
        publicKey: publicJwk
    };
}

// Helper: download CSV content
function downloadCSV(filename, csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function buildCsvForUser(user) {
    const header = ['userId', 'username', 'fullName', 'loginTime', 'signature'];
    const rows = (user.attendanceLog || []).map(r => {
        // Escape fields that may contain commas or quotes
        const esc = val => `"${String(val).replace(/"/g, '""')}"`;
        return [esc(user.userId), esc(user.username), esc(user.fullName), esc(r.loginTime), esc(r.signature || '')].join(',');
    });
    return header.join(',') + '\n' + rows.join('\n');
}

function buildCsvForAll(users) {
    const header = ['userId', 'username', 'fullName', 'loginTime', 'signature'];
    const rows = [];
    users.forEach(user => {
        (user.attendanceLog || []).forEach(r => {
            const esc = val => `"${String(val).replace(/"/g, '""')}"`;
            rows.push([esc(user.userId), esc(user.username), esc(user.fullName), esc(r.loginTime), esc(r.signature || '')].join(','));
        });
    });
    return header.join(',') + '\n' + rows.join('\n');
}

// Export a specific user's attendance as CSV (admin only), with companion signature JSON
async function exportUserAttendance(userId) {
    if (!isAdminLoggedIn) {
        showMessage('Admin login required to export attendance', 'error');
        return;
    }
    const user = userManager.getUserById(userId);
    if (!user) {
        showMessage('User not found', 'error');
        return;
    }

    const csv = buildCsvForUser(user);
    const signature = await signString(csv);
    const publicJwk = await getPublicJwk();

    const baseFilename = `attendance_${user.username}_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    downloadCSV(baseFilename + '.csv', csv);
    const sigObj = {
        meta: { exportedBy: 'admin', exportedAtISO: new Date().toISOString(), exportedAtLocal: new Date().toLocaleString() },
        signature,
        publicKey: publicJwk
    };
    downloadJSON(baseFilename + '.csv.sig.json', sigObj);
    showMessage(`Exported attendance for ${user.username}`, 'success');
}

// Export all users' attendance as CSV (admin only) with signature JSON
async function exportAllAttendance() {
    if (!isAdminLoggedIn) {
        showMessage('Admin login required to export all attendance', 'error');
        return;
    }

    const csv = buildCsvForAll(userManager.users);
    const signature = await signString(csv);
    const publicJwk = await getPublicJwk();

    const baseFilename = `attendance_all_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    downloadCSV(baseFilename + '.csv', csv);

    const sigObj = {
        meta: { exportedBy: 'admin', exportedAtISO: new Date().toISOString(), exportedAtLocal: new Date().toLocaleString() },
        signature,
        publicKey: publicJwk
    };
    downloadJSON(baseFilename + '.csv.sig.json', sigObj);
    showMessage('All attendance CSV exported (signed). Two files downloaded.', 'success');
}

// ------------------ end signature/export helpers ------------------

// Toggle between sign up and sign in forms
function toggleForms() {
    const signupSection = document.getElementById('signupSection');
    const signinSection = document.getElementById('signinSection');

    signupSection.classList.toggle('hidden');
    signinSection.classList.toggle('hidden');
}

// Display message to user
function showMessage(message, type = 'success', duration = 3000) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message show ${type}`;

    setTimeout(() => {
        messageEl.classList.remove('show');
    }, duration);
}

// Handle Sign Up
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const fullName = document.getElementById('signupName').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!username || !fullName || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    const result = await userManager.registerUser(username, fullName, password);

    if (result.success) {
        showMessage(result.message, 'success');
        document.getElementById('signupForm').reset();

        // Switch to sign in form after successful signup
        setTimeout(() => {
            toggleForms();
        }, 1500);
    } else {
        showMessage(result.message, 'error');
    }
});

// Handle Sign In
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signinUsername').value.trim();
    const password = document.getElementById('signinPassword').value;

    if (!username || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    const result = await userManager.authenticateUser(username, password);

    if (result.success) {
        // Play check-in sound on successful login (attendance recorded)
        audioAlert.playCheckInBeep();
        showMessage(result.message, 'success');
        userManager.currentUser = result.user;
        
        // Show dashboard after successful login
        setTimeout(() => {
            showDashboard(result.user);
        }, 1000);
    } else {
        audioAlert.playErrorBeep();
        showMessage(result.message, 'error');
    }
});

// Display user dashboard
function showDashboard(user) {
    // Hide auth sections
    document.getElementById('signupSection').classList.add('hidden');
    document.getElementById('signinSection').classList.add('hidden');

    // Show dashboard
    document.getElementById('dashboard').classList.remove('hidden');

    // Populate user information
    document.getElementById('userName').textContent = user.username;
    document.getElementById('userId').textContent = user.userId;
    document.getElementById('displayUsername').textContent = user.username;
    document.getElementById('displayName').textContent = user.fullName;
    document.getElementById('createdDate').textContent = user.accountCreatedDate;

    // Display attendance log
    displayAttendanceLog(user);
}

// Display attendance log
function displayAttendanceLog(user) {
    const historyContainer = document.getElementById('loginHistory');

    if (!user.attendanceLog || user.attendanceLog.length === 0) {
        historyContainer.innerHTML = '<p style="color: #999;">No attendance records yet</p>';
        return;
    }

    // Show all attendance records (reverse order - newest first)
    const reversedLog = [...user.attendanceLog].reverse();
    historyContainer.innerHTML = reversedLog.map((record, index) => `
        <div class="history-item">
            <p><strong>Attendance #${reversedLog.length - index}</strong></p>
            <p><span class="time">${record.loginTime}</span></p>
            ${record.signature ? `<p><strong>Signature:</strong> <span style="word-break: break-all;">${record.signature}</span></p>` : ''}
        </div>
    `).join('');
}

// Manual attendance button handler (adds a new attendance record)
async function manualCheckIn() {
    const user = userManager.currentUser;
    if (!user) {
        audioAlert.playErrorBeep();
    showMessage('You must be signed in to mark attendance.', 'error');
        return;
    }

    const nowLocal = new Date().toLocaleString();
    const nowTs = Date.now();
    if (!user.attendanceLog) user.attendanceLog = [];
    const record = { loginTime: nowLocal, timestamp: nowTs, signature: null };
    try {
        const payload = `ATTEND|${user.userId}|${user.username}|${record.loginTime}|${record.timestamp}`;
        record.signature = await signString(payload);
    } catch (e) {
        console.warn('Failed to sign manual attendance record', e);
    }
    user.attendanceLog.push(record);
    user.lastLogin = nowLocal;
    
    // Persist and update UI
    userManager.saveUsersToStorage();
    audioAlert.playCheckInBeep();
    showMessage('Attendance recorded.', 'success');
    displayAttendanceLog(user);
}

// Logout function
function logout() {
    userManager.currentUser = null;
    try {
        localStorage.removeItem('currentUserId');
    } catch (e) {}

    // Clear forms
    document.getElementById('signupForm').reset();
    document.getElementById('signinForm').reset();

    // Hide dashboard
    document.getElementById('dashboard').classList.add('hidden');

    // Show sign up section
    document.getElementById('signupSection').classList.remove('hidden');
    document.getElementById('signinSection').classList.add('hidden');

    showMessage('You have been logged out successfully!', 'success');
}

// ==================== ADMIN FUNCTIONS ====================

// Show admin login form
function showAdminLogin() {
    document.getElementById('signupSection').classList.add('hidden');
    document.getElementById('signinSection').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('adminLoginSection').classList.remove('hidden');
}

// Hide admin login form
function hideAdminLogin() {
    document.getElementById('adminLoginSection').classList.add('hidden');
    document.getElementById('signupSection').classList.remove('hidden');
}

// Handle admin login
document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const password = document.getElementById('adminPassword').value;

    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        try {
            localStorage.setItem('isAdminLoggedIn', 'true');
        } catch (e) {}
        showMessage('Admin login successful!', 'success');
        document.getElementById('adminLoginForm').reset();
        displayAdminDashboard();
    } else {
        showMessage('Incorrect admin password!', 'error');
        document.getElementById('adminPassword').value = '';
    }
});

// Display admin dashboard
function displayAdminDashboard() {
    // Hide all other sections
    document.getElementById('signupSection').classList.add('hidden');
    document.getElementById('signinSection').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('adminLoginSection').classList.add('hidden');

    // Show admin dashboard
    document.getElementById('adminDashboard').classList.remove('hidden');

    // Update stats
    document.getElementById('totalUsers').textContent = userManager.users.length;
    document.getElementById('totalSessions').textContent = userManager.loginSessions.length;

    // Display all users
    displayAllUsers();
}

// Display all users in admin dashboard
function displayAllUsers() {
    const usersList = document.getElementById('usersList');

    if (userManager.users.length === 0) {
        usersList.innerHTML = '<div class="no-users">No users registered yet</div>';
        return;
    }

    usersList.innerHTML = userManager.users.map(user => `
        <div class="user-item" onclick="viewUserDetails('${user.userId}')">
            <div class="user-item-info">
                <strong>${user.fullName}</strong>
                <p><strong>User ID:</strong> ${user.userId}</p>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Account Created:</strong> ${user.accountCreatedDate}</p>
                <p><strong>Last Login:</strong> ${user.lastLogin || 'Never'}</p>
                <p><strong>Total Attendance:</strong> ${user.attendanceLog ? user.attendanceLog.length : 0}</p>
                ${user.digitalSignature ? `<p><strong>Digital Signature:</strong> <span style="word-break: break-all;">${user.digitalSignature}</span></p>` : ''}
            </div>
            <div style="display:flex; gap:8px;">
                <button class="user-item-button" onclick="event.stopPropagation(); viewUserDetails('${user.userId}')">View Details</button>
                <button class="user-item-button" onclick="event.stopPropagation(); exportUserAttendance('${user.userId}')">Export</button>
                <button class="user-item-button btn-danger" onclick="event.stopPropagation(); deleteUser('${user.userId}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Search users
function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.trim().toLowerCase();

    if (!searchTerm) {
        showMessage('Please enter a search term', 'error');
        return;
    }

    const filteredUsers = userManager.users.filter(user => {
        const baseMatch = user.userId.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.fullName.toLowerCase().includes(searchTerm) ||
            (user.digitalSignature && user.digitalSignature.toLowerCase().includes(searchTerm));
        const attendanceMatch = (user.attendanceLog || []).some(r =>
            (r.signature && String(r.signature).toLowerCase().includes(searchTerm)) ||
            (r.loginTime && String(r.loginTime).toLowerCase().includes(searchTerm))
        );
        return baseMatch || attendanceMatch;
    });

    const usersList = document.getElementById('usersList');

    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<div class="no-users">No users found matching: ' + searchTerm + '</div>';
        return;
    }

    usersList.innerHTML = filteredUsers.map(user => {
        // Build matched attendance records snippet
        const matches = (user.attendanceLog || []).filter(r =>
            (r.signature && String(r.signature).toLowerCase().includes(searchTerm)) ||
            (r.loginTime && String(r.loginTime).toLowerCase().includes(searchTerm))
        );
        const matchHtml = matches.length > 0 ? `
            <div class="matched-attendance" style="margin-top:8px;">
                <p><strong>Matching attendance records (${matches.length}):</strong></p>
                ${matches.map(m => `<div class="detail-item"><label>Time:</label><span>${m.loginTime}</span><br><label>Signature:</label> <span style="word-break: break-all;">${m.signature || ''}</span></div>`).join('')}
            </div>
        ` : '';

        return `
        <div class="user-item" onclick="viewUserDetails('${user.userId}')">
            <div class="user-item-info">
                <strong>${user.fullName}</strong>
                <p><strong>User ID:</strong> ${user.userId}</p>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Account Created:</strong> ${user.accountCreatedDate}</p>
                <p><strong>Last Login:</strong> ${user.lastLogin || 'Never'}</p>
                <p><strong>Total Attendance:</strong> ${user.attendanceLog ? user.attendanceLog.length : 0}</p>
                ${user.digitalSignature ? `<p><strong>Digital Signature:</strong> <span style="word-break: break-all;">${user.digitalSignature}</span></p>` : ''}
                ${matchHtml}
            </div>
            <div style="display:flex; gap:8px;">
                <button class="user-item-button" onclick="event.stopPropagation(); viewUserDetails('${user.userId}')">View Details</button>
                <button class="user-item-button" onclick="event.stopPropagation(); exportUserAttendance('${user.userId}')">Export</button>
                <button class="user-item-button btn-danger" onclick="event.stopPropagation(); deleteUser('${user.userId}')">Delete</button>
            </div>
        </div>`;
    }).join('');
}

// Delete a user (admin only)
function deleteUser(userId) {
    if (!isAdminLoggedIn) {
        showMessage('Admin login required to delete users', 'error');
        return;
    }
    const user = userManager.getUserById(userId);
    if (!user) {
        showMessage('User not found', 'error');
        return;
    }
    // Remove user
    userManager.users = userManager.users.filter(u => u.userId !== userId);
    userManager.saveUsersToStorage();
    // Remove related login sessions
    userManager.loginSessions = userManager.loginSessions.filter(s => s.userId !== userId);
    userManager.saveLoginSessionsToStorage();
    // If current user was deleted, clear session
    try {
        const currentId = localStorage.getItem('currentUserId');
        if (currentId === userId) {
            localStorage.removeItem('currentUserId');
        }
    } catch (e) {}
    showMessage(`Deleted user ${user.username}`, 'success');
    // Refresh admin dashboard list and stats
    document.getElementById('totalUsers').textContent = userManager.users.length;
    document.getElementById('totalSessions').textContent = userManager.loginSessions.length;
    displayAllUsers();
}

// View detailed user information
function viewUserDetails(userId) {
    const user = userManager.getUserById(userId);

    if (!user) {
        showMessage('User not found', 'error');
        return;
    }

    const modal = document.getElementById('userDetailModal');
    const detailContent = document.getElementById('userDetailContent');
    const attendanceLog = user.attendanceLog || [];

    let attendanceHTML = '';
    if (attendanceLog.length === 0) {
        attendanceHTML = '<p style="color: #999;">No attendance records</p>';
    } else {
        attendanceHTML = attendanceLog.map((record, index) => `
            <div class="detail-item">
                <label>Attendance ${index + 1}:</label>
                <span>${record.loginTime}</span>
            </div>
            ${index < attendanceLog.length - 1 ? '<hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">' : ''}
        `).join('');
    }

    detailContent.innerHTML = `
        <div class="detail-section">
            <h4>Account Information</h4>
            <div class="detail-item">
                <label>User ID:</label>
                <span>${user.userId}</span>
            </div>
            <div class="detail-item">
                <label>Username:</label>
                <span>${user.username}</span>
            </div>
            <div class="detail-item">
                <label>Full Name:</label>
                <span>${user.fullName}</span>
            </div>
            <div class="detail-item">
                <label>Account Created:</label>
                <span>${user.accountCreatedDate}</span>
            </div>
            <div class="detail-item">
                <label>Last Login:</label>
                <span>${user.lastLogin || 'Never'}</span>
            </div>
            ${user.digitalSignature ? `
            <div class="detail-item">
                <label>Digital Signature:</label>
                <span style="word-break: break-all;">${user.digitalSignature}</span>
            </div>` : ''}
        </div>

        <div class="detail-section">
            <h4>Credentials</h4>
            <div class="detail-item">
                <label>Username:</label>
                <span>${user.username}</span>
            </div>
            <div class="detail-item">
                <label>Password:</label>
                <span>••••••• (Hidden for security)</span>
            </div>
        </div>

        <div class="detail-section">
            <h4>Attendance Log (${attendanceLog.length} records)</h4>
            ${attendanceHTML}
        </div>
    `;

    modal.classList.remove('hidden');
}

// Close user detail modal
function closeUserDetail() {
    document.getElementById('userDetailModal').classList.add('hidden');
}

// Logout from admin
function logoutAdmin() {
    isAdminLoggedIn = false;
    try {
        localStorage.removeItem('isAdminLoggedIn');
    } catch (e) {}
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('adminLoginForm').reset();
    document.getElementById('signupSection').classList.remove('hidden');
    showMessage('Admin logged out successfully!', 'success');
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('userDetailModal');
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});

// Check if user is already logged in (on page load)
window.addEventListener('load', () => {
    console.log('User Management System Loaded');
    console.log('Total registered users:', userManager.users.length);

    // Restore admin session first if present
    try {
        const savedAdmin = localStorage.getItem('isAdminLoggedIn');
        if (savedAdmin === 'true') {
            isAdminLoggedIn = true;
            displayAdminDashboard();
            return; // Prefer admin view when admin is remembered
        }
    } catch (e) {}

    // Restore user session if present
    try {
        const userId = localStorage.getItem('currentUserId');
        if (userId) {
            const user = userManager.getUserById(userId);
            if (user) {
                userManager.currentUser = user;
                showDashboard(user);
            }
        }
    } catch (e) {}
});
