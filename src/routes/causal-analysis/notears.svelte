<script>
    import { onMount } from 'svelte';
  	import {
      Button,
      DataTable,
      Pagination,
      Select,
      SelectItem,
      InlineNotification,
      ProgressIndicator,
      ProgressStep,
      TextInput,
      Tabs, Tab, TabContent,
      Loading
    } from 'carbon-components-svelte';
    import {baseLink} from '../../services/api.js'
    import { toast } from '@zerodevx/svelte-toast';
    import { user } from '../../stores/userStore';
    import { generateNotearsApi } from '../../api/causalApi.js';
    import { code } from '../../services/codeGen.js';

    let username;
    user.subscribe((value) => {
      username = value.username;
      console.log('username:', username)
    });

    let bar;

    function handleSplitBar(){
      if (bar >= 0 && bar <= 100){
        toast.push('阈值划分成功')
        return true
      } else {
        toast.push('阈值划分失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
        });
        return false
      }
    }

    // 当前状态
    let currentState = '等待生成...';

    function generate(){
      if (handleSplitBar()==false) {
        return
      }
      currentState = '生成中...'
      generateNotearsApi(username, bar/100, 'adaboost').then((response) => {
        if (response.status == 200) {
          currentState = '完成生成'
          console.log('response_data:', response.data);
          modelResult = response.data
          toast.push('模型成功生成');
          let image = document.getElementById('notears-image');
          image.src = `${baseLink}/static/data/${username}/images/causal/notears.png`
          image.alt = `AUROC Curve`
        } else {
          console.log('error!');
          toast.push('模型生成失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'

            }
          });
        }
      });
    }
</script>



<h1>因果发现</h1>

<div class="card w-full">
  <div class="card-body">
    <p>使用 NO TEARS 方法绘制出因果关系的 DAG 图。参考论文：DAGs with NO TEARS: Continuous Optimization for Structure Learning</p>
  </div>
</div>

<div class="divider"></div>

<div class="grid grid-cols-2 gap-4 w-full">
    <div class="grid flex-grow card rounded-box">
        <Tabs>
            <Tab label="Step 1: 划定阈值" />
            <Tab label="Step 2: 生成因果图" />

            <svelte:fragment slot="content">
              <TabContent>

                <div class="hero bg-base-200 h-96">
                    <div class="hero-overlay bg-opacity-60 rounded-lg"></div>
                    <div class="hero-content text-left text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">划定阈值</h2>
                        <p class="mb-5">不一定所有的特征变量之间都具有强因果关系，我们可以设置边系数阈值（0~1之间），而边系数大于该阈值的点与边则会出现在因果图中。</p>
                        <div class="flex items-end justify-between px-4 pt-4 items-center">
                          <input type="number" min="0" max="100" placeholder="输入阈值(%)" class="input input-bordered input-primary text-zinc-900 w-[14rem]" bind:value={bar}>
                          <button class="btn btn-primary" on:click={handleSplitBar}>确定阈值大小</button>
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
                      <h2 class="mb-5 text-5xl font-bold">NO TEARS</h2>
                      <p class="mb-5">一切准备就绪</p>
                      <button class="btn btn-primary" on:click={generate}>点击生成因果关系图</button>
                    </div>
                  </div>
                </div>

              </TabContent>

            </svelte:fragment>
        </Tabs>
    </div>

    <div class="grid flex-grow card rounded-box">

      <Tabs>
          <Tab label="因果关系图" />
          <svelte:fragment slot="content">
            <TabContent>

              {#if currentState != '完成生成'}
                <div class="alert shadow-lg mt-4">
                  <div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-info flex-shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span class="flex items-center ml-1">{currentState}</span>
                  </div>
                </div>
                <div class="flex flex-col items-center justify-center dmt-8">
                    <Loading withOverlay={false} />
                </div>
              {:else}
                  <div class="px-4 mx-auto container align-middle">
                    <div class="px-4 mx-auto container align-middle h-[32rem]">
                      <div class="flex flex-row justify-center items-center">
                        <img src='../../favicon.png' alt='尚未加载' id='notears-image'/>
                      </div>
                    </div>
                  </div>
              {/if}
            </TabContent>
          </svelte:fragment>
      </Tabs>
    </div>
 
  </div>