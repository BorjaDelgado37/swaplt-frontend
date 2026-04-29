import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  isSubRouteActive = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkRoute(this.router.url);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.checkRoute(e.urlAfterRedirects);
    });
  }

  private checkRoute(url: string): void {
    // Hay subruta si la URL es /admin/algo (no exactamente /admin)
    const subRoutes = ['/admin/usuarios', '/admin/vehiculos', '/admin/categorias', '/admin/bloqueos'];
    this.isSubRouteActive = subRoutes.some(r => url.startsWith(r));
  }
}
