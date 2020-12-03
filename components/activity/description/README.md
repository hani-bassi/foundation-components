# d2l-activity-description

Shows a description of an activity. **Currently does not have a default.**

# d2l-activity-description-editor

Provides a textarea for editing activitity descriptions. Updates to the
textarea are only reflected in the state and are not saved until the state
has been pushed.

## Example
```html
<d2l-activity-description-editor href="${this.href}" .token="${this.token}"></d2l-activity-description-editor>
```

## Custom

### `d2l-activity-description-course`

Shows the description of the linked `organization`.

**Classes matched:** `activity-usage` AND `course-offering`

### `d2l-activity-description-learning-path`

Shows the description of the linked `specialization`.

**Classes matched:** `activity-usage` AND `learning-path`
