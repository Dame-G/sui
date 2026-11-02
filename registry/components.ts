// Single source of truth: drives the registry build and the docs site.
export type Group = 'Primitives' | 'Forms' | 'Overlays' | 'Navigation' | 'Data'

export interface Component {
  name: string // file name in ui/ and registry item name
  title: string
  group: Group
  description: string
  deps?: string[] // extra npm dependencies (reka-ui is implied unless `plain`)
  plain?: boolean // no reka-ui
  uses?: string[] // other registry components this one imports
}

export const groups: Group[] = ['Primitives', 'Forms', 'Overlays', 'Navigation', 'Data']

export const components: Component[] = [
  { name: 'button', title: 'Button', group: 'Primitives', description: 'Primary action: a face on a slab that sinks onto it when pressed, with a busy state and icon slots.' },
  { name: 'icon-button', title: 'Icon button', group: 'Primitives', description: 'Square button for an icon alone: a required label, a tooltip, a busy state and a 44px tap size.', uses: ['tooltip'] },
  { name: 'badge', title: 'Badge', group: 'Primitives', description: 'Stamp for status: a tinted chip with a tone-coloured side slab.', plain: true },
  { name: 'button-group', title: 'Button group', group: 'Primitives', description: 'Buttons joined into one control with matching corners.', plain: true },
  { name: 'link', title: 'Link', group: 'Primitives', description: 'Text link with the identity underline, hover and focus.' },
  { name: 'card', title: 'Card', group: 'Primitives', description: 'Framed surface that groups related content.', plain: true },
  { name: 'separator', title: 'Separator', group: 'Primitives', description: 'Hairline rule, horizontal or vertical.' },
  { name: 'avatar', title: 'Avatar', group: 'Primitives', description: 'Image with an initials fallback.' },
  { name: 'kbd', title: 'Kbd', group: 'Primitives', description: 'Keyboard key cap on a thin slab.', plain: true },
  { name: 'spinner', title: 'Spinner', group: 'Primitives', description: 'Loading ring: an arc travelling round a dashed track, announced to screen readers.', plain: true, uses: ['announce'] },
  { name: 'skeleton', title: 'Skeleton', group: 'Primitives', description: 'Striped, pulsing placeholder while content loads.', plain: true },
  { name: 'progress', title: 'Progress', group: 'Primitives', description: 'Progress bar with a striped track for what is left, a sliding bar when unknown, and spoken value text.' },
  { name: 'notice', title: 'Notice', group: 'Primitives', description: 'Inline message with a tone icon and a side slab.', plain: true },

  { name: 'text-field', title: 'Text field', group: 'Forms', description: 'Labelled input with an accessible error message.', uses: ['field'], plain: true },
  { name: 'field', title: 'Field', group: 'Forms', description: 'The shared anatomy of every input: label with Required/Optional, hint or error, and an aside for a counter.', uses: ['announce'] },
  { name: 'form', title: 'Form', group: 'Forms', description: 'Validates on submit, lists the problems as links to their fields, and moves focus to the list.', plain: true, uses: ['notice'] },
  { name: 'password-field', title: 'Password field', group: 'Forms', description: 'Text field with a show/hide button and password-manager friendly attributes.', uses: ['field', 'announce'], plain: true },
  { name: 'search-field', title: 'Search field', group: 'Forms', description: 'Search input with an icon, a clear button and Escape to clear.', uses: ['field'], plain: true },
  { name: 'textarea', title: 'Textarea', group: 'Forms', description: 'Labelled multi-line input.', uses: ['field'], plain: true },
  { name: 'checkbox', title: 'Checkbox', group: 'Forms', description: 'Labelled checkbox with indeterminate support.' },
  { name: 'switch', title: 'Switch', group: 'Forms', description: 'On/off toggle with a label.' },
  { name: 'checkbox-group', title: 'Checkbox group', group: 'Forms', description: 'Pick any number of options, with an optional select-all.', uses: ['checkbox', 'fieldset'], plain: true },
  { name: 'radio-group', title: 'Radio group', group: 'Forms', description: 'Pick exactly one option.' },
  { name: 'select', title: 'Select', group: 'Forms', description: 'Dropdown list with keyboard typeahead, groups, multi-select and clear.', uses: ['field', 'spinner'] },
  { name: 'slider', title: 'Slider', group: 'Forms', description: 'Pick a value or range along a track.' },
  { name: 'toggle', title: 'Toggle', group: 'Forms', description: 'Two-state pressable button.' },
  { name: 'toggle-group', title: 'Toggle group', group: 'Forms', description: 'Segmented single-choice control; can stretch to fill the width.' },
  { name: 'combobox', title: 'Combobox', group: 'Forms', description: 'Type to filter a list and pick one or many, with groups, descriptions, clear, loading and freeform entry.', uses: ['field', 'spinner', 'announce'] },
  { name: 'number-field', title: 'Number field', group: 'Forms', description: 'Numeric input with stepper buttons and keyboard steps.', uses: ['field'] },
  { name: 'calendar', title: 'Calendar', group: 'Forms', description: 'Month grid for picking a date, with presets, marked days and a Today/Clear footer.', deps: ['@internationalized/date'] },
  { name: 'date-picker', title: 'Date picker', group: 'Forms', description: 'Field that opens a calendar in a popover.', deps: ['@internationalized/date'], uses: ['calendar', 'field'] },
  { name: 'date-range-picker', title: 'Date range picker', group: 'Forms', description: 'Pick a start and end date from one calendar popover.', deps: ['@internationalized/date'], uses: ['range-calendar', 'field'] },
  { name: 'range-calendar', title: 'Range calendar', group: 'Forms', description: 'Month grid for picking a start and end date, with a band between, presets and marked days.', deps: ['@internationalized/date'] },
  { name: 'time-field', title: 'Time field', group: 'Forms', description: 'Segmented hour and minute input.', deps: ['@internationalized/date'], uses: ['field'] },
  { name: 'date-field', title: 'Date field', group: 'Forms', description: 'Typed, segmented day, month and year input.', deps: ['@internationalized/date'], uses: ['field'] },
  { name: 'fieldset', title: 'Fieldset', group: 'Forms', description: 'Groups related controls under a legend with a shared hint and error.', plain: true },
  { name: 'color-picker', title: 'Color picker', group: 'Forms', description: 'Pick a colour from an area, a hue slider, swatches or a hex field.' },
  { name: 'pin-input', title: 'Pin input', group: 'Forms', description: 'One box per character, for one-time codes.', uses: ['field'] },
  { name: 'tags-input', title: 'Tags input', group: 'Forms', description: 'Type to add several values as removable chips.', uses: ['field'] },
  { name: 'input-group', title: 'Input group', group: 'Forms', description: 'Text field with a prefix or suffix attached.', plain: true, uses: ['field'] },
  { name: 'label', title: 'Label', group: 'Forms', description: 'Standalone label that stays tied to its control.' },
  { name: 'editable', title: 'Editable', group: 'Forms', description: 'Text you click to edit in place.', uses: ['field'] },
  { name: 'file-upload', title: 'File upload', group: 'Forms', description: 'Dropzone and file list with validation, thumbnails and progress.', plain: true, uses: ['field', 'announce'] },

  { name: 'dialog', title: 'Dialog', group: 'Overlays', description: 'Modal dialog with focus trap and scroll lock.' },
  { name: 'sheet', title: 'Sheet', group: 'Overlays', description: 'Side panel built on the dialog primitive.' },
  { name: 'popover', title: 'Popover', group: 'Overlays', description: 'Floating panel anchored to a trigger.' },
  { name: 'toggletip', title: 'Toggletip', group: 'Overlays', description: 'A tooltip you click, for touch and screen readers. Focus stays on the button.', uses: ['announce'] },
  { name: 'tooltip', title: 'Tooltip', group: 'Overlays', description: 'Short hint on hover or focus.' },
  { name: 'dropdown-menu', title: 'Dropdown menu', group: 'Overlays', description: 'Menu of actions with arrow-key navigation.' },
  { name: 'alert-dialog', title: 'Alert dialog', group: 'Overlays', description: 'Modal that demands a decision, for confirming destructive actions.' },
  { name: 'context-menu', title: 'Context menu', group: 'Overlays', description: 'Menu of actions on right-click or long-press.' },
  { name: 'hover-card', title: 'Hover card', group: 'Overlays', description: 'Rich preview shown when hovering a link or trigger.' },
  { name: 'drawer', title: 'Drawer', group: 'Overlays', description: 'Bottom sheet you can drag down to dismiss, made for touch.' },
  { name: 'command', title: 'Command', group: 'Overlays', description: 'Command palette: ranked, highlighted matches, groups, icons, shortcuts, nested pages and a loading state.', uses: ['announce', 'kbd', 'spinner'] },
  { name: 'toast', title: 'Toast', group: 'Overlays', description: 'Brief notification fired from code: duration, action button, keyed updates and a promise helper.' },

  { name: 'tabs', title: 'Tabs', group: 'Navigation', description: 'Switch between panels of related content, with optional counts and vertical layout.', uses: ['announce'] },
  { name: 'accordion', title: 'Accordion', group: 'Navigation', description: 'Collapsible sections, one open at a time.' },
  { name: 'breadcrumb', title: 'Breadcrumb', group: 'Navigation', description: 'Shows where the current page sits.', plain: true },
  { name: 'pagination', title: 'Pagination', group: 'Navigation', description: 'Page through long lists, with links or buttons and announced page changes.', uses: ['announce'] },
  { name: 'collapsible', title: 'Collapsible', group: 'Navigation', description: 'Single section that expands and collapses.' },
  { name: 'skip-link', title: 'Skip link', group: 'Navigation', description: 'Hidden until focused; jumps the keyboard past the header to the main content.', plain: true },
  { name: 'nav-list', title: 'Nav list', group: 'Navigation', description: 'List of links or buttons with an active slab, vertical or horizontal. The first letter of each item is strong.', plain: true },
  { name: 'menubar', title: 'Menubar', group: 'Navigation', description: 'Row of menus, like an app menu bar.' },
  { name: 'navigation-menu', title: 'Navigation menu', group: 'Navigation', description: 'Site navigation with flyout panels.' },
  { name: 'stepper', title: 'Stepper', group: 'Navigation', description: 'Steps through a multi-step flow: interactive or read-only, horizontal or vertical, with error and done states.', uses: ['announce'] },
  { name: 'toolbar', title: 'Toolbar', group: 'Navigation', description: 'Grouped buttons and toggles with roving keyboard focus.' },
  { name: 'tree', title: 'Tree', group: 'Navigation', description: 'Expandable hierarchy for files and categories.' },

  { name: 'scroll-area', title: 'Scroll area', group: 'Data', description: 'Scrollable region with a styled scrollbar.' },
  { name: 'empty-state', title: 'Empty state', group: 'Data', description: 'Calm tinted placeholder for when there is nothing to show yet.', plain: true, uses: ['announce'] },
  { name: 'description-list', title: 'Description list', group: 'Data', description: 'Label and value rows, ruled apart, for facts about one thing.', uses: ['badge'], plain: true },
  { name: 'carousel', title: 'Carousel', group: 'Data', description: 'Scroll-snapping slides with previous, next and dots.', plain: true },
  { name: 'chart', title: 'Chart', group: 'Data', description: 'Line, area and bar charts drawn in SVG from the theme tokens.', plain: true },
  { name: 'list', title: 'List', group: 'Data', description: 'One-tab-stop list with arrow keys and typeahead, for choosing a row or marking the current one.', plain: true },
  { name: 'virtual-list', title: 'Virtual list', group: 'Data', description: 'Draws only the rows in view, for lists of tens of thousands of items.', plain: true },
  { name: 'data-table', title: 'Data table', group: 'Data', description: 'A quiet captioned table for any data. Opt in to sort, search, filters, resizing, a column menu, selection and paging; also server mode, windowing and cards on narrow screens.', uses: ['pagination', 'popover', 'checkbox', 'button', 'announce'], plain: true },
  { name: 'resizable', title: 'Resizable', group: 'Data', description: 'Split panes with a draggable handle.' },
]
