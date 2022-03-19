<script>
    import { ContentSwitcher, Switch, Button, TextInput, Select, SelectItem, SelectableTile, Checkbox } from "carbon-components-svelte";
    import { causalModelBuildApi} from '../api/causalApi';
    let causalFeatures = {'key':'High_limit; Churn; Income_Category; Education_Level; Customer_Age;','causal':'Customer_Age -> Education_Level; Customer_Age -> Income_Category;Education_Level -> Income_Category; Income_Category->High_limit;U->Income_Category;U->High_limit;U->Churn;High_limit->Churn; Income_Category -> Churn;'};
    let values = JSON.parse(localStorage.target);
    let group = values.slice(0, 2);
    let estimands = '' ;
    let estimate = '' ;
    let refute_r = '' ;
    let refute_d = '' ;
    let refute_p = '' ;
    function causalModelBuild(){
        causalModelBuildApi(localStorage.filename, causalFeatures).then((response)=>{
            if(response.status == 200){
                toast.push('因果推断过程完成');
                console.log(response);
                estimands =response.estimands;
                estimate = response.estimate;
                refute_r = response.refute_r;
                refute_d = response.refute_d;
                refute_p = response.refute_p;
            }
        })
    }
</script>

<h1>因果推断页</h1>
<div class="flex flex-row px-4">
    <div class="container  px-4 py-6 " >
        <h2>因果推断模型</h2>
        <Select labelText="因果选择" >
            {#each JSON.parse(localStorage.target) as p}
                <SelectItem value={p} text={p} />
			{/each}
        </Select>
        <div role="group" aria-label="selectable tiles" >
            {#each values as value}
                <Checkbox bind:group labelText={value} {value} />
            {/each}
          </div>
        <TextInput bind:value={causalFeatures.causal} ></TextInput>
        <br/>
        <Button  on:click={causalModelBuild}  kind='primary'>开始因果推断分析</Button>
        <text bind={estimands}> </text>
        <text bind={estimate}> </text>
        <text bind={refute_r}> </text>
        <text bind={refute_d}> </text>
        <text bind={refute_p}> </text>
    </div>
</div>