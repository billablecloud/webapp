import { TranslatePipe } from './translate.pipe';
import { LanguageService } from '../../core/services/language.service';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let languageServiceMock: any;

  beforeEach(() => {
    languageServiceMock = {
      getCurrentLang: jest.fn().mockReturnValue('en'),
      currentLang$: new BehaviorSubject('en')
    };

    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        { provide: LanguageService, useValue: languageServiceMock }
      ]
    });

    pipe = TestBed.inject(TranslatePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate key to english', () => {
    expect(pipe.transform('nav.features')).toBe('Features');
  });

  it('should translate key to spanish', () => {
    languageServiceMock.getCurrentLang.mockReturnValue('es');
    expect(pipe.transform('nav.features')).toBe('Características');
  });

  it('should return key if translation missing', () => {
    expect(pipe.transform('missing.key')).toBe('missing.key');
  });
});
