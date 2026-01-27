import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  debounce,
  form,
  FormField,
  max,
  min,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    FormField,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  readonly WEEKDAYS = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;

  configurationModel = signal<ConfigurationData>({
    phoneNumber: '',
    topic: '',
    messageCount: 1,
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    deliveryTime: '',
  });

  atLeastOneDaySelected = computed(() => {
    const selected = this.WEEKDAYS.find((day) =>
      this.configurationForm[day]().value(),
    );
    return !!selected;
  });

  configurationForm = form(this.configurationModel, (schemaPath) => {
    required(schemaPath.phoneNumber, { message: 'Phone number is required' });
    required(schemaPath.topic, { message: 'Topic is required' });
    required(schemaPath.messageCount, { message: 'Message count is required' });
    required(schemaPath.deliveryTime, { message: 'Delivery time is required' });
    debounce(schemaPath.phoneNumber, 500);
    min(schemaPath.messageCount, 1, { message: 'Minimum 1 message required' });
    max(schemaPath.messageCount, 3, { message: 'Maximum 3 messages allowed' });
    pattern(schemaPath.phoneNumber, /^[0-9\s\-\+\(\)]*$/, {
      message: 'Invalid phone number',
    });
    pattern(schemaPath.phoneNumber, /^(?!.*[<>{}[\]`]).*$/, {
      message: 'Special characters not allowed',
    });
    this.WEEKDAYS.forEach((day) => {
      validate(schemaPath[day], () => {
        return this.atLeastOneDaySelected()
          ? null
          : { kind: 'daySelection', message: 'At least one day must be selected' };
      });
    });
  });

  messageCountOptions = [1, 2, 3];

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.configurationForm().valid()) {
      console.log('Form submitted:', this.configurationModel());
      // Handle form submission here (API call, etc.)
    }
  }
}

interface ConfigurationData {
  phoneNumber: string;
  topic: string;
  messageCount: number;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  deliveryTime: string;
}
