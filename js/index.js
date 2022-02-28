import { selfEstimation } from './estimation.js'
import { memoryGame } from './memoryGame.js'
import { getResultsFromLocalStorage } from './localStorageUtils.js'


getResultsFromLocalStorage();

memoryGame();

selfEstimation();