<script>
	// import { onMount } from 'svelte';
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

	function handleReduction() {
		console.log('new new new')
		console.log('hi init')
		dimensionReductionApi(username, method, selectedReductionDimenstionOption, targetFeature).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push(`成功 ${method} ${selectedReductionDimenstionOption} 降维`);
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
					<div class="hero bg-base-200 h-96">
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
					<div class="hero bg-base-200 h-96">
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
				<TabContent>
					<div class="px-4 mx-auto container align-middle">

					</div>
				</TabContent>
				<TabContent>
					<div class="px-4 mx-auto container align-middle">
						
					</div>
				</TabContent>
				<TabContent>
					<div class="px-4 mx-auto container align-middle">

					</div>
				</TabContent>
				<TabContent>
					<div class="px-4 mx-auto container align-middle">
						
					</div>
				</TabContent>
			</svelte:fragment>
		</Tabs>
	</div>
</div>
