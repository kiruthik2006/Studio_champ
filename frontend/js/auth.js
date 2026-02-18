/**
 * AuthManager - Handles authentication and API communication
 */
class AuthManager {
  constructor() {
    this.baseURL = "http://localhost:5001/api";
    this.token = null;
    this.refreshToken = null;
    this.user = null;

    this.init();
  }

  init() {
    // Load tokens from localStorage
    this.token = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");

    // Load user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        this.user = null;
      }
    }

    // Setup event listeners
    this.setupEventListeners();

    // Check auth state on page load
    this.checkAuthState();
  }

  setupEventListeners() {
    // Login/Register modal buttons
    const loginBtns = document.querySelectorAll("#loginBtn, #mobileLoginBtn");
    const registerBtns = document.querySelectorAll(
      "#registerBtn, #mobileRegisterBtn, #heroRegisterBtn, #ctaRegisterBtn",
    );

    loginBtns.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => this.showLoginModal());
      }
    });

    registerBtns.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => this.showRegisterModal());
      }
    });

    // Modal close buttons
    const closeLoginModal = document.getElementById("closeLoginModal");
    const closeRegisterModal = document.getElementById("closeRegisterModal");

    if (closeLoginModal) {
      closeLoginModal.addEventListener("click", () =>
        this.hideModal("loginModal"),
      );
    }

    if (closeRegisterModal) {
      closeRegisterModal.addEventListener("click", () =>
        this.hideModal("registerModal"),
      );
    }

    // Modal switch links
    const switchToRegister = document.getElementById("switchToRegister");
    const switchToLogin = document.getElementById("switchToLogin");

    if (switchToRegister) {
      switchToRegister.addEventListener("click", (e) => {
        e.preventDefault();
        this.hideModal("loginModal");
        this.showRegisterModal();
      });
    }

    if (switchToLogin) {
      switchToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        this.hideModal("registerModal");
        this.showLoginModal();
      });
    }

    // Form submissions
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => this.handleRegister(e));
    }

    // Toggle password visibility
    document.querySelectorAll(".toggle-password").forEach((btn) => {
      btn.addEventListener("click", (e) => this.togglePassword(e));
    });

    // Close modals on backdrop click
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    });

    // Hamburger menu
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mobileNav = document.getElementById("mobileNav");

    if (hamburgerBtn && mobileNav) {
      hamburgerBtn.addEventListener("click", () => {
        mobileNav.classList.toggle("active");
      });
    }

    // User menu dropdown
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdown = document.getElementById("userDropdown");

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener("click", () => {
        userDropdown.classList.toggle("active");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !userMenuBtn.contains(e.target) &&
          !userDropdown.contains(e.target)
        ) {
          userDropdown.classList.remove("active");
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  showLoginModal() {
    this.hideModal("registerModal");
    this.showModal("loginModal");
  }

  showRegisterModal() {
    this.hideModal("loginModal");
    this.showModal("registerModal");
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  togglePassword(e) {
    const btn = e.currentTarget;
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const icon = btn.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = form.email.value;
    const password = form.password.value;

    submitBtn.classList.add("loading");

    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.data.access_token;
        this.refreshToken = data.data.refresh_token;
        this.user = data.data.user;

        localStorage.setItem("access_token", this.token);
        localStorage.setItem("refresh_token", this.refreshToken);
        localStorage.setItem("user", JSON.stringify(this.user));

        this.showToast("Login successful!", "success");
        this.hideModal("loginModal");

        // Redirect to appropriate dashboard based on role
        if (
          window.location.pathname.includes("index.html") ||
          window.location.pathname === "/"
        ) {
          if (this.user.role === "admin") {
            window.location.href = "admin/dashboard.html";
          } else {
            window.location.href = "dashboard.html";
          }
        } else {
          window.location.reload();
        }
      } else {
        this.showToast(data.message || "Login failed", "error");
      }
    } catch (error) {
      this.showToast("Network error. Please try again.", "error");
      console.error("Login error:", error);
    } finally {
      submitBtn.classList.remove("loading");
    }
  }

  async handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate passwords match
    const password = form.password.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;

    if (confirmPassword && password !== confirmPassword) {
      this.showToast("Passwords do not match", "error");
      return;
    }

    const userData = {
      email: form.email.value,
      password: password,
      first_name: form.first_name.value,
      last_name: form.last_name.value,
    };

    submitBtn.classList.add("loading");

    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.data.access_token;
        this.refreshToken = data.data.refresh_token;
        this.user = data.data.user;

        localStorage.setItem("access_token", this.token);
        localStorage.setItem("refresh_token", this.refreshToken);

        this.showToast("Account created successfully!", "success");
        this.hideModal("registerModal");

        // Redirect to dashboard
        window.location.href = "dashboard.html";
      } else {
        this.showToast(data.message || "Registration failed", "error");
      }
    } catch (error) {
      this.showToast("Network error. Please try again.", "error");
      console.error("Register error:", error);
    } finally {
      submitBtn.classList.remove("loading");
    }
  }

  async checkAuthState() {
    if (!this.token) return;

    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        this.user = data.data;
        this.updateUI();
      } else {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();
        if (!refreshed) {
          console.log("Token refresh failed in checkAuthState, redirecting to login");
          if (window.location.pathname.includes("dashboard")) {
            window.location.href = "index.html";
          }
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      this.clearAuth();
      return false;
    }

    console.log("Attempting token refresh with:", this.refreshToken ? "token present" : "NO TOKEN");

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.refreshToken}`,
        },
      });

      console.log("Refresh response status:", response.status);

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error("Refresh failed:", response.status, text);
        this.clearAuth();
        return false;
      }

      const data = await response.json();

      if (data.success) {
        this.token = data.data.access_token;
        localStorage.setItem("access_token", this.token);
        console.log("Token refresh successful");
        return true;
      } else {
        console.error("Refresh returned failure:", data.message);
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error("Token refresh network error:", error.name, error.message);
      this.clearAuth();
      return false;
    }
  }

  async logout() {
    try {
      if (this.token) {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuth();
      window.location.href = "index.html";
    }
  }

  clearAuth() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  updateUI() {
    if (this.user) {
      const userNameEl = document.getElementById("userName");
      const userRoleEl = document.getElementById("userRole");

      if (userNameEl) {
        userNameEl.textContent = this.user.full_name || this.user.email;
      }

      if (userRoleEl) {
        userRoleEl.textContent =
          this.user.role === "admin" ? "Administrator" : "User";
      }

      // Update form fields
      const settingsFirstName = document.getElementById("settingsFirstName");
      const settingsLastName = document.getElementById("settingsLastName");
      const settingsEmail = document.getElementById("settingsEmail");

      if (settingsFirstName)
        settingsFirstName.value = this.user.first_name || "";
      if (settingsLastName) settingsLastName.value = this.user.last_name || "";
      if (settingsEmail) settingsEmail.value = this.user.email || "";
    }
  }

  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();

        // Retry request with new token
        if (refreshed && this.token) {
          config.headers["Authorization"] = `Bearer ${this.token}`;
          const retryResponse = await fetch(url, config);
          return await retryResponse.json();
        } else {
          // Refresh failed, logout user
          console.log("Token refresh failed in apiRequest, logging out...");
          this.logout();
          return { success: false, message: "Session expired" };
        }
      }

      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  async uploadFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      // Ensure token exists
      if (!this.token) {
        this.token = localStorage.getItem("access_token");
      }

      console.log("Upload request:", {
        url,
        token: this.token ? `${this.token.substring(0, 20)}...` : "NO TOKEN",
        hasFormData: !!formData,
      });

      // Build a FormData clone and append access_token to help endpoints that
      // accept token in form body (multipart clients that can't set headers reliably)
      let bodyToSend = formData;
      let originalEntries = [];
      if (
        formData &&
        typeof FormData !== "undefined" &&
        formData instanceof FormData
      ) {
        originalEntries = formData.entries
          ? Array.from(formData.entries())
          : [];
        const initialFormData = new FormData();
        originalEntries.forEach(([key, value]) =>
          initialFormData.append(key, value),
        );
        if (this.token) {
          initialFormData.append("access_token", this.token);
        }
        bodyToSend = initialFormData;
      }

      // Prepare headers (do not set Content-Type for FormData)
      const headers = {};
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }

      let response = await fetch(url, {
        method: "POST",
        headers,
        body: bodyToSend,
      });

      let data = await response.json().catch(() => ({}));
      console.log("Upload response status:", response.status, data);

      // If unauthorized, try a single token refresh + retry.
      if (response.status === 401) {
        console.log("Got 401, attempting token refresh...");
        const refreshed = await this.refreshAccessToken();

        if (refreshed && this.token) {
          // Recreate FormData because FormData/Blobs may have been consumed
          let retryBody = formData;
          if (
            formData &&
            typeof FormData !== "undefined" &&
            formData instanceof FormData
          ) {
            const retryFormData = new FormData();
            // Use originalEntries captured earlier to rebuild
            originalEntries.forEach(([key, value]) =>
              retryFormData.append(key, value),
            );
            // Append refreshed access token so the backend can accept it from form data
            retryFormData.append("access_token", this.token);
            retryBody = retryFormData;
          }

          const retryHeaders = {};
          retryHeaders["Authorization"] = `Bearer ${this.token}`;

          console.log("Retrying upload with refreshed token...");
          const retryResponse = await fetch(url, {
            method: "POST",
            headers: retryHeaders,
            body: retryBody,
          });

          const retryData = await retryResponse.json().catch(() => ({}));
          console.log(
            "Retry upload response status:",
            retryResponse.status,
            retryData,
          );

          if (retryResponse.status === 401) {
            console.log("Retry still unauthorized, logging out...");
            this.logout();
            return retryData;
          }

          return retryData;
        } else {
          console.log("Token refresh failed, logging out...");
          this.logout();
          return { success: false, message: "Token refresh failed" };
        }
      }

      return data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const iconMap = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    };

    toast.innerHTML = `
            <i class="fas ${iconMap[type]}"></i>
            <span>${message}</span>
        `;

    container.appendChild(toast);

    // Remove after 4 seconds
    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }
}

// Initialize AuthManager globally
const authManager = new AuthManager();
