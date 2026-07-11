export class FormatDate {
    private readonly date: Date | null;

    constructor(isoDate?: string | Date | null) {
        if (!isoDate) {
            this.date = null;
            return;
        }

        const parsedDate = new Date(isoDate);

        this.date = Number.isNaN(parsedDate.getTime())
            ? null
            : parsedDate;
    }

    get dayMonth(): string {
        if (!this.date) {
            return "";
        }

        return `${this.month} / ${this.day}`;
    }

    get time() {
        if (!this.date) {
            return null;
        }

        let hours = this.date.getHours();
        const minutes = this.date.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";

        hours = hours % 12;
        hours = hours || 12;

        const formattedMinutes = minutes
            .toString()
            .padStart(2, "0");

        return {
            hours,
            minutes,
            ampm,
            formattedMinutes,
            formatted: `${hours}:${formattedMinutes} ${ampm}`,
        };
    }

    get day(){
        if (!this.date) {
            return "";
        }

        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
        }).format(this.date);
    }

    get month(){
        if (!this.date) {
            return "";
        }

        return new Intl.DateTimeFormat("en-US", {
            month: "2-digit",
        }).format(this.date);
    }

    get year(): string {
        if (!this.date) {
            return "";
        }

        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
        }).format(this.date);
    }

    get time24(): string {
        if (!this.date) {
            return "";
        }

        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
            .format(this.date)
            .replace(",", "");
    }

    get time12(): string {
        if (!this.date) {
            return "";
        }

        let hours = this.date.getHours();
        const minutes = this.date.getMinutes();

        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours || 12;

        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    static differenceInHours(
        start?: string | Date | null,
        end?: string | Date | null,
    ): number {
        if (!start || !end) {
            return 0;
        }

        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();

        if (
            Number.isNaN(startTime) ||
            Number.isNaN(endTime)
        ) {
            return 0;
        }

        const hours =
            (endTime - startTime) / (1000 * 60 * 60);

        return Number(hours.toFixed(2));
    }
}