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
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  filteredTopics = computed(() => {
    const topic = this.configurationForm.topic().value();
    return this._filterTopics(topic || '');
  });

  configurationModel = signal<ConfigurationData>({
    phoneNumber: '',
    topic: '',
    messageCount: 1,
    selectedDays: [],
    deliveryTime: '',
  });

  configurationForm = form(this.configurationModel, (schemaPath) => {
    required(schemaPath.phoneNumber, { message: 'Phone number is required' });
    required(schemaPath.topic, { message: 'Topic is required' });
    required(schemaPath.messageCount, { message: 'Message count is required' });
    required(schemaPath.selectedDays, {
      message: 'At least one day is required',
    });
    required(schemaPath.deliveryTime, { message: 'Delivery time is required' });
    debounce(schemaPath.phoneNumber, 500);
    min(schemaPath.messageCount, 1, { message: 'Minimum 1 message required' });
    max(schemaPath.messageCount, 3, { message: 'Maximum 3 messages allowed' });
    pattern(schemaPath.phoneNumber, /^[0-9\s\-\+\(\)]*$/, {
      message: 'Invalid phone number',
    });
  });

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

  private _filterTopics(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.predefinedTopics.filter((topic) =>
      topic.toLowerCase().includes(filterValue),
    );
  }

  onDayChange(day: string, event: MatCheckboxChange) {
    if (event.checked) {
      this.configurationForm
        .selectedDays()
        .value.update((prevSelectedDays) => [...prevSelectedDays, day]);
    } else {
      const day: string | undefined = this.configurationForm
        .selectedDays()
        .value()
        .find((d) => d === day);
      if (day) {
        this.configurationForm
          .selectedDays()
          .value.update((prevSelectedDays) =>
            prevSelectedDays.filter((d) => d !== day),
          );
      }
    }
  }

  isDaySelected(day: string): boolean {
    return (this.configurationForm.selectedDays().value() || []).includes(day);
  }

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
  selectedDays: string[];
  deliveryTime: string;
}
