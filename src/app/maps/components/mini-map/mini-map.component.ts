import { Component, Input } from '@angular/core';
import { OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, Marker, config } from '@maptiler/sdk';

import '@maptiler/sdk/dist/maptiler-sdk.css';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  lngLat?: [number, number];

  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = environment.map_tiler;
  }
  ngAfterViewInit(): void {

    if(!this.mapContainer.nativeElement) throw 'El elemento HTML no fue encontrado';
    if( !this.lngLat) throw "LngLat can´t be null"

    // const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: this.lngLat,
      zoom: 14,
      interactive: false,
    });
    new Marker()
      .setLngLat(this.lngLat)
      .addTo(this.map);
  }


  ngOnDestroy(): void {
    this.map?.remove();
  }

}
