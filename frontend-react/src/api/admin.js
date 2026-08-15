import api from './client';

export const adminApi = {
  async getStats() {
    return api.get('/admin/stats');
  },

  async getEvents() {
    return api.get('/admin/events');
  },

  async createEvent(eventData) {
    return api.post('/admin/events', eventData);
  },

  async updateEvent(eventId, eventData) {
    return api.put(`/admin/events/${eventId}`, eventData);
  },

  async deleteEvent(eventId) {
    return api.delete(`/admin/events/${eventId}`);
  },

  async getEventTypes() {
    return api.get('/admin/event-types');
  },

  async createEventType(typeData) {
    return api.post('/admin/event-types', typeData);
  },

  async getUsers() {
    return api.get('/admin/users');
  },

  async updateUser(userId, userData) {
    return api.put(`/admin/users/${userId}`, userData);
  },

  async uploadEventPhotos(eventId, formData) {
    return api.post(`/admin/upload-event-photos/${eventId}`, formData);
  },

  async getEventPhotos(eventId, page = 1, perPage = 50) {
    return api.get(`/admin/event-photos/${eventId}?page=${page}&per_page=${perPage}`);
  },

  async reprocessPhoto(photoId) {
    return api.post(`/admin/reprocess-photo/${photoId}`);
  },

  async reprocessEvent(eventId) {
    return api.post(`/admin/reprocess-event/${eventId}`);
  },
};
