<script>
	import {baseLink} from '../services/api.js'
	import { analyzeUploadFileContentApi, uploadFileFeatureInfoApi } from '../api/dataApi';
	import {
		Button,
		DataTable,
		Pagination,
		RadioButtonGroup,
		RadioButton,
		InlineNotification,
		ProgressIndicator,
		ProgressStep,
    Tabs, Tab, TabContent,
    Loading
	} from 'carbon-components-svelte';
	import { browser } from '$app/env';
	import { toast } from '@zerodevx/svelte-toast';
	// import { dataHeader, rowData } from '../stores/dataStore';
	import FilePond from 'svelte-filepond';
	
  import {autogluonPredictorApi} from '../api/modelApi.js';

	import { filename, target, features, allFeatures } from '../stores/dataStore';
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

    // 当前状态
    let currentState = '等待预测...';

    // 处理模型的返回结果
    let modelResult=[]

    function train(){
      currentState = '预测中...'
      autogluonPredictorApi(username).then((response) => {
        
        if (response.status == 200) {
          currentState = '完成预测'
          console.log('response_data:', response.data);
          modelResult = response.data
          toast.push('模型成功预测');
        } else {
          console.log('error!');
          toast.push('模型预测失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });
    }

    function handleDownload(){
      const url = `${baseLink}/static/data/a/data_pred.csv`;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data_pred.csv'); //or any other extension
      document.body.appendChild(link);
      link.click();
    }
</script>


<h1>应用已部署模型完成预测</h1>

<div class="divider"></div>

<FilePond
bind:this={pond}
labelIdle='请先上传待预测数据 Drag & Drop your data (csv/xls/xlsx file) or <span class="filepond--label-action"> Browse </span>'
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

            <Tab label="应用预测" />

            <svelte:fragment slot="content">

              <TabContent>

                <div class="hero bg-base-200 h-96">
                  <div class="hero-overlay bg-opacity-60 rounded-lg"></div>
                  <div class="hero-content text-left text-neutral-content">
                    <div class="max-w-md">
                      <h2 class="mb-5 text-5xl font-bold">实现在线预测</h2>
                      <p class="mb-5">Powered by AutoGluon, 集成了CatBoost, LightGBM, 神经网络, XGBoost, KNN等各种训练方法, AutoML集成学习, 无需调参即有SOTA comparable的结果!</p>
                      <button class="btn btn-primary" on:click={train}>一键预测</button>
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


            <div class="alert shadow-lg mt-4">
              <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-info flex-shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span class="flex items-center ml-1">{currentState}</span>
              </div>
            </div>

            <div class="flex flex-col items-center justify-center mt-8">

              {#if currentState != '完成预测'}
                <Loading withOverlay={false} />
              {:else}
                <button class="btn btn-primary" on:click={handleDownload}>下载预测结果数据文件</button>
              {/if}

            </div>

          </TabContent>
 

        </svelte:fragment>
    </Tabs>

    </div>
 
  </div>

<style>
	@import 'filepond/dist/filepond.css';
</style>
