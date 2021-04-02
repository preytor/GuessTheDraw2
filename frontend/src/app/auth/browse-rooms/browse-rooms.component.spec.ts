import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseRoomsComponent } from './browse-rooms.component';

describe('BrowseRoomsComponent', () => {
  let component: BrowseRoomsComponent;
  let fixture: ComponentFixture<BrowseRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
