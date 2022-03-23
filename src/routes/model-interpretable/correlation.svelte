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
    target.subscribe((value) => {
		targetFeature = value;
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
			</svelte:fragment>
		</Tabs>
	</div>
</div>
