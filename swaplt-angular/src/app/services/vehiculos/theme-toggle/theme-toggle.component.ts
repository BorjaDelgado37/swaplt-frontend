import { Component, HostListener } from '@angular/core';
import { ThemeService, ThemeType } from '../../theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <div class="theme-menu-container">
      <button class="theme-toggle-btn" (click)="toggleMenu($event)">
        <i [class]="getIcon()"></i>
      </button>
      
      <div class="theme-dropdown" *ngIf="isMenuOpen">
        <button class="theme-option" (click)="setTheme('light')" [class.active]="currentTheme === 'light'">
          <i class="fas fa-sun"></i> Modo Normal
        </button>
        <button class="theme-option" (click)="setTheme('dark')" [class.active]="currentTheme === 'dark'">
          <i class="fas fa-moon"></i> Modo Oscuro
        </button>
        <button class="theme-option" (click)="setTheme('high-contrast')" [class.active]="currentTheme === 'high-contrast'">
          <i class="fas fa-adjust"></i> Alto Contraste
        </button>
        <button class="theme-option" (click)="setTheme('colorblind')" [class.active]="currentTheme === 'colorblind'">
          <i class="fas fa-eye"></i> Modo Daltonismo
        </button>
      </div>
    </div>
  `,
  styles: [`
    .theme-menu-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .theme-toggle-btn {
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 4px var(--shadow-color);
      transition: all 0.3s ease;
    }
    .theme-toggle-btn:hover {
      background-color: var(--quaternary-color);
    }
    .theme-dropdown {
      position: absolute;
      bottom: 60px;
      right: 0;
      background-color: var(--card-background);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: 0 4px 12px var(--shadow-color);
      padding: 8px 0;
      min-width: 180px;
      display: flex;
      flex-direction: column;
    }
    .theme-option {
      background: none;
      border: none;
      color: var(--text-color);
      padding: 10px 16px;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background-color 0.2s;
    }
    .theme-option:hover {
      background-color: var(--hover-color);
    }
    .theme-option.active {
      color: var(--primary-color);
      font-weight: bold;
    }
    .theme-option i {
      width: 20px;
      text-align: center;
    }
  `]
})
export class ThemeToggleComponent {
  currentTheme: ThemeType = 'light';
  isMenuOpen = false;

  constructor(private themeService: ThemeService) {
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  getIcon() {
    switch (this.currentTheme) {
      case 'dark': return 'fas fa-moon';
      case 'high-contrast': return 'fas fa-adjust';
      case 'colorblind': return 'fas fa-eye';
      default: return 'fas fa-sun';
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  setTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
    this.isMenuOpen = false;
  }

  @HostListener('document:click')
  closeMenu() {
    this.isMenuOpen = false;
  }
} 