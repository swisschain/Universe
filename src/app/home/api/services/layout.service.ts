import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Layout, LayoutContent, Product } from '../models/notifications';

const API_URL = 'quasar-templates/api/layouts';

@Injectable()
export class LayoutService {
    constructor(private http: HttpClient) { }

    get(product: Product) {
        const params = new HttpParams()
            .set('product', product ? product.toString() : '');
        return this.http.get<Layout[]>(`${API_URL}`, { params: params });
    }

    getById(layoutId: string) {
        return this.http.get<Layout>(`${API_URL}/${layoutId}`);
    }

    getContents(layoutId: string) {
        return this.http.get<LayoutContent[]>(`${API_URL}/${layoutId}/contents`);
    }

    getContentById(layoutId: string, contentId: string) {
        return this.http.get<LayoutContent>(`${API_URL}/${layoutId}/contents/${contentId}`);
    }

    addContent(layoutId: string, language: string, content: string) {
        return this.http.post(`${API_URL}/${layoutId}/contents`, {
            language,
            content
        });
    }

    updateContent(layoutId: string, contentId: string, content: string) {
        return this.http.put(`${API_URL}/${layoutId}/contents`, {
            id: contentId,
            content
        });
    }

    deleteContent(layoutId: string, contentId: string) {
        return this.http.delete(`${API_URL}/${layoutId}/contents/${contentId}`);
    }

    personalize(layoutId: string) {
        return this.http.post<Layout>(`${API_URL}/${layoutId}/personalize`, {});
    }

    restore(layoutId: string) {
        return this.http.post<Layout>(`${API_URL}/${layoutId}/restore`, {});
    }
}
