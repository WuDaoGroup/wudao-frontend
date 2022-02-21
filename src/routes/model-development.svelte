<script>
	import { base } from '$app/paths';
	import {
		ordinaryLeastSquaresData,
		boostedDecisionTreeRegressionData,
		ridgeRegressionData,
		lassoData,
		lassoLarsData
	} from '../api/modelApi';
	import {
		Form,
		FormGroup,
		Checkbox,
		RadioButtonGroup,
		RadioButton,
		Select,
		SelectItem,
		Button
	} from 'carbon-components-svelte';

	let filename = '';
	let coef = [];
	let intercept = [];
	let picAdd = '';
	let judge = '';
	let alphaCheck = '';
	let normalize = '';
	let alpha = 0.5;

	function getInAlphaRidgeRegression() {
		alphaCheck = 'ridgeRegression'
		alpha = 0.5
	}
	function getInAlphaLasso() {
		alphaCheck = 'lasso'
		alpha = 0.1
	}
	function getInAlphaLassoLars(){
		alphaCheck = 'lassoLars'
		normalize = 'False'
		alpha = 0.1
	}
	function lassoLars() {
		judge = '';
		coef = [];
		intercept = [];
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		lassoLarsData(filename, alpha, normalize).then((response) => {
			coef = response.data['result_coef'];
			intercept = response.data['result_intercept'];
			if (response.status == 200) {
				judge = 'll';
				alphaCheck = '';
			}
		});
	}

	function lasso() {
		judge = '';
		coef = [];
		intercept = [];
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		lassoData(filename, alpha).then((response) => {
			coef = response.data['result_coef'];
			intercept = response.data['result_intercept'];
			if (response.status == 200) {
				judge = 'l';
				alphaCheck = '';
			}
		});
	}
	function ridgeRegression() {
		judge = '';
		coef = [];
		intercept = [];
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		ridgeRegressionData(filename, alpha).then((response) => {
			coef = response.data['result_coef'];
			intercept = response.data['result_intercept'];
			if (response.status == 200) {
				judge = 'rd';
				alphaCheck = '';
			}
		});
	}
	function ordinaryLeastSquares() {
		judge = '';
		coef = [];
		intercept = [];
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		ordinaryLeastSquaresData(filename).then((response) => {
			coef = response.data['result_coef'];
			intercept = response.data['result_intercept'];
			if (response.status == 200) judge = 'ols';
		});
	}

	function boostedDecisionTreeRegression() {
		judge = '';
		coef = [];
		intercept = [];
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		boostedDecisionTreeRegressionData(filename).then((response) => {
			picAdd = 'http://localhost:8123/static/images/' + response.data['pic_addr'];
			console.log(picAdd);
			if (response.status == 200) judge = 'bdtr';
		});
	}
</script>

<div>
	<h1 class = "mb-5 text-center">Supervised Learning (监督学习)</h1>
	<p class = "mb-5 indent-8">
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
		<div class = "flex mb-10 justify-center">
			<Button type="submit" on:click={ordinaryLeastSquares}>Ordinary Least Squares</Button>
			<Button type="submit" on:click={getInAlphaRidgeRegression}>Ridge regression</Button>
			<Button type="submit" on:click={getInAlphaLasso}>Lasso</Button>
			<Button type="submit" on:click={boostedDecisionTreeRegression}>Decision Tree Regression with AdaBoost</Button>
		</div>
		<div class = "flex mb-10 justify-center">
			<Button type="submit" on:click={getInAlphaLassoLars}>LARS Lasso</Button>
			<Button>Ridge regression</Button>
			<Button>Multi-task Lasso</Button>
			<Button>Decision Tree Regression with AdaBoost</Button>
		</div>
		<div class = "flex mb-5 justify-center">
			<input bind:value={filename} type="file" enctype="multipart/form-data" size="16" />
		</div>
		<div>
			{#if alphaCheck == 'ridgeRegression'}
				<div class = "flex justify-center mb-4">
					<p>Select the appropriate value of alpha: </p>
					<input class="text-center" bind:value={alpha} />
					<p>(0~1)</p>
				</div>
				<div class = "flex mb-10 justify-center">
					<Button kind="tertiary" on:click={ridgeRegression}>ascertain</Button>
				</div>
			{:else if alphaCheck == 'lasso'}
				<div class = "flex justify-center mb-4">
					<p>Select the appropriate value of alpha: </p>
					<input class="text-center" bind:value={alpha} />
					<p>(0~1)</p>
				</div>
				<div class = "flex mb-10 justify-center">
					<Button kind="tertiary" on:click={lasso}>ascertain</Button>
				</div>
			{:else if alphaCheck == 'lassoLars'}
				<div class = "flex justify-center mb-4">
					<p>Select the appropriate value of alpha: </p>
					<input class="text-center" bind:value={alpha} />
					<p>(0~1)</p>
				</div>
				<div class = "flex justify-center mb-4">
					<p>Select the mode of normalize: </p>
					<input class="text-center" bind:value={normalize} />
					<p>(True or False)</p>
				</div>
				<div class = "flex mb-10 justify-center">
					<Button kind="tertiary" on:click={lassoLars}>ascertain</Button>
				</div>
			{/if}
		</div>
		<div>
			{#if judge == 'rd'}
				<p class = "mb-5 text-center">系数分别为:{coef}</p>
				<p class = "mb-5 text-center">常数项为:{intercept}</p>
			{:else if judge == 'ols'}
				<p class = "mb-5 text-center">系数分别为:{coef}</p>
				<p class = "mb-5 text-center">常数项为:{intercept}</p>
			{:else if judge == 'bdtr'}
				<img src={picAdd} alt="the result" />
			{:else if judge == 'l'}
				<p class = "mb-5 text-center">系数分别为:{coef}</p>
				<p class = "mb-5 text-center">常数项为:{intercept}</p>
			{:else if judge == 'll'}
				<p class = "mb-5 text-center">系数分别为:{coef}</p>
				<p class = "mb-5 text-center">常数项为:{intercept}</p>
			{/if}
		</div>
	</div>
</div>
<div class = "flex justify-center">
	<Button type="submit">Submit</Button>
</div>
