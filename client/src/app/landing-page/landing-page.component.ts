import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  debounce,
  form,
  max,
  min,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LearningProfileComponent } from './components/learning-profile/learning-profile.component';
import { DeliveryScheduleComponent } from './components/delivery-schedule/delivery-schedule.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    LearningProfileComponent,
    DeliveryScheduleComponent,
  ],
  templateUrl: './landing-page.component.html',
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

  dayFields = computed(() => {
    const fields: Record<string, any> = {};
    this.WEEKDAYS.forEach((day) => {
      fields[day] = this.configurationForm[day];
    });
    return fields;
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
          : {
              kind: 'daySelection',
              message: 'At least one day must be selected',
            };
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
