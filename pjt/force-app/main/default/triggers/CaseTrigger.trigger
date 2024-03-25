trigger CaseTrigger on Case (after insert, after update, after delete, before insert) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            CaseTriggerHandler.countNewCases(Trigger.new);
        }
        if (Trigger.isUpdate) {
            CaseTriggerHandler.countCases(Trigger.new, Trigger.oldMap);
        }
        if (Trigger.isDelete) {
            CaseTriggerHandler.countOldCases(Trigger.old);
        }
    }
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            CaseTriggerHandler.autocompleteAccountName(Trigger.new);
        }
    }
}