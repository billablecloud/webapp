import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService, Language } from '../../core/services/language.service';
import { TRANSLATIONS } from '../../core/i18n/translations';

@Pipe({
  name: 'translate',
  pure: false // Impure to update when language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}

  transform(key: string): string {
    const lang = this.languageService.getCurrentLang();
    const translation = (TRANSLATIONS as any)[lang][key];
    return translation || key;
  }
}
