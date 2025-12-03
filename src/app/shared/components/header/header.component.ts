import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isDark$ = this.themeService.darkMode$;
  lang$ = this.languageService.currentLang$;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLang() {
    this.languageService.toggleLanguage();
  }
}
