# 4.6.16 (2018-06-20)

- updated skyux builder to 1.10.0 and skyux cli to 1.15.0

# 4.6.15 (2017-12-13)

- Added environment and legal entity data to analytics service tracking

# 4.6.12 (2017-12-04)

- fixed issue with grid select all and paging
- updated demo to have select all and paging functionality

# 4.6.11 (2017-11-29)

- added name property to mixpanel people setup

# 4.6.10 (2017-11-21)

- fixed line height on wizard steps
- updated font size for draggable and list view repeater

# 4.6.9 (2017-11-20)

- update skyux-builder
- change analytics property type to be of type 'any'

# 4.6.8 (2017-11-17)

- fixed padding issue in wizard steps
- fixed vertical tab styles to match skyux

# 4.6.7 (2017-11-16)

- fixed issue with grid search where clicking search icon would not apply search in IE
- fixed padding in wizard footer

# 4.6.6 (2017-11-7)

- fixed casing in wizard footer button text
- change "route-requested" analytics property to "Route Requested"

# 4.6.5 (2017-11-6)

- refactored analytics service to inject router directly
- updated skyux builder reference to 1.5.0

# 4.6.4 (2017-10-31)

- updated skyux dependency to 2.3.2 and skyux-builder to 1.4.0

# 4.6.3 (2017-10-30)

- fixed styles for wizard footer buttons
- Fixed button color for search bar

# 4.6.2 (2017-10-26)

- addressed various style issues and fixed them.

# 4.6.1 (2017-10-24)

- updated button styles across the board to use skyux styles
- removed text expand component

# 4.6.0 (2017-10-23)

- updated skyux dependency to 2.3.0, skyux-builder to 1.3.0
- removed deprecated components (list-repeater, navbar, tabbar, spinner, omnibar, checklist)
- updated scss files to use latest skyux styles
- made list toolbar responsive.

# 4.5.9 (2017-10-11)

- fixed list repeater chevron to properly reflect item's expanded state
- only show scroll bars for list view grid when necessary

# 4.5.8 (2017-10-5)

- updated skyux dependency to version 2.2.0

# 4.5.7 (2017-10-3)

- updated skyux dependency to version 2.1.0
- refactored wizard to use Sky modal service directly

# 4.5.6 (2017-09-21)

- added ability to hide content for list view repeater
- exposed row index for use in repeater templates

# 4.5.5 (2017-09-11)

- Fixed search issue with list view component when search criteria returns no items
and selectionEnabled is true; selection column checked state is set.

# 4.5.4 (2017-09-07)

- Added unit tests for link records component
- Added 'showNewFieldValues' property to link records component and updated docs and unit tests

# 4.5.3 (2017-08-21)

- Added ability to define field label for link component field matching.
- Fixed issue where filtered checklist was clearing all items or only selecting shown items when clicking 'Select all' or 'Clear all'

# 4.5.2 (2017-08-16)

- Update components to use sky wait component.
- Removed local directory references to sky components.
- Fixed issue when no initial active tab selected in vertical tabbar component.
- Added removeSelectedItem to link record component api.
- Updated field selection styles and logic on link record component.
- updated link record component logic to move record directly to linked state if no match fields.

# 4.5.0 (2017-08-09)

- Updated project to SkyUX SPA Library.
- Added console service and deprecated messaging.
- Updated angular2localization to angular-l10n for translation service.
- Fix for 'Sky Grid Calling Data Provider Multiple Times When Columns Change' ([683](https://github.com/blackbaud/skyux2/issues/683)).
