import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    TranslatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    TranslatePipe,
    CommonModule
  ]
})
export class SharedModule { }
