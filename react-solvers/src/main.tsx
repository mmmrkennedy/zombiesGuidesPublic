import React from 'react';
import ReactDOM from 'react-dom/client';
import '/css/global_solver.css';
import WW2HangmanSolver from './components/WW2HangmanSolver';
import WW2StatueSolver from './components/WW2StatueSolver';
import WW2HammerPuzzleSolver from './components/WW2HammerPuzzleSolver';
import BO6BeamsmasherMathSolver from './components/BO6BeamsmasherMathSolver';
import BO3ValveSolver from './components/BO3ValveSolver';
import BO6MaxisItemsSolver from './components/BO6MaxisItemsSolver';
import BO6PeriodicTableSolver from './components/BO6PeriodicTableSolver';
import BO6LetterboardSolver from './components/BO6LetterboardSolver';
import IWMahjongSolver from './components/IWMahjongSolver';
import IWMainQuestWordFilter from './components/IWMainQuestWordFilter';
import IWChemicalStepSolver from './components/IWChemicalStepSolver';
import IWGnSSkull4Solver from './components/IWGnSSkull4Solver';
import IWBeastEightQueensSolver from './components/IWBeastEightQueensSolver';
import IWBeastFloppySolver from './components/IWBeastFloppySolver';
import IWBeastVenomXMazeSolver from './components/IWBeastVenomXMazeSolver';
import IWBeastVenomXBoxSolver from './components/IWBeastVenomXBoxSolver';

/**
 * Mount functions - These allow you to embed React components anywhere in your HTML
 *
 * Usage in HTML:
 * <div id="statue-solver-1"></div>
 * <script>
 *   window.ZombiesSolvers.mountValveSolver(ID_OF_DIV_ABOVE);
 * </script>
 */
type MountFunction = (elementId: string) => void;

interface ZombiesSolvers {
    mountHangmanSolver: MountFunction;
    mountStatueSolver: MountFunction;
    mountHammerSolver: MountFunction;
    mountValveSolver: MountFunction;
    mountBeamsmasherSolver: MountFunction;
    mountMaxisItemsSolver: MountFunction;
    mountPeriodicTableSolver: MountFunction;
    mountLetterboardSolver: MountFunction;
    mountMahjongSolver: MountFunction;
    mountShaolinWordFilter: MountFunction;
    mountChemicalStepSolver: MountFunction;
    mountAttackGnSSkull4Solver: MountFunction;
    mountBeastGnSEightQueensSolver: MountFunction;
    mountBeastFloppyDiskSolver: MountFunction;
    mountBeastVenomXMazeSolver: MountFunction;
    mountBeastVenomXBoxSolver: MountFunction;
}

declare global {
    interface Window {
        ZombiesSolvers: ZombiesSolvers;
    }
}

