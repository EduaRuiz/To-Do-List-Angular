import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../shared';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypewriterComponent } from './typewriter';

@NgModule({
  declarations: [ListComponent, TypewriterComponent],
  imports: [SharedModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [],
  exports: [ListComponent],
})
export class ComponentsModule {}
