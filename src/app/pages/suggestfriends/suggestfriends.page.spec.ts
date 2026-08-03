import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestfriendsPage } from './suggestfriends.page';

describe('SuggestfriendsPage', () => {
  let component: SuggestfriendsPage;
  let fixture: ComponentFixture<SuggestfriendsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestfriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
