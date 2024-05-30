import { Component } from '@angular/core';
import { OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { LngLat, Map, MapStyle, Marker, config } from '@maptiler/sdk';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-zoom-range-page',
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  public zoom: number = 14.5;
  public currentCenter: LngLat = new LngLat(-75.98293545180854, 6.113674843783187)


  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = environment.map_tiler;
  }
  ngAfterViewInit(): void {

    if(!this.mapContainer) throw 'El elemento HTML no fue encontrado';

    // const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: this.currentCenter,
      zoom: this.zoom
    });
    // new Marker({color: "#FF0000"})
    //   .setLngLat([139.7525,35.6846])
    //   .addTo(this.map);
    this.mapListeners()
  }

  mapListeners(){
    if(!this.map) throw 'Mapa no inicializado';

    this.map.on('zoom', (ev)=>{
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev)=>{
      if(this.map!.getZoom() < 18) return;

      this.map?.zoomTo(18)
    });

    this.map.on('move',()=>{
      this.currentCenter = this.map!.getCenter();
      const {lng, lat } = this.currentCenter;
      // console.log(this.lngLat)
    })
  }

  zoomIn(){
    this.map?.zoomIn();
  }

  zoomOut(){
    this.map?.zoomOut();
  }

  zoomChanged(value: string){
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }


}
