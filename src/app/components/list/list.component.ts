import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  panelOpenState = false;
  @Input() description: string = '';
  @Input() title: string = 'List Component';
  @Input() list: string[] = ['Item 1', 'Item 2', 'Item 3'];

  constructor() {}

  ngOnInit(): void {}
}
