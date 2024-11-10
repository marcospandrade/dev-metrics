export class FibonacciHelpers {
    static closestFibonacci(n: number): number {
        if (n < 0) throw new Error('Input must be a non-negative integer');
        if (n < 0.8) return 0.5;

        // Edge cases for 0 and 1
        if (n === 0) return 0;
        if (n === 1) return 1;

        // Generate Fibonacci sequence up to the target number
        let a = 0,
            b = 1;
        while (b <= n) {
            const next = a + b;
            a = b;
            b = next;
        }

        // 'a' is now the largest Fibonacci number <= n
        // 'b' is the smallest Fibonacci number > n
        return n - a < b - n ? +a : +b;
    }
}
