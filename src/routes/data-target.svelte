<script>
    import { browser } from '$app/env';
    import { goto } from '$app/navigation';
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
    import {target, features} from '../stores/dataStore';
    import { analyzeUploadFileContentApi, uploadFileFeatureInfoApi } from '../api/fileApi';
    import { toast } from '@zerodevx/svelte-toast';

    let selectedFeatures = []
    features.subscribe((value) => {
		selectedFeatures = value;
        console.log(selectedFeatures)
	});
    console.log('features:', features)
    $: console.log(selectedFeatures)
    const featureTypes = ['target', 'feature', 'useless'];
	let targetExplanation = [];

	$: featureTypeTargetCount = selectedFeatures.filter((e) => e.type === 'target').length;

	function uploadFeatureInfo() {
		uploadFileFeatureInfoApi(localStorage.filename, selectedFeatures).then((response) => {
			if (response.status == 200) {
				toast.push('上传数据的特征信息成功');
				console.log('data feature info:', response.data);

				const dataTarget = targetExplanation;
				target.set(dataTarget);
				if (browser) {
					localStorage.setItem('target', JSON.stringify(dataTarget));
				}
				goto(`/data-preprocessing`);
			}
		});
	}
</script>

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