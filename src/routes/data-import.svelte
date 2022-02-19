<style>
	@import 'filepond/dist/filepond.css';
</style>

<script>
	import { analyzeUploadFileContentApi, uploadFileHeaderApi} from '../api/fileApi';
	import { DataTable, Pagination, RadioButtonGroup, RadioButton, InlineNotification } from 'carbon-components-svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { Button } from 'carbon-components-svelte';
	import { dataHeader, rowData } from '../stores/dataStore';
	import FilePond from 'svelte-filepond';
	import { goto } from '$app/navigation';
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

	let show = { showtable: false };
	let shift = { shiftbutton: false };
	let display = { displayfinal: false };
	let analysis = { showbutton: false };

	let pagination = {
		pageSize: 5,
		page: 1
	};
	let dataChoice = {
		header: []
	};

	function receiveData() {
		analyzeUploadFileContentApi(filename).then((response) => {
			dataChoice.header=[]
			if (response.status == 200) {

				rowData.data = response.data.content;
				dataHeader.header = response.data.header;
				console.log(rowData.data, 'aaa', dataHeader.header);
				for (let i = 0; i < dataHeader.header.length; i++) {
					let b = {
						key: dataHeader.header[i]['key'],
						value: dataHeader.header[i]['value'],
						choice: 0
					};
					dataChoice.header.push(b);
					console.log(dataHeader.header.length);
				}
				analysis.showbutton = true
			} else {
				console.log('error!');
			}
		});
	}

	let chosenheader = {
		header: []
	};
	export let yheader = {
		header: []
	};
	export let xheader = {
		header: []
	};

	function showTable() {
		if (show.showtable == false && shift.shiftbutton == false) {
			show.showtable = true;
			shift.shiftbutton = true;
		} else if (shift.shiftbutton == true) {
			show.showtable = !show.showtable;
		}
	}
	function showTableFirst() {
		if (show.showtable == false && shift.shiftbutton == false) {
			show.showtable = true;
			shift.shiftbutton = true;
		}
	}

	function showChosenTable() {
		console.log('xxx', dataChoice.header);
		yheader.header=[]
		xheader.header=[]
		chosenheader.header=[]
		for (let i = 0; i < dataChoice.header.length; i++) {
			if (dataChoice.header[i]['choice'] == 1) {
				yheader.header.push(dataHeader.header[i]);
			} else if (dataChoice.header[i]['choice'] == -1) {
				xheader.header.push(dataHeader.header[i]);
			}
		}
		console.log(yheader);
		console.log(xheader);
		console.log(dataHeader.header[1]['choice']);
		for (let i = 0; i < yheader.header.length; i++) {
			chosenheader.header.push(yheader.header[i]);
		}
		for (let i = 0; i < xheader.header.length; i++) {
			chosenheader.header.push(xheader.header[i]);
		}
		display.displayfinal = true;
	}
	function uploadHeader(){
		uploadFileHeaderApi(filename,yheader.header,xheader.header).then((response) => {
			if (response.status == 200) {
				toast.push('上传成功');
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
		<Button on:click={receiveData} kind="tertiary" >获取数据</Button>
	</div>
	<div class=" m-auto">
		{#if analysis.showbutton == true}
			<Button on:click={showTableFirst} kind="tertiary" >开始分析</Button>
		{/if}
	</div>
</div>

	{#if show.showtable == true}
		<div class="container mx-auto">
			<DataTable
				size="compact"
				sortable
				title="原始表格"
				description="数据种类：{dataHeader.header.length}"
				headers={dataHeader.header}
				pageSize={pagination.pageSize}
				page={pagination.page}
				rows={rowData.data}
			/>
			<Pagination
				bind:pageSize={pagination.pageSize}
				bind:page={pagination.page}
				totalItems={rowData.data.length}
				pageSizeInputDisabled
			/>
		</div>
	{/if}

	<div
		class="container m-auto"
	>
		{#if shift.shiftbutton == true}
		<!--
			{#if show.showtable == true}
				<button on:click={showTable} class="btn btn-info">Hide</button>
			{:else}
				<button on:click={showTable} class="btn btn-info">Show</button>
			{/if}
			<br />
		-->
			{#each dataChoice.header as header}
				<!--
			<RadioButtonGroup labelPosition="left" legendText={header.value} selected={header.choice} >
				<RadioButton  labelText="因变量" value={1}/>
				<RadioButton  labelText="自变量" value={-1}/>
				<RadioButton labelText="无影响"  value={0}/>
			</RadioButtonGroup>
		-->
				<div align="center">{header.value}</div>
				<div align="center">
					<label><input type="radio" bind:group={header.choice} value={1} />预测目标</label>
					<label><input type="radio" bind:group={header.choice} value={-1} />特征</label>
					<label><input type="radio" bind:group={header.choice} value={0} />无用变量</label>
				</div>
				<br />
				
			{/each}
			<br />
			<Button on:click={showChosenTable} kind="tertiary" class="m-center" >展示表格</Button>
		{/if}
		<!--
    <form on:submit={uploadData}>
        <input 
          type="file" 
          bind:files={file} />
        <br />
        <input type="submit" />
      </form>
    -->

		<head><meta name="referrer" content="no-referrer" /></head>
	</div>
	{#if display.displayfinal == true}
		<div class="container mx-auto">
			<DataTable
				size="compact"
				sortable
				title="处理后数据"
				description="已选预测目标：{yheader.header.length}个，已选特征：{xheader.header.length}个"
				headers={chosenheader.header}
				pageSize={pagination.pageSize}
				page={pagination.page}
				rows={rowData.data}
			/>
			<Pagination
				bind:pageSize={pagination.pageSize}
				bind:page={pagination.page}
				totalItems={rowData.data.length}
				pageSizeInputDisabled
			/>
		</div>
	{/if}
	{#if yheader.header.length == 1 & display.displayfinal == true}
		<Button on:click={uploadHeader} kind="tertiary" >上传数据</Button>
	{:else if display.displayfinal == true}
		<InlineNotification
		hideCloseButton
		kind="warning"
		title="提示:"
		subtitle="预测目标只能由1个"
	/>
	{/if}