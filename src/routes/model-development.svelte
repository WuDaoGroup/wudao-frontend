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
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
	import { toast } from '@zerodevx/svelte-toast';

	let filename = '';
	let picAdd = '';
	let alphaCheck = ''; // 是否显示针对于alpha参数的修改
	let normalize = '';
	let alpha = 0.5;
	let methods = [];
	let theNumberOfMethod = 1;

	//对没有参数的方法是否进行添加的判断
	let ordinaryLeastSquaresJudge = false;
	let boostedDecisionTreeRegressionJudge = false;

	//答案列表
	let ordinaryLeastSquaresAnswerSheet = [];
	let boostedDecisionTreeRegressionAnswerSheet = [];
	let ridgeRegressionAnswerSheet = [];
	let lassoAnswerSheet = [];
	let lassoLarsAnswerSheet = [];

	let judge = false;
	let coef = [];
	let	intercept = [];
	
	//答案处理方法
	function lassoLars( alpha, normalize ) {
		judge = '';
		coef = [];
		intercept = [];
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		lassoLarsData(filename, alpha, normalize).then((response) => {
			coef = response.data['result_coef'];
			intercept = response.data['result_intercept'];
			let theNewAns = {
				coef: coef,
				intercept: intercept
			}
			lassoLarsAnswerSheet.push(theNewAns);
			lassoLarsAnswerSheet = lassoLarsAnswerSheet;
		});
	}

	function lasso( alpha ) {
		judge = '';
		coef = [];
		intercept = [];
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		lassoData(filename, alpha).then((response) => {
			coef = response.data['result_coef'];
			intercept = response.data['result_intercept'];
			let theNewAns = {
				coef: coef,
				intercept: intercept
			}
			lassoAnswerSheet.push(theNewAns);
			lassoAnswerSheet = lassoAnswerSheet;
		});
	}

	function ridgeRegression( alpha ) {
		judge = '';
		coef = [];
		intercept = [];
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		ridgeRegressionData(filename, alpha).then((response) => {
			coef = response.data['result_coef'];
			intercept = response.data['result_intercept'];
			let theNewAns = {
				coef: coef,
				intercept: intercept
			}
			ridgeRegressionAnswerSheet.push(theNewAns);
			ridgeRegressionAnswerSheet = ridgeRegressionAnswerSheet;
		});
	}

	function ordinaryLeastSquares() {
		judge = '';
		let theFile = filename.split('\\');
		let lenFile = theFile.length;
		filename = theFile[lenFile - 1];
		console.log("the filename:", filename);
		ordinaryLeastSquaresData(filename).then((response) => {
			coef = response.data['result_coef'];
			intercept = response.data['result_intercept'];
			let theNewAns = {
				coef: coef,
				intercept: intercept
			}
			console.log("the new ans:-------", theNewAns);
			ordinaryLeastSquaresAnswerSheet.push(theNewAns);
			ordinaryLeastSquaresAnswerSheet = ordinaryLeastSquaresAnswerSheet;
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
			let theNewAns = {
				picAdd:picAdd,
			}
			boostedDecisionTreeRegressionAnswerSheet.push(theNewAns);
			boostedDecisionTreeRegressionAnswerSheet = boostedDecisionTreeRegressionAnswerSheet;
		});
	}

	function handleAnswerSheet() {
		let ordinaryLeastSquaresAns = [];
		let boostedDecisionTreeAns = [];
		let ridgeRegressionAns = [];
		let lassoAns = [];
		let lassoLarsAns = [];
		alphaCheck = '';
		for (var i = 0; i < methods.length; i++ ){
			let newAns = methods[i];
			console.log(newAns);
			if( methods[i].name == 'Ordinary Least Squares' ){
				ordinaryLeastSquaresAns.push(newAns);
				ordinaryLeastSquaresAns = ordinaryLeastSquaresAns;
			}
			else if( methods[i].name == 'Ridge regression' ){
				ridgeRegressionAns.push(newAns);
				ridgeRegressionAns = ridgeRegressionAns;
			}
			else if( methods[i].name == "Lasso" ){
				lassoAns.push(newAns);
				lassoAns = lassoAns;
			}
			else if( methods[i].name == "Lars Lasso" ){
				lassoLarsAns.push(newAns);
				lassoLarsAns = lassoLarsAns;
			}
			else if( methods[i].name == "Decision Tree Regression with AdaBoost"){
				boostedDecisionTreeAns.push(newAns);
				boostedDecisionTreeAns = boostedDecisionTreeAns;
			}
		}
		for( var i = 0; i < ordinaryLeastSquaresAns.length; i++ ){
			ordinaryLeastSquares();
		}
		for( var i = 0; i < ridgeRegressionAns.length; i++ ){
			ridgeRegression( ridgeRegressionAns[i].alpha );
		}
		for( var i = 0; i < lassoAns.length; i++ ){
			lasso( lassoAns[i].alpha );
		}
		for( var i = 0; i < lassoLarsAns.length; i++ ){
			lassoLars( lassoLarsAns[i].alpha, lassoLarsAns[i].normalize );
		}
		for( var i = 0; i < boostedDecisionTreeAns.length; i++ ){
			boostedDecisionTreeRegression();
		}
		judge = true;
	}

	//增添选择的方法
	function ordinaryLeastSquaresAdd() {
		alphaCheck = ''
		if( !ordinaryLeastSquaresJudge ){
			ordinaryLeastSquaresJudge = true;
			let newMthod = { 
				name:"Ordinary Least Squares",
				id:theNumberOfMethod
			}
			theNumberOfMethod ++;
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
		}
		else{
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}
	function ridgeRegressionAdd() {
		let i = 0; 
		let status = true;
		alphaCheck = ''
		let newMthod = { 
			name:"Ridge regression",
			alpha:alpha,
			id:theNumberOfMethod
		}
		theNumberOfMethod ++;
		for( i = 0; i < methods.length; i++ ){
			if( methods[i].name == newMthod.name && methods[i].alpha == newMthod.alpha ){
				status = false;
				break;
			}
		}
		if( status ){
			methods = methods.filter(function (item) {
				return (item.name != newMthod.name) || (item.alpha != newMthod.alpha);
			});
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
		}
		else{
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
		alphaCheck = ''
		let newMthod = { 
			name:"Lasso",
			alpha:alpha,
			id:theNumberOfMethod
		}
		theNumberOfMethod ++;
		for( i = 0; i < methods.length; i++ ){
			if( methods[i].name == newMthod.name && methods[i].alpha == newMthod.alpha ){
				status = false;
				break;
			}
		}
		if( status ){
			methods = methods.filter(function (item) {
				return (item.name != newMthod.name) || (item.alpha != newMthod.alpha);
			});
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
		}
		else{
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}
	function boostedDecisionTreeRegressionAdd() {
		alphaCheck = ''
		if( !boostedDecisionTreeRegressionJudge ){
			boostedDecisionTreeRegressionJudge = true;
			let newMthod = { 
				name:"Decision Tree Regression with AdaBoost",
				id:theNumberOfMethod
			}
			theNumberOfMethod ++;
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
		}
		else{
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
		alphaCheck = ''
		let newMthod = { 
			name:"LARS Lasso",
			alpha:alpha,
			normalize:normalize,
			id:theNumberOfMethod
		}
		for( i = 0; i < methods.length; i++ ){
			if( methods[i].name == newMthod.name && methods[i].alpha == newMthod.alpha && methods[i].normalize == newMthod.normalize){
				status = false;
				break;
			}
		}
		if( status ){
			methods = methods.filter(function (item) {
				return (item.name != newMthod.name) || (item.alpha != newMthod.alpha);
			});
			methods.push(newMthod);
			methods = methods;
			toast.push('您成功添加了该种方法');
		}
		else{
			toast.push('您已经添加了该种方法', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	}

	//部分方法的删除(针对于不需要增添参数的方法)
	function ordinaryLeastSquaresDelite( id ){
		ordinaryLeastSquaresJudge = false;
		methods = methods.filter(function (item) {
        	return item.id != id;
    	});
	}
	function boostedDecisionTreeRegressionDelite( id ){
		boostedDecisionTreeRegressionJudge = false;
		methods = methods.filter(function (item) {
        	return item.id != id;
    	});
	}

	//需要参数方法的删除
	function ordinaryDelite( id ){
		methods = methods.filter(function (item) {
        	return item.id != id;
    	});
	}

	//获取部分方法所需要的参数
	function getInAlphaRidgeRegression() {
		alphaCheck = 'ridgeRegression'
		judge = ''
		alpha = 0.5
	}
	function getInAlphaLasso() {
		alphaCheck = 'lasso'
		judge = ''
		alpha = 0.1
	}
	function getInAlphaLassoLars(){
		alphaCheck = 'lassoLars'
		normalize = 'False'
		judge = ''
		alpha = 0.1
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
		<div class = "flex mb-10 flex-wrap">
			<div class="m-2"><Button  class="h-14" type="submit" on:click={ordinaryLeastSquaresAdd}>Ordinary Least Squares</Button></div>
			
			{#if alphaCheck == 'ridgeRegression'}
				<div class="m-2"><button class="h-14 bg-white text-blue-500 border-blue-500 border-2 pl-4 pr-16" type="submit" on:click={getInAlphaRidgeRegression}>Ridge regression</button></div>
			{:else}
				<div class="m-2"><Button class="h-14" type="submit" on:click={getInAlphaRidgeRegression}>Ridge regression</Button></div>
			{/if}
			
			{#if alphaCheck == 'lasso'}
				<div class="m-2"><button class="h-14 bg-white text-blue-500 border-blue-500 border-2 pl-4 pr-16" type="submit" on:click={getInAlphaLasso}>Lasso</button></div>
			{:else}
				<div class="m-2"><Button  class="h-14" type="submit" on:click={getInAlphaLasso}>Lasso</Button></div>
			{/if}
			
			<div class="m-2"><Button  class="h-14" type="submit" on:click={boostedDecisionTreeRegressionAdd}>Decision Tree Regression with AdaBoost</Button></div>
			
			{#if alphaCheck == 'lassoLars'}
				<div class="m-2"><button class="h-14 bg-white text-blue-500 border-blue-500 border-2 pl-4 pr-16" type="submit" on:click={getInAlphaLassoLars}>LARS Lasso</button></div>
			{:else}
				<div class="m-2"><Button  class="h-14" type="submit" on:click={getInAlphaLassoLars}>LARS Lasso</Button></div>
			{/if}

		</div>
		<div class = "flex mb-10 justify-center">
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
					<Button kind="tertiary" on:click={ridgeRegressionAdd}>Confirm</Button>
				</div>
			{:else if alphaCheck == 'lasso'}
				<div class = "flex justify-center mb-4">
					<p>Select the appropriate value of alpha: </p>
					<input class="text-center" bind:value={alpha} />
					<p>(0~1)</p>
				</div>
				<div class = "flex mb-10 justify-center">
					<Button kind="tertiary" on:click={lassoAdd}>Confirm</Button>
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
					<Button kind="tertiary" on:click={lassoLarsAdd}>Confirm</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
<div>
	<div class = "mb-5">the methods you have chosen:</div>
	<div class="flex flex-col">
		{#each methods as method, i}
			{#if method.name == 'Ordinary Least Squares'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-black text-white py-3 text-center w-10 mb-5">{i+1}</div>
					<div class="rounded-full bg-black text-white py-3 px-6 w-60 mb-5">{method.name}</div>
					<button class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold" on:click={ordinaryLeastSquaresDelite(method.id)}>X</button>
				</div>
			{:else if method.name == 'Ridge regression'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-yellow-300 text-black py-3 text-center w-10 mb-5">{i+1}</div>
					<div class="rounded-full bg-yellow-300 text-black py-3 px-6 w-44 mb-5" >{method.name}</div>
					<div class="rounded-full bg-yellow-300 text-black py-3 px-6 w-28 mb-5" >alpha:{method.alpha}</div>
					<button class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold" on:click={ordinaryDelite(method.id)}>X</button>
				</div>
			{:else if method.name == 'Lasso'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-green-300 text-black py-3 text-center w-10 mb-5">{i+1}</div>
					<div class="rounded-full bg-green-300 text-black py-3 px-6 w-24 mb-5">{method.name}</div>
					<div class="rounded-full bg-green-300 text-black py-3 px-6 w-28 mb-5">alpha:{method.alpha}</div>
					<button class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold" on:click={ordinaryDelite(method.id)}>X</button>
				</div>
			{:else if method.name == 'Decision Tree Regression with AdaBoost'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-blue-500 text-white py-3 text-center w-10 mb-5">{i+1}</div>
					<div class="rounded-full bg-blue-500 text-white py-3 px-6 w-80 mb-5">{method.name}</div>
					<button class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold" on:click={boostedDecisionTreeRegressionDelite(method.id)}>X</button>
				</div>
			{:else if method.name == 'LARS Lasso'}
				<div class="flex flex-wrap">
					<div class="rounded-full bg-pink-300 text-white py-3 text-center w-10 mb-5">{i+1}</div>
					<div class="rounded-full bg-pink-300 text-white py-3 px-6 w-36 mb-5">{method.name}</div>
					<div class="rounded-full bg-pink-300 text-white py-3 px-6 w-28 mb-5">alpha:{method.alpha}</div>
					<div class="rounded-full bg-pink-300 text-white py-3 px-6 w-40 mb-5">normalize:{method.normalize}</div>
					<button class="rounded-full bg-white hover:bg-red-600 text-red-600  hover:text-white border-2 border-red-600 py-3 text-center w-10 mb-5 font-bold" on:click={ordinaryDelite(method.id)}>X</button>
				</div>
			{/if}
		{/each}
	</div>
</div>
<div>
	<div class = "flex justify-center">
		<Button type="submit" on:click={handleAnswerSheet}>Submit</Button>
	</div>
	<div>
		{#if judge }
			{#each ordinaryLeastSquaresAnswerSheet as { coef, intercept} }
				<p class = "mb-5 text-center">系数分别为:{coef}</p>
				<p class = "mb-5 text-center">常数项为:{intercept}</p>
			{/each}
			{#each ridgeRegressionAnswerSheet as ans }
				<p class = "mb-5 text-center">系数分别为:{ans.coef}</p>
				<p class = "mb-5 text-center">常数项为:{ans.intercept}</p>
			{/each}
			{#each lassoAnswerSheet as ans }
				<p class = "mb-5 text-center">系数分别为:{ans.coef}</p>
				<p class = "mb-5 text-center">常数项为:{ans.intercept}</p>
			{/each}
			{#each lassoLarsAnswerSheet as ans }
				<p class = "mb-5 text-center">系数分别为:{ans.coef}</p>
				<p class = "mb-5 text-center">常数项为:{ans.intercept}</p>
			{/each}
			{#each boostedDecisionTreeRegressionAnswerSheet as ans }
				<img src={ans.picAdd} alt="the result" />
			{/each}
		{/if}
	</div>
</div>
	

