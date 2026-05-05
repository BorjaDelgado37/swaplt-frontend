import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserBlockService } from 'src/app/services/usuarios/user-block.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../usuarios/service/users.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bloqueos',
  templateUrl: './bloqueos.component.html',
  styleUrls: ['./bloqueos.component.css']
})
export class BloqueosComponent implements OnInit {
  bloqueos: any[] = [];
  displayedBloqueos: any[] = [];
  usuarios: any[] = [];
  usuarioSeleccionado: number | null = null;
  usuarioBloqueadoSeleccionado: number | null = null;
  razon: string = '';
  resultadoVerificacion: any = null;
  loading: boolean = false;
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  @ViewChild('bloqueosChart') bloqueosChartRef!: ElementRef;
  chart: any;

  constructor(
    private userBlockService: UserBlockService,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarBloqueos();
  }

  // Cargar todos los usuarios para los selects
  cargarUsuarios() {
    this.usersService.getUsers(1, 1000).subscribe({
      next: (res) => {
        if (res.data) {
          this.usuarios = res.data;
        } else if (Array.isArray(res)) {
          this.usuarios = res;
        } else {
          this.usuarios = [];
        }
      },
      error: () => { this.toastr.error('Error al cargar usuarios'); }
    });
  }

  // Cargar todos los bloqueos existentes (global, para admin)
  cargarBloqueos() {
    this.userBlockService.obtenerTodosLosBloqueos().subscribe({
      next: (res) => {
        this.bloqueos = (res.bloqueos || []).map((b: any) => ({
          ...b,
          usuario_bloqueante_id: b.usuario_bloqueante_id,
          usuario_bloqueado_id: b.usuario_bloqueado_id
        }));
        this.totalItems = this.bloqueos.length;
        this.applyPagination();
        
        // Renderizar gráfica después de cargar los datos
        setTimeout(() => this.renderChart(), 100);
      },
      error: () => { this.toastr.error('Error al cargar bloqueos'); }
    });
  }

  applyPagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.bloqueos.length);
    this.displayedBloqueos = this.bloqueos.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyPagination();
  }

  // Crear un nuevo bloqueo
  crearBloqueo() {
    if (!this.usuarioSeleccionado || !this.usuarioBloqueadoSeleccionado) return;
    this.userBlockService.bloquearUsuario(this.usuarioBloqueadoSeleccionado, this.razon).subscribe({
      next: () => {
        this.toastr.success('Bloqueo creado');
        this.cargarBloqueos();
        this.razon = '';
      },
      error: (err) => { this.toastr.error(err.error.message || 'Error al bloquear'); }
    });
  }

  // Eliminar un bloqueo
  eliminarBloqueo(bloqueo: any) {
    const bloqueanteId = bloqueo.usuario_bloqueante.id;
    const bloqueadoId = bloqueo.usuario_bloqueado.id;

    this.userBlockService.desbloquearComoAdmin(bloqueanteId, bloqueadoId).subscribe({
      next: () => {
        this.toastr.success('Bloqueo eliminado');
        this.cargarBloqueos();
      },
      error: (err) => {
        this.toastr.error('Error al eliminar bloqueo');
        console.error('Error al eliminar:', err);
      }
    });
  }

  // Verificar si hay bloqueo entre dos usuarios
  verificarBloqueo() {
    if (!this.usuarioSeleccionado || !this.usuarioBloqueadoSeleccionado) return;
    this.userBlockService.verificarBloqueo(this.usuarioBloqueadoSeleccionado).subscribe({
      next: (res) => { this.resultadoVerificacion = res; },
      error: () => { this.toastr.error('Error al verificar bloqueo'); }
    });
  }

  // Renderizar gráfica de bloqueos por mes
  renderChart() {
    if (!this.bloqueosChartRef) return;
    
    if (this.chart) {
      this.chart.destroy();
    }

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const conteoMeses = new Array(12).fill(0);

    this.bloqueos.forEach(b => {
      if (b.created_at) {
        const fecha = new Date(b.created_at);
        const mes = fecha.getMonth();
        conteoMeses[mes]++;
      }
    });

    this.chart = new Chart(this.bloqueosChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [{
          label: 'Usuarios bloqueados por mes',
          data: conteoMeses,
          backgroundColor: '#dc3545',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { stepSize: 1 } 
          }
        }
      }
    });
  }
} 