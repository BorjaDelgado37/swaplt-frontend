import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CategoriasService } from './service/categorias.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var Chart: any;

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stockChart') stockChartRef!: ElementRef;

  categorias: any[] = [];
  statsData: any[] = [];
  isLoading: boolean = true;
  editing: boolean = false;
  categoria: { id: number | null, nombre: string } = { id: null, nombre: '' };
  private chartInstance: any = null;
  private chartJsLoaded = false;

  constructor(
    private categoriasService: CategoriasService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadChartJs();
  }

  ngAfterViewInit(): void {
    // Chart will be rendered after data is loaded
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  loadChartJs(): void {
    if ((window as any).Chart) {
      this.chartJsLoaded = true;
      this.loadStats();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      this.chartJsLoaded = true;
      this.loadStats();
    };
    document.head.appendChild(script);
  }

  loadStats(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categorias/stats`).subscribe({
      next: (data) => {
        this.statsData = data;
        setTimeout(() => this.renderChart(), 100);
      },
      error: (err) => console.error('Error al cargar stats:', err)
    });
  }

  renderChart(): void {
    if (!this.stockChartRef || !this.chartJsLoaded) return;
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const labels = this.statsData.map(c => c.nombre);
    const values = this.statsData.map(c => c.total_vehiculos);

    const colors = [
      'rgba(52, 164, 180, 0.85)',
      'rgba(220, 188, 124, 0.85)',
      'rgba(124, 92, 36, 0.85)',
      'rgba(108, 92, 60, 0.85)',
      'rgba(196, 188, 132, 0.85)',
      'rgba(52, 164, 120, 0.85)',
      'rgba(180, 100, 60, 0.85)',
      'rgba(80, 140, 200, 0.85)',
    ];

    this.chartInstance = new Chart(this.stockChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Vehículos publicados',
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(c => c.replace('0.85', '1')),
          borderWidth: 2,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Stock de vehículos por categoría',
            font: { size: 16, weight: 'bold' },
            color: '#34a4b4',
            padding: { bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => ` ${ctx.raw} vehículo${ctx.raw !== 1 ? 's' : ''}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, precision: 0 },
            grid: { color: 'rgba(150,150,150,0.1)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  loadCategorias(): void {
    this.categoriasService.getCategorias().subscribe(
      (data) => {
        this.categorias = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
        this.isLoading = false;
      }
    );
  }

  editCategoria(cat: any): void {
    this.categoria = { ...cat };
    this.editing = true;
  }

  cancelEdit(): void {
    this.categoria = { id: null, nombre: '' };
    this.editing = false;
  }

  saveCategoria(): void {
    if (!this.categoria.nombre.trim()) return;
    if (this.editing) {
      this.categoriasService.updateCategoria(this.categoria.id!, this.categoria).subscribe(
        () => { this.loadCategorias(); this.cancelEdit(); },
        (error) => console.error('Error al actualizar:', error)
      );
    } else {
      this.categoriasService.createCategoria({ nombre: this.categoria.nombre }).subscribe(
        (data) => { this.categorias.push(data); this.cancelEdit(); },
        (error) => console.error('Error al crear:', error)
      );
    }
  }

  deleteCategoria(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriasService.deleteCategoria(id).subscribe(
        () => { this.categorias = this.categorias.filter(c => c.id !== id); },
        (error) => console.error('Error al eliminar:', error)
      );
    }
  }
}
