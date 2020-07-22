import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetAlertComponent } from "../bottom-sheet-alert/bottom-sheet-alert.component";
import { Util } from '../services/util/util.service';
import { UserService } from '../services/user/user.service';

enum EnumPageStage { Ratings, Rights, DataPDE, DataCDE }

@Component({
  selector: "app-ratings",
  templateUrl: "./ratings.component.html",
  styleUrls: ["./ratings.component.scss"],
})
export class RatingsComponent implements OnInit {
  public PageStage = EnumPageStage;
  public stage: EnumPageStage = EnumPageStage.Ratings;

  public poiID: string;
  public highlightID: string;
  public ratings: {
    name: string;
    score: number;
  }[] = [];
  public ratingsParam: {} = {};

  public poi: {
    id: string;
    alias: string;
    address: string;
    last_updated: number;
    has_more_resources: boolean;
    location: {
      latitude: number;
      longitude: number;
    };
    resource_ratings: {};
    resource_score: number;
    score: number;
  };

  public demoRatings: string;
  public gotRights: boolean = false;

  public poiBackground: string;
  public submitable: boolean = false;
  public clickable: boolean = true;
  private isChangeRating: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private apiService: ApiService,
    private bottomSheet: MatBottomSheet,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetAlertComponent>,
    public router: Router,
    private userService: UserService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.poiID = params.id;
      this.getRatings();
      this.getPOIProfile();
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.highlightID = params["highlight_id"];
    });
    this.demoRatings = JSON.stringify(
      { ratings: { equipment_disinfected: 0, face_coverings_required: 0, good_air_circulation: 3, hand_sanitizer: 5, hand_washing_facilities: 2, outdoor_options: 4, social_distancing: 1, surfaces_disinfected: 0, temperature_checks: 0, } }, undefined, 2);
    this.gotRights = this.userService.getPreference('rights-known') || false;
  }

  ngOnInit() {}

  private getRatings(): void {
    this.apiService
      .request(
        "get",
        `${environment.autonomy_api_url}api/points-of-interest/${this.poiID}/ratings`,
        null,
        null,
        ApiService.DSTarget.PDS
      )
      .subscribe(
        (data: { ratings: any }) => {
          for (let key in data.ratings) {
            this.ratings.push({
              name: key.replace(/_/g, " "),
              score: data.ratings[key],
            });
          }
          this.checkSubmitable(data.ratings);
        },
        (err: any) => {
          console.log(err);
          // TODO: do something
        }
      );
  }

  private getPOIProfile(): void {
    this.apiService
      .request(
        "get",
        `${environment.autonomy_api_url}api/points-of-interest/${this.poiID}`,
        null,
        null,
        ApiService.DSTarget.CDS
      )
      .subscribe(
        (data: any) => {
          this.poi = data;
          this.poiBackground = Util.scoreToColor(
            this.poi.resource_score,
            false
          );
        },
        (err: any) => {
          console.log(err);
          // TODO: do something
        }
      );
  }

  private openBottomSheet(): void {
    this.bottomSheetRef = this.bottomSheet.open(BottomSheetAlertComponent, {
      disableClose: true,
      data: {
        error: false,
        header: "submitting",
        mainContent: "Anonymously submitting your ratings for this place ...",
      },
    });
  }

  private checkSubmitable(data) {
    for (let key in data) {
      if (data[key] > 0) {
        this.submitable = true;
        break;
      }
    }
  }

  private formatParams() {
    this.ratings.forEach((el) => {
      let tmp = {};
      tmp[el.name.replace(/ /g, "_")] = el.score;
      this.ratingsParam = Object.assign(this.ratingsParam, tmp);
    });
  }

  public checkRightsKnown() {
    this.gotRights = !this.gotRights;
    this.userService.setPreference('rights-known', this.gotRights);
  }

  public submitRatings(): void {
    if (this.clickable && this.submitable) {
      this.clickable = false;
      this.openBottomSheet();
      this.formatParams();
      this.apiService
        .request(
          "put",
          `${environment.autonomy_api_url}api/points-of-interest/${this.poiID}/ratings`,
          {
            ratings: this.ratingsParam,
          },
          null,
          ApiService.DSTarget.BOTH
        )
        .subscribe(
          () => {
            setTimeout(() => {
              this.bottomSheetRef.afterDismissed().subscribe(() => {
                this.clickable = true;
                this.router.navigate(["/pois", this.poiID]);
              });
              this.bottomSheetRef.dismiss();
            }, 3 * 1000);
          },
          (err: any) => {
            this.clickable = true;
            console.log(err);
            // TODO: do something
          }
        );
    }
  }

  public changeRating() {
    this.isChangeRating = true;
  }

  public clickRating(el) {
    this.submitable = true;
    setTimeout(() => {
      if (!this.isChangeRating) {
        el.score = 0;
      }
      this.isChangeRating = false;
    }, 0);
  }

  public back(): void {
    this.location.back();
  }
}
