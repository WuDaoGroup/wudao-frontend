<script>
	import NavigationBar from '../components/NavigationBar.svelte';
	import { uploadDataApi } from '../api/userApi';
	import axios from 'axios';
	import { DataTable, Pagination } from "carbon-components-svelte";
  
  let show={showtable:false};
	let shift={shiftbutton:false};
	/*
    function uploadData() {
		uploadDataApi(file).then((response) => {
		    console.log(file)
		});
	}
*/

  

  let pagination = {
    "pageSize":5,
    "page":1
  }

  let dataheader={
    'header':[
      {key:'y',value:'First'},
      {key:'x1',value:'Second'},
      {key:'x2',value:'Third'}
    ]
  }
	let file={
		'data':[
			{
                'id':"a",
				'y': 2.5,
				'x1': 4,
				'x2': 7
			},
			{
                'id':"b",
				'y': 2.6,
				'x1': 5,
				'x2': 8
			},
			{
                'id':"c",
				'y': 2.7,
				'x1': 15,
				'x2': 9
			},
			{
                'id':"d",
				'y': 2.9,
				'x1': 9,
				'x2': 17
			},
			{
                'id':"e",
				'y': 3.2,
				'x1': 12,
				'x2': 5
			},
            {
                'id':"f",
				'y': 3.6,
				'x1': 15,
				'x2': 8
			}
		]
	}


  let rowData = [
    { 
      id:file.data[0]["id"],
      y: file.data[0]["y"],
      x1: file.data[0]["x1"],
      x2: file.data[0]["x2"]
    },
  ]
  for(let i=1;i<file.data.length;i++){
  let a={
      id:file.data[i]["id"],
      y: file.data[i]["y"],
      x1: file.data[i]["x1"],
      x2: file.data[i]["x2"]
    }
  rowData.push(a)
}
  console.log(rowData)
  //console.log(a)


  function showTable(){
    if (show.showtable==false&&shift.shiftbutton==false){
        show.showtable=true;
		    shift.shiftbutton=true;
        }
		else if(shift.shiftbutton==true){
			show.showtable=!show.showtable;
		}
    }
	function uploadData() {
		//event.preventDefault();
		let form = new FormData();
		form.append('file', file);
		fetch('http://127.0.0.1:8123/upload', {
			method: 'POST',
			headers: [['Content-Type', 'multipart/form-data']],
			body: form
		})
			.then((response) => {
				//const response = await axios.post('http://api.yhzhu.top/v1/web/files/upload', form);
				console.log(response);
				console.log(file);
			})
			.catch((error) => {
				console.log(err);
				console.log(file);
			});
	}
</script>

<NavigationBar />

<div class="container mx-auto">
	{#if show.showtable == true}
		<DataTable
			sortable
			title="Load balancers"
			description="Your organization's active load balancers."
			headers={dataheader.header}
			pageSize={pagination.pageSize}
			page={pagination.page}
			rows={rowData}
		/>
		<Pagination
			bind:pageSize={pagination.pageSize}
			bind:page={pagination.page}
			totalItems={rowData.length}
			pageSizeInputDisabled
		/>
	{/if}

	<div
		class="container mx-auto  rounded-xl p-8 w-1/5 border-4 border-indigo-600 border-light-blue-500 border-opacity-100"
	>
		<div class=" form-control">
			<input
				bind:files={file}
				type="file"
				name="uploadfile"
				id="uploadfile"
				accept=".csv,.xls,.xlsx"
				class="mx-auto  form-control"
			/>
		</div>
		<br />
		<button  on:click={showTable} class="mx-auto btn btn-success "
			>Upload</button
		>
		{#if shift.shiftbutton == true}
			{#if show.showtable == true}
				<button on:click={showTable} class="btn btn-info">Hide</button>
			{:else}
				<button on:click={showTable} class="btn btn-info">Show</button>
			{/if}
		{/if}
		<!--
    <form on:submit={uploadData}>
        <input 
          type="file" 
          bind:files={file} />
        <br />
        <input type="submit" />
      </form>
    -->
		<head><meta name="referrer" content="no-referrer" /></head>
	</div>
</div>
