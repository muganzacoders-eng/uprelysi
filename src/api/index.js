// frontend/src/api/index.js - Complete enhanced version
import axios from 'axios';
import { debugApi } from '../utils/debug';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://educationapi-n33q.onrender.com';
const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        console.error('API Error:', {
          status,
          message,
          url: error.config?.url,
          method: error.config?.method
        });

        if (status === 404) {
          error.message = 'Requested resource not found';
        } else if (status === 500) {
          error.message = 'Server error. Please try again later.';
        } else if (status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          error.message = message || 'An unexpected error occurred';
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/api/auth/register', userData);
    return response.data;
  }

  async getMe() {
    const response = await this.api.get('/api/auth/me');
    return response.data;
  }

  async changePassword(passwordData) {
    const response = await this.api.put('/api/auth/change-password', passwordData);
    return response.data;
  }

  // User management
  async getUsers() {
    const response = await this.api.get('/api/users');
    return response.data;
  }

  async getUser(id) {
    const response = await this.api.get(`/api/users/${id}`);
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await this.api.put(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id) {
    const response = await this.api.delete(`/api/users/${id}`);
    return response.data;
  }

  // Content management
  async getContent(params = {}) {
    const response = await this.api.get('/api/content', { params });
    return response.data;
  }

  async getContentById(id) {
    const response = await this.api.get(`/api/content/${id}`);
    return response.data;
  }

  async createContent(formData) {
    const response = await this.api.post('/api/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateContent(id, formData) {
    const response = await this.api.put(`/api/content/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteContent(id) {
    const response = await this.api.delete(`/api/content/${id}`);
    return response.data;
  }

  async getContentCategories() {
    const response = await this.api.get('/api/content/categories');
    return response.data;
  }

  async getRecommendedContent() {
    const response = await this.api.get('/api/content/recommended');
    return response.data.data || [];
  }

  // Classroom management
  async getClassrooms() {
    const response = await this.api.get('/api/classrooms');
    return response.data.data || [];
  }

  async getClassroom(id) {
    const response = await this.api.get(`/api/classrooms/${id}`);
    return response.data;
  }

  async createClassroom(classroomData) {
    const response = await this.api.post('/api/classrooms', classroomData);
    return response.data;
  }

  async updateClassroom(id, classroomData) {
    const response = await this.api.put(`/api/classrooms/${id}`, classroomData);
    return response.data;
  }

  async deleteClassroom(id) {
    const response = await this.api.delete(`/api/classrooms/${id}`);
    return response.data;
  }

  async joinClassroom(id) {
    const response = await this.api.post(`/api/classrooms/${id}/join`);
    return response.data;
  }

  async leaveClassroom(id) {
    const response = await this.api.post(`/api/classrooms/${id}/leave`);
    return response.data;
  }

  // Exam management
  async getExams() {
    const response = await this.api.get('/api/exams');
    return response.data;
  }

  async getExam(id) {
    const response = await this.api.get(`/api/exams/${id}`);
    return response.data;
  }

  async createExam(examData) {
    const response = await this.api.post('/api/exams', examData);
    return response.data;
  }

  async submitExam(id, answers) {
    const response = await this.api.post(`/api/exams/${id}/submit`, { answers });
    return response.data;
  }

  async getExamResults(id) {
    const response = await this.api.get(`/api/exams/${id}/results`);
    return response.data;
  }

  // Counseling
  async getCounselingSessions() {
    const response = await this.api.get('/api/counseling');
    return response.data;
  }

  async getCounselingSession(id) {
    const response = await this.api.get(`/api/counseling/${id}`);
    return response.data;
  }

  async requestCounseling(sessionData) {
    const response = await this.api.post('/api/counseling', sessionData);
    return response.data;
  }

  async updateCounselingSession(id, updates) {
    const response = await this.api.put(`/api/counseling/${id}`, updates);
    return response.data;
  }

  // Payments
  async getPayments() {
    const response = await this.api.get('/api/payments');
    return response.data;
  }

  async createPayment(paymentData) {
    const response = await this.api.post('/api/payments', paymentData);
    return response.data;
  }

  async processPayment(id, paymentMethod) {
    const response = await this.api.post(`/api/payments/${id}/process`, { paymentMethod });
    return response.data;
  }

  // Notifications
  async getNotifications() {
    const response = await this.api.get('/api/notifications');
    return response.data;
  }

  async markNotificationAsRead(id) {
    const response = await this.api.put(`/api/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await this.api.put('/api/notifications/read-all');
    return response.data;
  }

  // Meetings
  async createMeeting(meetingData) {
    const response = await this.api.post('/api/meetings', meetingData);
    return response.data;
  }

  async getMeetings() {
    const response = await this.api.get('/api/meetings');
    return response.data;
  }

  async updateMeeting(id, updates) {
    const response = await this.api.put(`/api/meetings/${id}`, updates);
    return response.data;
  }

  async deleteMeeting(id) {
    const response = await this.api.delete(`/api/meetings/${id}`);
    return response.data;
  }

  // Legal documents
  async getPrivacyPolicy() {
    const response = await this.api.get('/api/legal/privacy-policy');
    return response.data;
  }

  async getTermsOfService() {
    const response = await this.api.get('/api/legal/terms-of-service');
    return response.data;
  }

  async getLegalDocuments() {
    const response = await this.api.get('/api/legal/documents');
    return response.data;
  }

  async acceptLegalDocument(documentId) {
    const response = await this.api.post(`/api/legal/accept/${documentId}`);
    return response.data;
  }

  async getUserAgreements() {
    const response = await this.api.get('/api/legal/user-agreements');
    return response.data;
  }

  // Advertisements
  async getActiveAds(position, targetAudience) {
    const params = {};
    if (position) params.position = position;
    if (targetAudience) params.target_audience = targetAudience;
    
    const response = await this.api.get('/api/advertisements/active', { params });
    return response.data;
  }

  async trackAdClick(adId) {
    const response = await this.api.post(`/api/advertisements/click/${adId}`);
    return response.data;
  }

  // Admin endpoints
  async getAdminStats() {
    const response = await this.api.get('/api/admin/stats');
    return response.data;
  }

  async getAllUsers(params = {}) {
    const response = await this.api.get('/api/admin/users', { params });
    return response.data;
  }

  async getAdminContent(params = {}) {
    const response = await this.api.get('/api/admin/content', { params });
    return response.data;
  }

  async deleteAdminContent(id) {
    const response = await this.api.delete(`/api/admin/content/${id}`);
    return response.data;
  }

  async getAdminCategories() {
    const response = await this.api.get('/api/admin/categories');
    return response.data;
  }

  async createCategory(categoryData) {
    const response = await this.api.post('/api/admin/categories', categoryData);
    return response.data;
  }

  async updateCategory(id, categoryData) {
    const response = await this.api.put(`/api/admin/categories/${id}`, categoryData);
    return response.data;
  }

  async deleteCategory(id) {
    const response = await this.api.delete(`/api/admin/categories/${id}`);
    return response.data;
  }

  async getAdminAds(params = {}) {
    const response = await this.api.get('/api/advertisements/admin', { params });
    return response.data;
  }

  async createAd(formData) {
    const response = await this.api.post('/api/advertisements/admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateAd(id, formData) {
    const response = await this.api.put(`/api/advertisements/admin/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAd(id) {
    const response = await this.api.delete(`/api/advertisements/admin/${id}`);
    return response.data;
  }

  async getAdAnalytics(id, period = '7d') {
    const response = await this.api.get(`/api/advertisements/analytics/${id}`, {
      params: { period }
    });
    return response.data;
  }

  async getAdminLegalDocuments() {
    const response = await this.api.get('/api/admin/legal-documents');
    return response.data;
  }

  async createLegalDocument(documentData) {
    const response = await this.api.post('/api/admin/legal-documents', documentData);
    return response.data;
  }

  async getSystemSettings() {
    const response = await this.api.get('/api/admin/settings');
    return response.data;
  }

  async updateSystemSettings(settings) {
    const response = await this.api.put('/api/admin/settings', settings);
    return response.data;
  }

  async getAnalyticsOverview(period = '30d') {
    const response = await this.api.get('/api/admin/analytics/overview', {
      params: { period }
    });
    return response.data;
  }

  // Parent endpoints
  async getParentChildren() {
    const response = await this.api.get('/api/parent/children');
    return response.data;
  }

  async addChild(childData) {
    const response = await this.api.post('/api/parent/children', childData);
    return response.data;
  }

  async getChildProgress(childId) {
    const response = await this.api.get(`/api/parent/children/${childId}/progress`);
    return response.data;
  }

  // Analytics
  async getUserAnalytics() {
    const response = await this.api.get('/api/analytics/user');
    return response.data;
  }

  async getContentAnalytics() {
    const response = await this.api.get('/api/analytics/content');
    return response.data;
  }

  async getProgressReport(params = {}) {
    const response = await this.api.get('/api/analytics/progress', { params });
    return response.data;
  }
}

export default new ApiService();