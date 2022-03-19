<script>
	import {baseLink} from '../services/api.js'
	import { analyzeUploadFileContentApi, uploadFileFeatureInfoApi } from '../api/dataApi';
	import {
		Button,
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
	// import { dataHeader, rowData } from '../stores/dataStore';
	import FilePond from 'svelte-filepond';
	

	import { filename, target, features } from '../stores/dataStore';
	import { goto } from '$app/navigation';

	import { user } from '../stores/userStore';
	let username;
	user.subscribe((value) => {
		username = value.username;
	});
	let uploadApiLink = `${baseLink}/api/v1/files/upload?username=${username}`;
	// 接收到的结构化数据 (原始数据)
	let rawData = {
		features: [],
		content: []
	};
	let selectedFeatures = [];
    const featureTypes = ['target', 'feature', 'useless'];
	const defaultChoice = featureTypes[1];

	let currentIndex = 0;
	let checkUploadFiles = { current: true, complete: false, invalid: false };
	let analyzeDataFiles = { current: false, complete: false, disabled: true };


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
			// const dataFilename = fileItem.filename;
			// filename.set(dataFilename);
			// if (browser) {
			// 	localStorage.setItem('filename', JSON.stringify(dataFilename));
			// }
			toast.push('点击上传');
			// localStorage.filename= localStorage.filename.replace("\"", "").replace("\"","")
			// console.log(dataFilename, localStorage.filename)
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
		analyzeUploadFileContentApi(username).then((response) => {
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
				features.set(selectedFeatures)
				if (browser) {
					localStorage.setItem('features', JSON.stringify(selectedFeatures));
				}
				(analyzeDataFiles.current = false), (analyzeDataFiles.complete = true);
				currentIndex = 2;
				showTable = true
			} else {
				console.log('error!');
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

</ProgressIndicator>

<h1 class="mt-4">数据是悟道之源</h1>
<div class = "divider"></div>

<div class="grid grid-rows-2 grid-cols-5 gap-4 mt-4">
	<div class="row-span-2 col-span-4">
		<FilePond
			bind:this={pond}
			labelIdle='Drag & Drop your data (csv/xls/xlsx file) or <span class="filepond--label-action"> Browse </span>'
			{name}
			server={uploadApiLink}
			allowMultiple={true}
			oninit={handleInit}
			onaddfile={handleAddFile}
			instantUpload={false}
		/>
	</div>
	<div class=" m-auto">
		<Button on:click={receiveData} kind="tertiary">上传完成后查看数据</Button>
	</div>
</div>

{#if showTable == true}
	<div class="container mx-auto w-3/4">
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

		<div class="mt-4"><Button on:click={()=>{goto('/data-target')}} kind="tertiary">进入下一步</Button></div>
		
	</div>
{:else}

	<p class="text-2xl text-center">当前数据尚未导入，导入后显示数据表格</p>
	
{/if}

<style>
	@import 'filepond/dist/filepond.css';
</style>
