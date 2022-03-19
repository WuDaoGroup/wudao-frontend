import { writable } from 'svelte/store';

export const ordinaryLeastSquaresAnswerSheetS = writable([]);
export const boostedDecisionTreeRegressionAnswerSheetS = writable([]);
export const ridgeRegressionAnswerSheetS = writable([]);
export const lassoAnswerSheetS = writable([]);
export const lassoLarsAnswerSheetS = writable([]);
export const SVCAnswerSheetS = writable([]);
export const SGDClassifierAnswerSheetS = writable([]);
export const xgboostAnswerSheetS = writable([]);

export const ordinaryLeastSquaresAppearance = writable(false);
export const boostedDecisionTreeRegressionAppearance = writable(false);
export const ridgeRegressionAppearance = writable(false);
export const lassoAppearance = writable(false);
export const lassoLarsAppearance = writable(false);
export const SVCAppearance = writable(false);
export const SGDClassifierAppearance = writable(false);
export const xgboostAppearance = writable(false);

export const errorOrdinaryLeastSquares = writable(true);
export const errorBoostedDecisionTreeRegression = writable(true);
export const errorRidgeRegression = writable(true);
export const errorLasso = writable(true);
export const errorLassoLars = writable(true);
export const errorSVC = writable(true);
export const errorSGDClassifier = writable(true);
export const errorXgboost = writable(true);

export const judge = writable(false);