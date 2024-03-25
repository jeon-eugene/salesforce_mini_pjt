global class ScheduleAmountBatch implements Schedulable {
    global void execute(SchedulableContext SC) {
        AmountBatch batch = new AmountBatch();
        Database.executeBatch(batch);
    }

    public static void scheduleJob() {
        String cronExpr = '0 00 00 * * ?';   //차례대로 초, 분, 시, 매일, 모든 달, 요일에 관계없이 실행
        System.schedule('최근 90일 구매 금액 갱신', cronExpr, new ScheduleAmountBatch());
    }
}


//실행  : ScheduleAmountBatch.scheduleJob();