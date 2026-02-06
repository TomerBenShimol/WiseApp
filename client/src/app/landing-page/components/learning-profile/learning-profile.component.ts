import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-learning-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormField,
  ],
  templateUrl: './learning-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningProfileComponent {
  phoneNumberField = input.required<any>();
  topicField = input.required<any>();
  messageCountField = input.required<any>();
  messageCountOptions = input.required<number[]>();
}
