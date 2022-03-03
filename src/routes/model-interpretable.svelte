<script>
    import { ComboBox } from "carbon-components-svelte";
    import { ContentSwitcher, Switch, Button } from "carbon-components-svelte";
    import { Select, SelectItem } from "carbon-components-svelte";
    import "../app.css";
    import { dimensionReductionApi, featureCorrApi, objectMatrixApi, pairwiseFeatureCorrApi } from '../api/explanationApi';
    import { toast } from '@zerodevx/svelte-toast';
    let explainationTypeIndex = 1;
    let explainationDimmensionIndex = 1;
    let explanationFeatures = {'dimmension':'2','type':'TSNE','learningrate':'100','target':'评分'};
    $:console.log(explanationFeatures);
    let filename='test.xlsx';
    let method="pearson";
    let showReduction = false;
    let showCorr =false;
    let showMatrix =false;
    let showPair =false;
    let featureCorrFeatures = {'object':'评分','k_number':'10'};
    let cols=['评分','投票人数','时长']

    function dimensionReduction(){
        dimensionReductionApi(filename, explanationFeatures).then((response)=>{
            if(response.status == 200){
                toast.push('降维过程完成');
                console.log('dimensionReductionImgAddr:',response.pic_addr);
                showReduction = true;
            }
        });
    }
    
    function featureCorr(){
        featureCorrApi(filename, method).then((response)=>{
            if(response.status == 200){
                toast.push('关联过程完成');
                console.log(response.pic_addr);
                showCorr = true;
            }
        });
    }

     function objectMatrix(){
         objectMatrixApi(filename, featureCorrFeatures).then((response)=>{
             if(response.status == 200){
                 toast.push('目标矩阵生成过程完成');
                 console.log(response.pic_addr);
                 showMatrix = true;
             }
        });
     }
     
     function pairwiseFeatureCorr(){
        pairwiseFeatureCorrApi(filename, cols).then((response)=>{
             if(response.status == 200){
                 toast.push('特征相关具体分布生成过程完成');
                 console.log(response.pic_addr);
                 showPair = true;
             }
        });
     }

    
</script>

<h1>可解释性AI页</h1>
<div class="flex flex-row px-4">
    <div class="container w-1/2 px-4 py-6 " >
        <h2>降维模型</h2>
        <Select labelText="降维模型选择" bind:selected={explanationFeatures.type} >
            <SelectItem value="PCA" text="PCA" />
            <SelectItem value="TSNE" text="TSNE" />
        </Select>
        <Select labelText="降维维数选择" bind:selected={explanationFeatures.dimmension}>
            <SelectItem value="2" text="2" />
            <SelectItem value="3" text="3" />
        </Select>
        <Button on:click={dimensionReduction}  kind='primary'>生成降维图像</Button>
        {#if showReduction == true}
            <img src="http://localhost:8123/static/images/test.xlsx_dimension_reduction_img.png">
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
                <img src="http://localhost:8123/static/images/test.xlsx_feature_corr_img.png">
            {/if} 
        </div>
        <div class="py-6">
            <Button on:click={objectMatrix}  kind='primary'>生成目标相关矩阵</Button>
            {#if showMatrix == true}
                <img src="http://localhost:8123/static/images/test.xlsx_object_matrix_img.png">
            {/if} 
        </div>
        <div class="py-6">
            <Button on:click={pairwiseFeatureCorr}  kind='primary'>生成特征相关具体分布</Button>
            {#if showPair == true}
                <img src="http://localhost:8123/static/images/test.xlsx_pairwise_feature_corr_img.png">
            {/if} 
        </div>
    </div>
    

</div>

