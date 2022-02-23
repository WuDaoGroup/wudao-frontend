<script>
    let images = [];
    import { Button } from 'carbon-components-svelte';
	import { receiveBasicImageInfoApi } from '../api/fileApi';
    let showImage = false;
    function receiveData() {
        receiveBasicImageInfoApi('movie_data.xlsx').then((response) =>{
            if(response.status == 200){
                console.log(response);
                for(let i = 1; i <= response.data.data;i++) {
                    let str = 'http://localhost:8123/static/images/data.csv_selected_features_'+i+'.png'
                    console.log(str);
                    images.push(str);
                }
                console.log(images);
                showImage = true;
            } else{
				console.log('error!');
            }
        })
    }
</script>

<div class=" m-auto grid-cols-2 gap-4">
	<Button on:click={receiveData} kind="tertiary" class=" col-auto ">获取数据</Button>
</div>
{#if showImage == true}
{#each images as image}
<img src = {image}>
{/each}
{/if}