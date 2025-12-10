// src/js/store.js
import { randomHsl } from './helpers.js';

const STORAGE_KEY = 'shapes-app-state-v1';

class Store {
    constructor() {
        this.subscribers = new Set();

        // domyślny stan
        this.shapes = [];
        this.nextId = 1;

        // wczytaj z localStorage, jeśli jest
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed.shapes)) {
                    this.shapes = parsed.shapes;
                    this.nextId =
                        typeof parsed.nextId === 'number'
                            ? parsed.nextId
                            : this._calculateNextId();
                }
            }
        } catch (e) {
            console.warn('Nie udało się wczytać stanu z localStorage', e);
        }

        // początkowy notify, żeby UI zrenderował to, co jest w pamięci
        this._notify();
    }

    // prywatne: liczenie nextId na podstawie aktualnych kształtów
    _calculateNextId() {
        if (this.shapes.length === 0) return 1;
        return Math.max(...this.shapes.map((s) => s.id)) + 1;
    }

    // Gettery
    // "Kopia" stanu
    getState() {
        return {
            shapes: this.shapes.map((s) => ({ ...s })),
        };
    }

    // liczniki kształtów
    getCounts() {
        let squares = 0;
        let circles = 0;
        for (const s of this.shapes) {
            if (s.type === 'square') squares++;
            else if (s.type === 'circle') circles++;
        }
        return { squares, circles };
    }

    // wzorzec Obserwator
    subscribe(fn) {
        this.subscribers.add(fn);
        // od razu daj aktualny stan
        fn(this.getState(), this.getCounts());
        // zwracamy funkcję do wypisania się
        return () => {
            this.subscribers.delete(fn);
        };
    }

    _notify() {
        const snapshot = this.getState();
        const counts = this.getCounts();
        for (const fn of this.subscribers) {
            fn(snapshot, counts);
        }
        // tu też zapis do localStorage
        this._saveToLocalStorage();
    }

    _saveToLocalStorage() {
        try {
            const data = JSON.stringify({
                shapes: this.shapes,
                nextId: this.nextId,
            });
            window.localStorage.setItem(STORAGE_KEY, data);
        } catch (e) {
            console.warn('Nie udało się zapisać stanu do localStorage', e);
        }
    }

    // ====== Metody modyfikujące stan (jedyne wejście do zmiany stanu) ======

    addShape(type) {
        if (type !== 'square' && type !== 'circle') {
            throw new Error('Nieznany typ kształtu: ' + type);
        }
        const shape = {
            id: this.nextId++,
            type,
            color: randomHsl(),
        };
        this.shapes.push(shape);
        this._notify();
    }

    removeShape(id) {
        const before = this.shapes.length;
        this.shapes = this.shapes.filter((s) => s.id !== id);
        if (this.shapes.length !== before) {
            this._notify();
        }
    }

    recolorShapesOfType(type) {
        let changed = false;
        this.shapes = this.shapes.map((s) => {
            if (s.type === type) {
                changed = true;
                return { ...s, color: randomHsl() };
            }
            return s;
        });
        if (changed) {
            this._notify();
        }
    }
}

// globalny store -> Singleton
const store = new Store();
export default store;
