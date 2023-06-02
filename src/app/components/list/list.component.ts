import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface Item {
  value: string;
  isChecked: boolean;
  updatedAt: Date;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  panelExpanded = false;
  @Input() title = 'List Component';
  @Input() description = 'List Component Description';
  @Input() itemList: Item[] = [
    { value: 'Item 1', isChecked: false, updatedAt: new Date() },
    { value: 'Item 2', isChecked: true, updatedAt: new Date() },
    { value: 'Item 3', isChecked: false, updatedAt: new Date() },
  ];
  formGroup: FormGroup = new FormGroup({});
  displayedColumns: string[] = [
    'demo-position',
    'demo-name',
    'demo-weight',
    'demo-symbol',
    'remove',
  ];
  private itemListSubject: BehaviorSubject<Item[]> = new BehaviorSubject<
    Item[]
  >(this.itemList);
  progress!: number;
  badge!: number;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      itemsArray: this.formBuilder.array([]),
      newItem: ['', [Validators.required, Validators.minLength(1)]],
    });

    this.itemListSubject.subscribe((itemList) => {
      const checked = itemList.reduce((acc, item) => {
        if (item.isChecked) {
          acc++;
        }
        return acc;
      }, 0);
      this.progress = (checked / itemList.length) * 100;
      this.badge = itemList.length - checked;
    });
  }

  ngOnInit(): void {
    this.itemList.forEach((item) => {
      let list = this.formBuilder.group({
        value: [
          { value: item.value, disabled: item.isChecked },
          [Validators.required, Validators.minLength(1)],
        ],
        isChecked: [
          { value: item.isChecked, disabled: false },
          [Validators.required],
        ],
      });
      this.itemsArray.push(list);
    });
  }

  get itemsArray(): FormArray {
    return this.formGroup.get('itemsArray') as FormArray;
  }

  get newItem(): FormControl {
    return this.formGroup.get('newItem') as FormControl;
  }

  onPanelOpen(): void {
    this.panelExpanded = true;
  }

  onPanelClose(): void {
    this.panelExpanded = false;
  }

  deleteItem(index: number): void {
    this.itemsArray.removeAt(index);
    this.itemList.splice(index, 1);
    this.itemListSubject.next(this.itemList);
  }

  addItem(): void {
    if (this.alreadyExist(this.newItem.value) || this.newItem.invalid) {
      alert('Item already exist or is empty');
      return;
    }
    const formGroup = this.formBuilder.group({
      value: [
        { value: this.newItem.value, disabled: false },
        [Validators.required, Validators.minLength(1)],
      ],
      isChecked: [{ value: false, disabled: false }, [Validators.required]],
    });
    this.itemsArray.push(formGroup);
    this.itemList.push({
      value: this.newItem.value,
      isChecked: false,
      updatedAt: new Date(),
    });
    this.itemListSubject.next(this.itemList);
    this.newItem.reset();
  }

  alreadyExist(name?: string): boolean {
    if (!name) {
      return this.itemList.some((item) => item.value === this.newItem.value);
    }
    return this.itemList.some((item) => item.value === name);
  }

  change(index: number): void {
    const isChecked = this.itemsArray.at(index).get('isChecked')?.value;
    if (isChecked) {
      this.itemsArray.at(index).get('value')?.disable();
    } else {
      this.itemsArray.at(index).get('value')?.enable();
    }
    const updated: Item = {
      value: this.itemsArray.at(index).get('value')?.value,
      isChecked: isChecked,
      updatedAt: new Date(),
    };
    this.itemList[index] = updated;
    this.itemListSubject.next(this.itemList);
    console.log(this.itemList);
  }
}
