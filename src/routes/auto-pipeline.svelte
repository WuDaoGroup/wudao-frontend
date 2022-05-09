<script>
	import {baseLink} from '../services/api.js'
	import {
    Tabs, Tab, TabContent,
    Loading
	} from 'carbon-components-svelte';
	import { toast } from '@zerodevx/svelte-toast';
	// import { dataHeader, rowData } from '../stores/dataStore';
	import FilePond from 'svelte-filepond';
  import {autogluonTrainerApi} from '../api/modelApi.js';
	import { goto } from '$app/navigation';
	import { user } from '../stores/userStore';
  
	let username;
	user.subscribe((value) => {
		username = value.username;
	});
	let uploadApiLink = `${baseLink}/api/v1/files/upload?username=${username}`;
	let pond;
	// the name to use for the internal file input
	let name = 'upload_file'; // 这个值就对应了form-data的key
	// handle filepond events
	function handleInit() {
		console.log('FilePond has initialised');
	}
	
	function handleAddFile(err, fileItem) {
		console.log('A file has been added', fileItem);
		if (!['xlsx', 'xls', 'csv'].includes(fileItem.fileExtension.toLowerCase())) {
			toast.push('文件类型错误', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
			fileItem.abortLoad();
			fileItem.abortProcessing();
		} else {
			toast.push('点击上传');
		}
	}

    let testPercent;

    function handleSplitDataset(){
      if (testPercent >= 50 && testPercent <= 95){
        toast.push('数据集划分成功')
        return true
      } else {
        toast.push('数据集划分失败，需在50%到95%之间', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
        });
        return false
      }
    }

    // 当前状态
    let currentState = '等待训练...';

    // 处理模型的返回结果
    let modelResult=[]

    function train(){
      if (handleSplitDataset()==false) {
        return
      }
      currentState = '训练中...'
      autogluonTrainerApi(username, testPercent/100).then((response) => {
        
        if (response.status == 200) {
          currentState = '完成训练'
          console.log('response_data:', response.data);
          modelResult = response.data
          toast.push('模型成功训练');
        } else {
          console.log('error!');
          toast.push('模型训练失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });
    }

</script>

<svelte:head>
  <meta charset="UTF-8" />
  <title>自动机器学习预测分析</title>
</svelte:head>

<div class="flex justify-between ...">
    <h1>自动机器学习预测分析</h1>

    <button class="border border-teal-500 bg-teal-500 text-white block rounded-sm font-bold py-4 px-6 ml-2 flex items-center" on:click={() => goto(`deploy/`)}>
      前往部署预测页
      <svg class="h-5 w-5 ml-2 fill-current" clasversion="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="-49 141 512 512" style="enable-background:new -49 141 512 512;" xml:space="preserve">
      <path id="XMLID_11_" d="M-24,422h401.645l-72.822,72.822c-9.763,9.763-9.763,25.592,0,35.355c9.763,9.764,25.593,9.762,35.355,0
          l115.5-115.5C460.366,409.989,463,403.63,463,397s-2.634-12.989-7.322-17.678l-115.5-115.5c-9.763-9.762-25.593-9.763-35.355,0
          c-9.763,9.763-9.763,25.592,0,35.355l72.822,72.822H-24c-13.808,0-25,11.193-25,25S-37.808,422-24,422z"/>
      </svg>
    </button>
</div>

<div class="divider"></div>

<FilePond
bind:this={pond}
labelIdle='请先上传数据 Drag & Drop your data (csv/xls/xlsx file) or <span class="filepond--label-action"> Browse </span>'
{name}
server={uploadApiLink}
allowMultiple={true}
oninit={handleInit}
onaddfile={handleAddFile}
instantUpload={false}
/>

<div class="grid grid-cols-2 gap-4 w-full">
    <div class="grid flex-grow card rounded-box">
        <Tabs>
            <Tab label="Step 1: 划分数据集" />
            <Tab label="Step 2: 模型训练" />

            <svelte:fragment slot="content">
              <TabContent>

                <div class="hero bg-base-200 h-96">
                    <div class="hero-overlay bg-opacity-60 rounded-lg"></div>
                    <div class="hero-content text-left text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">数据集划分</h2>
                        <p class="mb-5">在机器学习任务中，我们通常将已有的数据集划分为训练集和验证集两部分，其中训练集用来训练模型，而验证集则用来验证模型对于新样本的判别能力。</p>
                        <div class="flex items-end justify-between px-4 pt-4 items-center">
                          <input type="number" min="50" max="95" placeholder="输入训练集的比例(%)" class="input input-bordered input-primary text-zinc-900 w-[14rem]" bind:value={testPercent}>
                          <button class="btn btn-primary" on:click={handleSplitDataset}>确定划分比例</button>
                        </div>
                      </div>
                    </div>
                  </div>

              </TabContent>
              <TabContent>

                <div class="hero bg-base-200 h-96">
                  <div class="hero-overlay bg-opacity-60 rounded-lg"></div>
                  <div class="hero-content text-left text-neutral-content">
                    <div class="max-w-md">
                      <h2 class="mb-5 text-5xl font-bold">智能判断预测任务</h2>
                      <p class="mb-5">Powered by AutoGluon, 集成了CatBoost, LightGBM, 神经网络, XGBoost, KNN等各种训练方法, AutoML集成学习, 无需调参即有SOTA comparable的结果!</p>
                      <button class="btn btn-primary" on:click={train}>一键训练</button>
                    </div>
                  </div>
                </div>

              </TabContent>

            </svelte:fragment>
        </Tabs>
    </div>

    <div class="grid flex-grow card rounded-box">

      <Tabs>
        <Tab label="模型评估结果" />
        <svelte:fragment slot="content">
          <TabContent>

            {#if currentState != '完成训练'}
              <div class="alert shadow-lg mt-4">
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-info flex-shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="flex items-center ml-1">{currentState}</span>
                </div>
              </div>
              <div class="flex flex-col items-center justify-center mt-8">
                  <Loading withOverlay={false} />
              </div>
            {:else}
                <div class="px-4 mx-auto container align-middle">
                <div class="grid grid-cols-4 gap-2">

                    {#each modelResult as result}
                    <div class="shadow rounded-lg py-4 px-5 bg-white">
                        <div class="flex flex-row justify-center items-center">
                        <div>
                            <h6 class="text-sm">{result.indicator}</h6>
                            <h4 class="text-black text-xl font-bold text-left">{result.value}</h4>
                        </div>
                        </div>
                    </div>
                    {/each}

                </div>
                </div>
            {/if}


          </TabContent>
 

        </svelte:fragment>
    </Tabs>

    </div>
 
  </div>

<style>
	@import 'filepond/dist/filepond.css';
</style>
