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
	import { dimensionReductionApi } from '../../api/explanationApi.js';

	let username;
	user.subscribe((value) => {
		username = value.username;
		console.log('username:', username);
	});

	let targetFeature
    target.subscribe((value) => {
		targetFeature = value;
	});

	const reductionDimenstionOptions = [2, 3];
    let selectedReductionDimenstionOption = 2

	let method = 'PCA'

	// let imageShow = {
	// 	'PCA+2': false,
	// 	'PCA+3': false,
	// 	'TSNE+2': false,
	// 	'TSNE+3': false,
	// }

	// $: images = [
	// 	{'link':`${baseLink}/static/data/${username}/images/explanation/reduction_PCA_2_${targetFeature}.png`, 'name':`reduction_PCA_2_${targetFeature}`, 'show': imageShow['PCA+2']},
	// 	{'link':`${baseLink}/static/data/${username}/images/explanation/reduction_PCA_3_${targetFeature}.png`, 'name':`reduction_PCA_3_${targetFeature}`, 'show':imageShow['PCA+3']},
	// 	{'link':`${baseLink}/static/data/${username}/images/explanation/reduction_TSNE_2_${targetFeature}.png`, 'name':`reduction_TSNE_2_${targetFeature}`, 'show':imageShow['TSNE+2']},
	// 	{'link':`${baseLink}/static/data/${username}/images/explanation/reduction_TSNE_3_${targetFeature}.png`, 'name':`reduction_TSNE_3_${targetFeature}`, 'show':imageShow['TSNE+3']},
	// ]

	// function showImage(method, selectedReductionDimenstionOption){
	// 	let key = `${method}+${selectedReductionDimenstionOption}`
	// 	imageShow[key] = true
	// 	return new Promise(resolve => {
	// 		setTimeout(() => {
	// 		resolve();
	// 		}, 2000);
	// 	});
	// };

	async function handleReduction() {
		console.log(username, method, selectedReductionDimenstionOption, targetFeature)
		await dimensionReductionApi(username, method, selectedReductionDimenstionOption, targetFeature).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push(`成功 ${method} ${selectedReductionDimenstionOption} 降维`);

		  let imageId = `${method}-${selectedReductionDimenstionOption}d` // alt as well
		  let imageSrc = `${baseLink}/static/data/${username}/images/explanation/reduction_${method}_${selectedReductionDimenstionOption}_${targetFeature}.png`
		  let image = document.getElementById(imageId)
		  image.src = imageSrc
		  image.alt = imageId


        } else {
			console.log('error!');
			toast.push('降维失败', {
				theme: {
				'--toastBackground': '#F56565',
				'--toastBarBackground': '#C53030'
				}
			});
			}
		});
		// await showImage(method,selectedReductionDimenstionOption)
	}


</script>

<h1>数据降维</h1>

<div class="card w-full">
	<div class="card-body">
		<p>
			在机器学习和统计学领域，降维是指在某些限定条件下，降低随机变量个数，得到一组“不相关”主变量的过程。
		</p>
	</div>
</div>

<div class="divider" />

<div class="grid grid-cols-2 gap-4 w-full">
	<div class="grid flex-grow card rounded-box">
		<Tabs>
			<Tab label="PCA" />
			<Tab label="TSNE" />

			<svelte:fragment slot="content">
				<TabContent>
					<div class="hero bg-base-200 h-[32rem]">
						<div class="hero-overlay bg-opacity-60 rounded-lg" />
						<div class="hero-content text-left text-neutral-content">
							<div class="max-w-md">
								<h2 class="mb-5 text-5xl font-bold">PCA</h2>
								<p class="mb-5">
									PCA（principal components analysis）即主成分分析技术，又称主分量分析，旨在利用降维的思想，把多指标转化为少数几个综合指标。
								</p>
								<div class="flex items-end justify-between px-4 pt-4 items-center">
									<select class="select select-bordered w-30 text-zinc-900 w-[10rem]" bind:value={selectedReductionDimenstionOption}>
										{#each reductionDimenstionOptions as opt}
										<option value={opt} class="font-mono">
										  降维维度: {opt}
										  </option>
										{/each}
									</select>
									<button class="btn btn-primary w-[10rem]" on:click={()=>{method='PCA'; handleReduction()}}>
										生成降维
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
								<h2 class="mb-5 text-5xl font-bold">TSNE</h2>
								<p class="mb-5">
									t-Distributed Stochastic Neighbor Embedding (t-SNE) is a technique for dimensionality reduction that is particularly well suited for the visualization of high-dimensional datasets. The technique can be implemented via Barnes-Hut approximations, allowing it to be applied on large real-world datasets
								</p>
								<div class="flex items-end justify-between px-4 pt-4 items-center">
									<select class="select select-bordered w-30 text-zinc-900 w-[10rem]" bind:value={selectedReductionDimenstionOption}>
										{#each reductionDimenstionOptions as opt}
										<option value={opt} class="font-mono">
										  降维维度: {opt}
										  </option>
										{/each}
									</select>
									<button class="btn btn-primary w-[10rem]" on:click={()=>{method='TSNE'; handleReduction()}}>
										生成降维
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
			<Tab label="PCA 降维 2D" />
			<Tab label="PCA 降维 3D" />
			<Tab label="TSNE 降维 2D" />
			<Tab label="TSNE 降维 3D" />
			<svelte:fragment slot="content">


			<!-- {#each images as image}
				<TabContent>
					<div class="px-4 mx-auto container align-middle h-[32rem]">
						<div class="flex flex-row justify-center items-center">
							{#if image.show == true}
								<img src={image.link} alt={image.name} onerror="if (this.src != '../../favicon.png') this.src = '../../favicon.png';" width="75%"/>
							{:else}
								<img src='../../favicon.png' alt='尚未加载'/>
							{/if}
						  </div>

					</div>
				</TabContent>
			{/each} -->

			<TabContent>
				<div class="px-4 mx-auto container align-middle h-[32rem]">
					<div class="flex flex-row justify-center items-center">
						<img src='../../favicon.png' alt='尚未加载' id="PCA-2d" width="75%"/>
					  </div>
				</div>
			</TabContent>

			<TabContent>
				<div class="px-4 mx-auto container align-middle h-[32rem]">
					<div class="flex flex-row justify-center items-center">
						<img src='../../favicon.png' alt='尚未加载' id="PCA-3d" width="75%"/>
					  </div>
				</div>
			</TabContent>


			<TabContent>
				<div class="px-4 mx-auto container align-middle h-[32rem]">
					<div class="flex flex-row justify-center items-center">
						<img src='../../favicon.png' alt='尚未加载' id="TSNE-2d" width="75%"/>
					  </div>
				</div>
			</TabContent>

			<TabContent>
				<div class="px-4 mx-auto container align-middle h-[32rem]">
					<div class="flex flex-row justify-center items-center">
						<img src='../../favicon.png' alt='尚未加载' id="TSNE-3d" width="75%"/>
					  </div>
				</div>
			</TabContent>

			</svelte:fragment>
		</Tabs>
	</div>
</div>
