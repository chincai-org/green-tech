class Timer {
    /**
     * Creates a Timer instance.
     * @param {number} seconds - The duration of the timer in seconds.
     */
    constructor(timeMs) {
        this.duration = timeMs;
        this.startTime = Date.now();
    }

    /**
     * Checks whether the timer has reached 0.
     * If the timer has expired, it resets and returns true.
     * @returns {boolean} - True if the timer expired, otherwise false.
     */
    check() {
        const elapsed = Date.now() - this.startTime;

        if (elapsed >= this.duration) {
            this.reset();
            return true;
        } else {
            return false;
        }
    }

    reset(duration = this.duration) {
        this.duration = duration;
        this.startTime = Date.now();
    }
}
