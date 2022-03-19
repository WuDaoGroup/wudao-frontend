<script>
	// import ImagesChart from '../components/ImagesChart.svelte';
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

	// 在页面刚进入的时候，就展示所有的东西
	onMount(async () => {
		getDataStatisticsInfoApi(username, 'data_target_confirmed').then((response) => {
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

		getDataStatisticsInfoApi(username, 'data_zscore_fill_filter').then((response) => {
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
	});
</script>

<h1>数据观察</h1>

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
			</TabContent>
		</svelte:fragment>
	</Tabs>
</div>
