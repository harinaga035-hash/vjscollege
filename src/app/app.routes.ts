import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FacultyComponent } from './faculty/faculty.component';
import { CampusandinfrastructureComponent } from './campusandinfrastructure/campusandinfrastructure.component';
import { PlacementsComponent } from './placements/placements.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { EventsGalleryComponent } from './events-gallery/events-gallery.component';
import { BusRoutesComponent } from './bus-routes/bus-routes.component';
import { ContactComponent } from './contact/contact.component';
import { ConferencesComponent } from './conferences/conferences.component';
import { SportsComponent } from './sports/sports.component';
import { CulturalsComponent } from './culturals/culturals.component';
import { VideosComponent } from './videos/videos.component';
import { NssActivitiesComponent } from './nss-activities/nss-activities.component';
import { NewsArticlesComponent } from './news-articles/news-articles.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'faculty', component: FacultyComponent },
    { path: 'campusandinfrastructure', component: CampusandinfrastructureComponent },
    { path: 'placements', component: PlacementsComponent },
    { path: 'achievements', component: AchievementsComponent },
    { path: 'events-gallery', component: EventsGalleryComponent },
    { path: 'bus-routes', component: BusRoutesComponent },
    { path: 'conferences', component: ConferencesComponent },
    { path: 'sports', component: SportsComponent },
    { path: 'culturals', component: CulturalsComponent },
    { path: 'videos', component: VideosComponent },
    { path: 'nss-activities', component: NssActivitiesComponent },
    { path: 'news-articles', component: NewsArticlesComponent },
    { path: 'contact', component: ContactComponent },


];
