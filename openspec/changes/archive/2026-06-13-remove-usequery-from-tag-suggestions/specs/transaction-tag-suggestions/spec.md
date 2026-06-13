## REMOVED Requirements

### Requirement: Tag suggestion loading SHALL remain non-blocking

**Reason**: Tag suggestions are now retrieved synchronously from LocalStorage cache, making them instantly available without loading or refetching states.
**Migration**: Retrieve suggestions synchronously using direct local cache reads.

#### Scenario: Removed

- **WHEN** the capability is removed
- **THEN** this requirement is no longer applicable
