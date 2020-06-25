declare var window: any;

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { v4 as uuidv4 } from 'uuid';

enum EnumPageView {Main, Search, Thanks, SymptomGuide, CommonGuide};

@Component({
  selector: 'app-report-symptom',
  templateUrl: './report-symptom.component.html',
  styleUrls: ['./report-symptom.component.scss']
})
export class ReportSymptomComponent implements OnInit {
  public PageView = EnumPageView;
  public view: EnumPageView = EnumPageView.Main;

  public symptoms: {
    id: string,
    name: string,
    description: string,
    existing: boolean,
    common: boolean,
    picked: boolean
  }[];

  public keyword: string;
  public autocompleteSymptoms: {
    id: string,
    name: string,
    description: string,
    matched: boolean
  }[];

  public symptomMetric: {
    me: {
      total_today: number,
      delta: number,
    },
    community: {
      avg_today: number,
      delta: number,
    }
  };

  public symptomGuide: {
    distance: number,
    country: string,
    state: string
    county: string,
    latitude: number,
    longitude: number,
    name: string,
    address: string,
    phone: string
  }[];

  constructor(private activatedRoute: ActivatedRoute, private location: Location, private apiService: ApiService) {
    this.autocompleteSymptoms = [];
    this.keyword = '';
    this.getSymptoms();
    this.getAutocompleteSymptoms();
  }

  ngOnInit() {}

  public setView(newView: EnumPageView) {
    this.view = newView;
    if (this.view === EnumPageView.Search && this.autocompleteSymptoms.length === 0) {
      this.getAutocompleteSymptoms();
    } else if (this.view === EnumPageView.Thanks && !this.symptomMetric) {
      this.getSymptomMetric();
    }
  }

  public autocomplete() {
    this.autocompleteSymptoms.forEach((symptom) => {
      symptom.matched = symptom.name.includes(this.keyword);
    });
  }

  public toggleSymptomPicking(name: string, force?: boolean) {
    name = name.toLowerCase().trim();
    let found = this.symptoms.find(symptom => symptom.name === name);
    if (found) {
      found.picked = force === undefined ? !found.picked : force;
    } else {
      this.addSymptom(name);
    }
  }

  public addSymptom(name: string) {
    this.apiService
      .request('post', 'api/symptoms', {
        name: name,
        description: ''
      })
      .subscribe(
        (data) => {
          let symptom = data;
          symptom.common = false;
          symptom.existing = true;
          symptom.picked = true;
          this.symptoms.push(symptom);
        }
      )
  }

  public submit() {
    let report = this.symptoms.filter(symptom => symptom.picked).map(symptom => symptom.id);
    if (!report.length) {
      return;
    }

    this.apiService
      .request('post', 'api/symptoms/report', {
        symptoms: report
      })
      .subscribe(
        (data: {official: number, guide: any}) => {
          if (data.official > 0 && data.guide && data.guide.length > 0) {
            this.symptomGuide = data.guide;
            this.setView(EnumPageView.SymptomGuide);
          } else {
            this.setView(EnumPageView.Thanks);
          }
        },
        (err: any) => {
          console.log(err);
          // TODO: do something
        }
      );
  }

  private getSymptoms(): void {
    this.apiService
      .request('get', `api/v2/symptoms`)
      .subscribe(
        (data: {official_symptoms: any, neighborhood_symptoms: any}) => {
          this.symptoms = [];
          data.official_symptoms.forEach(symptom => {
            symptom.common = true;
            symptom.existing = true;
            symptom.picked = false;
            this.symptoms.push(symptom);
          });
          data.neighborhood_symptoms.forEach(symptom => {
            symptom.common = false;
            symptom.existing = true;
            symptom.picked = false;
            this.symptoms.push(symptom);
          });
        },
        (err: any) => {
          console.log(err);
          // TODO: do something
        }
      );
  }

  private getAutocompleteSymptoms(): void {
    this.apiService
      .request('get', `api/v2/symptoms?all=true`)
      .subscribe(
        (data: {customized_symptoms: any, official_symptoms: any, suggested_symptoms: any}) => {
          this.autocompleteSymptoms = data.official_symptoms.concat(data.customized_symptoms, data.suggested_symptoms);
        },
        (err: any) => {
          console.log(err);
          // TODO: do something
        }
      );
  }

  private getSymptomMetric(): void {
    this.apiService
      .request('get', 'api/metrics/symptom')
      .subscribe(
        (data) => {
          this.symptomMetric = data;
        },
        (err: any) => {
          console.log(err);
          // TODO: do something
        }
      )
  }

}
