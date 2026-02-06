import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-delivery-schedule',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTimepickerModule,
    FormField,
  ],
  templateUrl: './delivery-schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryScheduleComponent {
  weekdays = input.required<readonly string[]>();
  dayFields = input.required<Record<string, any>>();
  deliveryTimeField = input.required<any>();
  formTouched = input.required<boolean>();
  atLeastOneDaySelected = input.required<boolean>();
}
