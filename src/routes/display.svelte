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


	let file={
		'data':[
			{
				'y': 2.5,
				'x1': 4,
				'x2': 7
			},
			{
				'y': 2.6,
				'x1': 5,
				'x2': 8
			},
			{
				'y': 2.7,
				'x1': 15,
				'x2': 9
			},
			{
				'y': 2.9,
				'x1': 9,
				'x2': 17
			},
			{
				'y': 3.2,
				'x1': 12,
				'x2': 5
			}
		]
	}

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
{#if show.showtable==true}
<DataTable
  sortable
  title="Load balancers"
  description="Your organization's active load balancers."
  headers={[
    { key: "name", value: "Name" },
    { key: "protocol", value: "Protocol" },
    { key: "port", value: "Port" },
    { key: "cost", value: "Cost", display: (cost) => cost + " €" },
    {
      key: "expireDate",
      value: "Expire date",
      display: (date) => new Date(date).toLocaleString(),
      sort: (a, b) => new Date(a) - new Date(b),
    },
  ]}
  pageSize={pagination.pageSize}
  page={pagination.page}
  rows={[
    {
      id: "a",
      name: "Load Balancer 3",
      protocol: "HTTP",
      port: 3000,
      cost: 100,
      expireDate: "2020-10-21",
    },
    {
      id: "b",
      name: "Load Balancer 1",
      protocol: "HTTP",
      port: 443,
      cost: 200,
      expireDate: "2020-09-10",
    },
    {
      id: "c",
      name: "Load Balancer 2",
      protocol: "HTTP",
      port: 80,
      cost: 150,
      expireDate: "2020-11-24",
    },
    {
      id: "d",
      name: "Load Balancer 6",
      protocol: "HTTP",
      port: 3000,
      cost: 250,
      expireDate: "2020-12-01",
    },
    {
      id: "e",
      name: "Load Balancer 4",
      protocol: "HTTP",
      port: 443,
      cost: 550,
      expireDate: "2021-03-21",
    },
    {
      id: "f",
      name: "Load Balancer 5",
      protocol: "HTTP",
      port: 80,
      cost: 400,
      expireDate: "2020-11-14",
    },
  ]}
/>
<Pagination
  bind:pageSize={pagination.pageSize}
  bind:page={pagination.page}
  totalItems={6}
  pageSizeInputDisabled
/>
  
{/if}

<div class="container mx-auto  rounded-xl p-8 w-1/5 border-4 border-indigo-600 border-light-blue-500 border-opacity-100">
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
	<button on:click={uploadData} on:click={showTable} class="mx-auto btn btn-success "
		>Upload</button
	>
	{#if shift.shiftbutton==true}
		{#if show.showtable==true}
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