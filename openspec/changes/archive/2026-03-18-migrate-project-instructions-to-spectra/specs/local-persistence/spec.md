## ADDED Requirements

### Requirement: Core domain records persist locally in IndexedDB

The web application SHALL persist account books, transactions, categories, and user-related local records in IndexedDB.

#### Scenario: Save a new domain record

- **WHEN** the application creates or updates an account book, transaction, category, or other local user record
- **THEN** the system SHALL persist the change in IndexedDB

### Requirement: Local data survives browser sessions

The web application SHALL restore previously saved local records when the same user opens the application in a later browser session on the same device.

#### Scenario: Reopen the application

- **WHEN** a user returns to the application after closing the browser session on the same device
- **THEN** the system SHALL load the previously saved local records from IndexedDB

### Requirement: Required local stores are initialized before use

The web application SHALL initialize the required local persistence stores before repository-backed domain operations are executed.

#### Scenario: First launch on a device

- **WHEN** a user opens the application on a device with no existing local data
- **THEN** the system SHALL initialize the required IndexedDB stores before the user performs repository-backed actions