import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Declaración de tipos para window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Component({
  selector: 'app-google-ads',
  templateUrl: './google-ads.component.html',
  styleUrls: ['./google-ads.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class GoogleAdsComponent implements OnInit {
  isLocalhost = false;
  // ID de cliente de Google Ads - Reemplazar con tu ID real (debe incluir pub-)
  readonly GOOGLE_ADS_CLIENT_ID = 'pub-5066584817244936';
  
  @Input() adSlot: string = '5065389724'; // ID del slot de anuncio (ejemplo: '1234567890')
  @Input() adFormat: string = 'auto';
  @Input() adStyle: string = 'display:block';

  constructor() { }

  ngOnInit(): void {
    // Comprobar si estamos en localhost
    this.isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Cargar el script de Google Ads si no está cargado y NO estamos en localhost (o si queremos forzarlo)
    if (!window.adsbygoogle && !this.isLocalhost) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${this.GOOGLE_ADS_CLIENT_ID}`;
      script.crossOrigin = "anonymous";
      script.async = true;
      document.head.appendChild(script);
    }
  }

  ngAfterViewInit() {
    if (this.isLocalhost) return; // No intentar cargar anuncios en localhost
    
    try {
      // Necesita un timeout en Angular a veces para asegurar que el DOM está listo
      setTimeout(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }, 100);
    } catch (e) {
      console.error('Error al cargar el anuncio:', e);
    }
  }
}
