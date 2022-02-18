<style>
    @import 'filepond/dist/filepond.css';
</style>

<script>
	import NavigationBar from '../components/NavigationBar.svelte';
	import { analyzeUploadFileContentApi } from '../api/fileApi';
	import axios from 'axios';
	import { DataTable, Pagination, RadioButtonGroup, RadioButton } from 'carbon-components-svelte';


	// 上传文件组件所需要导入的包、要定义的变量和方法
	import { FileUploader } from "carbon-components-svelte";
	let fileVar;
    import FilePond, { registerPlugin, supported } from 'svelte-filepond';
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
			fileItem.abortLoad()
			fileItem.abortProcessing()
			console.log('文件需为Excel或CSV格式')
		}
		filename = fileItem.filename
    }

	let xy = 0;
	let show = { showtable: false };
	let shift = { shiftbutton: false };
	let display = { displayfinal: false };

	let pagination = {
		pageSize: 5,
		page: 1
	};
	let file = {
		data:[]
	};
	let dataheader = {
		header: []
	};
	let rowData = []
	let datachoice = {
		header: []
	};
	

	function receiveData(){
		analyzeUploadFileContentApi(filename).then((response) => {
			if (response.status == 200) {
				rowData=response.data.content
				dataheader.header=response.data.header
				console.log(rowData,"aaa",dataheader.header)
				for (let i = 0; i < dataheader.header.length; i++) {
					let b = {
					key: dataheader.header[i]['key'],
					value: dataheader.header[i]['value'],
					choice: 0
				};
				datachoice.header.push(b);
				console.log(dataheader.header.length)
				}


			} else {
				console.log('error!')
			}
		});
		
		
	}
	

	

	let chosenheader = {
		header: []
	};
	let yheader = {
		header: []
	};
	let xheader = {
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
		console.log("xxx",datachoice.header)
		for (let i = 0; i < datachoice.header.length; i++) {
			if (datachoice.header[i]['choice'] == 1) {
				yheader.header.push(dataheader.header[i]);
			} else if (datachoice.header[i]['choice'] == -1) {
				xheader.header.push(dataheader.header[i]);
			}
		}
		console.log(yheader);
		console.log(xheader);
		console.log(dataheader.header[1]['choice']);
		for (let i = 0; i < yheader.header.length; i++) {
			chosenheader.header.push(yheader.header[i]);
		}
		for (let i = 0; i < xheader.header.length; i++) {
			chosenheader.header.push(xheader.header[i]);
		}
		display.displayfinal = true;
	}
</script>

<NavigationBar />

	<FilePond
		bind:this={pond}
		{name}
		server="http://localhost:8123/api/v1/files/upload"
		allowMultiple={true}
		oninit={handleInit}
		onaddfile={handleAddFile}
	/>


<div class="container mx-auto">

	<button on:click={receiveData} class="mx-auto btn btn-success "
		>获取数据</button
	>
	<button on:click={showTableFirst}  class="mx-auto btn btn-success "
		>开始分析</button
	>

	{#if show.showtable == true}
		<div class="container w-3/4 mx-auto">
			<DataTable
				sortable
				title="原始表格"
				description="数据种类：{dataheader.header.length}"
				headers={dataheader.header}
				pageSize={pagination.pageSize}
				page={pagination.page}
				rows={rowData}
			/>
			<Pagination
				bind:pageSize={pagination.pageSize}
				bind:page={pagination.page}
				totalItems={rowData.length}
				pageSizeInputDisabled
			/>
		</div>
	{/if}

	<div
		class="container mx-auto  rounded-xl p-8 w-1/5 border-4 border-indigo-600 border-light-blue-500 border-opacity-100"
	>

		{#if shift.shiftbutton == true}
			{#if show.showtable == true}
				<button on:click={showTable} class="btn btn-info">Hide</button>
			{:else}
				<button on:click={showTable} class="btn btn-info">Show</button>
			{/if}
			<br />
			{#each datachoice.header as header}
				<!--
			<RadioButtonGroup labelPosition="left" legendText={header.value}>
				<RadioButton  labelText="因变量" bind:selected={header.choice} value= {1} />
				<RadioButton  labelText="自变量" bind:selected={header.choice} value= {-1} />
				<RadioButton labelText="无影响" value="None" />
			</RadioButtonGroup>
		-->
			<label align="left">{header.value}</label>
				<div align="right">
					<label><input type="radio" bind:group={header.choice} value={1} />预测目标</label>
					<label><input type="radio" bind:group={header.choice} value={-1} />特征</label>
					<label><input type="radio" bind:group={header.choice} value={0} />无用变量</label>
				</div>
				<br />
			{/each}
			<br />
			<button on:click={showChosenTable} class="mx-auto btn btn-success ">Confirm</button>
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
		<div class="container w-3/4 mx-auto">
			<DataTable
				sortable
				title="处理后数据"
				description="已选预测目标：{yheader.header.length}个，已选特征：{xheader.header.length}个"
				headers={chosenheader.header}
				pageSize={pagination.pageSize}
				page={pagination.page}
				rows={rowData}
			/>
			<Pagination
				bind:pageSize={pagination.pageSize}
				bind:page={pagination.page}
				totalItems={rowData.length}
				pageSizeInputDisabled
			/>
		</div>
	{/if}
</div>
