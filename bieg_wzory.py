import re


RIEGEL_EXPONENT = 1.06


def parse_time_to_seconds(time_str: str) -> int:
    pattern = r"^\s*(?:(\d+)h)?(\d+)m(\d+)s\s*$"
    match = re.fullmatch(pattern, time_str)
    if not match:
        raise ValueError("Niepoprawny format czasu.")

    hours_raw, minutes_raw, seconds_raw = match.groups()
    hours = int(hours_raw) if hours_raw is not None else 0
    minutes = int(minutes_raw)
    seconds = int(seconds_raw)
    if minutes >= 60 or seconds >= 60:
        raise ValueError("Minuty i sekundy muszą być mniejsze niż 60.")

    return hours * 3600 + minutes * 60 + seconds


def format_seconds_to_hms(total_seconds: int) -> str:
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{hours}h{minutes}m{seconds}s"


def predict_time_riegel(t1_seconds: int, d1_km: float, d2_km: float) -> int:
    predicted_seconds = t1_seconds * (d2_km / d1_km) ** RIEGEL_EXPONENT
    return round(predicted_seconds)


def read_positive_float(prompt: str) -> float:
    while True:
        raw = input(prompt).strip().replace(",", ".")
        try:
            value = float(raw)
            if value <= 0:
                print("Podaj liczbę większą od zera.")
                continue
            return value
        except ValueError:
            print("Niepoprawna liczba. Spróbuj ponownie.")


def main() -> None:
    print("=== Kalkulator czasu biegu (wzór Riegla) ===")
    print("Instrukcja:")
    print("- Podaj czas bazowy w formacie: XhXmXs lub XmXs")
    print("  (np. 1h45m30s albo 45m30s)")
    print("- Podaj dystans bazowy (km), na którym uzyskałeś ten czas")
    print("- Podaj dystans docelowy (km), dla którego chcesz prognozę")
    print()

    while True:
        time_input = input("Czas bazowy [XhXmXs lub XmXs]: ")
        try:
            t1_seconds = parse_time_to_seconds(time_input)
            break
        except ValueError as error:
            print(f"Błąd: {error} Popraw i spróbuj ponownie.")

    d1_km = read_positive_float("Dystans bazowy [km]: ")
    d2_km = read_positive_float("Dystans docelowy [km]: ")

    predicted = predict_time_riegel(t1_seconds, d1_km, d2_km)

    print()
    print("=== Wynik prognozy ===")
    print(f"Czas bazowy:      {format_seconds_to_hms(t1_seconds)}")
    print(f"Dystans bazowy:   {d1_km:.2f} km")
    print(f"Dystans docelowy: {d2_km:.2f} km")
    print(f"Przewidywany czas: {format_seconds_to_hms(predicted)}")
    print(f"(wg wzoru Riegla: T2 = T1 * (D2/D1)^{RIEGEL_EXPONENT})")


if __name__ == "__main__":
    main()
