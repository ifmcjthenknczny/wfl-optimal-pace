import math

def calculate_wfl_run_time(distance_km):
    if distance_km <= 0:
        return 0.0

    catcher_car_schedule = [
        (30, 14.0),
        (30, 15.0),
        (30, 16.0),
        (30, 17.0),
        (30, 18.0),
        (30, 22.0),
        (30, 26.0),
        (150, 30.0),
    ]

    runner_time_min = 30.0
    car_distance_km = 0.0
    car_moving_time_min = 0.0

    for stage_duration_min, speed_kmh in catcher_car_schedule:
        distance_in_stage = speed_kmh * (stage_duration_min / 60.0)

        if car_distance_km + distance_in_stage >= distance_km:
            distance_needed_in_stage = distance_km - car_distance_km
            if speed_kmh <= 0:
                return None
            time_needed_in_stage_min = (distance_needed_in_stage / speed_kmh) * 60.0
            car_moving_time_min += time_needed_in_stage_min
            runner_time_min += time_needed_in_stage_min
            return runner_time_min
        else:
            car_distance_km += distance_in_stage
            car_moving_time_min += stage_duration_min
            runner_time_min += stage_duration_min

    print(f"Ostrzeżenie: Podany dystans ({distance_km} km) wykracza poza zdefiniowany harmonogram.")
    last_stage_duration, last_speed = catcher_car_schedule[-1]
    remaining_distance = distance_km - car_distance_km
    if last_speed > 0:
       additional_time_min = (remaining_distance / last_speed) * 60.0
       runner_time_min += additional_time_min
       return runner_time_min
    else:
       return None


def format_pace(pace_min_km):
    if pace_min_km is None or pace_min_km < 0:
        return "N/A"
    minutes = int(pace_min_km)
    seconds = int(round((pace_min_km - minutes) * 60))
    if seconds == 60:
        minutes += 1
        seconds = 0
    return f"{minutes:02d}:{seconds:02d}"

def format_time(time_min):
    if time_min is None or time_min < 0:
        return "N/A"
    total_seconds = int(round(time_min * 60))
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


if __name__ == "__main__":
    print("Kalkulator tempa dla Wings for Life")
    print("----------------------------------")
    print("Podaj dystans, który udało Ci się przebiec.")
    print("Pamiętaj, że harmonogram prędkości Samochodu Pościgowego bazuje na edycji 2024.")

    while True:
        try:
            distance_str = input("Podaj dystans w kilometrach (np. 15.5): ")
            distance = float(distance_str.replace(',', '.'))
            if distance < 0:
                print("Dystans nie może być ujemny.")
            else:
                break
        except ValueError:
            print("Nieprawidłowa wartość. Podaj liczbę.")

    total_time_min = calculate_wfl_run_time(distance)

    if distance > 0 and total_time_min is not None and total_time_min > 0:
        average_pace_min_km = total_time_min / distance
        print("\n--- Wyniki ---")
        print(f"Przebiegnięty dystans: {distance:.2f} km")
        print(f"Całkowity czas biegu: {format_time(total_time_min)}")
        print(f"Średnie tempo: {format_pace(average_pace_min_km)} min/km")
    elif distance == 0:
        print("\n--- Wyniki ---")
        print(f"Przebiegnięty dystans: 0.00 km")
        print(f"Całkowity czas biegu: 00:00:00")
        print(f"Średnie tempo: N/A")
    else:
         print("\nNie udało się obliczyć czasu dla podanego dystansu (może być zbyt duży dla harmonogramu lub wystąpił błąd).")