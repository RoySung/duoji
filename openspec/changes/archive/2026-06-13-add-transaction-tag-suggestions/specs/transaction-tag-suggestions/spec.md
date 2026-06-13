## ADDED Requirements

### Requirement: Tag suggestions are scoped to the transaction form's selected account book

The system SHALL derive transaction-form tag suggestions from tags already used by transactions in the account book currently selected in the form.

#### Scenario: Suggestions are scoped to the selected account book

- **WHEN** a user opens a transaction form for account book A and account book A has historical tags while account book B has different historical tags
- **THEN** the system SHALL show only suggestions derived from account book A

#### Scenario: Changing the account book changes the suggestion source

- **WHEN** the user changes the account book selection inside the transaction form
- **THEN** the system SHALL update the available suggestions to use the newly selected account book as the only source

### Requirement: Tag suggestions are normalized for display

The system SHALL exclude empty tag values, trim surrounding whitespace, collapse case-insensitive duplicate values into a single suggestion, sort visible suggestions in ascending order, and hide suggestions that are already selected in the current transaction draft.

#### Scenario: Empty and already-selected values are excluded

- **WHEN** the stored transactions for the selected account book contain empty tag values, whitespace-padded values, and values that are already present in the current draft
- **THEN** the visible suggestion list SHALL exclude the empty values and SHALL NOT repeat any tag already selected in the draft

#### Scenario: Case-insensitive duplicates appear once

- **WHEN** the stored transactions for the selected account book contain multiple tag values that differ only by case
- **THEN** the suggestion list SHALL present only one selectable suggestion for that tag value

### Requirement: Tag suggestions stay coherent with transaction mutations

The system SHALL refresh the suggestion list for an account book after transaction creation, update, or deletion changes that account book's used-tag set.

#### Scenario: A new tag becomes available after transaction creation

- **WHEN** a user saves a transaction in account book A with a tag that was not previously used in account book A
- **THEN** future transaction forms for account book A SHALL include that tag in their suggestion list without waiting for cache TTL expiry

#### Scenario: A removed last-use tag disappears after update or deletion

- **WHEN** the last remaining transaction in account book A that uses a tag is updated or deleted so that the tag no longer exists in account book A
- **THEN** future transaction forms for account book A SHALL no longer include that tag in their suggestion list after the transaction cache refreshes

### Requirement: Tag suggestion loading SHALL remain non-blocking

The system SHALL keep the tag field manually editable while tag suggestions are loading, refetching, or unavailable, and SHALL NOT display suggestions from a previously selected account book after the user changes the account book in the form.

#### Scenario: Manual tag entry remains available during loading

- **WHEN** the suggestion data for the selected account book is loading or refetching
- **THEN** the user SHALL still be able to type and save tags manually

#### Scenario: Stale suggestions are cleared during account-book switches

- **WHEN** the user changes the account book selection inside the transaction form and the next account book's suggestions are not ready yet
- **THEN** the system SHALL stop showing the previous account book's suggestions until the new suggestion data is ready
