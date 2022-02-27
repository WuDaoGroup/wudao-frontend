<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { receiveBasicFileInfoApi, zscoreFilterInfoApi, originZscoreApi, confirmOriginZscoreApi } from '../api/fileApi'

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

    let showTable = false;

    let basicData = {
        content:[],
        header:[]
    }

    let currentIndex = 0;
    let getFileData = { current: true, complete: false, invalid: false};
    let dataZscore = { current: false, complete: false, disabled: true, invalid: false};
    let chooseZscoreMethod = { current: false, complete: false, disabled: true, invalid: false};
    let filterData = { current: false, complete: false, disabled: true, invalid: false};



    const zscorechoice = ["请选择", "均值填充", "中位数填充"]
    const defaultChoice = zscorechoice[0]
    let zscoreType = {'key':defaultChoice}

    let filename = 'data.csv'
    function receiveBasicData() {
		receiveBasicFileInfoApi(filename).then((response) => {
			if (response.status == 200) {
				console.log('response_data:', response.data)
                basicData.content = response.data.content
                basicData.header = response.data.header
                showTable = true;
                getFileData.current = false;
                getFileData.complete = true;
                getFileData.invalid = false;
                currentIndex++;
                dataZscore.disabled = false;
                dataZscore.current = true;
                toast.push("获取数据成功")
			} else {
                getFileData.current = false;
                getFileData.invalid = true;
				console.log('error!');
                toast.push("获取数据失败", {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
			}
		});
	}
    let bar
    function zscoreFilter(){
        zscoreFilterInfoApi(filename, bar).then((response) => {
                if (response.status == 200) {
                    filterData.current = false;
                    filterData.complete = true;
                    currentIndex++;
                    toast.push("筛选成功")
                    console.log('response_data:', response.data)
                } else {
                    
                    console.log('error!');
                }
            });

    }

    function originZscore(){
        originZscoreApi(filename).then((response) => {
                if (response.status == 200) {
                    console.log('response_data:', response.data)
                    dataZscore.current = false;
                    dataZscore.complete = true;
                    currentIndex++;
                    chooseZscoreMethod.current = true;
                    chooseZscoreMethod.disabled = false;
                    toast.push("归一化文件成功");
                } else {
                    console.log('error!');
                }
            });

    }

    function confirmOriginZscore(){
        console.log(zscoreType.key)
        confirmOriginZscoreApi(filename, zscoreType.key).then((response) => {
                if (response.status == 200) {
                    console.log('response_data:', response.data)
                    chooseZscoreMethod.invalid = false;
                    chooseZscoreMethod.current = false;
                    chooseZscoreMethod.complete = true;
                    currentIndex++;
                    filterData.disabled = false;
                    filterData.current = true;


                    toast.push('选择成功');
                } else {
                    chooseZscoreMethod.invalid = true;
                    chooseZscoreMethod.current = false;
                    toast.push("请选择类型", {
					theme: {
						'--toastBackground': '#F56565',
						'--toastBarBackground': '#C53030'
					}
				});
                    console.log('error!');
                }
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
		label="Get File"
	/>
	<ProgressStep
        bind:current={dataZscore.current}
        bind:complete={dataZscore.complete}
        bind:invalid={dataZscore.invalid}
        bind:disabled={dataZscore.disabled}
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

<Button on:click={receiveBasicData} kind="tertiary">获取数据</Button>
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

{/if}

<Button on:click={originZscore} kind="tertiary">数据归一化</Button>

<Select inline labelText="Carbon theme" bind:selected={zscoreType.key}>
    {#each zscorechoice as p}
		<SelectItem text={p} value={p} />
	{/each}
</Select>
<Button on:click={confirmOriginZscore} kind="tertiary">确定</Button>

<TextInput inline labelText="User name" placeholder="Enter user name..." bind:value={bar} />
<Button on:click={zscoreFilter} kind="tertiary">数据筛选</Button>