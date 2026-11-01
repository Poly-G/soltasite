# Hosted checkout upload fixtures

Solta Site Sandbox QA — synthetic test fixture, no customer data.

Use these small files with the authorized sandbox checkout and materials upload flow:

| File | Purpose | Contents |
| --- | --- | --- |
| `sandbox-headshot.png` | Test the headshot/image picker. | A 640 × 400 RGB color pattern with visible QA labels; no person is depicted. |
| `sandbox-resume.pdf` | Test the resume/PDF picker. | One US Letter page containing only labeled QA placeholder text. |

These files contain no real actor information, customer data, credentials, or production assets. Download the raw files before selecting them in the browser upload picker.

Generated with the existing Pillow and ReportLab environment; no project dependencies were added. Both formats were parsed successfully, and the PDF was checked to contain exactly one page.
