import { Component } from '@angular/core';
import { OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { LngLat, Map, MapStyle, Marker, config } from '@maptiler/sdk';
import { environment } from '../../../../environments/environment';
import { elementAt } from 'rxjs';

interface MarkerAndColor{
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: [number, number];
}

@Component({
  selector: 'app-markers-page',
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  public zoom: number = 15;
  public currentCenter: LngLat = new LngLat(-75.98293545180854, 6.113674843783187)


  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  public markers: MarkerAndColor[] = [];

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

    this.readFromLocalStorage();
    // const markerHTML = document.createElement('div');
    // markerHTML.innerHTML = 'Edison'
    // const marker = new Marker(
    //   // {color: "#FF0000"}
    //   // {element: markerHTML}
    // )
    //   .setLngLat(this.currentCenter)
    //   .addTo(this.map);
  }

  createMarker(){

    if(!this.map) return;
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker( lngLat, color );
  }

  addMarker(lngLat:LngLat, color: string){

    if(!this.map) return;

    const marker = new Marker({
      color: color,
      draggable:true
    })
    .setLngLat(lngLat)
    .addTo( this.map );

    this.markers.push( {
      color,
      marker,
    } );

    this.saveToLocalStorage();

    marker.on('dragend', ()=> this.saveToLocalStorage());


  }

  deleteMarker(index: number){

    this.markers[index].marker.remove();

    this.markers.splice(index, 1);

    this.saveToLocalStorage();
  }

  flyTo(marker: Marker){

    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    })

  }

  saveToLocalStorage(){

    const plainMarker: PlainMarker[] = this.markers.map(({ color, marker}) => {

      return{
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarker));

  }

  readFromLocalStorage(){

    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';

    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach(( { color, lngLat })=>{
      const [lng, lat] = lngLat;

      const coords = new LngLat(lng, lat);

      this.addMarker( coords, color);
    })

  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

}
