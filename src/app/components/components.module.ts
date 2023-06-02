import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../shared';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListComponent],
  imports: [SharedModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [],
  exports: [ListComponent],
})
export class ComponentsModule {}
