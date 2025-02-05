import { Observable, BehaviorSubject } from 'rxjs';
import trTranslations from '../i18n/tr';
import enTranslations from '../i18n/en';

export class I18nService {
  private static instance: I18nService;
  private currentLanguage = new BehaviorSubject<string>('tr');
  private translations = {
    tr: trTranslations,
    en: enTranslations
  };

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  getCurrentLanguage(): Observable<string> {
    return this.currentLanguage.asObservable();
  }

  setLanguage(language: string) {
    if (this.translations[language]) {
      this.currentLanguage.next(language);
    }
  }

  translate(key: string): string {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage.getValue()];
    
    for (const k of keys) {
      if (translation[k] === undefined) {
        return key;
      }
      translation = translation[k];
    }
    
    return translation;
  }
}