# Delete Multiple Records in ServiceNow

## Overview
The `deleteMultiple()` operation provides an efficient way to delete multiple records that match specific criteria in ServiceNow. This method is more performant than deleting records individually in a loop.

## Basic Usage

```javascript
var gr = new GlideRecord('u_exceptions');
gr.addEncodedQuery('active=false');
gr.deleteMultiple();
```

## Practical Examples

### Example 1: Delete Old Records with Age Check

```javascript
var grIncident = new GlideRecord('incident');
// Delete resolved incidents older than 90 days
grIncident.addEncodedQuery('state=6^resolved_atRELATIVELE@dayofweek@ago@90');
grIncident.query();
var count = grIncident.getRowCount();
gs.info('Deleting ' + count + ' old incidents');
grIncident.deleteMultiple();
```

### Example 2: Batch Delete with Progress Tracking

```javascript
function batchDelete(tableName, query, batchSize) {
    var totalDeleted = 0;
    var gr = new GlideRecord(tableName);
    gr.addEncodedQuery(query);
    gr.setLimit(batchSize);
    
    while (true) {
        gr.query();
        if (!gr.hasNext()) {
            break;
        }
        
        var count = gr.getRowCount();
        gr.deleteMultiple();
        totalDeleted += count;
        
        gs.info('Deleted batch of ' + count + ' records. Total deleted: ' + totalDeleted);
    }
    
    return totalDeleted;
}

// Usage
var deleted = batchDelete('incident', 'state=7^sys_created_onRELATIVELE@dayofweek@ago@365', 1000);
gs.info('Total records deleted: ' + deleted);
```

## Advanced Features

### Pre-delete Validation

```javascript
var gr = new GlideRecord('incident');
gr.addEncodedQuery('state=7^closed_atRELATIVELE@dayofweek@ago@90');
gr.query();

while (gr.next()) {
    // Check for related records before deletion
    var relatedCount = new GlideAggregate('task');
    relatedCount.addQuery('parent', gr.sys_id);
    relatedCount.addActiveQuery();
    relatedCount.query();
    
    if (relatedCount.getCount() > 0) {
        gs.warn('Skipping deletion of incident ' + gr.number + ' due to active child tasks');
        continue;
    }
    
    gr.deleteRecord();
}
```

### Error Handling and Logging

```javascript
function safeDeleteMultiple(table, query) {
    try {
        var gr = new GlideRecord(table);
        gr.addEncodedQuery(query);
        gr.query();
        var count = gr.getRowCount();
        
        if (count > 1000) {
            gs.warn('Attempting to delete ' + count + ' records. Consider batch processing.');
        }
        
        var success = gr.deleteMultiple();
        if (!success) {
            gs.error('Failed to delete records from ' + table);
            return false;
        }
        
        gs.info('Successfully deleted ' + count + ' records from ' + table);
        return true;
    } catch (ex) {
        gs.error('Error deleting records: ' + ex.message);
        return false;
    }
}
```

## Best Practices

1. **Pre-deletion Checks**
   - Always verify the query returns expected records
   - Consider archiving data before deletion
   - Check for dependent records

2. **Performance Considerations**
   - Use batch processing for large deletions
   - Consider database load during peak hours
   - Monitor system resources

3. **Security**
   - Verify user permissions
   - Log deletion operations
   - Consider audit requirements

4. **Data Integrity**
   - Check for referential integrity
   - Consider soft deletes where appropriate
   - Maintain audit trails

## Common Issues and Solutions

### Issue: Timeout with Large Deletions
```javascript
// Solution: Use batch processing
function batchDeleteWithTimeout(table, query, batchSize) {
    var gr = new GlideRecord(table);
    gr.addEncodedQuery(query);
    gr.setLimit(batchSize);
    gr.query();
    
    if (gr.hasNext()) {
        gr.deleteMultiple();
        // Schedule next batch
        gs.schedule('Delete Next Batch', 'batchDeleteWithTimeout', table, query, batchSize);
    }
}
```

### Issue: Locked Records
```javascript
// Solution: Skip locked records and retry
function deleteWithLockCheck(table, query) {
    var gr = new GlideRecord(table);
    gr.addEncodedQuery(query);
    gr.query();
    
    var skipped = [];
    while (gr.next()) {
        if (gr.isLocked()) {
            skipped.push(gr.sys_id.toString());
            continue;
        }
        gr.deleteRecord();
    }
    
    return skipped; // Return skipped records for retry
}
```

## Related Resources
- [ServiceNow DeleteMultiple API Documentation](https://developer.servicenow.com/dev.do#!/reference/api/tokyo/server/no-namespace/c_GlideRecordAPI#r_GlideRecord-deleteMultiple)
- [Best Practices for Data Cleanup](https://developer.servicenow.com/dev.do#!/guides/tokyo/now-platform/tpb-guide/data-cleanup)
- [ServiceNow Performance Best Practices](https://developer.servicenow.com/dev.do#!/guides/tokyo/now-platform/tpb-guide/performance_best_practices)
