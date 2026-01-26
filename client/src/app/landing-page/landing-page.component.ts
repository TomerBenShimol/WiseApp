import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: [],
})
export class LandingPageComponent implements OnInit {
  form!: FormGroup;
  filteredTopics$!: Observable<string[]>;

  predefinedTopics = [
    'Technology',
    'Science',
    'History',
    'Languages',
    'Business',
  ];
  messageCountOptions = [1, 2, 3];
  weekdays = [
    { label: 'Sunday', value: 'sunday' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.setupTopicAutocomplete();
  }

  initializeForm() {
    this.form = this.fb.group({
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9\s\-\+\(\)]*$/)],
      ],
      topic: ['', Validators.required],
      messageCount: ['', Validators.required],
      selectedDays: [[], Validators.required],
      deliveryTime: ['', Validators.required],
    });
  }

  setupTopicAutocomplete() {
    this.filteredTopics$ = this.form.get('topic')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTopics(value)),
    );
  }

  private _filterTopics(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.predefinedTopics.filter((topic) =>
      topic.toLowerCase().includes(filterValue),
    );
  }

  onDayChange(day: string, event: any) {
    const selectedDays = this.form.get('selectedDays')?.value || [];
    if (event.checked) {
      selectedDays.push(day);
    } else {
      const index = selectedDays.indexOf(day);
      if (index > -1) {
        selectedDays.splice(index, 1);
      }
    }
    this.form.get('selectedDays')?.setValue(selectedDays);
  }

  isDaySelected(day: string): boolean {
    return (this.form.get('selectedDays')?.value || []).includes(day);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      // Handle form submission here (API call, etc.)
    }
  }
}
