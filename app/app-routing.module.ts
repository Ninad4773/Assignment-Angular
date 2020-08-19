import { VerifyComponent } from './verify/verify.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { SuccessfullComponent } from './successfull/successfull.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/verify',
    pathMatch: 'full'
  },
  {
    path: 'verify',
    component: VerifyComponent
  },
  {
    path: 'success/:fullname',
    component: SuccessfullComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
