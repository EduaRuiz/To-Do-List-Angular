import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TypewriterComponent } from './typewriter.component';

describe('TypewriterComponent', () => {
  let component: TypewriterComponent;
  let fixture: ComponentFixture<TypewriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypewriterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypewriterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set animatedText to an empty string if text input is not provided', () => {
      // Arrange
      component.text = '';

      // Act
      component.ngOnInit();

      // Assert
      expect(component.animatedText).toEqual('');
    });

    it('should set animatedText to the same value as text input', fakeAsync(() => {
      // Arrange
      component.text = 'Hello, World!';

      // Act
      component.ngOnInit();
      tick(10000);

      // Assert
      expect(component.animatedText).toEqual('Hello, World!');
    }));

    it('should update animatedText with each character of text input at the specified speed', fakeAsync(() => {
      // Arrange
      component.text = 'Hello, World!';
      component.speed = 50;

      // Act
      component.ngOnInit();
      tick(50);

      // Assert
      expect(component.animatedText).toEqual('H');
      tick(50);
      expect(component.animatedText).toEqual('He');
      tick(50);
      expect(component.animatedText).toEqual('Hel');
      tick(50);
      expect(component.animatedText).toEqual('Hell');
      tick(900);
      expect(component.animatedText).toEqual('Hello, World!');
      tick(50);
      expect(component.animatedText).toEqual('Hello, World!');
    }));

    it('should stop updating animatedText when end of text input is reached', fakeAsync(() => {
      // Arrange
      component.text = 'Hello, World!';
      component.speed = 50;

      // Act
      component.ngOnInit();
      tick(1000);

      // Assert
      expect(component.animatedText).toEqual('Hello, World!');
      tick(50); // make sure no more text is added
      expect(component.animatedText).toEqual('Hello, World!');
    }));
  });
});
