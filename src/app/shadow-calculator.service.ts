import {Injectable} from '@angular/core';
import {ShadowShapeSet, ShapesJSON} from "./shape/shadow-shape.model";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SunPositionCalculator} from "./sun-position-calculator.model";
import LatLng = google.maps.LatLng;

let SunCalc = require('suncalc');

// import SunCalc from 'suncalc';

@Injectable()
export class ShadowCalculatorService {
  private hour: number = 16;
  private minutes: number = 20;
  private shadowShapeSet: ShadowShapeSet;
  private date = new Date();


  public isDay: boolean;
  public isDuskOrDawn: boolean;
  public sunrise: Date;
  public sunset: Date;
  public noon: Date;

  public azimuthDegrees: number;
  public azimuthRad: number;

  public date$ = new BehaviorSubject<Date>(this.date);
  public pos$ = new BehaviorSubject<LatLng>(null);

  private sunIconPositionCalculator: SunPositionCalculator;

  public midsummer: Date;
  public midwinter: Date;

  constructor() {

  }

  public setTime(hour: number, minutes: number) {
    this.hour = hour;
    this.minutes = minutes;
    this.date.setHours(this.hour, this.minutes, 0, 0);
    this.date$.next(new Date(this.date));
    this.shadowShapeSet.clearSelection();
    this.recalculateShadows();
  }

  setDay(day: Date) {
    this.date = new Date(day);
    this.date.setHours(this.hour, this.minutes, 0, 0);
    this.date$.next(this.date);
    this.recalculateShadows();
  }

  public setDateAndTime(day: Date) {
    this.date = new Date(day);
    this.date$.next(this.date);
    this.hour = day.getHours();
    this.minutes = day.getMinutes();
    this.recalculateShadows();
  }

  public setDateAndTimeFromModel(model: ShapesJSON) {
    if (model.timestamp != null) {
      this.date = new Date(model.timestamp);
      this.hour = this.date.getHours();
      this.minutes = this.date.getMinutes();
      this.date$.next(this.date);
    }
  }

  public setShadowShapeSet(shadowShapeSet: ShadowShapeSet) {
    this.shadowShapeSet = shadowShapeSet;
  }

  public recalculateShadows() {

    const center = this.shadowShapeSet.map.getCenter();
    const times = SunCalc.getTimes(this.date, center.lat(), center.lng());
    const position = SunCalc.getPosition(this.date, center.lat(), center.lng());
    const altitudeDegrees = position.altitude * (180 / Math.PI);
    const azimuthDegrees = position.azimuth * (180 / Math.PI);
    console.log("altitude=" + altitudeDegrees + " azimuth=" + azimuthDegrees);
    this.azimuthDegrees = azimuthDegrees;
    this.azimuthRad = position.azimuth;

    this.shadowShapeSet.createShadows(position.altitude, position.azimuth);
    this.isDay = position.altitude > 0;
    this.isDuskOrDawn = position.altitude > 0 && (this.date.getTime() < times.goldenHourEnd.getTime() || this.date.getTime() > times.goldenHour);

    this.sunrise = times.sunrise;
    this.sunset = times.sunset;
    this.noon = times.solarNoon;

    if (this.sunIconPositionCalculator == null) {
      this.sunIconPositionCalculator = new SunPositionCalculator(this.shadowShapeSet.map);
    }

    this.sunIconPositionCalculator.recalculatePositionOfSunIconOnTheMap(position.azimuth);

  }


  getDate() {
    return this.date;
  }

  getMinutes() {
    return this.minutes;
  }

  getHour() {
    return this.hour;
  }

  setCurrentHeight(height: number) {
    this.shadowShapeSet.currentHeight = height;
  }

  setPosition(pos: LatLng) {
    this.pos$.next(pos);
  }

  registerMidsummerAndMidwinter(midsummer: Date, midwinter: Date) {
    this.midsummer = midsummer;
    this.midwinter = midwinter;

  }

  recalculateShape(newDistances: Array) {
    let calculatedLatLng = this.shadowShapeSet.currentShape.origin.getPath().getArray();
    let originalLatLng: LatLng[] = this.shadowShapeSet.currentShape.origin.getPath().getArray();

    originalLatLng.forEach((value, i) => {
      let tempIndex = i + 1;
      if (i + 1 === originalLatLng.length)
        tempIndex = 0;

      let startLatLng = calculatedLatLng[i];
      let destLatLng = calculatedLatLng[tempIndex];
      let heading = google.maps.geometry.spherical.computeHeading(startLatLng, destLatLng);
      console.log("Heading: " + heading);
      console.log("new distance: " + newDistances[i]);
      calculatedLatLng[i] = google.maps.geometry.spherical.computeOffset(startLatLng, newDistances[i], heading);
      console.log("Orig LatLng ["+i+"]: lat: " + originalLatLng[i].lat() +  " lng: " +originalLatLng[i].lng());
      console.log("Calc LatLng ["+i+"]: lat: " + calculatedLatLng[i].lat() +  " lng: " +calculatedLatLng[i].lng());


      this.shadowShapeSet.currentShape.origin.setPath(calculatedLatLng);
      if (this.shadowShapeSet.currentShape != null) {
        this.shadowShapeSet.markersSet.createMarkers(this.shadowShapeSet.currentShape.origin, true);
      } else {
        this.shadowShapeSet.markersSet.clearMarkers();
      }
    });
    this.recalculateShadows();
  }

}
