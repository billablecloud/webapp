import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MockPipe, MockComponent } from 'ng-mocks';

// Mock jsPDF
const mockJsPDFInstance = {
  internal: {
    pageSize: { width: 210 }
  },
  setFontSize: jest.fn(),
  setTextColor: jest.fn(),
  text: jest.fn(),
  addImage: jest.fn(),
  setDrawColor: jest.fn(),
  line: jest.fn(),
  splitTextToSize: jest.fn((text) => [text]),
  rect: jest.fn(),
  setFillColor: jest.fn(),
  setFont: jest.fn(),
  addPage: jest.fn(),
  save: jest.fn()
};

const mockJsPDFConstructor = jest.fn(() => mockJsPDFInstance);

jest.mock('jspdf', () => ({
  jsPDF: mockJsPDFConstructor
}));

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        HomePageComponent,
        MockPipe(TranslatePipe),
        MockComponent(HeaderComponent)
      ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should estimate price correctly', () => {
    const text = 'one two three four five'; // 5 words
    // Base 300. 5 * 1.2 = 6. Max(300, 6) = 300.
    expect(component['estimatePrice'](text)).toBe(300);

    const longText = new Array(1000).fill('word').join(' '); // 1000 words
    // 1000 * 1.2 = 1200. Max(300, 1200) = 1200.
    expect(component['estimatePrice'](longText)).toBe(1200);
  });

  it('should generate PDF', async () => {
    // Mock ViewChild elements
    component.projectRef = { nativeElement: { value: 'Test Project Description' } } as ElementRef;
    component.currencyRef = { nativeElement: { value: '$' } } as ElementRef;
    
    component.clientName = 'Test Client';
    component.basePrice = 500;

    await component.generate();

    expect(mockJsPDFConstructor).toHaveBeenCalled();
    expect(mockJsPDFInstance.text).toHaveBeenCalledWith(expect.stringContaining('Test Client'), expect.any(Number), expect.any(Number));
    expect(mockJsPDFInstance.text).toHaveBeenCalledWith(expect.stringContaining('500 $'), expect.any(Number), expect.any(Number), expect.any(Object));
    expect(mockJsPDFInstance.save).toHaveBeenCalledWith('billable-quote.pdf');
  });

  it('should handle logo selection', () => {
    const file = new File([''], 'logo.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    
    const readerMock = {
      readAsDataURL: jest.fn(),
      onload: null as any
    };
    
    jest.spyOn(window, 'FileReader').mockImplementation(() => readerMock as any);

    component.onLogoSelected(event);
    
    expect(readerMock.readAsDataURL).toHaveBeenCalledWith(file);
    
    // Simulate onload
    readerMock.onload({ target: { result: 'data:image/png;base64,test' } });
    expect(component.logoDataUrl).toBe('data:image/png;base64,test');
  });
});
