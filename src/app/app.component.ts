import { Component } from '@angular/core';
import { Satellite } from './satellite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'orbit-report';
  typeList: { "type": string, "count": number }[];
  sourceList: Satellite[];
  displayList: Satellite[];

  constructor() {
    this.sourceList = [];
    this.displayList = [];
    this.typeList = [];
    let satellitesUrl = 'https://handlers.education.launchcode.org/static/satellites.json';
    let typesPresent = {};

    window.fetch(satellitesUrl).then(function (response) {
      response.json().then(function (data) {
        let fetchedSatellites = data.satellites;
        for (let s of fetchedSatellites) {
          let satellite = new Satellite(s.name, s.type, s.launchDate, s.orbitType, s.operational);
          this.sourceList.push(satellite);
        }

        for (let fs of fetchedSatellites) {
          typesPresent[fs.type] = typesPresent[fs.type] === undefined ? 1 : typesPresent[fs.type] += 1;
        }

        for (let key in typesPresent) {
          let value = typesPresent[key];
          this.typeList.push({ "type": key, "count": value });
        }

        this.displayList = this.sourceList.slice(0);
      }.bind(this));
    }.bind(this));

  }

  search(searchTerm: string): void {
    let matchingSatellites: Satellite[] = [];
    let typesPresent = {};
    searchTerm = searchTerm.toLowerCase();
    this.typeList = [];
    for (let i = 0; i < this.sourceList.length; i++) {
      let name = this.sourceList[i].name.toLowerCase();
      if (name.indexOf(searchTerm) >= 0) {
        matchingSatellites.push(this.sourceList[i]);
      }
    }

    for (let ms of matchingSatellites) {
      typesPresent[ms.type] = typesPresent[ms.type] === undefined ? 1 : typesPresent[ms.type] += 1;
    }

    for (let key in typesPresent) {
      let value = typesPresent[key];
      this.typeList.push({ "type": key, "count": value });
    }
    this.displayList = matchingSatellites;

  }
}
