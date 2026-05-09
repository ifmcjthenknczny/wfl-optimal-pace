export const formatTime = (timeSeconds: number) => {
    const hours = Math.floor(timeSeconds / 3600);
    const minutes = Math.floor((timeSeconds % 3600) / 60);
    const seconds = timeSeconds % 60;
    return `${hours}:${minutes}:${seconds}`;
}

export const calculatePace = (timeMinutes: number, distanceKms: number) => {
    return timeMinutes / distanceKms;
}