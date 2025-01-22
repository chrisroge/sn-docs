# ServiceNow GlideRecord Methods Guide

GlideRecord methods are fundamental to ServiceNow development, enabling you to query, insert, update, and delete records in your system. These methods are essential components of business rules, UI actions, and scheduled job scripts.

## Important Note
These methods are designed for server-side JavaScript (excluding client scripts and UI policies). Some methods can be used in client-side JavaScript and are noted accordingly.

## Basic Operations

### Query Records
```javascript
var gr = new GlideRecord('incident'); // Specify table to query
gr.addQuery('active', true);          // Optional: Add conditions
gr.query();                           // Execute the query
while (gr.next()) {                   // Iterate through results
    if (gr.category == 'software') {
        gs.log('Category is ' + gr.category);
    }
}
```

### Client-Side Asynchronous Query
```javascript
var gr = new GlideRecord('sys_user');
gr.addQuery('name', 'Joe Employee');
gr.query(myCallbackFunction);         // Execute with callback

function myCallbackFunction(gr) {
    while (gr.next()) {
        alert(gr.user_name);
    }
}
```

### Get Single Record
```javascript
// By sys_id (works client-side)
var gr = new GlideRecord('incident');
gr.get(sys_id_of_record_here);

// By field/value pair
var gr = new GlideRecord('incident');
if (gr.get('active', true)) {
    gs.log('Category is ' + gr.category);
}
```

### Get Referenced Record
```javascript
var caller = current.caller_id.getRefRecord();
caller.email = 'test@test.com';
caller.update();
```

## Advanced Queries

### OR Conditions
```javascript
// Method 1
var gr = new GlideRecord('incident');
var grOR = gr.addQuery('priority', 1);
grOR.addOrCondition('priority', 2);
gr.query();

// Method 2 (Chained)
var gr = new GlideRecord('incident');
gr.addQuery('priority', 1).addOrCondition('priority', 2);
gr.query();
```

### Insert Record
```javascript
var gr = new GlideRecord('incident');
gr.initialize();
gr.short_description = 'Network problem';
gr.category = 'software';
gr.caller_id.setDisplayValue('Joe Employee');
gr.insert();
```

### Update Records
```javascript
var gr = new GlideRecord('incident');
gr.addQuery('active', true);
gr.query();
while (gr.next()) {
    gr.active = false;
    gr.update();
}
```

### Delete Records
```javascript
// Delete individual records
var gr = new GlideRecord('incident');
gr.addQuery('active', false);
gr.query();
while (gr.next()) {
    gr.deleteRecord();
}

// Delete multiple records at once
var gr = new GlideRecord('incident');
gr.addQuery('active', false);
gr.deleteMultiple();
```

## Special Query Methods

### Encoded Queries
```javascript
var gr = new GlideRecord('incident');
var strQuery = 'active=true^category=software^ORcategory=hardware';
gr.addEncodedQuery(strQuery);
gr.query();
```

### GlideAggregate
Supports COUNT, SUM, MIN, MAX, and AVG operations:
```javascript
var gr = new GlideAggregate('incident');
gr.addQuery('active', true);
gr.addAggregate('COUNT');
gr.query();
if (gr.next()) {
    var incidents = gr.getAggregate('COUNT');
    gs.log('Active incident count: ' + incidents);
}
```

## Query Modifiers

### Sorting
```javascript
var gr = new GlideRecord('incident');
gr.addQuery('active', true);
gr.orderBy('category');           // Ascending
gr.orderByDesc('sys_created_on'); // Descending
gr.query();
```

### Null Queries
```javascript
// Find empty values
var gr = new GlideRecord('incident');
gr.addNullQuery('short_description');
gr.query();

// Find non-empty values
var gr = new GlideRecord('incident');
gr.addNotNullQuery('short_description');
gr.query();
```

### Result Management
```javascript
// Get result count
var gr = new GlideRecord('incident');
gr.addQuery('category', 'software');
gr.query();
gs.log('Incident count: ' + gr.getRowCount());

// Limit results
var gr = new GlideRecord('incident');
gr.orderByDesc('sys_created_on');
gr.setLimit(10);
gr.query();

// Choose specific window of results
var gr = new GlideRecord('incident');
gr.orderByDesc('sys_created_on');
gr.chooseWindow(10, 20);  // Rows 10-19
gr.query();
```

## Special Update Modifiers

### Workflow Control
```javascript
var gr = new GlideRecord('incident');
gr.addQuery('category', 'software');
gr.query();
while (gr.next()) {
    gr.category = 'hardware';
    gr.setWorkflow(false);    // Disable business rules
    gr.update();
}
```

### System Fields Control
```javascript
var gr = new GlideRecord('incident');
gr.addQuery('category', 'software');
gr.query();
while (gr.next()) {
    gr.category = 'hardware';
    gr.autoSysFields(false);  // Don't update sys fields
    gr.update();
}
```

### Force Update
```javascript
var gr = new GlideRecord('sys_user');
gr.query();
while (gr.next()) {
    gr.setWorkflow(false);
    gr.autoSysFields(false);
    gr.setForceUpdate(true);
    gr.update();
}
```

## Query Operators

| Operator | Description | Example |
|----------|-------------|---------|
| = | Equals | `addQuery('priority', '=', 3)` |
| > | Greater than | `addQuery('priority', '>', 3)` |
| < | Less than | `addQuery('priority', '<', 3)` |
| >= | Greater than or equal | `addQuery('priority', '>=', 3)` |
| <= | Less than or equal | `addQuery('priority', '<=', 3)` |
| != | Not equal | `addQuery('priority', '!=', 3)` |
| STARTSWITH | Begins with | `addQuery('short_description', 'STARTSWITH', 'Error')` |
| ENDSWITH | Ends with | `addQuery('short_description', 'ENDSWITH', 'Error')` |
| CONTAINS | Contains | `addQuery('short_description', 'CONTAINS', 'Error')` |
| DOES NOT CONTAIN | Doesn't contain | `addQuery('short_description', 'DOES NOT CONTAIN', 'Error')` |
| IN | In list | `addQuery('sys_id', 'IN', 'id1,id2')` |
| INSTANCEOF | Class type | `addQuery('sys_class_name', 'INSTANCEOF', 'cmdb_ci_computer')` |
