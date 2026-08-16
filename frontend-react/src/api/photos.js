import api from './client';

export const photosApi = {
  async uploadFaces(formData) {
    return api.post('/photos/upload-faces', formData);
  },

  async getMyFaces(memberId = null) {
    const query = memberId ? `?member_id=${memberId}` : '';
    return api.get(`/photos/my-faces${query}`);
  },

  async deleteFace(faceId) {
    return api.delete(`/photos/delete-face/${faceId}`);
  },

  // Family & Friends Circle APIs
  async getCircleMembers() {
    return api.get('/photos/circle/members');
  },

  async createCircleMember({ name, relationship, notes }) {
    return api.post('/photos/circle/members', { name, relationship, notes });
  },

  async updateCircleMember(memberId, data) {
    return api.put(`/photos/circle/members/${memberId}`, data);
  },

  async deleteCircleMember(memberId) {
    return api.delete(`/photos/circle/members/${memberId}`);
  },

  async getEvents() {
    return api.get('/photos/events');
  },

  async getEventDetails(eventId) {
    return api.get(`/photos/event/${eventId}`);
  },

  async matchPhotos({ eventId, threshold = 0.6 }) {
    return api.post('/photos/match', {
      event_id: eventId,
      threshold,
    });
  },

  async matchCirclePhotos({ eventId, memberIds = [], matchMode = 'ANY', threshold = 0.50 }) {
    return api.post('/photos/circle/match', {
      event_id: eventId,
      member_ids: memberIds,
      match_mode: matchMode,
      threshold,
    });
  },

  getDownloadUrl(photoId) {
    return `${api.baseURL}/photos/download/${photoId}`;
  },
};
