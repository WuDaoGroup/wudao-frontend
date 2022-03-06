<script>
	import { base } from '$app/paths';
	import {
		ordinaryLeastSquaresData,
		boostedDecisionTreeRegressionData,
		ridgeRegressionData,
		lassoData,
		lassoLarsData,
		SVCData,
		xgboostData
	} from '../api/modelApi';
	import {
		Accordion,
		AccordionItem,
		Form,
		FormGroup,
		Checkbox,
		CodeSnippet,
		RadioButtonGroup,
		RadioButton,
		Select,
		SelectItem,
		Button,
		DataTable,
		InlineNotification,
		TextInput,
		Tooltip,
		ComboBox,
		Pagination,
		ProgressIndicator,
		ProgressStep,
	} from 'carbon-components-svelte';
	import TrashCan16 from 'carbon-icons-svelte/lib/TrashCan16';
	import { toast } from '@zerodevx/svelte-toast';
	import { filename } from '../stores/dataStore';

	let picAdd = '';
	let alphaCheck = ''; // 是否显示针对于alpha参数的修改
	let methods = [];
	let theNumberOfMethod = 1;
	let percentOfTestData = 0.3;

	//不同方法所需要的参数
	let penalty = '';
	let loss = '';
	let normalize = '';
	let alpha = '';

	//对没有参数的方法是否进行添加的判断
	let SVCJudge = false;
	let SGDClassifierJudge = false;
	let ordinaryLeastSquaresJudge = false;
	let boostedDecisionTreeRegressionJudge = false;
	let xgboostJudge = false;

	//答案列表
	let ordinaryLeastSquaresAnswerSheet = [];
	let boostedDecisionTreeRegressionAnswerSheet = [];
	let ridgeRegressionAnswerSheet = [];
	let lassoAnswerSheet = [];
	let lassoLarsAnswerSheet = [];
	let SVCAnswerSheet = [];
	let SGDClassifierAnswerSheet = [];
	let xgboostAnswerSheet = [];

	let judge = false; // 判断此时是否显示得到的答案
	let judgeReset = false; // 判断此时是否需要显示reset

	//返回的答案
	let coef = [];
	let intercept = [];
	let accuracyOfTestData = 0;
	let accuracyOfTrainData = 0;
	let code = '';
	let mae = '';
	let mse = '';
	let r2 = '';

	//判断是否存在某方法的出现
	let ordinaryLeastSquaresAppearance = false;
	let boostedDecisionTreeRegressionAppearance = false;
	let ridgeRegressionAppearance = false;
	let lassoAppearance = false;
	let lassoLarsAppearance = false;
	let SVCAppearance = false;
	let SGDClassifierAppearance = false;
	let xgboostAppearance = false;

	//判断某种方法是否发生错误
	let errorOrdinaryLeastSquares = true;
	let errorBoostedDecisionTreeRegression = true;
	let errorRidgeRegression = true;
	let errorLasso = true;
	let errorLassoLars = true;
	let errorSVC = true;
	let errorSGDClassifier = true;
	let errorXgboost = true;

	//答案处理方法
	function xgboost(percentOfTestData) {
		judge = '';
		xgboostData(localStorage.filename + '_zscore_afterFilter.csv', percentOfTestData)
			.then((response) => {
				accuracyOfTestData = response.data['result_accuracyOfTestData'];
				code = response.data['code']
				mae = response.data['mae']
				mse = response.data['mse']
				r2 = response.data['r2']

				let theNewAns = {
					accuracyOfTestData: accuracyOfTestData,
					code: code,
					mae: mae,
					mse: mse,
					r2: r2,
				};

				xgboostAnswerSheet.push(theNewAns);
				xgboostAnswerSheet = xgboostAnswerSheet;
				errorXgboost = true;
			})
			.catch(() => {
				errorXgboost = false;
			});
	}
	function SGDClassifier( loss, penalty, percentOfTestData) {
		judge = '';
		SGDClassifierData(localStorage.filename + '_zscore_afterFilter.csv', loss, penalty, percentOfTestData)
			.then((response) => {
				accuracyOfTestData = response.data['result_accuracyOfTestData'];
				code = response.data['code'];
				let theNewAns = {
					accuracyOfTestData: accuracyOfTestData,
					code: code,
					loss: loss,
					penalty: penalty,
				};
				SGDClassifierAnswerSheet.push(theNewAns);
				SGDClassifierAnswerSheet = SGDClassifierAnswerSheet;
				errorSGDClassifier = true;
			})
			.catch(() => {
				errorSGDClassifier = false;
			});
	}
	function SVC(percentOfTestData) {
		judge = '';
		SVCData(localStorage.filename + '_zscore_afterFilter.csv', percentOfTestData)
			.then((response) => {
				accuracyOfTestData = response.data['result_accuracyOfTestData'];
				code = response.data['code'];
				let theNewAns = {
					accuracyOfTestData: accuracyOfTestData,
					code: code,
				};
				SVCAnswerSheet.push(theNewAns);
				SVCAnswerSheet = SVCAnswerSheet;
				errorSVC = true;
			})
			.catch(() => {
				errorSVC = false;
			});
	}
	function lassoLars(alpha, normalize, percentOfTestData) {
		judge = '';
		coef = [];
		intercept = [];
		lassoLarsData(localStorage.filename + '_zscore_afterFilter.csv', alpha, normalize, percentOfTestData)
			.then((response) => {
				coef = response.data['result_coef'];
				intercept = response.data['result_intercept'];
				accuracyOfTestData = response.data['result_accuracyOfTestData'];
				accuracyOfTrainData = response.data['result_accuracyOfTrainData'];
				code  = response.data['code'];
				mae = response.data['mae'];
				mse = response.data['mse'];
				r2 = response.data['r2'];
				let theNewAns = {
					coef: coef,
					intercept: intercept,
					alpha: alpha,
					normalize: normalize,
					accuracyOfTestData: accuracyOfTestData,
					accuracyOfTrainData: accuracyOfTrainData,
					code: code,
					mae: mae,
					mse: mse,
					r2: r2,
				};
				console.log('lassoLars:', theNewAns);
				lassoLarsAnswerSheet.push(theNewAns);
				lassoLarsAnswerSheet = lassoLarsAnswerSheet;
				errorLassoLars = true;
			})
			.catch(() => {
				errorLassoLars = false;
			});
	}

	function lasso(alpha, percentOfTestData) {
		judge = '';
		coef = [];
		intercept = [];
		lassoData(localStorage.filename + '_zscore_afterFilter.csv', alpha, percentOfTestData)
			.then((response) => {
				coef = response.data['result_coef'];
				intercept = response.data['result_intercept'];
				accuracyOfTestData = response.data['result_accuracyOfTestData'];
				accuracyOfTrainData = response.data['result_accuracyOfTrainData'];
				code  = response.data['code'];
				mae = response.data['mae'];
				mse = response.data['mse'];
				r2 = response.data['r2'];
				let theNewAns = {
					coef: coef,
					intercept: intercept,
					alpha: alpha,
					accuracyOfTestData: accuracyOfTestData,
					accuracyOfTrainData: accuracyOfTrainData,
					code: code,
					mae: mae,
					mse: mse,
					r2: r2,
				};
				lassoAnswerSheet.push(theNewAns);
				lassoAnswerSheet = lassoAnswerSheet;
				errorLasso = true;
			})
			.catch(() => {
				errorLasso = false;
			});
	}

	function ridgeRegression(alpha, percentOfTestData) {
		judge = '';
		coef = [];
		intercept = [];
		ridgeRegressionData(localStorage.filename + '_zscore_afterFilter.csv', alpha, percentOfTestData)
			.then((response) => {
				coef = response.data['result_coef'];
				intercept = response.data['result_intercept'];
				accuracyOfTestData = response.data['result_accuracyOfTestData'];
				accuracyOfTrainData = response.data['result_accuracyOfTrainData'];
				code  = response.data['code'];
				mae = response.data['mae'];
				mse = response.data['mse'];
				r2 = response.data['r2'];
				let theNewAns = {
					coef: coef,
					intercept: intercept,
					alpha: alpha,
					accuracyOfTestData: accuracyOfTestData,
					accuracyOfTrainData: accuracyOfTrainData,
					code: code,
					mae: mae,
					mse: mse,
					r2: r2,
				};
				ridgeRegressionAnswerSheet.push(theNewAns);
				ridgeRegressionAnswerSheet = ridgeRegressionAnswerSheet;
				errorRidgeRegression = true;
			})
			.catch(() => {
				errorRidgeRegression = false;
			});
	}

	function ordinaryLeastSquares(percentOfTestData) {
		judge = '';
		ordinaryLeastSquaresData(localStorage.filename + '_zscore_afterFilter.csv', percentOfTestData)
			.then((response) => {
				coef = response.data['result_coef'];
				intercept = response.data['result_intercept'];
				accuracyOfTestData = response.data['result_accuracyOfTestData'];
				accuracyOfTrainData = response.data['result_accuracyOfTrainData'];
				code  = response.data['code'];
				mae = response.data['mae'];
				mse = response.data['mse'];
				r2 = response.data['r2'];
				let theNewAns = {
					coef: coef,
					intercept: intercept,
					accuracyOfTestData: accuracyOfTestData,
					accuracyOfTrainData: accuracyOfTrainData,
					code: code,
					mae: mae,
					mse: mse,
					r2: r2,
				};
				console.log('the accuracyOfTrainData:-------', accuracyOfTrainData);
				ordinaryLeastSquaresAnswerSheet.push(theNewAns);
				ordinaryLeastSquaresAnswerSheet = ordinaryLeastSquaresAnswerSheet;
				errorOrdinaryLeastSquares = true;
			})
			.catch(() => {
				errorOrdinaryLeastSquares = false;
			});
	}

	function boostedDecisionTreeRegression() {
		judge = '';
		boostedDecisionTreeRegressionData(localStorage.filename + '_zscore_afterFilter.csv')
			.then((response) => {
				picAdd = 'http://localhost:8123/static/images/' + response.data['pic_addr'];
				code  = response.data['code'];
				let theNewAns = {
					picAdd: picAdd,
					code: code,
				};
				boostedDecisionTreeRegressionAnswerSheet.push(theNewAns);
				boostedDecisionTreeRegressionAnswerSheet = boostedDecisionTreeRegressionAnswerSheet;
				errorBoostedDecisionTreeRegression = true;
			})
			.catch(() => {
				errorBoostedDecisionTreeRegression = false;
			});
	}

	//最终的答案处理
	function handleAnswerSheet() {
		if (!judgeReset) {
			let ordinaryLeastSquaresAns = [];
			let boostedDecisionTreeAns = [];
			let ridgeRegressionAns = [];
			let lassoAns = [];
			let lassoLarsAns = [];
			let SVCAns = [];
			let SGDClassifierAns = [];
			let xgboostAns = [];
			alphaCheck = '';
			for (var i = 0; i < methods.length; i++) {
				let newAns = methods[i];
				console.log(newAns);
				if (methods[i].name == 'Ordinary Least Squares') {
					ordinaryLeastSquaresAns.push(newAns);
					ordinaryLeastSquaresAns = ordinaryLeastSquaresAns;
					ordinaryLeastSquaresAppearance = true;
				} else if (methods[i].name == 'Ridge regression') {
					ridgeRegressionAns.push(newAns);
					ridgeRegressionAns = ridgeRegressionAns;
					ridgeRegressionAppearance = true;
				} else if (methods[i].name == 'Lasso') {
					lassoAns.push(newAns);
					lassoAns = lassoAns;
					lassoAppearance = true;
				} else if (methods[i].name == 'LARS Lasso') {
					lassoLarsAns.push(newAns);
					lassoLarsAns = lassoLarsAns;
					lassoLarsAppearance = true;
				} else if (methods[i].name == 'Decision Tree Regression with AdaBoost') {
					boostedDecisionTreeAns.push(newAns);
					boostedDecisionTreeAns = boostedDecisionTreeAns;
					boostedDecisionTreeRegressionAppearance = true;
				} else if (methods[i].name == 'SVC') {
					SVCAns.push(newAns);
					SVCAns = SVCAns;
					SVCAppearance = true;
				} else if (methods[i].name == 'xgboost') {
					xgboostAns.push(newAns);
					xgboostAns = xgboostAns;
					xgboostAppearance = true;
				}else if (methods[i].name == 'SGDClassifier') {
					SGDClassifierAns.push(newAns);
					SGDClassifierAns = SGDClassifierAns;
					SGDClassifierAppearance = true;
				}
			}
			for (var i = 0; i < ordinaryLeastSquaresAns.length; i++) {
				ordinaryLeastSquares(percentOfTestData);
			}
			for (var i = 0; i < ridgeRegressionAns.length; i++) {
				ridgeRegression(ridgeRegressionAns[i].alpha, percentOfTestData);
			}
			for (var i = 0; i < lassoAns.length; i++) {
				lasso(lassoAns[i].alpha, percentOfTestData);
			}
			for (var i = 0; i < lassoLarsAns.length; i++) {
				console.log('Use the lassoLars!!!');
				lassoLars(lassoLarsAns[i].alpha, lassoLarsAns[i].normalize, percentOfTestData);
			}
			for (var i = 0; i < boostedDecisionTreeAns.length; i++) {
				boostedDecisionTreeRegression();
			}
			for (var i = 0; i < SVCAns.length; i++) {
				SVC(percentOfTestData);
			}
			for (var i = 0; i < SGDClassifierAns.length; i++) {
				SGDClassifier(SGDClassifierAns[i].loss, SGDClassifierAns[i].penalty, percentOfTestData);
			}
			for (var i = 0; i < xgboostAns.length; i++) {
				xgboost(percentOfTestData);
			}
			judge = true;
			judgeReset = true;
		}
	}

	//重设数据
	function Reset() {
		reset();

		ordinaryLeastSquaresAppearance = false;
		boostedDecisionTreeRegressionAppearance = false;
		ridgeRegressionAppearance = false;
		lassoAppearance = false;
		lassoLarsAppearance = false;
		SVCAppearance = false;
		SGDClassifierAppearance = false;
		xgboostAppearance = false;
	}
	function reset() {
		judgeReset = false;

		ordinaryLeastSquaresAnswerSheet = [];
		boostedDecisionTreeRegressionAnswerSheet = [];
		ridgeRegressionAnswerSheet = [];
		lassoAnswerSheet = [];
		lassoLarsAnswerSheet = [];
		SVCAnswerSheet = [];
		SGDClassifierAnswerSheet = [];
		xgboostAnswerSheet = [];

		errorOrdinaryLeastSquares = true;
		errorBoostedDecisionTreeRegression = true;
		errorRidgeRegression = true;
		errorLasso = true;
		errorLassoLars = true;
		errorSVC = true;
		errorSGDClassifier = true;
		errorXgboost = true;
	}
	function allClear() {
		Reset();

		SVCJudge = false;
		SGDClassifierJudge = false;
		ordinaryLeastSquaresJudge = false;
		boostedDecisionTreeRegressionJudge = false;
		xgboostJudge = false;

		methods = [];
	}
	//无参数增添选择的方法
	function boostedDecisionTreeRegressionAdd() {
		alphaCheck = '';
		if (!boostedDecisionTreeRegressionJudge) {
			boostedDecisionTreeRegressionJudge = true;
			let newMthod = {
				name: 'Decision Tree Regression with AdaBoost',
				id: theNumberOfMethod
			};
			theNumberOfMethod++;
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
			reset();
			judge = '';
		} else {
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}
	function xgboostAdd() {
		alphaCheck = '';
		if (!xgboostJudge) {
			xgboostJudge = true;
			let newMthod = {
				name: 'xgboost',
				id: theNumberOfMethod
			};
			theNumberOfMethod++;
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
			judge = '';
			reset();
		} else {
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}
	function SVCAdd() {
		alphaCheck = '';
		if (!SVCJudge) {
			SVCJudge = true;
			let newMthod = {
				name: 'SVC',
				id: theNumberOfMethod
			};
			theNumberOfMethod++;
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
			judge = '';
			reset();
		} else {
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}
	function SGDClassifierAdd() {
		alphaCheck = '';
		if (!SGDClassifierJudge) {
			SGDClassifierJudge = true;
			let newMthod = {
				name: 'SGDClassifier',
				loss: loss,
				penalty: penalty,
				id: theNumberOfMethod,
			};
			theNumberOfMethod++;
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
			judge = '';
			reset();
		} else {
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}
	function ordinaryLeastSquaresAdd() {
		alphaCheck = '';
		if (!ordinaryLeastSquaresJudge) {
			ordinaryLeastSquaresJudge = true;
			let newMthod = {
				name: 'Ordinary Least Squares',
				id: theNumberOfMethod
			};
			theNumberOfMethod++;
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
			judge = '';
			reset();
		} else {
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}

	//有参数增添选择的方法
	function ridgeRegressionAdd() {
		let i = 0;
		let status = true;
		alphaCheck = '';
		let newMthod = {
			name: 'Ridge regression',
			alpha: alpha,
			id: theNumberOfMethod
		};
		theNumberOfMethod++;
		for (i = 0; i < methods.length; i++) {
			if (methods[i].name == newMthod.name && methods[i].alpha == newMthod.alpha) {
				status = false;
				break;
			}
		}
		if (status) {
			methods = methods.filter(function (item) {
				return item.name != newMthod.name || item.alpha != newMthod.alpha;
			});
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
		} else {
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}
	function lassoAdd() {
		let i = 0;
		let status = true;
		alphaCheck = '';
		let newMthod = {
			name: 'Lasso',
			alpha: alpha,
			id: theNumberOfMethod
		};
		theNumberOfMethod++;
		for (i = 0; i < methods.length; i++) {
			if (methods[i].name == newMthod.name && methods[i].alpha == newMthod.alpha) {
				status = false;
				break;
			}
		}
		if (status) {
			methods = methods.filter(function (item) {
				return item.name != newMthod.name || item.alpha != newMthod.alpha;
			});
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
		} else {
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}
	function lassoLarsAdd() {
		let i = 0;
		let status = true;
		alphaCheck = '';
		let newMthod = {
			name: 'LARS Lasso',
			alpha: alpha,
			normalize: normalize,
			id: theNumberOfMethod
		};
		theNumberOfMethod++;
		for (i = 0; i < methods.length; i++) {
			if (
				methods[i].name == newMthod.name &&
				methods[i].alpha == newMthod.alpha &&
				methods[i].normalize == newMthod.normalize
			) {
				console.log("the method has already existed");
				status = false;
				break;
			}
		}
		if ( status ) {
			methods = methods.filter(function (item) {
				return item.name != newMthod.name || item.alpha != newMthod.alpha || item.normalize != newMthod.normalize;
			});
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
		} else {
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}

	//部分方法的删除(针对于不需要增添参数的方法)
	function xgboostDelite(id) {
		xgboostJudge = false;
		methods = methods.filter(function (item) {
			return item.id != id;
		});
		Reset();
	}

	function SVCDelite(id) {
		SVCJudge = false;
		methods = methods.filter(function (item) {
			return item.id != id;
		});
		Reset();
	}

	function ordinaryLeastSquaresDelite(id) {
		ordinaryLeastSquaresJudge = false;
		methods = methods.filter(function (item) {
			return item.id != id;
		});
		Reset();
	}

	function boostedDecisionTreeRegressionDelite(id) {
		boostedDecisionTreeRegressionJudge = false;
		methods = methods.filter(function (item) {
			return item.id != id;
		});
		Reset();
	}

	//需要参数方法的删除
	function ordinaryDelite(id) {
		methods = methods.filter(function (item) {
			return item.id != id;
		});
		Reset();
	}

	//获取部分方法所需要的参数
	function getInAlphaRidgeRegression() {
		alphaCheck = 'ridgeRegression';
		alpha = 0.5;
		judge = '';
		reset();
	}
	function getInAlphaLasso() {
		alphaCheck = 'lasso';
		alpha = 0.5;
		judge = '';
		reset();
	}
	function getInAlphaLassoLars() {
		alphaCheck = 'lassoLars';
		alpha = 0.5;
		normalize = 'False';
		judge = '';
		reset();
	}
	function getInAlphaSGDClassifier() {
		alphaCheck = 'SGDClassifier';
		loss= 'hinge';
		penalty= 'l2';
		judge = '';
		reset();
	}
</script>

<div>
	<h1 class="mb-5 text-center">Supervised Learning (监督学习)</h1>
	<!-- 对于监督学习的介绍 -->
	<p class="mb-5 indent-8">
		从给定的训练数据集中学习出一个函数(模型参数),当新的数据到来时,可以根据这个函数预测结果。
		监督学习的训练集要求包括输入输出,也可以说是特征和目标。训练集中
		的标签是由人标注的。监督学习就是最常见的分类(注意和聚类区分)问题,通过已有的训练样本(
		即已知数据及其对应的输出)去训练得到一个最优模型,再利用这个模型将所有的输入映射为相应的输出,对输出进行简单的判断
		从而实现分类的目的。也就具有了对未知数据分类的能力。
		监督学习的目标往往是让计算机根据已有的数据集去学习我们已经创建好的分类系统,知道输入和输出结果之间的关系。
		根据这种已知的关系,训练得到一个最优的模型。
		也就是说,在监督学习中训练数据既有特征(feature)又有标签(label),通过训练,让机器可以自己找到特征和标签之间的联
		系,在面对只有特征没有标签的数据时,可以判断出标签。通俗一点,可以把机器学习理解为我们教机器如何做事情。
	</p>
	<div>
		<!-- 操作按钮(regression) -->
		<div class="mb-10">
			<p class="text-center mb-7 text-3xl">Regression</p>
			<div class="flex flex-wrap">
				<div class="m-2">
					<Button class="h-14" type="submit" on:click={ordinaryLeastSquaresAdd}
						>Ordinary Least Squares</Button
					>
				</div>

				{#if alphaCheck == 'ridgeRegression'}
					<div class="m-2">
						<button
							class="h-14 bg-white text-blue-500 border-blue-500 border-2 pl-4 pr-16"
							type="submit"
							on:click={getInAlphaRidgeRegression}>Ridge regression</button
						>
					</div>
				{:else}
					<div class="m-2">
						<Button class="h-14" type="submit" on:click={getInAlphaRidgeRegression}
							>Ridge regression</Button
						>
					</div>
				{/if}

				{#if alphaCheck == 'lasso'}
					<div class="m-2">
						<button
							class="h-14 bg-white text-blue-500 border-blue-500 border-2 pl-4 pr-16"
							type="submit"
							on:click={getInAlphaLasso}>Lasso</button
						>
					</div>
				{:else}
					<div class="m-2">
						<Button class="h-14" type="submit" on:click={getInAlphaLasso}>Lasso</Button>
					</div>
				{/if}

				<div class="m-2">
					<Button class="h-14" type="submit" on:click={boostedDecisionTreeRegressionAdd}
						>Decision Tree Regression with AdaBoost</Button
					>
				</div>

				{#if alphaCheck == 'lassoLars'}
					<div class="m-2">
						<button
							class="h-14 bg-white text-blue-500 border-blue-500 border-2 pl-4 pr-16"
							type="submit"
							on:click={getInAlphaLassoLars}>LARS Lasso</button
						>
					</div>
				{:else}
					<div class="m-2">
						<Button class="h-14" type="submit" on:click={getInAlphaLassoLars}>LARS Lasso</Button>
					</div>
				{/if}

				<div class="m-2">
					<Button class="h-14" type="submit" on:click={xgboostAdd}>xgboost</Button>
				</div>
			</div>
		</div>
		<!-- 操作按钮(classification) -->
		<div class="mb-10">
			<p class="text-center mb-7 text-3xl">Classification</p>
			<div class="flex flex-wrap">
				<div class="m-2"><Button class="h-14" type="submit" on:click={SVCAdd}>SVC</Button></div>
				{#if alphaCheck == 'SGDClassifier'}
					<div class="m-2">
						<button
							class="h-14 bg-white text-blue-500 border-blue-500 border-2 pl-4 pr-16"
							type="submit"
							on:click={getInAlphaSGDClassifier}>SGD Classifier</button
						>
					</div>
				{:else}
					<div class="m-2">
						<Button class="h-14" type="submit" on:click={getInAlphaSGDClassifier}>SGD Classifier</Button>
					</div>
				{/if}
			</div>
		</div>
		<!-- 训练集占比的选择 -->
		<div class="flex justify-center mb-5">
			<div class = "w-60"></div>
				<TextInput 
					labelText="Choose the percentage of the test data:" 
					type="Number" 
					placeholder="Please make sure percent is in the range of 0 to 1" 
					bind:value={percentOfTestData} 
				/>
			<div class = "w-60"></div>
		</div>
		<!-- 参数选择 -->
		<div>
			{#if alphaCheck == 'ridgeRegression'}
				<div class="flex justify-center mb-4">
					<div class = "w-60"></div>
					<TextInput 
						labelText="Select the appropriate value of alpha:" 
						type="Number" 
						placeholder="Please make sure alpha is in the range of 0 to 1" 
						bind:value={alpha} 
					/>
					<div class = "w-60"></div>
				</div>
				<div class="flex mb-10 justify-center">
					<Button kind="tertiary" on:click={ridgeRegressionAdd}>Confirm</Button>
				</div>
			{:else if alphaCheck == 'lasso'}
				<div class="flex justify-center mb-4">
					<div class = "w-60"></div>
					<TextInput 
						labelText="Select the appropriate value of alpha:" 
						type="Number" 
						placeholder="Please make sure alpha is in the range of 0 to 1" 
						bind:value={alpha} 
					/>
					<div class = "w-60"></div>
				</div>
				<div class="flex mb-10 justify-center">
					<Button kind="tertiary" on:click={lassoAdd}>Confirm</Button>
				</div>
			{:else if alphaCheck == 'lassoLars'}
				<div class="flex justify-center mb-4">
					<div class = "w-60"></div>
					<TextInput 
						labelText="Select the appropriate value of alpha:" 
						type="Number" 
						placeholder="Please make sure alpha is in the range of 0 to 1" 
						bind:value={alpha} 
					/>
					<div class = "w-60"></div>
				</div>
				<div class="flex justify-center mb-4">
					<ComboBox
					    titleText="Select the mode of normalize"
						items={[
							{ id: "True", text: "True" },
							{ id: "False", text: "False" },
						]}
						bind:selectedId={normalize} 
					/>
				</div>
				<div class="flex mb-10 justify-center">
					<Button kind="tertiary" on:click={lassoLarsAdd}>Confirm</Button>
				</div>
			{:else if alphaCheck == 'SGDClassifier'}
				<div class="flex justify-center mb-4">
					<ComboBox
					    titleText="Select the mode of loss"
						items={[
							{ id: "hinge", text: "hinge" },
							{ id: "modified_huber", text: "modified_huber" },
							{ id: "log", text: "log" },
						]}
						bind:selectedId={loss} 
					/>
				</div>
				<div class="flex justify-center mb-4">
					<ComboBox
					    titleText="Select the mode of penalty"
						items={[
							{ id: "l1", text: "l1" },
							{ id: "l2", text: "l2" },
							{ id: "elasticnet", text: "elasticnet" },
						]}
						bind:selectedId={penalty} 
					/>
				</div>
				<div class="flex mb-10 justify-center">
					<Button kind="tertiary" on:click={SGDClassifierAdd}>Confirm</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
<div>
	<!-- 已选择的方法框 -->
	<div class="mb-5">the methods you have chosen:</div>
	<div class="flex flex-col">
		{#each methods as method, i}
			{#if method.name == 'Ordinary Least Squares'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-black text-white py-3 text-center w-10 mb-5">{i + 1}</div>
					<div class="rounded-full bg-black text-white py-3 px-6 w-60 mb-5">{method.name}</div>
					<button
						class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold"
						on:click={ordinaryLeastSquaresDelite(method.id)}>X</button
					>
				</div>
			{:else if method.name == 'Ridge regression'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-yellow-300 text-black py-3 text-center w-10 mb-5">
						{i + 1}
					</div>
					<div class="rounded-full bg-yellow-300 text-black py-3 px-6 w-44 mb-5">{method.name}</div>
					<div class="rounded-full bg-yellow-300 text-black py-3 px-6 w-28 mb-5">
						alpha:{method.alpha}
					</div>
					<button
						class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold"
						on:click={ordinaryDelite(method.id)}>X</button
					>
				</div>
			{:else if method.name == 'Lasso'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-green-300 text-black py-3 text-center w-10 mb-5">{i + 1}</div>
					<div class="rounded-full bg-green-300 text-black py-3 px-6 w-24 mb-5">{method.name}</div>
					<div class="rounded-full bg-green-300 text-black py-3 px-6 w-28 mb-5">
						alpha:{method.alpha}
					</div>
					<button
						class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold"
						on:click={ordinaryDelite(method.id)}>X</button
					>
				</div>
			{:else if method.name == 'Decision Tree Regression with AdaBoost'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-blue-500 text-white py-3 text-center w-10 mb-5">{i + 1}</div>
					<div class="rounded-full bg-blue-500 text-white py-3 px-6 w-80 mb-5">{method.name}</div>
					<button
						class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold"
						on:click={boostedDecisionTreeRegressionDelite(method.id)}>X</button
					>
				</div>
			{:else if method.name == 'LARS Lasso'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-pink-300 text-black py-3 text-center w-10 mb-5">{i + 1}</div>
					<div class="rounded-full bg-pink-300 text-black py-3 px-6 w-36 mb-5">{method.name}</div>
					<div class="rounded-full bg-pink-300 text-black py-3 px-6 w-28 mb-5">
						alpha:{method.alpha}
					</div>
					<div class="rounded-full bg-pink-300 text-black py-3 px-6 w-40 mb-5">
						normalize:{method.normalize}
					</div>
					<button
						class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold"
						on:click={ordinaryDelite(method.id)}>X</button
					>
				</div>
			{:else if method.name == 'SVC'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-yellow-900 text-white py-3 text-center w-10 mb-5">
						{i + 1}
					</div>
					<div class="rounded-full bg-yellow-900 text-white py-3 px-6 w-20 mb-5">{method.name}</div>
					<button
						class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold"
						on:click={SVCDelite(method.id)}>X</button
					>
				</div>
			{:else if method.name == 'xgboost'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-purple-900 text-white py-3 text-center w-10 mb-5">
						{i + 1}
					</div>
					<div class="rounded-full bg-purple-900 text-white py-3 px-6 w-28 mb-5">{method.name}</div>
					<button
						class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold"
						on:click={xgboostDelite(method.id)}>X</button
					>
				</div>
			{:else if method.name == 'SGDClassifier'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-blue-300 text-black py-3 text-center w-10 mb-5">
						{i + 1}
					</div>
					<div class="rounded-full bg-blue-300 text-black py-3 px-6 w-36 mb-5">{method.name}</div>
					<div class="rounded-full bg-blue-300 text-black py-3 px-6 w-28 mb-5">
						loss:{method.loss}
					</div>
					<div class="rounded-full bg-blue-300 text-black py-3 px-6 w-32 mb-5">
						penalty:{method.penalty}
					</div>
					<button
						class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold"
						on:click={ordinaryDelite(method.id)}>X</button
					>
				</div>
			{/if}
		{/each}
		<Button kind="danger" class="w-36" on:click={allClear}>Clear all</Button>
	</div>
</div>
<!-- 最终的答案展示 -->
<div>
	<div class="flex justify-center mb-10">
		{#if !judgeReset}
			<Button type="submit" on:click={handleAnswerSheet}>Submit</Button>
		{:else}
			<Button type="submit" on:click={handleAnswerSheet}>Submit</Button>
			<Button type="submit" on:click={Reset}>Reset</Button>
		{/if}
	</div>
	<!-- 最终得到的答案展示 -->
	<div>
		{#if judge}
			{#if ordinaryLeastSquaresAppearance}
				<Accordion>
					<AccordionItem title="Ordinary Least Squares">
						{#if errorOrdinaryLeastSquares}
							{#each ordinaryLeastSquaresAnswerSheet as { coef, intercept, accuracyOfTestData, accuracyOfTrainData, code, mae, mse, r2 }}
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'coefficient', value: 'coefficient' },
										{ key: 'intercept', value: 'intercept' },
										{ key: 'test', value: 'accuracy of test-data' },
										{ key: 'train', value: 'accuracy of train-data' }
									]}
									rows={[
										{
											coefficient: coef,
											intercept: intercept,
											test: accuracyOfTestData,
											train: accuracyOfTrainData
										}
									]}
								/>
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'MAE', value: 'MAE' },
										{ key: 'MSE', value: 'MSE' },
										{ key: 'R2', value: 'R2' },
									]}
									rows={[
										{
											MAE: mae,
											MSE: mse,
											R2: r2,
										}
									]}
								/>
								<CodeSnippet code={code} type="multi" />
							{/each}
						{:else}
							<div class="flex flex-nowrap justify-start">
								<InlineNotification
									title="Error:"
									subtitle="The file you selected is not suitable for this method."
								/>
								<Tooltip tooltipBodyId="tooltip-body" class="self-center">
									<p id="tooltip-body">
										Make sure that every value that is a feature is of numeric type.
									</p>
								</Tooltip>
							</div>
						{/if}
					</AccordionItem>
				</Accordion>
			{/if}
			{#if ridgeRegressionAppearance}
				<Accordion>
					<AccordionItem title="Ridge regression">
						{#if errorRidgeRegression}
							{#each ridgeRegressionAnswerSheet as { coef, intercept, alpha, accuracyOfTestData, accuracyOfTrainData, code, mae, mse, r2  }}
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'alpha', value: 'alpha' },
										{ key: 'coefficient', value: 'coefficient' },
										{ key: 'intercept', value: 'intercept' },
										{ key: 'test', value: 'accuracy of test-data' },
										{ key: 'train', value: 'accuracy of train-data' }
									]}
									rows={[
										{
											alpha: alpha,
											coefficient: coef,
											intercept: intercept,
											test: accuracyOfTestData,
											train: accuracyOfTrainData
										}
									]}
								/>
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'MAE', value: 'MAE' },
										{ key: 'MSE', value: 'MSE' },
										{ key: 'R2', value: 'R2' },
									]}
									rows={[
										{
											MAE: mae,
											MSE: mse,
											R2: r2,
										}
									]}
								/>
								<CodeSnippet code={code} type="multi" />
								<div class="divider"></div>
							{/each}
						{:else}
							<div class="flex flex-nowrap justify-start">
								<InlineNotification
									title="Error:"
									subtitle="The file you selected is not suitable for this method."
								/>
								<Tooltip tooltipBodyId="tooltip-body" class="self-center">
									<p id="tooltip-body">
										Make sure that every value that is a feature is of numeric type.
									</p>
								</Tooltip>
							</div>
						{/if}
					</AccordionItem>
				</Accordion>
			{/if}
			{#if lassoAppearance}
				<Accordion>
					<AccordionItem title="Lasso">
						{#if errorLasso}
							{#each lassoAnswerSheet as { coef, intercept, alpha, accuracyOfTestData, accuracyOfTrainData, code, mae, mse, r2  }}
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'alpha', value: 'alpha' },
										{ key: 'coefficient', value: 'coefficient' },
										{ key: 'intercept', value: 'intercept' },
										{ key: 'test', value: 'accuracy of test-data' },
										{ key: 'train', value: 'accuracy of train-data' }
									]}
									rows={[
										{
											alpha: alpha,
											coefficient: coef,
											intercept: intercept,
											test: accuracyOfTestData,
											train: accuracyOfTrainData
										}
									]}
								/>
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'MAE', value: 'MAE' },
										{ key: 'MSE', value: 'MSE' },
										{ key: 'R2', value: 'R2' },
									]}
									rows={[
										{
											MAE: mae,
											MSE: mse,
											R2: r2,
										}
									]}
								/>
								<CodeSnippet code={code} type="multi" />
								<div class="divider"></div>
							{/each}
						{:else}
							<div class="flex flex-nowrap justify-start">
								<InlineNotification
									title="Error:"
									subtitle="The file you selected is not suitable for this method."
								/>
								<Tooltip tooltipBodyId="tooltip-body" class="self-center">
									<p id="tooltip-body">
										Make sure that every value that is a feature is of numeric type.
									</p>
								</Tooltip>
							</div>
						{/if}
					</AccordionItem>
				</Accordion>
			{/if}
			{#if lassoLarsAppearance}
				<Accordion>
					<AccordionItem title="LARS Lasso">
						{#if errorLassoLars}
							{#each lassoLarsAnswerSheet as { coef, intercept, alpha, normalize, accuracyOfTestData, accuracyOfTrainData, code, mae, mse, r2  }}
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'alpha', value: 'alpha' },
										{ key: 'normalize', value: 'normalize' },
										{ key: 'coefficient', value: 'coefficient' },
										{ key: 'intercept', value: 'intercept' },
										{ key: 'test', value: 'accuracy of test-data' },
										{ key: 'train', value: 'accuracy of train-data' }
									]}
									rows={[
										{
											alpha: alpha,
											normalize: normalize,
											coefficient: coef,
											intercept: intercept,
											test: accuracyOfTestData,
											train: accuracyOfTrainData
										}
									]}
								/>
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'MAE', value: 'MAE' },
										{ key: 'MSE', value: 'MSE' },
										{ key: 'R2', value: 'R2' },
									]}
									rows={[
										{
											MAE: mae,
											MSE: mse,
											R2: r2,
										}
									]}
								/>
								<CodeSnippet code={code} type="multi" />
								<div class="divider"></div>
							{/each}
						{:else}
							<div class="flex flex-nowrap justify-start">
								<InlineNotification
									title="Error:"
									subtitle="The file you selected is not suitable for this method."
								/>
								<Tooltip tooltipBodyId="tooltip-body" class="self-center">
									<p id="tooltip-body">
										Make sure that every value that is a feature is of numeric type.
									</p>
								</Tooltip>
							</div>
						{/if}
					</AccordionItem>
				</Accordion>
			{/if}
			{#if SVCAppearance}
				<Accordion>
					<AccordionItem title="SVC">
						{#if errorSVC}
							{#each SVCAnswerSheet as { accuracyOfTestData, code }}
								<DataTable
									class="w-11/12"
									headers={[{ key: 'test', value: 'accuracy of test-data' }]}
									rows={[
										{
											test: accuracyOfTestData
										}
									]}
								/>
								<CodeSnippet code={code} type="multi" />
							{/each}
						{:else}
							<div class="flex flex-nowrap justify-start">
								<InlineNotification
									title="Error:"
									subtitle="The file you selected is not suitable for this method."
								/>
								<Tooltip tooltipBodyId="tooltip-body" class="self-center">
									<p id="tooltip-body">
										ValueError: Unknown label type: 'continuous' or we got 1 class but the number of
										classes has to be greater than one.
									</p>
								</Tooltip>
							</div>
						{/if}
					</AccordionItem>
				</Accordion>
			{/if}
			{#if xgboostAppearance}
				<Accordion>
					<AccordionItem title="xgboost">
						{#if errorXgboost}
							{#each xgboostAnswerSheet as { accuracyOfTestData, code, mae, mse, r2  }}
								<DataTable
									class="w-11/12"
									headers={[{ key: 'test', value: 'accuracy of test-data' }]}
									rows={[
										{
											test: accuracyOfTestData
										}
									]}
								/>
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'MAE', value: 'MAE' },
										{ key: 'MSE', value: 'MSE' },
										{ key: 'R2', value: 'R2' },
									]}
									rows={[
										{
											MAE: mae,
											MSE: mse,
											R2: r2,
										}
									]}
								/>
								<CodeSnippet code={code} type="multi" />
							{/each}
						{:else}
							<div class="flex flex-nowrap justify-start">
								<InlineNotification
									title="Error:"
									subtitle="The file you selected is not suitable for this method."
								/>
								<Tooltip tooltipBodyId="tooltip-body" class="self-center">
									<p id="tooltip-body">
										Make sure that every value that is a feature is of numeric type.
									</p>
								</Tooltip>
							</div>
						{/if}
					</AccordionItem>
				</Accordion>
			{/if}
			{#if boostedDecisionTreeRegressionAppearance}
				<Accordion>
					<AccordionItem title="Decision Tree Regression with AdaBoost">
						{#if errorBoostedDecisionTreeRegression}
							{#each boostedDecisionTreeRegressionAnswerSheet as ans}
								<div class="flex mb-10 justify-center">
									<img src={ans.picAdd} alt="the result" />
								</div>
								<CodeSnippet code={ans.code} type="multi" />
							{/each}
						{:else}
							<div class="flex flex-nowrap justify-start">
								<InlineNotification
									title="Error:"
									subtitle="The file you selected is not suitable for this method."
								/>
								<Tooltip tooltipBodyId="tooltip-body" class="self-center">
									<p id="tooltip-body">
										Make sure that every value that is a feature is of numeric type.
									</p>
								</Tooltip>
							</div>
						{/if}
					</AccordionItem>
				</Accordion>
			{/if}
			{#if SGDClassifierAppearance}
				<Accordion>
					<AccordionItem title="SGD Classifier">
						{#if errorSGDClassifier}
							{#each SGDClassifierAnswerSheet as { loss, penalty, accuracyOfTestData, code }}
								<DataTable
									class="w-11/12"
									headers={[
										{ key: 'loss', value: 'loss' },
										{ key: 'penalty', value: 'penalty' },
										{ key: 'test', value: 'accuracy of test-data' },
									]}
									rows={[
										{
											loss: loss,
											penalty: penalty,
											test: accuracyOfTestData,
										}
									]}
								/>
								<CodeSnippet code={code} type="multi" />
							{/each}
						{:else}
							<div class="flex flex-nowrap justify-start">
								<InlineNotification
									title="Error:"
									subtitle="The file you selected is not suitable for this method."
								/>
								<Tooltip tooltipBodyId="tooltip-body" class="self-center">
									<p id="tooltip-body">
										ValueError: Unknown label type: 'continuous' or we got 1 class but the number of
										classes has to be greater than one.
									</p>
								</Tooltip>
							</div>
						{/if}
					</AccordionItem>
				</Accordion>
			{/if}
		{/if}
	</div>
</div>
