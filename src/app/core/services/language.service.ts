import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<Language>('en');
  currentLang$ = this.currentLang.asObservable();

  constructor() {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) {
      this.currentLang.next(savedLang);
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.next(lang);
    localStorage.setItem('lang', lang);
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang.value === 'en' ? 'es' : 'en');
  }

  getCurrentLang(): Language {
    return this.currentLang.value;
  }
}
