import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstallationComponent } from './components/installation/installation.component';
import { SigninComponent } from './components/signin/signin.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { PoiComponent } from './components/poi/poi.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { RecoveryKeyComponent } from './components/recovery-key/recovery-key.component';
import { SignoutComponent } from './components/signout/signout.component';
import { HomeComponent } from './components/home/home.component';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { FaqComponent } from './components/faq/faq.component';
import { PWAUserGuard, PWAGuestGuard, PWAGuard, BrowserGuard, NetworkGuard } from './url-guard';

const routes: Routes = [
  {path: '', redirectTo: 'installation', pathMatch: 'full'},
  {path: 'ucberkeley', redirectTo: 'installation'},
  {path: 'installation', component: InstallationComponent, canActivate: [NetworkGuard, BrowserGuard]},
  {path: 'onboarding/signin', component: SigninComponent, canActivate: [NetworkGuard, PWAGuard, PWAGuestGuard]},
  {path: 'onboarding', component: OnboardingComponent, canActivate: [NetworkGuard, PWAGuard, PWAGuestGuard]},
  {path: 'onboarding/irb', component: OnboardingComponent, canActivate: [NetworkGuard, PWAGuard, PWAGuestGuard]},
  {path: 'home', component: HomeComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard], children: [
    // {path: '', redirectTo: 'resources', pathMatch: 'full'},
    {path: '', component: HomeComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
    {path: 'survey', component: HomeComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
    {path: 'resources', component: HomeComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
    {path: 'setting', component: HomeComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  ]},
  {path: 'home/resources/pois/:id', component: PoiComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  {path: 'rating/:id', component: RatingsComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  {path: 'home/setting/recovery-key', component: RecoveryKeyComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  {path: 'home/setting/signout', component: SignoutComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  {path: 'home/setting/pde', component: PersonalDataComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  {path: 'home/setting/pde/read', component: PersonalDataComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  {path: 'home/setting/pde/delete', component: PersonalDataComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  {path: 'faq', component: FaqComponent, canActivate: [NetworkGuard, PWAGuard, PWAUserGuard]},
  {path: '**', redirectTo: 'installation'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
