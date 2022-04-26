<script>
    import { browser } from '$app/env';
    import { goto } from '$app/navigation';
	import {
        Button,
		DataTable,
		// Pagination,
		RadioButtonGroup,
		RadioButton,
		InlineNotification,
		ProgressIndicator,
		ProgressStep
	} from 'carbon-components-svelte';
    import {target, features, allFeatures} from '../stores/dataStore';
    import { analyzeUploadFileContentApi, uploadFileFeatureInfoApi } from '../api/dataApi';
    import Table, { Pagination, Row, Search, Sort } from '../components/Table.svelte';
    import { toast } from '@zerodevx/svelte-toast';
	import { user } from '../stores/userStore';
	let username;
	user.subscribe((value) => {
		username = value.username;
	});

    let rows = [];
    let page = 0; // first page
    let pageSize = 5; //optional, 5 by default

    // let selectedFeatures = []
    allFeatures.subscribe((value) => {
		// selectedFeatures = value;
        rows = value;
        console.log(rows)
	});
    console.log('features:', features)
    $: console.log(rows)
    const featureTypes = ['target', 'feature', 'useless'];
	// let targetExplanation = [];

	$: featureTypeTargetCount = rows.filter((e) => e.type === 'target').length;

	function uploadFeatureInfo() {
		uploadFileFeatureInfoApi(username, rows).then((response) => {
			if (response.status == 200) {
				toast.push('上传数据的特征信息成功');
				console.log('data feature info:', response.data);
				const dataTarget = response.data.target;
                const dataFeatures = response.data.features;
                const dataAllFeatures = rows;

				target.set(dataTarget);
                features.set(dataFeatures);
                allFeatures.set(dataAllFeatures);
				if (browser) {
					localStorage.setItem('target', JSON.stringify(dataTarget));
                    localStorage.setItem('features', JSON.stringify(dataFeatures));
                    localStorage.setItem('all_features', JSON.stringify(dataAllFeatures));
				}
				goto(`/data-preprocessing`);
			}
		});
	}

</script>



<div class="flex flex-row items-center justify-between">

    <h1 class="mt-2">选择预测目标和特征</h1>

    {#if !(featureTypeTargetCount == 1)}
        <!-- <InlineNotification
            hideCloseButton
            kind="warning"
            title="提示: "
            subtitle="请选择预测目标和特征信息, 注意预测目标只能有1个"
        /> -->
    
        <div class="alert shadow-lg ml-8">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-info flex-shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="flex items-center ml-1">提示：请选择预测目标和特征信息, 注意预测目标只能有1个</span>
            </div>
        </div>
    {/if}

    {#if featureTypeTargetCount == 1}
        <Button on:click={uploadFeatureInfo} kind="tertiary" class="mt-4">上传特征标注</Button>
    {/if}

</div>

<div class="divider"></div>

<div class="flex flex-col items-center justify-center">
    <div class="flex flex-col items-center justify-center">
        <!-- {#each selectedFeatures as f}
            <RadioButtonGroup
                legendText={f.value}
                orientation="horizontal"
                labelPosition="right"
                bind:selected={f.type}
            >
                {#each featureTypes as p}
                    <RadioButton labelText={p} value={p} />
                {/each}
            </RadioButtonGroup>
        {/each} -->

        <Table {page} {pageSize} {rows} let:rows={rows}>

            <tbody>
              {#each rows as row, index (row)}
                <Row {index}>
                <RadioButtonGroup
                    legendText={row.value}
                    orientation="horizontal"
                    labelPosition="right"
                    bind:selected={row.type}
                >
                    {#each featureTypes as p}
                        <RadioButton labelText={p} value={p} />
                    {/each}
                </RadioButtonGroup>
                </Row>
              {/each}
            </tbody>
        </Table>
    </div>
    <!-- <Pagination totalItems={102} pageSizes={[10, 15, 20]} /> -->
</div>