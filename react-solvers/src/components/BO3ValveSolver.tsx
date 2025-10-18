import React, { useState } from 'react';

type ValveLocation = 'department_store' | 'supply_depot' | 'armory' | 'infirmary' | 'tank_factory' | 'dragon_command';

type ValveConfig = [number | undefined, number | undefined, number | undefined, number | undefined, number | undefined, number | undefined];

type LocationToConfigMap = Partial<Record<ValveLocation, ValveConfig>>;
type ValveLegend = Record<ValveLocation, LocationToConfigMap>;

const valve_legend: ValveLegend = {
    department_store: {
        supply_depot: [1, undefined, 2, 3, 1, 1],
        armory: [3, 2, undefined, 2, 2, 3],
        infirmary: [3, 2, 2, undefined, 1, 1],
        tank_factory: [2, 2, 2, 3, undefined, 1],
        dragon_command: [2, 1, 1, 2, 3, undefined],
    },
    supply_depot: {
        department_store: [undefined, 1, 3, 2, 3, 3],
        armory: [3, 2, undefined, 2, 2, 3],
        infirmary: [3, 2, 2, undefined, 1, 1],
        tank_factory: [2, 2, 2, 3, undefined, 1],
        dragon_command: [2, 1, 1, 2, 3, undefined],
    },
    armory: {
        department_store: [undefined, 3, 1, 3, 1, 2],
        supply_depot: [3, undefined, 2, 1, 1, 1],
        infirmary: [2, 1, 2, undefined, 2, 2],
        tank_factory: [2, 3, 3, 3, undefined, 1],
        dragon_command: [2, 1, 3, 2, 2, undefined],
    },
    infirmary: {
        department_store: [undefined, 3, 3, 3, 3, 1],
        supply_depot: [1, undefined, 2, 3, 2, 2],
        armory: [1, 1, undefined, 2, 2, 2],
        tank_factory: [1, 3, 1, 3, undefined, 2],
        dragon_command: [3, 2, 2, 2, 2, undefined],
    },
    tank_factory: {
        department_store: [undefined, 2, 3, 3, 1, 1],
        supply_depot: [1, undefined, 1, 3, 1, 2],
        armory: [3, 2, undefined, 1, 1, 1],
        infirmary: [3, 2, 2, undefined, 2, 3],
        dragon_command: [1, 1, 1, 1, 1, undefined],
    },
    dragon_command: {
        department_store: [undefined, 2, 2, 1, 1, 1],
        supply_depot: [2, undefined, 1, 2, 3, 2],
        armory: [1, 3, undefined, 1, 1, 1],
        infirmary: [2, 3, 3, undefined, 3, 1],
        tank_factory: [1, 3, 1, 1, undefined, 3],
    },
};

function get_valve_list(valve_legend: ValveLegend, greenValve: ValveLocation, pinkValue: ValveLocation): ValveConfig | undefined {
    return valve_legend[greenValve][pinkValue];
}

function format_list_as_str(list_of_correct_vals: ValveConfig | undefined): string {
    let result = '';
    let loc_name;

    if (list_of_correct_vals === undefined) {
        return 'List of correct values is undefined. Please try again.';
    }

    for (let i = 0; i < list_of_correct_vals.length; i++) {
        if (list_of_correct_vals[i] === undefined || list_of_correct_vals[i] === 0) {
            continue;
        }

        if (i === 0) {
            loc_name = 'Department Store';
        } else if (i === 1) {
            loc_name = 'Supply Depot';
        } else if (i === 2) {
            loc_name = 'Armory';
        } else if (i === 3) {
            loc_name = 'Infirmary';
        } else if (i === 4) {
            loc_name = 'Tank Factory';
        } else if (i === 5) {
            loc_name = 'Dragon Command';
        }

        const value = list_of_correct_vals[i];
        if (value !== undefined && value > 3) {
            console.log('ERROR: Value for %s is greater than 3 (%s)', loc_name, value);
        }

        result += 'Set ' + loc_name + ' to: ' + list_of_correct_vals[i] + '\n';
    }

    return result.slice(0, -1);
}

export default function BO3ValveSolver() {
    const [greenValve, setGreenValve] = useState<ValveLocation>('department_store');
    const [pinkValve, setPinkValve] = useState<ValveLocation>('department_store');
    const [result, setResult] = React.useState<string>('');

    function handle_green_valve_change(e: React.ChangeEvent<HTMLSelectElement>) {
        const newGreenValve = e.target.value as ValveLocation;
        setGreenValve(newGreenValve);

        if (newGreenValve === pinkValve) {
            setResult("The Green and Pink Valves can't be the same.");
        } else {
            const list_of_valves = get_valve_list(valve_legend, newGreenValve, pinkValve);
            setResult(format_list_as_str(list_of_valves));
        }
    }

    function handle_pink_valve_change(e: React.ChangeEvent<HTMLSelectElement>) {
        const newPinkValve = e.target.value as ValveLocation;
        setPinkValve(newPinkValve);

        if (newPinkValve === greenValve) {
            setResult("The Green and Pink Valves can't be the same.");
        } else {
            const list_of_valves = get_valve_list(valve_legend, greenValve, newPinkValve);
            setResult(format_list_as_str(list_of_valves));
        }
    }

    return (
        <div className="solver-container">
            <h2>Gorod Valves Solver</h2>
            <label htmlFor="greenValve">
                <span style={{ color: 'lawngreen' }}>Select Green Light Valve:</span>
            </label>{' '}
            <select id="greenValve" className="solver-symbol-select" value={greenValve} onChange={handle_green_valve_change}>
                <option value="department_store">Department Store</option>
                <option value="supply_depot">Supply Depot</option>
                <option value="armory">Armory</option>
                <option value="infirmary">Infirmary</option>
                <option value="tank_factory">Tank Factory</option>
                <option value="dragon_command">Dragon Command</option>
            </select>
            <br />
            <label htmlFor="pinkValve">
                <span style={{ color: 'deeppink' }}>Select Pink Cylinder Valve:</span>
            </label>{' '}
            <select id="pinkValve" className="solver-symbol-select" value={pinkValve} onChange={handle_pink_valve_change}>
                <option value="department_store">Department Store</option>
                <option value="supply_depot">Supply Depot</option>
                <option value="armory">Armory</option>
                <option value="infirmary">Infirmary</option>
                <option value="tank_factory">Tank Factory</option>
                <option value="dragon_command">Dragon Command</option>
            </select>
            <div>
                <p className="solver-output" id="result">
                    {result.split('\n').map((line, i) => (
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
