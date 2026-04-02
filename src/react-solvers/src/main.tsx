import React from "react";
import ReactDOM from "react-dom/client";
import "../../css/global_solver.css";
import "../../css/styles.css";
import WW2HangmanSolver from "./components/WW2HangmanSolver";
import WW2StatueSolver from "./components/WW2StatueSolver";
import WW2HammerPuzzleSolver from "./components/WW2HammerPuzzleSolver";
import BO6BeamsmasherMathSolver from "./components/BO6BeamsmasherMathSolver";
import BO3ValveSolver from "./components/BO3ValveSolver";
import BO6MaxisItemsSolver from "./components/BO6MaxisItemsSolver";
import BO6PeriodicTableSolver from "./components/BO6PeriodicTableSolver";
import BO6LetterboardSolver from "./components/BO6LetterboardSolver";
import IWMahjongSolver from "./components/IWMahjongSolver";
import IWMainQuestWordFilter from "./components/IWMainQuestWordFilter";
import IWChemicalStepSolver from "./components/IWChemicalStepSolver";
import IWGnSSkull4Solver from "./components/IWGnSSkull4Solver";
import IWBeastEightQueensSolver from "./components/IWBeastEightQueensSolver";
import IWBeastFloppySolver from "./components/IWBeastFloppySolver";
import IWBeastVenomXMazeSolver from "./components/IWBeastVenomXMazeSolver";
import IWBeastVenomXBoxSolver from "./components/IWBeastVenomXBoxSolver";

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
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountHangmanSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <WW2HangmanSolver />
            </React.StrictMode>,
        );
    },

    mountStatueSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountStatueSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <WW2StatueSolver />
            </React.StrictMode>,
        );
    },

    mountHammerSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountHammerSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <WW2HammerPuzzleSolver />
            </React.StrictMode>,
        );
    },

    mountValveSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountValveSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO3ValveSolver />
            </React.StrictMode>,
        );
    },

    mountBeamsmasherSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountBeamsmasherSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO6BeamsmasherMathSolver />
            </React.StrictMode>,
        );
    },

    mountMaxisItemsSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountMaxisItemsSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO6MaxisItemsSolver />
            </React.StrictMode>,
        );
    },

    mountPeriodicTableSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountPeriodicTableSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO6PeriodicTableSolver />
            </React.StrictMode>,
        );
    },

    mountLetterboardSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountLetterboardSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <BO6LetterboardSolver />
            </React.StrictMode>,
        );
    },

    mountMahjongSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountMahjongSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWMahjongSolver />
            </React.StrictMode>,
        );
    },

    mountShaolinWordFilter(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountShaolinWordFilter: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWMainQuestWordFilter />
            </React.StrictMode>,
        );
    },

    mountChemicalStepSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountChemicalStepSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWChemicalStepSolver />
            </React.StrictMode>,
        );
    },

    mountAttackGnSSkull4Solver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountAttackGnSSkull4Solver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWGnSSkull4Solver />
            </React.StrictMode>,
        );
    },

    mountBeastGnSEightQueensSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountBeastGnSEightQueensSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWBeastEightQueensSolver />
            </React.StrictMode>,
        );
    },

    mountBeastFloppyDiskSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountBeastFloppyDiskSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWBeastFloppySolver />
            </React.StrictMode>,
        );
    },

    mountBeastVenomXMazeSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountBeastVenomXMazeSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWBeastVenomXMazeSolver />
            </React.StrictMode>,
        );
    },

    mountBeastVenomXBoxSolver(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("mountBeastVenomXBoxSolver: element not found:", elementId);
            return;
        }
        const root = ReactDOM.createRoot(element);
        root.render(
            <React.StrictMode>
                <IWBeastVenomXBoxSolver />
            </React.StrictMode>,
        );
    },
};

// For test page: auto-mount all solvers
const devRoot = document.getElementById("root");
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
        </React.StrictMode>,
    );
}
