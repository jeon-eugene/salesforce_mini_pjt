global class ScheduleLevelDecisionBatch implements Schedulable {
    global void execute(SchedulableContext SC) {
        LevelDecisionBatch batch = new LevelDecisionBatch();
        Database.executeBatch(batch);   
    }

    public static void scheduleJob() {
        String cronExpr = '0 01 00 1 * ?'; //차례대로 초, 분, 시, 일, 달, 요일
        System.schedule('등급 갱신', cronExpr, new ScheduleLevelDecisionBatch());
    }
}
//실행 : ScheduleLevelDecisionBatch.scheduleJob();