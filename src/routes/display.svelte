<script>
    import NavigationBar from "../components/NavigationBar.svelte"
    import { uploadDataApi } from '../api/userApi';
    let file =[];

    function uploadData() {
		uploadDataApi(file).then((response) => {
		console.log(file)
		});
	}




</script>

<NavigationBar></NavigationBar>

<div>
    <input  bind:value={file} type="file" name="uploadfile" id="uploadfile" accept=".csv,.xls,.xlsx" >
    <button on:click={uploadData} class="btn btn-success">success</button>
</div>