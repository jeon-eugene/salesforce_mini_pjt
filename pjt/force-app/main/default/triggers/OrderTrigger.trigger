trigger OrderTrigger on Order (before insert) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            OrderTriggerHandler.autocompleteAccountName(Trigger.new);
        }
    }
}