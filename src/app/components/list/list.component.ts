import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../interfaces';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  itemList: Item[] = [];
  formGroup!: FormGroup;
  private itemListSubject = new BehaviorSubject<Item[]>([...this.itemList]);
  progress = 0;
  badge = 0;
  darkTheme = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.itemListSubject.subscribe((itemList) => {
      const checked = itemList.filter((item) => item.isChecked).length;
      this.progress = (checked / itemList.length) * 100;
      this.badge = itemList.length - checked;
    });

    this.itemList = JSON.parse(localStorage.getItem('itemList') ?? '[]');
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme') ?? 'false');
    this.formGroup = this.formBuilder.group({
      itemsArray: this.formBuilder.array([]),
      newItem: ['', [Validators.required, Validators.minLength(1)]],
      filter: ['all', [Validators.required]],
    });

    this.itemList.forEach((item) => {
      const list = this.formBuilder.group({
        value: [
          { value: item.value, disabled: item.isChecked },
          [Validators.required, Validators.minLength(1)],
        ],
        isChecked: [
          { value: item.isChecked, disabled: false },
          [Validators.required],
        ],
        show: [{ value: item.show, disabled: false }],
      });
      this.itemsArray.push(list);
    });
    this.itemListSubject.next([...this.itemList]);
  }

  get itemsArray(): FormArray {
    return this.formGroup.get('itemsArray') as FormArray;
  }

  get newItem(): FormControl {
    return this.formGroup.get('newItem') as FormControl;
  }

  get filter(): FormControl {
    return this.formGroup.get('filter') as FormControl;
  }

  toggleTheme() {
    localStorage.setItem('darkTheme', JSON.stringify(this.darkTheme));
  }

  deleteItem(index: number): void {
    this.itemsArray.removeAt(index);
    this.itemList.splice(index, 1);
    this.filterList();
  }

  addItem(): void {
    const itemName = this.newItem.value.trim();
    if (this.alreadyExist(itemName)) {
      console.warn('Item already exists or is empty.');
      return;
    }
    const formGroup = this.formBuilder.group({
      value: [
        { value: itemName, disabled: false },
        [Validators.required, Validators.minLength(1)],
      ],
      isChecked: [{ value: false, disabled: false }, [Validators.required]],
      show: [{ value: true, disabled: false }],
    });
    this.itemsArray.push(formGroup);
    this.itemList.push({
      value: itemName,
      isChecked: false,
      updatedAt: new Date(),
      show: true,
    });
    this.newItem.reset();
    this.filterList();
  }

  alreadyExist(name = ''): boolean {
    return this.itemList.some((item) => item.value === name);
  }

  change(index: number): void {
    const formGroup = this.itemsArray?.at(index);
    const isChecked = formGroup?.get('isChecked')?.value;
    const control = formGroup?.get('value');
    if (isChecked) {
      control?.disable();
    } else {
      control?.enable();
    }
    const updated: Item = {
      value: control?.value ?? '',
      isChecked: isChecked ?? false,
      updatedAt: new Date(),
      show: true,
    };
    this.itemList[index] = updated;
    this.filterList();
  }

  filterList(): void {
    this.itemListSubject.next([...this.itemList]);
    this.itemsArray.controls.forEach((item) => {
      const isChecked = item.get('isChecked')?.value;
      switch (this.filter.value) {
        case 'completed':
          item.get('show')?.setValue(isChecked);
          break;
        case 'pending':
          item.get('show')?.setValue(!isChecked);
          break;
        case 'all':
          item.get('show')?.setValue(true);
      }
    });
    localStorage.setItem('itemList', JSON.stringify(this.itemList));
  }
}
