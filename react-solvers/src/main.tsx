import React from 'react';
import ReactDOM from 'react-dom/client';
import WW2HangmanSolver from './components/WW2HangmanSolver';
import WW2StatueSolver from './components/WW2StatueSolver';
import WW2HammerPuzzleSolver from './components/WW2HammerPuzzleSolver';
import BO6BeamsmasherMathSolver from './components/BO6BeamsmasherMathSolver';
import BO3ValveSolver from './components/BO3ValveSolver';
import BO6MaxisItemsSolver from './components/BO6MaxisItemsSolver';

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
};

// For test page: auto-mount all solvers
const devRoot = document.getElementById('root');
if (devRoot) {
    const root = ReactDOM.createRoot(devRoot);
    root.render(
        <React.StrictMode>
            <div>
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
            </div>
        </React.StrictMode>
    );
}
