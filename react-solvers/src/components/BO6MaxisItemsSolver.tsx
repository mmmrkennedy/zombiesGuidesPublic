import React from 'react';

type FileValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type SamFile = {
    file_number: number;
    name: string;
    date: string;
    order: number;
};

type FileNumber = 'file1' | 'file2' | 'file3' | 'file4';

const samFiles: SamFile[] = [
    { file_number: 6, name: 'BND Badge', date: '6/28/1985', order: 1 },
    { file_number: 1, name: "Notso's Collar", date: '7/15/1985', order: 2 },
    { file_number: 3, name: 'Scarf', date: '8/21/1985', order: 3 },
    { file_number: 4, name: 'Wristwatch', date: '9/2/1985', order: 4 },
    { file_number: 5, name: 'Combat Goggles', date: '10/12/1985', order: 5 },
    { file_number: 2, name: 'Katana', date: '12/8/1985', order: 6 },
];

function sort_files(updatedFiles: FileValue[]) {
    // Check if all files are selected (using updated values)
    if (updatedFiles.every(file => file !== 0)) {
        // Get the selected files
        const selectedFiles: SamFile[] = [];

        for (const num of updatedFiles) {
            const file = samFiles.find(file => file.file_number === num);
            if (file) {
                selectedFiles.push(file);
            }
        }

        // Sort by chronological order (order property)
        selectedFiles.sort((a, b) => a.order - b.order);

        // Create the 4-digit number from chronologically sorted files
        return 'Code: ' + selectedFiles.map(file => file.file_number).join('');
    } else {
        return 'Select 4 files...';
    }
}

