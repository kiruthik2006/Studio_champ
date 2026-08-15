import api from './client';

export const photosApi = {
  async uploadFaces(formData) {
    return api.post('/photos/upload-faces', formData);
  },

  async getMyFaces() {
    return api.get('/photos/my-faces');
  },

  async deleteFace(faceId) {
    return api.delete(`/photos/delete-face/${faceId}`);
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

  getDownloadUrl(photoId) {
    return `${api.baseURL}/photos/download/${photoId}`;
  },
};
