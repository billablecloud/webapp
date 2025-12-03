import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let localStorageMock: any;

  beforeEach(() => {
    localStorageMock = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        clear: jest.fn(() => {
          store = {};
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default language (en)', (done) => {
    service.currentLang$.subscribe(lang => {
      expect(lang).toBe('en');
      done();
    });
  });

  it('should set language', () => {
    service.setLanguage('es');
    expect(service.getCurrentLang()).toBe('es');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('lang', 'es');
  });

  it('should toggle language', () => {
    service.setLanguage('en');
    service.toggleLanguage();
    expect(service.getCurrentLang()).toBe('es');
    
    service.toggleLanguage();
    expect(service.getCurrentLang()).toBe('en');
  });
});
