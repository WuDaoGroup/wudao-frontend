<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { receiveBasicFileInfoApi, zscoreFilterInfoApi, originZscoreApi, confirmOriginZscoreApi } from '../api/fileApi'

    import {
		Button,
        DataTable,
		Pagination,
        Select,
        SelectItem
	} from 'carbon-components-svelte';

    let showTable = false;

    let basicData = {
        content:[],
        header:[]
    }
    const zscorechoice = ["请选择","Mean","Median"]
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
			} else {
				console.log('error!');
			}
		});
	}
    let bar = 1
    function zscoreFilter(){
        zscoreFilterInfoApi(filename, bar).then((response) => {
                if (response.status == 200) {
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
                    toast.push('选择成功');
                } else {
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

<Button on:click={originZscore} kind="tertiary">原始规划</Button>

<Select inline labelText="Carbon theme" bind:selected={zscoreType.key}>
    {#each zscorechoice as p}
		<SelectItem text={p} value={p} />
	{/each}
</Select>
<Button on:click={confirmOriginZscore} kind="tertiary">确定</Button>


<Button on:click={zscoreFilter} kind="tertiary">数据筛选</Button>