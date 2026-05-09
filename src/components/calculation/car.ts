type CatcherCarSchedule = {
    stageDurationMinutes: number, speedKmH: number
}[]

const calculateWflNetCatchTime = (distanceKm: number, runnerStartDelayMinutes: number): number | null => {
    if (distanceKm <= 0) {
        return 0;
    }

    const catcherCarSchedule: CatcherCarSchedule = [
        { stageDurationMinutes: 30, speedKmH: 14 },
        { stageDurationMinutes: 30, speedKmH: 15 },
        { stageDurationMinutes: 30, speedKmH: 16 },
        { stageDurationMinutes: 30, speedKmH: 17 },
        { stageDurationMinutes: 30, speedKmH: 18 },
        { stageDurationMinutes: 30, speedKmH: 22 },
        { stageDurationMinutes: 30, speedKmH: 26 },
        { stageDurationMinutes: 180, speedKmH: 30 },
    ];

    let netRunnerTimeMinutes = 30 - runnerStartDelayMinutes;
    let carDistanceKm = 0;

    for (const stage of catcherCarSchedule) {
        const stageDistance = stage.speedKmH * (stage.stageDurationMinutes / 60.0);

        if (carDistanceKm + stageDistance >= distanceKm) {
            const stageDistanceNeeded = distanceKm - carDistanceKm;
            if (stage.speedKmH <= 0) {
                return null;
            }
            const stageTimeNeededMinutes = (stageDistanceNeeded / stage.speedKmH) * 60.0;
            netRunnerTimeMinutes += stageTimeNeededMinutes;
            return netRunnerTimeMinutes;
        }

        carDistanceKm += stageDistance;
        netRunnerTimeMinutes += stage.stageDurationMinutes;
    }

    const lastSpeed = catcherCarSchedule[catcherCarSchedule.length - 1].speedKmH;
    const remainingDistance = distanceKm - carDistanceKm;

    if (lastSpeed > 0) {
        const additionalTimeMinutes = (remainingDistance / lastSpeed) * 60.0;
        netRunnerTimeMinutes += additionalTimeMinutes;
        return netRunnerTimeMinutes;
    }

    return null;
};

export default calculateWflNetCatchTime;