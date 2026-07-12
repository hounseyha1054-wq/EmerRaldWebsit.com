# Requirements Document

## Introduction

The **Reservation Report & Print** feature adds two major capabilities to the Emerald Bistro web application:

1. **Customer Booking Confirmation & Print** — After a successful reservation, the customer is shown a confirmation receipt with their full booking details. The receipt can be printed via the browser or downloaded as a PDF.

2. **Admin Reporting & Print** — A new Reports page in the admin panel provides summary statistics and a filterable table of reservations. Admins can print the full report, export it as CSV, and print individual reservation records directly from the existing Reservations table.

The feature also includes a backend enhancement to return saved booking data from the `POST /api/reservation/add` endpoint, and a new protected `GET /api/reservation/report` endpoint for filtered reservation retrieval.

---

## Glossary

- **ReservationForm**: The customer-facing form component (`ReservationForm.jsx`) used to submit a table reservation.
- **BookingConfirmation**: A new modal/page component (`BookingConfirmation.jsx`) displayed to the customer after a successful booking.
- **AdminTable**: The existing admin page (`AdminTable.jsx`) that lists all reservations in a table with per-row status and delete controls.
- **ReportsPage**: A new admin page (`ReportsPage.jsx`) showing reservation summary statistics and a filterable reservation table.
- **PrintPreviewModal**: A new reusable admin component (`PrintPreviewModal.jsx`) that renders a single reservation in a print-ready format.
- **Booking_Reference**: The MongoDB `_id` returned from the `POST /api/reservation/add` endpoint, used as a unique identifier on the customer receipt.
- **Status**: A reservation workflow state: `Pending`, `Confirmed`, or `Cancelled`. In Phase 1, status is managed client-side via `localStorage` in the admin panel; it is not stored in the database.
- **StatusMap**: A `localStorage`-backed mapping of reservation `_id` to `Status`, maintained by the AdminTable component.
- **Report_API**: The new backend endpoint `GET /api/reservation/report`, protected by `adminAuth` middleware.
- **Admin**: An authenticated user of the admin panel who has provided a valid JWT token matching the configured admin email.
- **Customer**: An unauthenticated visitor of the customer-facing front-end who submits a reservation via ReservationForm.
- **Summary_Statistics**: Aggregate counts derived from the reservations list: total bookings, confirmed count, pending count, cancelled count, and total guest count.

---

## Requirements

### Requirement 1: Backend — Enhanced Reservation Creation Response

**User Story:** As a Customer, I want to receive my booking details back from the server after submitting a reservation, so that my confirmation receipt can display accurate information including a booking reference.

#### Acceptance Criteria

1. WHEN a valid reservation submission is received at `POST /api/reservation/add`, THE Reservation_API SHALL save the reservation and return a response with `success: true`, a `message` string, and a `reservation` object containing all saved fields (`_id`, `name`, `email`, `phone`, `date`, `time`, `guests`).
2. IF the reservation fails to save due to a database error, THEN THE Reservation_API SHALL return HTTP 500 with `{ success: false, message: "Internal server error" }`.
3. IF any required field (`name`, `email`, `phone`, `date`, `time`, `guests`) is missing from the request body, THEN THE Reservation_API SHALL return HTTP 400 with a descriptive error message.

---

### Requirement 2: Backend — Protected Report Endpoint

**User Story:** As an Admin, I want a dedicated API endpoint to retrieve reservations filtered by date range, so that the Reports page can fetch only the relevant data without processing the full dataset client-side.

#### Acceptance Criteria

1. THE Reservation_API SHALL expose a `GET /api/reservation/report` endpoint protected by `adminAuth` middleware.
2. WHEN a request to `GET /api/reservation/report` is made without a valid admin JWT token, THE Reservation_API SHALL return HTTP 401 with `{ message: "Unauthorized user!" }`.
3. WHEN a valid authenticated request to `GET /api/reservation/report` is made with no query parameters, THE Reservation_API SHALL return all reservations sorted by date descending, along with a `summary` object containing `total` and `totalGuests`.
4. WHEN a valid authenticated request includes a `from` query parameter (YYYY-MM-DD), THE Reservation_API SHALL return only reservations whose `date` field is greater than or equal to `from`.
5. WHEN a valid authenticated request includes a `to` query parameter (YYYY-MM-DD), THE Reservation_API SHALL return only reservations whose `date` field is less than or equal to `to`.
6. WHEN both `from` and `to` are provided, THE Reservation_API SHALL return only reservations whose `date` falls within the inclusive range `[from, to]`.
7. IF the database query fails, THEN THE Reservation_API SHALL return HTTP 500 with `{ success: false, message: "Internal server error" }`.

