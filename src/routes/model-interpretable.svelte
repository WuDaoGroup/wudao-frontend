

<script>
    import { ComboBox } from "carbon-components-svelte";
    import { browser } from '$app/env';
    import { ContentSwitcher, Switch, Button, TextInput, Select, SelectItem, SelectableTile, Checkbox } from "carbon-components-svelte";
    import "../app.css";
    import { dimensionReductionApi, featureCorrApi, objectMatrixApi, pairwiseFeatureCorrApi } from '../api/explanationApi';
    import { toast } from '@zerodevx/svelte-toast';
    let explainationTypeIndex = 1;
    let explainationDimmensionIndex = 1;
    $: explanationFeatures = {'dimmension':'2','type':'TSNE','learningrate':'100','target':'评分'};
    $:{
        explanationFeatures = {'dimmension':'2','type':'TSNE','learningrate':'100','target':'评分'};
        showReduction=false;
    }
    $:console.log(explanationFeatures);
    let method="pearson";
    let showReduction = false;
    let showCorr =false;
    let showMatrix =false;
    let showPair =false;
    let featureCorrFeatures = {'object':'评分','k_number':'10'};
    let cols=['评分','投票人数','时长']
    let values = JSON.parse(localStorage.target);
    let group = values.slice(0, 2);

    function dimensionReduction(){
        dimensionReductionApi(localStorage.filename, explanationFeatures).then((response)=>{
            if(response.status == 200){
                toast.push('降维过程完成');
                console.log('dimensionReductionImgAddr:',response.pic_addr);
                showReduction = true;
            }
        });
    }
    
    function featureCorr(){
        featureCorrApi(localStorage.filename, method).then((response)=>{
            if(response.status == 200){
                toast.push('关联过程完成');
                console.log(response.pic_addr);
                showCorr = true;
            }
        });
    }

     function objectMatrix(){
         objectMatrixApi(localStorage.filename, featureCorrFeatures).then((response)=>{
             if(response.status == 200){
                 toast.push('目标矩阵生成过程完成');
                 console.log(response.pic_addr);
                 showMatrix = true;
             }
        });
     }
     
     function pairwiseFeatureCorr(){
        pairwiseFeatureCorrApi(localStorage.filename, group).then((response)=>{
             if(response.status == 200){
                 toast.push('特征相关具体分布生成过程完成');
                 console.log(response.pic_addr);
                 showPair = true;
             }
        });
     }
     function changeShow(){
        showReduction = false;
     }
    
</script>


<h1>可解释性AI页</h1>
<div class="flex flex-row px-4">
    <div class="container w-1/2 px-4 py-6 " >
        <h2>降维模型</h2>
        <h1>{localStorage.filename}</h1>
        <Select labelText="降维模型选择" bind:selected={explanationFeatures.type}>
            <SelectItem value="PCA" text="PCA" on:click={changeShow} />
            <SelectItem value="TSNE" text="TSNE" on:click={changeShow} />
        </Select>
        <Select labelText="降维维数选择" bind:selected={explanationFeatures.dimmension}>
            <SelectItem value="2" text="2" />
            <SelectItem value="3" text="3" />
        </Select>
        <Select labelText="降维维数选择" bind:selected={explanationFeatures.target}>
            {#each JSON.parse(localStorage.target) as p}
                <SelectItem value={p} text={p} />
			{/each}
        </Select>
        <br/>
        <TextInput class="py-10" inline labelText="筛选数据" type="Number" placeholder="请填写筛选范围" bind:value={explanationFeatures.learningrate} />
        <br/>
        <Button  on:click={dimensionReduction}  kind='primary'>生成降维图像</Button>
        {#if showReduction == true}
            <img src="http://localhost:8123/static/images/{localStorage.filename}_dimension_reduction_img.png">
        {/if}   
    </div>
    
    <div class=" container w-1/2 px-4" >
        <div class="py-6 ">
            <h2>特征相关性</h2>
            <Select labelText="特征关联方法选择" bind:selected={method} >
                <SelectItem value="pearson" text="pearson" />
                <SelectItem value="spearman" text="spearman " />
                <SelectItem value="kendall" text="kendall  " />
            </Select>
            <Button on:click={featureCorr}  kind='primary'>生成特征关联图</Button>
            {#if showCorr == true}
                <img src="http://localhost:8123/static/images/{localStorage.filename}_feature_corr_img.png">
            {/if} 
        </div>
        <div class="py-6">
            <Select labelText="降维维数选择" bind:selected={featureCorrFeatures.object}>
                {#each JSON.parse(localStorage.target) as p}
                    <SelectItem value={p} text={p} />
                {/each}
            </Select>
            <Button on:click={objectMatrix}  kind='primary'>生成目标相关矩阵</Button>
            {#if showMatrix == true}
                <img src="http://localhost:8123/static/images/{localStorage.filename}_object_matrix_img.png">
            {/if} 
        </div>
        <div class="py-6">
            <div role="group" aria-label="selectable tiles" >
                {#each values as value}
                    <Checkbox bind:group labelText={value} {value} />
                {/each}
              </div>
              <strong>Selected:</strong>
                {JSON.stringify(group)}
            <br/>
            <Button on:click={pairwiseFeatureCorr}  kind='primary'>生成特征相关具体分布</Button>
            {#if showPair == true}
                <img src="http://localhost:8123/static/images/{localStorage.filename}_pairwise_feature_corr_img.png">
            {/if} 
        </div>
    </div>
    

</div>

