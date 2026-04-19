import React from "react";

type DialIndex = 0 | 1 | 2 | 3;
type DialValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const DIAL_NAMES = ["Yellow", "Orange", "Blue", "Purple"] as const;
const DIAL_COLORS: Record<string, string> = {
    Yellow: "#f5c400",
    Orange: "#e87500",
    Blue: "#1a7fc4",
    Purple: "#8b2fc9",
};
const TARGET: [number, number, number, number] = [2, 7, 4, 6];

type Solution = {
    presses: [number, number, number, number];
    total: number;
} | null;

function solve(init: [number, number, number, number]): Solution {
    let best: [number, number, number, number] | null = null;
    let bestTotal = Infinity;

    for (let y = 0; y < 10; y++)
        for (let o = 0; o < 10; o++)
            for (let b = 0; b < 10; b++)
                for (let p = 0; p < 10; p++) {
                    const r0 = (init[0] + y + o) % 10;
                    const r1 = (init[1] + y + o + b) % 10;
                    const r2 = (init[2] + o + b + p) % 10;
                    const r3 = (init[3] + b + p) % 10;

                    if (r0 === TARGET[0] && r1 === TARGET[1] && r2 === TARGET[2] && r3 === TARGET[3]) {
                        const total = y + o + b + p;
                        if (total < bestTotal) {
                            bestTotal = total;
                            best = [y, o, b, p];
                        }
                    }
                }

    return best ? { presses: best, total: bestTotal } : null;
}

function formatResult(solution: Solution): string {
    if (!solution) return "No solution found.";
    if (solution.total === 0) return "Dials are already at the correct position!";

    const lines = solution.presses
        .map((p, i) => (p > 0 ? `Turn ${DIAL_NAMES[i]}: ${p} time${p !== 1 ? "s" : ""}` : null))
        .filter(Boolean);

    return lines.join("\n") + `\nTotal turns: ${solution.total}`;
}

export default function BO1DialSolver() {
    const [dials, setDials] = React.useState<[number, number, number, number]>([0, 0, 0, 0]);
    const [result, setResult] = React.useState<string>(formatResult(solve([0, 0, 0, 0])));

    function handleDialChange(index: DialIndex, value: string) {
        const parsed = parseInt(value);
        if (isNaN(parsed) || parsed < 0 || parsed > 9) return;

        const newDials: [number, number, number, number] = [...dials] as [number, number, number, number];
        newDials[index] = parsed as DialValue;
        setDials(newDials);
        setResult(formatResult(solve(newDials)));
    }

    return (
        <div className="solver-container">
            <p className="solver-instructions">
                Set each dial to its current in-game value (0–9). The solver will calculate the minimum number of turns
                required to reach <strong>2-7-4-6</strong>.
            </p>

            {DIAL_NAMES.map((name, i) => (
                <div className="form-row" key={name}>
                    <label htmlFor={`dial-${name}`}>
                        <span
                            style={{
                                display: "inline-block",
                                width: "0.75em",
                                height: "0.75em",
                                borderRadius: "50%",
                                backgroundColor: DIAL_COLORS[name],
                                marginRight: "0.4em",
                                verticalAlign: "middle",
                            }}
                            aria-hidden="true"
                        />
                        {name} Dial (current value):
                    </label>
                    <select
                        id={`dial-${name}`}
                        value={dials[i]}
                        onChange={(e) => handleDialChange(i as DialIndex, e.target.value)}
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <div className="solver-output" id="result" role="status" aria-live="polite">
                <p>
                    {result.split("\n").map((line, i) => (
                        <span key={i}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
}