---

### Requirement 3: Customer — Booking Confirmation Receipt Display

**User Story:** As a Customer, I want to see a confirmation receipt immediately after my reservation is submitted, so that I have a clear record of my booking details.

#### Acceptance Criteria

1. WHEN the ReservationForm receives a successful response from `POST /api/reservation/add`, THE BookingConfirmation SHALL be displayed showing: customer name, email, phone number, reservation date, time slot, number of guests, and a booking reference derived from the returned `_id`.
2. WHILE the BookingConfirmation is displayed, THE ReservationForm SHALL be hidden or obscured by the modal overlay.
3. IF the API response does not include a `reservation` object but `success` is `true`, THEN THE BookingConfirmation SHALL display the confirmation using the field values the Customer entered in the form prior to submission.
4. THE BookingConfirmation SHALL include an Emerald Bistro branding header (restaurant name and logo or wordmark).
5. WHEN the Customer clicks the "Close" or "Make Another Booking" button, THE BookingConfirmation SHALL be dismissed and THE ReservationForm SHALL be visible and reset to its default values.

---

### Requirement 4: Customer — Print Booking Confirmation Receipt

**User Story:** As a Customer, I want to print my booking confirmation receipt, so that I have a physical copy of my reservation.

#### Acceptance Criteria

1. THE BookingConfirmation SHALL display a "Print Receipt" button.
2. WHEN the Customer clicks "Print Receipt", THE BookingConfirmation SHALL invoke `window.print()` to open the browser print dialog.
3. WHILE printing, THE BookingConfirmation SHALL apply `@media print` CSS rules that hide all page elements except the receipt content area.

---

### Requirement 5: Customer — Download Booking Confirmation as PDF

**User Story:** As a Customer, I want to download my booking confirmation as a PDF file, so that I can save a digital copy for future reference.

#### Acceptance Criteria

1. THE BookingConfirmation SHALL display a "Download PDF" button.
2. WHEN the Customer clicks "Download PDF", THE BookingConfirmation SHALL use `html2canvas` to capture the receipt DOM element and `jsPDF` to generate and download a PDF file named `booking-confirmation-[YYYY-MM-DD].pdf`.
3. IF `html2canvas` or `jsPDF` throws an error during PDF generation, THEN THE BookingConfirmation SHALL display a toast notification with the message "PDF generation failed — try printing instead" and SHALL NOT download a partial file.

---

### Requirement 6: Admin — Reports Page Navigation

**User Story:** As an Admin, I want a dedicated Reports page accessible from the admin sidebar, so that I can navigate to reservation analytics without leaving the admin panel.

#### Acceptance Criteria

1. THE Admin_Panel SHALL include a "Reports" navigation item in the Sidebar that links to the `/reports` route.
2. WHEN the Admin navigates to `/reports`, THE Admin_Panel SHALL render the ReportsPage component.
3. THE ReportsPage SHALL require a valid admin `token` prop; WHEN the token is absent, THE ReportsPage SHALL redirect the Admin to the login screen.

---

### Requirement 7: Admin — Reports Page Summary Statistics

**User Story:** As an Admin, I want to see summary statistics at the top of the Reports page, so that I can quickly understand the overall reservation status at a glance.

#### Acceptance Criteria

1. WHEN the ReportsPage loads or filters are applied, THE ReportsPage SHALL display Summary_Statistics cards showing: total reservations, confirmed count, pending count, cancelled count, and total guest count.
2. THE ReportsPage SHALL compute confirmed, pending, and cancelled counts by reading reservation statuses from the StatusMap in `localStorage`.
3. THE ReportsPage SHALL compute `totalGuests` by summing the `guests` field (parsed as an integer) across all reservations in the current filtered result set.
4. WHEN the filtered result set is empty, THE ReportsPage SHALL display zero for all Summary_Statistics values.

---

### Requirement 8: Admin — Reports Page Filter Controls

**User Story:** As an Admin, I want to filter the reservations report by date range and status, so that I can focus on a specific subset of bookings.

#### Acceptance Criteria

