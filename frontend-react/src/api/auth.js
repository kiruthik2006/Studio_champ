import api from './client';

export const authApi = {
  async register({ email, password, firstName, lastName }) {
    return api.post('/auth/register', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });
  },

  async login({ email, password }) {
    return api.post('/auth/login', { email, password });
  },

  async googleAuth(googleData) {
    return api.post('/auth/google', googleData || {});
  },

  async getProfile() {
    return api.get('/auth/profile');
  },

  async updateProfile({ firstName, lastName }) {
    return api.put('/auth/profile', {
      first_name: firstName,
      last_name: lastName,
    });
  },

  async changePassword({ currentPassword, newPassword }) {
    return api.put('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      api.clearTokens();
    }
  },
};
