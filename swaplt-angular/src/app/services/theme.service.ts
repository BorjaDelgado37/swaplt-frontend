import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeType = 'light' | 'dark' | 'high-contrast' | 'colorblind';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<ThemeType>('light');
  currentTheme$ = this.currentTheme.asObservable();
  
  // Mantenemos la retrocompatibilidad
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('appTheme') as ThemeType;
    if (savedTheme && ['light', 'dark', 'high-contrast', 'colorblind'].includes(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      // Intentar migrar desde el antiguo formato
      const oldSavedTheme = localStorage.getItem('darkMode');
      if (oldSavedTheme === 'true') {
        this.setTheme('dark');
      } else {
        this.setTheme('light');
      }
    }
  }

  setTheme(theme: ThemeType) {
    this.currentTheme.next(theme);
    this.darkMode.next(theme === 'dark');
    localStorage.setItem('appTheme', theme);
    this.applyTheme(theme);
  }

  toggleDarkMode() {
    if (this.currentTheme.value === 'dark') {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  private applyTheme(theme: ThemeType) {
    document.body.classList.remove('dark-theme', 'high-contrast-theme', 'colorblind-theme');
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (theme === 'high-contrast') {
      document.body.classList.add('high-contrast-theme');
    } else if (theme === 'colorblind') {
      document.body.classList.add('colorblind-theme');
    }
  }
} 