1. THE ReportsPage SHALL provide a "Date From" date input, a "Date To" date input, and a "Status" dropdown with options: All, Pending, Confirmed, Cancelled.
2. WHEN the Admin changes any filter value, THE ReportsPage SHALL fetch updated reservation data from `GET /api/reservation/report` using the `from` and `to` query parameters for date filtering.
3. WHEN the Admin selects a status other than "All", THE ReportsPage SHALL apply status filtering client-side by reading the StatusMap from `localStorage`.
4. THE ReportsPage SHALL provide a "Reset Filters" button that clears all filter inputs and re-fetches unfiltered reservation data.
5. WHEN no reservations match the applied filters, THE ReportsPage SHALL display an empty state message: "No reservations found for the selected filters."

---

### Requirement 9: Admin — Reports Page Reservation Table

**User Story:** As an Admin, I want to see a table of reservations on the Reports page, so that I can review individual booking details alongside the summary statistics.

#### Acceptance Criteria

1. THE ReportsPage SHALL render a table of reservations with columns: #, Name, Phone, Email, Date, Time, Guests, Status.
2. WHEN the Reports page loads, THE ReportsPage SHALL display the status of each reservation using the StatusMap from `localStorage`, defaulting to "Pending" for any reservation without a stored status.
3. WHILE the reservation data is loading, THE ReportsPage SHALL display a loading spinner.
4. IF the `GET /api/reservation/report` request fails, THEN THE ReportsPage SHALL display a toast error notification and render an empty state with a "Retry" button.
5. WHEN the Admin clicks "Retry", THE ReportsPage SHALL re-fire the `GET /api/reservation/report` request with the current filter values.

---

### Requirement 10: Admin — Print Full Report

**User Story:** As an Admin, I want to print the full reservations report, so that I can produce a physical summary for operational use.

#### Acceptance Criteria

1. THE ReportsPage SHALL display a "Print Report" button.
2. WHEN the Admin clicks "Print Report", THE ReportsPage SHALL invoke `window.print()` to open the browser print dialog.
3. WHILE printing, THE ReportsPage SHALL apply `@media print` CSS rules that hide the admin sidebar, filter controls, and action buttons, showing only the Summary_Statistics cards and the reservation table.

---

### Requirement 11: Admin — Export Reservations as CSV

**User Story:** As an Admin, I want to export the currently displayed reservations as a CSV file, so that I can analyse or archive the data in a spreadsheet application.

#### Acceptance Criteria

1. THE ReportsPage SHALL display an "Export CSV" button.
2. WHEN the Admin clicks "Export CSV", THE ReportsPage SHALL generate a CSV string client-side from the currently filtered reservations and trigger a browser file download named `reservations-report-[YYYY-MM-DD].csv`.
3. THE CSV file SHALL contain a header row: `#,Name,Email,Phone,Date,Time,Guests,Status`.
4. THE CSV file SHALL contain one data row per reservation in the currently filtered result set.
5. WHEN a reservation field value contains a comma, THE ReportsPage SHALL wrap that field value in double-quotes in the CSV output.
6. WHEN the filtered result set is empty, THE ReportsPage SHALL generate and download a CSV file containing only the header row.

---

### Requirement 12: Admin — Single Reservation Print from AdminTable

**User Story:** As an Admin, I want to print an individual reservation record directly from the Reservations table, so that I can produce a standalone receipt for a specific booking without navigating away.

#### Acceptance Criteria

1. THE AdminTable SHALL display a "Print" icon button in the Action column of each reservation row, alongside the existing "Delete" button.
2. WHEN the Admin clicks the "Print" button on a reservation row, THE AdminTable SHALL open the PrintPreviewModal populated with that reservation's data and its status from the StatusMap.
3. THE PrintPreviewModal SHALL display the reservation details: name, email, phone, date, time, guests, and status.
4. THE PrintPreviewModal SHALL include a "Confirm Print" button that invokes `window.print()` scoped to the modal content.
5. THE PrintPreviewModal SHALL include a "Close" button that dismisses the modal without printing.
6. WHILE the PrintPreviewModal is open, THE Admin_Panel SHALL apply `@media print` CSS that hides all content except the modal, so that only the reservation receipt is printed.

---

### Requirement 13: Admin — CSV Data Integrity

**User Story:** As an Admin, I want the CSV export to faithfully represent the reservation data, so that I can rely on it for accurate records.

#### Acceptance Criteria

1. THE ReportsPage SHALL produce a CSV where the number of data rows equals the number of reservations in the current filtered result set.
2. THE ReportsPage SHALL include the status value from the StatusMap for each reservation in the exported CSV, defaulting to "Pending" for any reservation without a stored status.
3. THE CSV header row SHALL always be `#,Name,Email,Phone,Date,Time,Guests,Status` regardless of the filter state or the number of reservations.
