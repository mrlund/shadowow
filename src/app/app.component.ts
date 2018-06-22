import 'hammerjs';
import {Component, NgZone, ViewChild} from '@angular/core';
import {environment} from "../environments/environment";
import DrawingControlOptions = google.maps.drawing.DrawingControlOptions;
import OverlayType = google.maps.drawing.OverlayType;
import MarkerOptions = google.maps.MarkerOptions;
import {} from '@types/googlemaps';
import {colors} from "./shape/marker-set.model";
import {ShadowCalculatorService} from "./shadow-calculator.service";
import {ShadowShapeSet} from "./shape/shadow-shape.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  shadowShapesSet: ShadowShapeSet;
  json: string = "[{\"coords\":[{\"lat\":50.080234080477496,\"lng\":19.899840021904538},{\"lat\":50.08023321987161,\"lng\":19.899614716347287},{\"lat\":50.0800671226473,\"lng\":19.89961337524278}," +
    "{\"lat\":50.08007486812652,\"lng\":19.89984404521806},{\"lat\":50.080123922799125,\"lng\":19.899837339695523},{\"lat\":50.08012478340697,\"lng\":19.89980783539636},{\"lat\":50.08008605603872," +
    "\"lng\":19.899810517605374},{\"lat\":50.08008519543017,\"lng\":19.899636174019406},{\"lat\":50.08022031078156,\"lng\":19.899632150705884},{\"lat\":50.08021945017542,\"lng\":19.89981319981439}," +
    "{\"lat\":50.080134250092215,\"lng\":19.899809176500867},{\"lat\":50.080134250092215,\"lng\":19.89984404521806}],\"heights\":[10,10,10,40,10,10,10,10,10,10,10,10]}]";


  constructor(private _ngZone: NgZone, private shadowService: ShadowCalculatorService) {





    //dzyngiel z dolu z rozna wysokoscia
    this.json="[{\"coords\":[{\"lat\":50.08022805623605,\"lng\":19.89971261697633},{\"lat\":50.08014629859806,\"lng\":19.899709934767316},{\"lat\":50.080148880420346,\"lng\":19.899778331097195},{\"lat\":50.08011703793582,\"lng\":19.89978101330621},{\"lat\":50.08011961975971,\"lng\":19.89984940963609},{\"lat\":50.08014974102773,\"lng\":19.89983868080003},{\"lat\":50.08015318345718,\"lng\":19.899915123756955},{\"lat\":50.080082613604525,\"lng\":19.89991780596597},{\"lat\":50.08008003177866,\"lng\":19.899982178982327},{\"lat\":50.08015232284984,\"lng\":19.899976814564297},{\"lat\":50.08016092892245,\"lng\":19.90005862193925},{\"lat\":50.08026248046294,\"lng\":19.90006532746179}],\"heights\":[10,10,10,10,10,10,10,10,40,10,10,10]}]";







    //dzyngiel z dolu, tworzylo 3 cienie
    this.json ="[{\"coords\":[{\"lat\":50.08022805623605,\"lng\":19.89971261697633},{\"lat\":50.08014629859806,\"lng\":19.899709934767316},{\"lat\":50.080148880420346,\"lng\":19.899778331097195}," +
      "{\"lat\":50.08011703793582,\"lng\":19.89978101330621},{\"lat\":50.08011961975971,\"lng\":19.89984940963609},{\"lat\":50.08014974102773,\"lng\":19.89983868080003}," +
      "{\"lat\":50.08015318345718,\"lng\":19.899915123756955},{\"lat\":50.080082613604525,\"lng\":19.89991780596597},{\"lat\":50.08008003177866,\"lng\":19.899982178982327}," +
      "{\"lat\":50.08015232284984,\"lng\":19.899976814564297}," +
      "{\"lat\":50.08016092892245,\"lng\":19.90005862193925},{\"lat\":50.08026248046294,\"lng\":19.90006532746179}],\"heights\":[10,10,10,10,10,10,10,10,60,10,10,10]}]"




    //"C shape problematic"
    this.json="[{\"coords\":[{\"lat\":50.080196213804115,\"lng\":19.899771625574658},{\"lat\":50.080306371316375,\"lng\":19.89977028447015},{\"lat\":50.080308953130036,\"lng\":19.899919147070477},{\"lat\":50.08026161985754,\"lng\":19.89991780596597},{\"lat\":50.08026248046291,\"lng\":19.899889642771313},{\"lat\":50.080296904665104,\"lng\":19.899888301666806},{\"lat\":50.080290019826656,\"lng\":19.899794424351285},{\"lat\":50.08020912290068,\"lng\":19.899795765455792},{\"lat\":50.080209983506975,\"lng\":19.89989634829385},{\"lat\":50.080253013802995,\"lng\":19.899893666084836},{\"lat\":50.080253013802995,\"lng\":19.899915123756955},{\"lat\":50.08019449259097,\"lng\":19.899916464861462},{\"lat\":50.08019018955786,\"lng\":19.899793083246777}],\"heights\":[10,10,10,10,10,10,10,5,5,5,5,5,5]}]";




    // "C shape"
    this.json = "[{\"coords\":[{\"lat\":50.080234080477496,\"lng\":19.899840021904538},{\"lat\":50.08023321987161,\"lng\":19.899614716347287},{\"lat\":50.0800671226473,\"lng\":19.89961337524278}," +
      "{\"lat\":50.08007486812652,\"lng\":19.89984404521806},{\"lat\":50.080123922799125,\"lng\":19.899837339695523},{\"lat\":50.08012478340697,\"lng\":19.89980783539636},{\"lat\":50.08008605603872," +
      "\"lng\":19.899810517605374},{\"lat\":50.08008519543017,\"lng\":19.899636174019406},{\"lat\":50.08022031078156,\"lng\":19.899632150705884},{\"lat\":50.08021945017542,\"lng\":19.89981319981439}," +
      "{\"lat\":50.080134250092215,\"lng\":19.899809176500867},{\"lat\":50.080134250092215,\"lng\":19.89984404521806}],\"heights\":[10,10,10,40,10,10,10,10,10,10,10,10]}]";


    // double C
    this.json="[{\"coords\":[{\"lat\":50.08006970447386,\"lng\":19.899758214529584},{\"lat\":50.08009982577324,\"lng\":19.89975955563409},{\"lat\":50.080098965164936,\"lng\":19.89978637772424}," +
      "{\"lat\":50.08004818924842,\"lng\":19.899782354410718},{\"lat\":50.08004646802996,\"lng\":19.899594599779675},{\"lat\":50.080196213804115,\"lng\":19.899593258675168}," +
      "{\"lat\":50.080196213804115,\"lng\":19.899771625574658},{\"lat\":50.080306371316375,\"lng\":19.89977028447015},{\"lat\":50.080308953130036,\"lng\":19.899919147070477}," +
      "{\"lat\":50.08026161985754,\"lng\":19.89991780596597},{\"lat\":50.08026248046291,\"lng\":19.899889642771313},{\"lat\":50.080296904665104,\"lng\":19.899888301666806}," +
      "{\"lat\":50.080290019826656,\"lng\":19.899794424351285},{\"lat\":50.08020912290068,\"lng\":19.899795765455792},{\"lat\":50.080209983506975,\"lng\":19.89989634829385}," +
      "{\"lat\":50.080253013802995,\"lng\":19.899893666084836},{\"lat\":50.080253013802995,\"lng\":19.899915123756955},{\"lat\":50.08019449259097,\"lng\":19.899916464861462}," +
      "{\"lat\":50.08019018955786,\"lng\":19.899793083246777},{\"lat\":50.08011187428771,\"lng\":19.899785036619733},{\"lat\":50.08011101367961,\"lng\":19.899758214529584}," +
      "{\"lat\":50.080181583490486,\"lng\":19.89976626115663}," +
      "{\"lat\":50.08018244409728,\"lng\":19.89961337524278},{\"lat\":50.08005937716683,\"lng\":19.899616057451794}],\"heights\":[10,10,10,10,10,10,10,10,10,10,10,10,10,5,5,5,5,5,5,10,10,10,10,10]}]";


  }

  ngOnInit() {
    let mapProp = {
      center: new google.maps.LatLng(environment.initLat, environment.initLng),
      zoom: 20,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      rotateControl: false,
      overviewMapControl: false,
      streetViewControl: false
    };


    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map.setTilt(0);
    this.shadowShapesSet = new ShadowShapeSet(this.map);
    this.shadowService.setShadowShapeSet(this.shadowShapesSet);


    const drawingControlOptions: DrawingControlOptions = {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [OverlayType.POLYGON]
    };
    const markerOptions: MarkerOptions = {
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      position: new google.maps.LatLng(environment.initLat, environment.initLng)
    };
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions,
      markerOptions,
      polygonOptions: {
        fillColor: colors.colorArea,
        fillOpacity: 0.2,
        strokeWeight: 3,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
      }
    });


    const shadowShapesSet = this.shadowShapesSet;

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {
      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a origin.
        drawingManager.setDrawingMode(null);

        shadowShapesSet.onShapeAdded(e.overlay, this._ngZone, this.shadowService);
      }
    });
    drawingManager.setMap(this.map);

  }

  loadFromJSON() {
    this.shadowShapesSet.fromJSON(this.json, this._ngZone, this.shadowService);
  }
  saveToJSON() {
    this.json=this.shadowShapesSet.toJSON();
  }

}
