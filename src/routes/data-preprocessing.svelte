<script>
	import { toast } from '@zerodevx/svelte-toast';
	import { axios } from 'axios';
	import {
		receiveBasicFileInfoApi,
		zscoreFilterInfoApi,
		originZscoreApi,
		confirmOriginZscoreApi
	} from '../api/fileApi';
	import {
		Button,
		DataTable,
		Pagination,
		Select,
		SelectItem,
		InlineNotification,
		ProgressIndicator,
		ProgressStep,
		TextInput
	} from 'carbon-components-svelte';
	import { CodeSnippet } from 'carbon-components-svelte';
	let showTable = false;
	let hasSelected = false;
	let hasFilled = false;
	let basicData = {
		content: [],
		header: []
	};

	let currentIndex = 0;
	let getFileData = { current: true, complete: false, invalid: false };
	let chooseZscoreMethod = { current: false, complete: false, disabled: true, invalid: false };
	let filterData = { current: false, complete: false, disabled: true, invalid: false };

	const zscorechoice = ['请选择', '均值填充', '中位数填充'];
	const defaultChoice = zscorechoice[0];
	let zscoreType = { key: defaultChoice };
	let code = [];
	function receiveBasicData() {
		receiveBasicFileInfoApi(localStorage.filename).then((response) => {
			if (response.status == 200) {
				console.log('response_data:', response.data);
				code.push(response.data.code);
				basicData.content = response.data.content;
				basicData.header = response.data.header;
				showTable = true;
				getFileData.current = false;
				getFileData.complete = true;
				getFileData.invalid = false;
				currentIndex++;
				chooseZscoreMethod.current = true;
				chooseZscoreMethod.disabled = false;
				toast.push('归一化成功');
			} else {
				getFileData.invalid = true;
				console.log('error!');
				toast.push('归一化失败', {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
			}
		});
	}
	let bar;
	function zscoreFilter() {
		zscoreFilterInfoApi(localStorage.filename, bar).then((response) => {
			if (response.status == 200) {
				filterData.current = false;
				filterData.complete = true;
				currentIndex++;
				toast.push('筛选成功');
				console.log('LLLresponse_data:', response.data);
				code.push(response.data.code);
				console.log('code', code);
				hasSelected = !hasSelected;
			} else {
				console.log('error!');
			}
		});
	}

	function confirmOriginZscore() {
		console.log(zscoreType.key);
		confirmOriginZscoreApi(localStorage.filename, zscoreType.key).then((response) => {
			if (response.status == 200) {
				console.log('response_data:', response.data);
				code.push(response.data.code);
				chooseZscoreMethod.invalid = false;
				chooseZscoreMethod.current = false;
				chooseZscoreMethod.complete = true;
				currentIndex++;
				filterData.disabled = false;
				filterData.current = true;
				toast.push('选择成功');
				hasFilled = !hasFilled;
			} else {
				chooseZscoreMethod.invalid = true;
				toast.push('请选择类型', {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
				console.log('error!');
			}
		});
	}

	function downloadFile() {
		const url = `http://localhost:8123/static/data/${localStorage.filename}_download_code.ipynb`;
		const options = {
			method: 'GET',
			headers: {
				Accept: 'application/octet-stream',
				'Content-Type': 'application/octet-stream;charset=UTF-8'
			}
		};
		fetch(url, options)
			.then((response) => response.blob())
			.then((data) => {
				// console.log(data);
				const url = window.URL.createObjectURL(new Blob([data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'code.ipynb'); //or any other extension
				document.body.appendChild(link);
				link.click();
			});
	}

	let pagination = {
		pageSize: 10,
		page: 1
	};
</script>

<h1>数据预处理</h1>

<ProgressIndicator bind:currentIndex spaceEqually preventChangeOnClick>
	<ProgressStep
		bind:current={getFileData.current}
		bind:complete={getFileData.complete}
		bind:invalid={getFileData.invalid}
		label="Zscore Data"
	/>
	<ProgressStep
		bind:current={chooseZscoreMethod.current}
		bind:complete={chooseZscoreMethod.complete}
		bind:invalid={chooseZscoreMethod.invalid}
		bind:disabled={chooseZscoreMethod.disabled}
		label="Fill Data"
	/>
	<ProgressStep
		bind:current={filterData.current}
		bind:complete={filterData.complete}
		bind:invalid={filterData.invalid}
		bind:disabled={filterData.disabled}
		label="Filter Data"
	/>
</ProgressIndicator>
<div class="grid grid-cols-5 gap-4">
	<div class="col-span-2" />
	<Button on:click={receiveBasicData} kind="tertiary">获取数据</Button>
</div>
{#if showTable == true}
	<div class="container mx-auto">
		<DataTable
			size="compact"
			sortable
			title="原始表格"
			description="数据:5"
			headers={basicData.header}
			pageSize={pagination.pageSize}
			page={pagination.page}
			rows={basicData.content}
		/>
		<Pagination
			bind:pageSize={pagination.pageSize}
			bind:page={pagination.page}
			totalItems={basicData.content.length}
			pageSizeInputDisabled
		/>
	</div>
	<br />
	<CodeSnippet class="m-auto" code={code[0]} type="multi" />
{/if}

<div class="grid grid-col-5">
	<div class="col-span-1" />
	<div class="col-span-3">
		<Select inline labelText="选择填充方式" bind:selected={zscoreType.key}>
			{#each zscorechoice as p}
				<SelectItem text={p} value={p} />
			{/each}
		</Select>
	</div>
	<div class="col-span-1">
		<Button on:click={confirmOriginZscore} kind="tertiary">确定</Button>
	</div>
</div>
<br />
{#if hasFilled == true}
	<CodeSnippet class="m-auto" code={code[1]} type="multi" />
{/if}

<TextInput
	inline
	labelText="筛选数据"
	type="Number"
	placeholder="请填写筛选范围"
	bind:value={bar}
/>
<Button on:click={zscoreFilter} kind="tertiary">数据筛选</Button>
{#if hasSelected == true}
	<CodeSnippet class="m-auto" code={code[2]} type="multi" />
{/if}

<Button kind="tertiary" on:click={downloadFile}>下载文件</Button>
