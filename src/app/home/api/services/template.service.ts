import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Template, TemplateContent, Product, Channel } from '../models/notifications';

const API_URL = 'quasar/api/templates';

@Injectable()
export class TemplateService {
    constructor(private http: HttpClient) { }

    get(name: string, product: Product) {
        const params = new HttpParams()
            .set('name', name)
            .set('product', product ? product.toString() : '');
        return this.http.get<Template[]>(`${API_URL}`, { params: params });
    }

    getById(templateId: string) {
        return this.http.get<Template>(`${API_URL}/${templateId}`);
    }

    getContents(templateId: string, channel: Channel) {
        const params = new HttpParams()
            .set('channel', channel ? channel.toString() : '');
        return this.http.get<TemplateContent[]>(`${API_URL}/${templateId}/contents`, { params: params });
    }

    getContentById(templateId: string, contentId: string) {
        return this.http.get<TemplateContent>(`${API_URL}/${templateId}/contents/${contentId}`);
    }

    addContent(templateId: string, language: string, channel: Channel, subject: string, content: string) {
        return this.http.post(`${API_URL}/${templateId}/contents`, {
            language,
            channel,
            subject,
            content
        });
    }

    updateContent(templateId: string, contentId: string, subject: string, content: string) {
        return this.http.put(`${API_URL}/${templateId}/contents`, {
            id: contentId,
            subject,
            content
        });
    }

    deleteContent(templateId: string, contentId: string) {
        return this.http.delete(`${API_URL}/${templateId}/contents/${contentId}`);
    }

    personalize(templateId: string) {
        return this.http.post<Template>(`${API_URL}/${templateId}/personalize`, {});
    }

    restore(templateId: string) {
        return this.http.post<Template>(`${API_URL}/${templateId}/restore`, {});
    }
}
