<script>
	import { analyzeUploadFileContentApi, uploadFileFeatureInfoApi } from '../api/fileApi';
	import {
		DataTable,
		Pagination,
		RadioButtonGroup,
		RadioButton,
		InlineNotification,
		ProgressIndicator,
		ProgressStep
	} from 'carbon-components-svelte';
	import { browser } from '$app/env';
	import { toast } from '@zerodevx/svelte-toast';
	import { Button } from 'carbon-components-svelte';
	// import { dataHeader, rowData } from '../stores/dataStore';
	import FilePond from 'svelte-filepond';
	import { filename } from '../stores/dataStore';
	import { goto } from '$app/navigation';

	// 接收到的结构化数据 (原始数据)
	let rawData = {
		features: [],
		content: []
	};
	let currentIndex = 0;
	let checkUploadFiles = { current: true, complete: false, invalid: false };
	let analyzeDataFiles = { current: false, complete: false, disabled: true };
	let chooseFeature = { current: false, complete: false, disabled: true };
	const featureTypes = ['target', 'feature', 'useless'];
	const defaultChoice = featureTypes[1];
	let selectedFeatures = [];
	// let selectedFeatures = [{'value': 'Y', 'type': defaultChoice},{'value': 'm', 'type': defaultChoice},{'value': 'n', 'type': defaultChoice}]
	$: console.log(selectedFeatures);
	$: featureTypeTargetCount = selectedFeatures.filter((e) => e.type === 'target').length;
	let pond;
	// the name to use for the internal file input
	let name = 'upload_file'; // 这个值就对应了form-data的key
	// handle filepond events
	function handleInit() {
		console.log('FilePond has initialised');
	}
	
	function handleAddFile(err, fileItem) {
		console.log('A file has been added', fileItem);
		if (!['xlsx', 'xls', 'csv'].includes(fileItem.fileExtension.toLowerCase())) {
			(checkUploadFiles.invalid = true);
			toast.push('文件类型错误', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
			
			fileItem.abortLoad();
			fileItem.abortProcessing();
		} else {
			const dataFilename = fileItem.filename;
			filename.set(dataFilename);
				if (browser) {
					localStorage.setItem('filename', JSON.stringify(dataFilename));
				}
			toast.push('点击上传');
			localStorage.filename= localStorage.filename.replace("\"", "").replace("\"","")
			console.log(dataFilename,"aaa",localStorage.filename)
			currentIndex = 1;
			(checkUploadFiles.current = false), (checkUploadFiles.complete = true), (checkUploadFiles.invalid = false);
			(analyzeDataFiles.disabled = false), (analyzeDataFiles.current = true);
		}
	}

	let showTable = false;
	let pagination = {
		pageSize: 10,
		page: 1
	};

	function receiveData() {
		analyzeUploadFileContentApi(localStorage.filename).then((response) => {
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
				(analyzeDataFiles.current = false), (analyzeDataFiles.complete = true);
				currentIndex = 2;
				(showTable = true),
				(chooseFeature.current = true),
				(chooseFeature.disabled = false)
			} else {
				console.log('error!');
			}
		});
	}

	function uploadFeatureInfo() {
		uploadFileFeatureInfoApi(localStorage.filename, selectedFeatures).then((response) => {
			if (response.status == 200) {
				toast.push('上传数据的特征信息成功');
				console.log('data feature info:', response.data);
				(chooseFeature.current = false), (chooseFeature.complete = true), (currentIndex = 4);
				goto(`/data-preprocessing`);
			}
		});
	}
</script>

<ProgressIndicator bind:currentIndex spaceEqually preventChangeOnClick>
	<ProgressStep
		bind:current={checkUploadFiles.current}
		bind:complete={checkUploadFiles.complete}
		bind:invalid={checkUploadFiles.invalid}
		label="Upload File"
	/>
	<ProgressStep
		bind:disabled={analyzeDataFiles.disabled}
		bind:current={analyzeDataFiles.current}
		bind:complete={analyzeDataFiles.complete}
		label="Show Table"
	/>
	<ProgressStep
		bind:disabled={chooseFeature.disabled}
		bind:current={chooseFeature.current}
		bind:complete={chooseFeature.complete}
		label="Upload Features"
	/>
</ProgressIndicator>
<div class="grid grid-rows-2 grid-cols-5 gap-4">
	<div class="row-span-2 col-span-4">
		<FilePond
			bind:this={pond}
			labelIdle='Drag & Drop your data (csv/xls/xlsx file) or <span class="filepond--label-action"> Browse </span>'
			{name}
			server="https://wudao-backend.herokuapp.com/api/v1/files/upload"
			allowMultiple={true}
			oninit={handleInit}
			onaddfile={handleAddFile}
			instantUpload={false}
		/>
	</div>
	<div class=" m-auto">
		<Button on:click={receiveData} kind="tertiary">获取数据</Button>
	</div>
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

	<div class="flex flex-col items-center justify-center">
		{#if !(featureTypeTargetCount == 1)}
			<InlineNotification
				hideCloseButton
				kind="warning"
				title="提示: "
				subtitle="请选择预测目标, 注意预测目标只能有1个"
			/>
		{/if}
		<div class="flex flex-row items-center justify-center">
			{#each selectedFeatures as f}
				<RadioButtonGroup
					legendText={f.value}
					orientation="vertical"
					labelPosition="right"
					bind:selected={f.type}
				>
					{#each featureTypes as p}
						<RadioButton labelText={p} value={p} />
					{/each}
				</RadioButtonGroup>
			{/each}
		</div>
		{#if featureTypeTargetCount == 1}
			<Button on:click={uploadFeatureInfo} kind="tertiary" class="mt-4">上传数据</Button>
		{/if}
	</div>
{/if}

<style>
	@import 'filepond/dist/filepond.css';
</style>