// Global namespace for all solvers
window.ZombiesSolvers = {
    mountHangmanSolver(elementId: string) {
        console.log('Mounting WW2HangmanSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <WW2HangmanSolver />
            </React.StrictMode>
        );
        console.log('WW2HangmanSolver mounted successfully');
    },

    mountStatueSolver(elementId: string) {
        console.log('Mounting WW2StatueSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <WW2StatueSolver />
            </React.StrictMode>
        );
        console.log('WW2StatueSolver mounted successfully');
    },

    mountHammerSolver(elementId: string) {
        console.log('Mounting WW2HammerPuzzleSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <WW2HammerPuzzleSolver />
            </React.StrictMode>
        );
        console.log('WW2StatueSolver mounted successfully');
    },

    mountValveSolver(elementId: string) {
        console.log('Mounting ValveSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO3ValveSolver />
            </React.StrictMode>
        );
        console.log('ValveSolver mounted successfully');
    },

    mountBeamsmasherSolver(elementId: string) {
        console.log('Mounting BeamsmasherSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO6BeamsmasherMathSolver />
            </React.StrictMode>
        );
        console.log('BeamsmasherSolver mounted successfully');
    },

    mountMaxisItemsSolver(elementId: string) {
        console.log('Mounting BO6MaxisItemsSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO6MaxisItemsSolver />
            </React.StrictMode>
        );
        console.log('BO6MaxisItemsSolver mounted successfully');
    },

    mountPeriodicTableSolver(elementId: string) {
        console.log('Mounting BO6PeriodicTableSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO6PeriodicTableSolver />
            </React.StrictMode>
        );
        console.log('BO6PeriodicTableSolver mounted successfully');
    },

    mountLetterboardSolver(elementId: string) {
        console.log('Mounting BO6LetterboardSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO6LetterboardSolver />
            </React.StrictMode>
        );
        console.log('BO6LetterboardSolver mounted successfully');
    },

    mountMahjongSolver(elementId: string) {
        console.log('Mounting IWMahjongSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWMahjongSolver />
            </React.StrictMode>
        );
        console.log('IWMahjongSolver mounted successfully');
    },

    mountShaolinWordFilter(elementId: string) {
        console.log('Mounting IWMainQuestWordFilter to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWMainQuestWordFilter />
            </React.StrictMode>
        );
        console.log('IWMainQuestWordFilter mounted successfully');
    },

    mountChemicalStepSolver(elementId: string) {
        console.log('Mounting IWChemicalStepSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWChemicalStepSolver />
            </React.StrictMode>
        );
        console.log('IWChemicalStepSolver mounted successfully');
    },

    mountAttackGnSSkull4Solver(elementId: string) {
        console.log('Mounting IWGnSSkull4Solver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWGnSSkull4Solver />
            </React.StrictMode>
        );
        console.log('IWGnSSkull4Solver mounted successfully');
    },

    mountBeastGnSEightQueensSolver(elementId: string) {
        console.log('Mounting IWBeastEightQueensSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWBeastEightQueensSolver />
            </React.StrictMode>
        );
        console.log('IWBeastEightQueensSolver mounted successfully');
    },

    mountBeastFloppyDiskSolver(elementId: string) {
        console.log('Mounting IWBeastFloppySolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWBeastFloppySolver />
            </React.StrictMode>
        );
        console.log('IWBeastFloppySolver mounted successfully');
    },

    mountBeastVenomXMazeSolver(elementId: string) {
        console.log('Mounting IWBeastVenomXBoxSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWBeastVenomXMazeSolver />
            </React.StrictMode>
        );
        console.log('IWBeastVenomXBoxSolver mounted successfully');
    },

    mountBeastVenomXBoxSolver(elementId: string) {
        console.log('Mounting IWBeastVenomXBoxSolver to:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWBeastVenomXBoxSolver />
            </React.StrictMode>
        );
        console.log('IWBeastVenomXBoxSolver mounted successfully');
    },
};

// For test page: auto-mount all solvers
const devRoot = document.getElementById('root');
if (devRoot) {
    const root = ReactDOM.createRoot(devRoot);
    root.render(
        <React.StrictMode>
            <div>
                <h2>Beast Venom X Maze Solver</h2>
                <IWBeastVenomXMazeSolver />

                <h2>Beast Venom X Box Solver</h2>
                <IWBeastVenomXBoxSolver />

                <h2>Beast Floppy Disk Solver</h2>
                <IWBeastFloppySolver />

                <h2>Beast Eight Queens Solver</h2>
                <IWBeastEightQueensSolver />

                <h2>Attack GnS Skull 4 Solver</h2>
                <IWGnSSkull4Solver />

                <h2>Attack Chemical Step Solver</h2>
                <IWChemicalStepSolver />

                <h2>Shaolin Main Quest Word Filter</h2>
                <IWMainQuestWordFilter />

                <h2>Mahjong Solver</h2>
                <IWMahjongSolver />

                <h2>Hangman Solver</h2>
                <WW2HangmanSolver />

                <h2>Statue Solver</h2>
                <WW2StatueSolver />

                <h2>Lightning Hammer Solver</h2>
                <WW2HammerPuzzleSolver />

                <h2>Valve Solver</h2>
                <BO3ValveSolver />

                <h2>Beamsmasher Solver</h2>
                <BO6BeamsmasherMathSolver />

                <h2>Maxis Items Solver</h2>
                <BO6MaxisItemsSolver />

                <h2>Periodic Table Solver</h2>
                <BO6PeriodicTableSolver />

                <h2>Letterboard Solver</h2>
                <BO6LetterboardSolver />
            </div>
        </React.StrictMode>
    );
}
