# Create or Update Records in ServiceNow

## Overview
This script provides a template for implementing an "upsert" operation in ServiceNow - either updating an existing record or creating a new one if it doesn't exist. This pattern is commonly used when you need to ensure a record exists with specific values without creating duplicates.

## Basic Usage

```javascript
var grTABLE = new GlideRecord('TABLENAME');
grTABLE.addEncodedQuery(QUERY);
grTABLE.query();

if (grTABLE.next()) {  // update
    grTABLE.COL = VAL;
    grTABLE.update();
} else {  // insert
    grTABLE.initialize();
    grTABLE.COL = VAL;
    grTABLE.insert();
}
```

## Practical Examples

### Example 1: Managing Configuration Items

```javascript
var grCI = new GlideRecord('cmdb_ci_server');
grCI.addEncodedQuery('serial_number=ABC123');
grCI.query();

if (grCI.next()) {
    // Update existing server record
    grCI.os_version = 'Windows Server 2022';
    grCI.ip_address = '192.168.1.100';
    grCI.update();
} else {
    // Create new server record
    grCI.initialize();
    grCI.serial_number = 'ABC123';
    grCI.name = 'PROD-SERVER-01';
    grCI.os_version = 'Windows Server 2022';
    grCI.ip_address = '192.168.1.100';
    grCI.insert();
}
```

### Example 2: With Business Rule Control

```javascript
var grIncident = new GlideRecord('incident');
grIncident.addEncodedQuery('number=INC0010001');
grIncident.query();

if (grIncident.next()) {
    // Disable business rules and workflow
    grIncident.setWorkflow(false);
    grIncident.autoSysFields(false);
    
    grIncident.state = 2; // In Progress
    grIncident.assignment_group = 'Service Desk';
    grIncident.assigned_to = 'abel.tuter';
    grIncident.update();
}
```

## Advanced Features

### Workflow Control
- `setWorkflow(false)`: Prevents business rules and workflows from triggering
- `autoSysFields(false)`: Prevents system fields from being automatically updated

### Error Handling

```javascript
var grUser = new GlideRecord('sys_user');
grUser.addEncodedQuery('email=john.doe@example.com');
grUser.query();

if (grUser.next()) {
    grUser.title = 'Senior Developer';
    if (!grUser.update()) {
        gs.error('Failed to update user record: ' + grUser.number);
        return false;
    }
} else {
    grUser.initialize();
    grUser.email = 'john.doe@example.com';
    grUser.title = 'Senior Developer';
    if (!grUser.insert()) {
        gs.error('Failed to create user record');
        return false;
    }
}
```

## Best Practices

1. **Query Validation**
   - Always verify your query returns the expected records
   - Use appropriate encoded queries for complex conditions
   - Consider using `setLimit(1)` if you only need one record

2. **Performance Considerations**
   - Use indexes when querying large tables
   - Consider batch processing for multiple records
   - Be mindful of business rule impact

3. **Security**
   - Verify user permissions before operations
   - Use ACLs appropriately
   - Consider data sensitivity

4. **Maintenance**
   - Add appropriate comments and documentation
   - Log important operations
   - Include error handling

## Common Issues and Solutions

### Issue: Duplicate Records
```javascript
// Check for existing records before insert
var grCheck = new GlideRecord('your_table');
grCheck.addQuery('unique_field', value);
grCheck.query();
if (!grCheck.hasNext()) {
    // Safe to insert
}
```

### Issue: Record Locking
```javascript
// Handle record locks gracefully
if (!grTABLE.update()) {
    if (grTABLE.isValidRecord() && grTABLE.isLocked()) {
        gs.warn('Record is locked: ' + grTABLE.number);
        // Implement retry logic or alternative processing
    }
}
```

## Related Resources
- [ServiceNow GlideRecord API Documentation](https://developer.servicenow.com/dev.do#!/reference/api/tokyo/server/no-namespace/c_GlideRecordAPI)
- [ServiceNow Best Practices Guide](https://developer.servicenow.com/dev.do#!/guides/tokyo/now-platform/tpb-guide/scripting_best_practices)
