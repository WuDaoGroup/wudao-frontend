<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { receiveBasicFileInfoApi } from '../api/fileApi'

    import {
		Button,
        DataTable,
		Pagination,
	} from 'carbon-components-svelte';

    let showTable = false;


    let featureHeader = [
        {key:'name',value:'name'},
        {key:'count',value:'count'},
        {key:'missing_rate',value:'missing_rate'},
        {key:'mean',value:'mean'},
        {key:'max',value:'max'},
        {key:'min',value:'min'},
        {key:'std',value:'std'},
        {key:'median',value:'median'},
        

    ]


    let basicDataContent = []
    let basicData = {
        content:[],
        header:[]
    }
    let filename = 'data.csv'
    function receiveBasicData() {
		receiveBasicFileInfoApi(filename).then((response) => {
			if (response.status == 200) {
				console.log('response_data:', response.data)
                basicData.content = response.data.content
                basicData.header = response.data.feature
                showTable = true;
			} else {
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
<Button on:click={receiveBasicData} kind="tertiary">获取数据</Button>
{/if}