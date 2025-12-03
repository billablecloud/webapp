import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
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

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light mode by default', (done) => {
    service.darkMode$.subscribe(isDark => {
      expect(isDark).toBe(false);
      done();
    });
  });

  it('should toggle theme', () => {
    service.toggleTheme();
    expect(service['darkMode'].value).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    
    service.toggleTheme();
    expect(service['darkMode'].value).toBe(false);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});