export default function BO6MaxisItemsSolver() {
    const [file1, setFile1] = React.useState<FileValue>(0);
    const [file2, setFile2] = React.useState<FileValue>(0);
    const [file3, setFile3] = React.useState<FileValue>(0);
    const [file4, setFile4] = React.useState<FileValue>(0);
    const [result, setResult] = React.useState<string>('Select 4 files...');

    function handle_file_select_change(e: React.ChangeEvent<HTMLSelectElement>) {
        const selected_file_value = Number(e.target.value) as FileValue;
        const selected_file_number = e.target.id as FileNumber;

        let updatedFiles: FileValue[];

        if (selected_file_number === 'file1') {
            setFile1(selected_file_value);
            updatedFiles = [selected_file_value, file2, file3, file4];
        } else if (selected_file_number === 'file2') {
            setFile2(selected_file_value);
            updatedFiles = [file1, selected_file_value, file3, file4];
        } else if (selected_file_number === 'file3') {
            setFile3(selected_file_value);
            updatedFiles = [file1, file2, selected_file_value, file4];
        } else if (selected_file_number === 'file4') {
            setFile4(selected_file_value);
            updatedFiles = [file1, file2, file3, selected_file_value];
        } else {
            return; // Should never happen
        }

        setResult(sort_files(updatedFiles));
    }

    function reset_maxis_solver() {
        setFile1(0);
        setFile2(0);
        setFile3(0);
        setFile4(0);
        setResult('Select 4 files...');
    }

    // Check if a value is already selected in another dropdown
    function isValueDisabled(value: FileValue, currentFile: FileNumber): boolean {
        // Value 0 ("Select file...") is never disabled
        if (value === 0) return false;

        // Check if the value is selected in any other dropdown
        const selectedValues: FileValue[] = [];
        if (currentFile !== 'file1') selectedValues.push(file1);
        if (currentFile !== 'file2') selectedValues.push(file2);
        if (currentFile !== 'file3') selectedValues.push(file3);
        if (currentFile !== 'file4') selectedValues.push(file4);

        return selectedValues.includes(value);
    }

    return (
        <div className="solver-container">
            <h3>S.A.M. Files Solver</h3>
            <p>Select 4 S.A.M. Files to get the file number combination.</p>

            <div>
                <label htmlFor="file1">File 1:</label>{' '}
                <select id="file1" className="solver" onChange={handle_file_select_change} value={file1}>
                    <option value="0">Select file...</option>
                    <option value="1" disabled={isValueDisabled(1, 'file1')}>
                        Notso's Collar (1)
                    </option>
                    <option value="2" disabled={isValueDisabled(2, 'file1')}>
                        Katana (2)
                    </option>
                    <option value="3" disabled={isValueDisabled(3, 'file1')}>
                        Scarf (3)
                    </option>
                    <option value="4" disabled={isValueDisabled(4, 'file1')}>
                        Wristwatch (4)
                    </option>
                    <option value="5" disabled={isValueDisabled(5, 'file1')}>
                        Combat Goggles (5)
                    </option>
                    <option value="6" disabled={isValueDisabled(6, 'file1')}>
                        BND Badge (6)
                    </option>
                </select>
            </div>

            <div>
                <label htmlFor="file2">File 2:</label>{' '}
                <select id="file2" className="solver" onChange={handle_file_select_change} value={file2}>
                    <option value="0">Select file...</option>
                    <option value="1" disabled={isValueDisabled(1, 'file2')}>
                        Notso's Collar (1)
                    </option>
                    <option value="2" disabled={isValueDisabled(2, 'file2')}>
                        Katana (2)
                    </option>
                    <option value="3" disabled={isValueDisabled(3, 'file2')}>
                        Scarf (3)
                    </option>
                    <option value="4" disabled={isValueDisabled(4, 'file2')}>
                        Wristwatch (4)
                    </option>
                    <option value="5" disabled={isValueDisabled(5, 'file2')}>
                        Combat Goggles (5)
                    </option>
                    <option value="6" disabled={isValueDisabled(6, 'file2')}>
                        BND Badge (6)
                    </option>
                </select>
            </div>

            <div>
                <label htmlFor="file3">File 3:</label>{' '}
                <select id="file3" className="solver" onChange={handle_file_select_change} value={file3}>
                    <option value="0">Select file...</option>
                    <option value="1" disabled={isValueDisabled(1, 'file3')}>
                        Notso's Collar (1)
                    </option>
                    <option value="2" disabled={isValueDisabled(2, 'file3')}>
                        Katana (2)
                    </option>
                    <option value="3" disabled={isValueDisabled(3, 'file3')}>
                        Scarf (3)
                    </option>
                    <option value="4" disabled={isValueDisabled(4, 'file3')}>
                        Wristwatch (4)
                    </option>
                    <option value="5" disabled={isValueDisabled(5, 'file3')}>
                        Combat Goggles (5)
                    </option>
                    <option value="6" disabled={isValueDisabled(6, 'file3')}>
                        BND Badge (6)
                    </option>
                </select>
            </div>

            <div>
                <label htmlFor="file4">File 4:</label>{' '}
                <select id="file4" className="solver" onChange={handle_file_select_change} value={file4}>
                    <option value="0">Select file...</option>
                    <option value="1" disabled={isValueDisabled(1, 'file4')}>
                        Notso's Collar (1)
                    </option>
                    <option value="2" disabled={isValueDisabled(2, 'file4')}>
                        Katana (2)
                    </option>
                    <option value="3" disabled={isValueDisabled(3, 'file4')}>
                        Scarf (3)
                    </option>
                    <option value="4" disabled={isValueDisabled(4, 'file4')}>
                        Wristwatch (4)
                    </option>
                    <option value="5" disabled={isValueDisabled(5, 'file4')}>
                        Combat Goggles (5)
                    </option>
                    <option value="6" disabled={isValueDisabled(6, 'file4')}>
                        BND Badge (6)
                    </option>
                </select>
            </div>

            <button type="reset" className="btn-base solver-button" id="maxis-reset" onClick={reset_maxis_solver}>
                Clear
            </button>

            <div className="solver-output">
                <div id="maxis-results-container">{result}</div>
            </div>
        </div>
    );
}
