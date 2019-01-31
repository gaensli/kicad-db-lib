import { Component, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { SettingsService } from "../settings.service";
import { Location } from "@angular/common";
import { Settings } from "../settings/settings";

@Component({
  selector: "app-settings-fields",
  templateUrl: "./settings-fields.component.html",
  styleUrls: ["./settings-fields.component.css"]
})
export class SettingsFieldsComponent implements OnInit {
  settingsForm: FormGroup;
  settings: Settings;

  get customFields(): FormArray {
    return this.settingsForm.get("customFields") as FormArray;
  }
  constructor(
    private settingsService: SettingsService,
    private location: Location
  ) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe(settings => {
      this.settings = settings;
      this.initForm();
    });
  }

  initForm() {
    console.log("Settings initForm");

    const customFields: FormControl[] = [];
    for (const field of this.settings.customFields) {
      customFields.push(new FormControl(field, Validators.required));
    }
    this.settingsForm = new FormGroup({
      customFields: new FormArray(customFields)
    });
    console.log(this.settingsForm.value);
  }

  addCustomField(): void {
    this.customFields.push(new FormControl("", Validators.required));
  }

  removeCustomField(index: number): void {
    this.customFields.removeAt(index);
  }

  onSubmit(): void {
    console.warn(this.settingsForm.value);
    this.settings.customFields = this.settingsForm.controls[
      "customFields"
    ].value;
    this.settingsService
      .updateSettings(this.settings)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}