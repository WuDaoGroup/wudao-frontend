<script>
	import { onMount } from 'svelte';
	import {
		Button,
		DataTable,
		Pagination,
		Select,
		SelectItem,
		InlineNotification,
		ProgressIndicator,
		ProgressStep,
		TextInput,
		Tabs,
		Tab,
		TabContent
	} from 'carbon-components-svelte';
	import {baseLink} from '../../services/api.js'
	import { toast } from '@zerodevx/svelte-toast';
	import { user } from '../../stores/userStore';
	import {target, features, allFeatures} from '../../stores/dataStore';
	import { generateCorrelationFeatureApi, generateCorrelationTargetApi, generateCorrelationPairwiseApi } from '../../api/explanationApi.js';

	let username;
	user.subscribe((value) => {
		username = value.username;
		console.log('username:', username);
	});

	let targetFeature
	let featuresList
    target.subscribe((value) => {
		targetFeature = value;
	});
	features.subscribe((value) => {
		featuresList = value;
	});

	const correlationMethodOptions = ['pearson', 'kendall', 'spearman'];
    let selectedCorrelationMethodOption = 'pearson'
	
	async function handleCorrelationFeature() {
		await generateCorrelationFeatureApi(username, selectedCorrelationMethodOption).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push(response.data.message);
		  let image = document.getElementById('correlation-feature-image');
		  image.src = `${baseLink}/static/data/${username}/images/explanation/correlation_feature_${selectedCorrelationMethodOption}.png`
        } else {
			console.log('error!');
			toast.push('fail!', {
				theme: {
				'--toastBackground': '#F56565',
				'--toastBarBackground': '#C53030'
				}
			});
			}
		});
	}

	let kNumber = 2
	async function handleCorrelationTarget() {
		await generateCorrelationTargetApi(username, kNumber, targetFeature).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push(response.data.message);
		  let image = document.getElementById('correlation-target-image');
		  image.src = `${baseLink}/static/data/${username}/images/explanation/correlation_target_${targetFeature}_${kNumber}.png`
        } else {
			console.log('error!');
			toast.push('fail!', {
				theme: {
				'--toastBackground': '#F56565',
				'--toastBarBackground': '#C53030'
				}
			});
			}
		});
	}

	async function handleCorrelationPairwise() {
		await generateCorrelationPairwiseApi(username, featuresList).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push(response.data.message);
		  let image = document.getElementById('correlation-pairwise-image');
		  image.src = `${baseLink}/static/data/${username}/images/explanation/correlation_feature_pairwise.png`
        } else {
			console.log('error!');
			toast.push('fail!', {
				theme: {
				'--toastBackground': '#F56565',
				'--toastBarBackground': '#C53030'
				}
			});
			}
		});
	}


</script>

<h1>特征关联分析</h1>

<div class="card w-full">
	<div class="card-body">
		<p>
			机器学习中，我们学到了特征之间相关性的表示，我们可以将这种相关性可视化出来，观察分析出什么特征重要，什么特征不重要，从而可以指导特征的选择和进一步的特征工程。并且特征关联分析还能为机器学习模型增加可解释性。
		</p>
	</div>
</div>

<div class="divider" />

<div class="grid grid-cols-2 gap-4 w-full">
	<div class="grid flex-grow card rounded-box">
		<Tabs>
			<Tab label="生成特征相关矩阵" />
			<Tab label="生成目标相关矩阵" />
			<Tab label="生成Pairwise关联矩阵" />

			<svelte:fragment slot="content">
				<TabContent>
					<div class="hero bg-base-200 h-[32rem]">
						<div class="hero-overlay bg-opacity-60 rounded-lg" />
						<div class="hero-content text-left text-neutral-content">
							<div class="max-w-md">
								<h2 class="mb-5 text-5xl font-bold">特征相关矩阵</h2>
								<p class="mb-5">
									对全特征计算特征相关矩阵，可选方法有 pearson、kendall 和 spearman
								</p>
								<div class="flex items-end justify-between px-4 pt-4 items-center">
									<select class="select select-bordered w-30 text-zinc-900 w-[10rem]" bind:value={selectedCorrelationMethodOption}>
										{#each correlationMethodOptions as opt}
										<option value={opt} class="font-mono">
										  方法: {opt}
										  </option>
										{/each}
									</select>
									<button class="btn btn-primary w-[10rem]" on:click={()=>{handleCorrelationFeature()}}>
										生成Correlation Matrix
									</button>
								</div>
							</div>
						</div>
					</div>
				</TabContent>
				<TabContent>
					<div class="hero bg-base-200 h-[32rem]">
						<div class="hero-overlay bg-opacity-60 rounded-lg" />
						<div class="hero-content text-left text-neutral-content">
							<div class="max-w-md">
								<h2 class="mb-5 text-5xl font-bold">目标 ({targetFeature}) 相关矩阵</h2>
								<p class="mb-5">
									对预测目标及其 K 个相关特征计算相关矩阵，默认使用方法为 spearman。你一共有 {featuresList.length} 个特征，请输入你想要计算的相关特征数量 (2~{featuresList.length}个)。
								</p>
								<div class="flex items-end justify-between px-4 pt-4 items-center">
									<input type="number" min="2" max="{featuresList.length}" placeholder="输入阈值" class="input input-bordered input-primary text-zinc-900 w-[10rem]" bind:value={kNumber}>
									<button class="btn btn-primary w-[10rem]" on:click={()=>{handleCorrelationTarget()}}>
										生成Correlation Matrix
									</button>
								</div>
							</div>
						</div>
					</div>
				</TabContent>
				<TabContent>
					<div class="hero bg-base-200 h-[32rem]">
						<div class="hero-overlay bg-opacity-60 rounded-lg" />
						<div class="hero-content text-left text-neutral-content">
							<div class="max-w-md">
								<h2 class="mb-5 text-5xl font-bold">Pairwise 相关矩阵</h2>
								<p class="mb-5">
									计算两两特征之间的相关矩阵。现已为您挑选目标特征及随机若干个特征进行分析。
								</p>
								<div class="flex items-end justify-center px-4 pt-4 items-center">
									<button class="btn btn-primary w-[10rem]" on:click={()=>{handleCorrelationPairwise()}}>
										生成Correlation Matrix
									</button>
								</div>
							</div>
						</div>
					</div>
				</TabContent>
			</svelte:fragment>
		</Tabs>
	</div>

	<div class="grid flex-grow card rounded-box">
		<Tabs>
			<Tab label="Feature Correlation Matrix" />
			<Tab label="Target Correlation Matrix" />
			<Tab label="Pairwise Correlation Matrix" />
			<svelte:fragment slot="content">
			<TabContent>
				<div class="px-4 mx-auto container align-middle h-[32rem]">
					<div class="flex flex-row justify-center items-center">
						<img src='../../favicon.png' alt='尚未加载' id='correlation-feature-image'/>
					</div>
				</div>
			</TabContent>
			<TabContent>
				<div class="px-4 mx-auto container align-middle h-[32rem]">
					<div class="flex flex-row justify-center items-center">
						<img src='../../favicon.png' alt='尚未加载' id='correlation-target-image'/>
					</div>
				</div>
			</TabContent>
			<TabContent>
				<div class="px-4 mx-auto container align-middle h-[32rem]">
					<div class="flex flex-row justify-center items-center">
						<img src='../../favicon.png' alt='尚未加载' id='correlation-pairwise-image'/>
					</div>
				</div>
			</TabContent>
			</svelte:fragment>
		</Tabs>
	</div>
</div>
