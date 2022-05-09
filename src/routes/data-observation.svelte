<script>
	// import ImagesChart from '../components/ImagesChart.svelte';
	import {baseLink} from '../services/api.js'
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
	import { toast } from '@zerodevx/svelte-toast';
	import { user } from '../stores/userStore';
	import {target, features, allFeatures} from '../stores/dataStore';
	import {
		zscoreDataApi,
		fillDataApi,
		filterDataApi,
		getDataStatisticsInfoApi,
		generateHistogramApi
	} from '../api/dataApi.js';

	let username;
	user.subscribe((value) => {
		username = value.username;
		console.log('username:', username);
	});

	let selectedFeatures = []
    allFeatures.subscribe((value) => {
		selectedFeatures = value.filter((e) => e.type != 'useless');
        console.log(selectedFeatures)
	});

	// 显示统计信息表格
	let pagination = {
		pageSize: 6,
		page: 1
	};

	let rawData = {
		content: [],
		header: []
	};

	let pagination2 = {
		pageSize: 6,
		page: 1
	};

	let curData = {
		content: [],
		header: []
	};

	let images = {
		'raw': [],
		'processed': []
	}

	function prepareImages(){
		for(let i=0; i<selectedFeatures.length; i++){
			let featureName = selectedFeatures[i].value
			let rawImageInfo = {
				name: featureName,
				link: `${baseLink}/static/data/${username}/images/data_target_confirmed/histogram_${featureName}.png`
			}
			let processedImageInfo = {
				name: featureName,
				link: `${baseLink}/static/data/${username}/images/data_zscore_fill_filter/histogram_${featureName}.png`
			}
			images.raw.push(rawImageInfo);
			images.processed.push(processedImageInfo);
			images = images;
		}
		return new Promise(resolve => {
			setTimeout(() => {
			resolve();
			}, 2000);
		});
	};

	// 在页面刚进入的时候，就展示所有的东西
	onMount(async () => {
		await getDataStatisticsInfoApi(username, 'data_target_confirmed').then((response) => {
			if (response.status == 200) {
				console.log('response_data:', response.data);
				rawData = response.data;
				//   console.log('len raw', rawData.content.length)
				toast.push('初始统计量信息查询成功');
			} else {
				console.log('error!');
				toast.push('初始统计量信息查询失败', {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
			}
		});
		
		await generateHistogramApi(username, 'data_target_confirmed').then((response) => {
			if (response.status == 200) {
				console.log('response_data:', response.data);
				//   console.log('len raw', rawData.content.length)
				toast.push('（原始数据）绘制频次统计直方图成功');
			} else {
				console.log('error!');
				toast.push('（原始数据）绘制频次统计直方图失败', {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
			}
		});

		await getDataStatisticsInfoApi(username, 'data_zscore_fill_filter').then((response) => {
			if (response.status == 200) {
				curData = response.data;
				//   console.log('len raw', rawData.content.length)
				toast.push('处理后统计量信息查询成功');
			} else {
				console.log('error!');
				toast.push('处理后统计量信息查询失败', {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
			}
		});

		await generateHistogramApi(username, 'data_zscore_fill_filter').then((response) => {
			if (response.status == 200) {
				console.log('response_data:', response.data);
				//   console.log('len raw', rawData.content.length)
				toast.push('（处理数据）绘制频次统计直方图成功');
			} else {
				console.log('error!');
				// toast.push('（处理数据）绘制频次统计直方图失败', {
				// 	theme: {
				// 		'--toastBackground': '#F56565',
				// 		'--toastBarBackground': '#C53030'
				// 	}
				// });
			}
		});

		await prepareImages();

	});

	console.log(images)
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <title>数据统计与观察</title>
</svelte:head>

<h1>数据统计与观察</h1>

<div class="divider" />

<!-- <ImagesChart /> -->

<div class="grid flex-grow card rounded-box place-items-center">
	<Tabs>
		<Tab label="原始数据观察" />
		<Tab label="处理后数据观察" />
		<svelte:fragment slot="content">
			<TabContent>
				<DataTable
					size="compact"
					title="各特征的统计量"
					description="（预测目标选择完成后的原始数据）"
					sortable
					headers={rawData.header}
					pageSize={pagination.pageSize}
					page={pagination.page}
					rows={rawData.content}
				/>
				<Pagination
					bind:pageSize={pagination.pageSize}
					bind:page={pagination.page}
					totalItems={rawData.content.length}
					pageSizeInputDisabled
				/>
				<div class="grid grid-cols-3 gap-4">
					{#each images.raw as image}
						<img src={image.link} alt={image.name}/>
					{/each}
				</div>
			</TabContent>

			<TabContent>
				<DataTable
					size="compact"
					title="各特征的统计量"
					description="（经过了数据预处理后的数据）"
					sortable
					headers={curData.header}
					pageSize={pagination2.pageSize}
					page={pagination2.page}
					rows={curData.content}
				/>
				<Pagination
					bind:pageSize={pagination2.pageSize}
					bind:page={pagination2.page}
					totalItems={curData.content.length}
					pageSizeInputDisabled
				/>

				<div class="grid grid-cols-3 gap-4">
					{#each images.processed as image}
						<img src={image.link} alt={image.name}/>
					{/each}
				</div>
			</TabContent>
		</svelte:fragment>
	</Tabs>
</div>
