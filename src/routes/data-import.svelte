<script>
	import { analyzeUploadFileContentApi, uploadFileFeatureInfoApi } from '../api/fileApi';
	import {
		DataTable,
		Pagination,
		RadioButtonGroup,
		RadioButton,
		InlineNotification
	} from 'carbon-components-svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { Button } from 'carbon-components-svelte';
	// import { dataHeader, rowData } from '../stores/dataStore';
	import FilePond from 'svelte-filepond';
	import { goto } from '$app/navigation';

	// 接收到的结构化数据 (原始数据)
	let rawData = {
		features: [],
		content: []
	};
	const featureTypes = ['target', 'feature', 'useless'];
	const defaultChoice = featureTypes[1];
	let selectedFeatures = [];
	// let selectedFeatures = [{'value': 'Y', 'type': defaultChoice},{'value': 'm', 'type': defaultChoice},{'value': 'n', 'type': defaultChoice}]
	$: console.log(selectedFeatures);

	let pond;
	// the name to use for the internal file input
	let name = 'upload_file'; // 这个值就对应了form-data的key
	let filename;
	// handle filepond events
	function handleInit() {
		console.log('FilePond has initialised');
	}

	function handleAddFile(err, fileItem) {
		console.log('A file has been added', fileItem);
		if (!['xlsx', 'xls', 'csv'].includes(fileItem.fileExtension.toLowerCase())) {
			toast.push('文件类型错误', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
			console.log();
			fileItem.abortLoad();
			fileItem.abortProcessing();
		} else {
			filename = fileItem.filename;
			toast.push('点击上传');
		}
	}

	let showTable = false;
	let showAnalysisButton = false;
	let pagination = {
		pageSize: 5,
		page: 1
	};

	function receiveData() {
		analyzeUploadFileContentApi(filename).then((response) => {
			selectedFeatures = [];
			if (response.status == 200) {
				// console.log('response_data:', response.data)
				rawData.content = response.data.content;
				rawData.features = response.data.header;
				console.log(rawData);
				for (let i = 0; i < rawData.features.length; i++) {
					let e = {
						key: rawData.features[i]['key'],
						value: rawData.features[i]['value'],
						type: defaultChoice
					};
					selectedFeatures.push(e);
				}
				showAnalysisButton = true;
			} else {
				console.log('error!');
			}
		});
	}

	function uploadFeatureInfo(){
		uploadFileFeatureInfoApi(selectedFeatures).then((response) => {
			if (response.status == 200) {
				toast.push('上传数据的特征信息成功');
				console.log('data feature info:', response.data)
				goto(`/data-observation`);
			}
		});
	}
</script>

<div class="grid grid-rows-2 grid-cols-5 gap-4">
	<div class="row-span-2 col-span-4">
		<FilePond
			bind:this={pond}
			labelIdle='Drag & Drop your data (csv/xls/xlsx file) or <span class="filepond--label-action"> Browse </span>'
			{name}
			server="http://localhost:8123/api/v1/files/upload"
			allowMultiple={true}
			oninit={handleInit}
			onaddfile={handleAddFile}
			instantUpload={false}
		/>
	</div>
	<div class=" m-auto">
		<Button on:click={receiveData} kind="tertiary">获取数据</Button>
	</div>
	{#if showAnalysisButton == true}
		<div class=" m-auto">
			<Button on:click={() => (showTable = true)} kind="tertiary">开始分析</Button>
		</div>
	{/if}
</div>

{#if showTable == true}
	<div class="container mx-auto">
		<DataTable
			size="compact"
			sortable
			title="原始表格"
			description="数据种类: {rawData.features.length}"
			headers={rawData.features}
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
	</div>

	<InlineNotification hideCloseButton kind="warning" title="提示: " subtitle="请选择预测目标, 注意预测目标只能有1个" />

	{#each selectedFeatures as f}
		<RadioButtonGroup legendText={f.value} bind:selected={f.type}>
			{#each featureTypes as p}
				<RadioButton labelText={p} value={p} />
			{/each}
		</RadioButtonGroup>
		Selected feature: <strong>{f.type}</strong>
	{/each}
{/if}

<Button on:click={uploadFeatureInfo} kind="tertiary" >上传数据</Button>

<style>
	@import 'filepond/dist/filepond.css';
</style>
