<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { Tabs, Tab, TabContent } from "carbon-components-svelte";
    import { user } from '../stores/userStore';
    import {zscoreDataApi} from '../api/fileApi.js';

    let username;
    user.subscribe((value) => {
      username = value.username;
      console.log('username:', username)
    });

    console.log('username2:', username)
    function handleZscoreData(){
      console.log('username3:', username)
      zscoreDataApi(username).then((response) => {
        if (response.status == 200) {
          console.log('response_data:', response.data);
          toast.push('归一化成功');
        } else {

          console.log('error!');
          toast.push('归一化失败', {
            theme: {
              '--toastBackground': '#F56565',
              '--toastBarBackground': '#C53030'
            }
          });
        }
      });
    }


</script>



<h1>数据预处理</h1>

<div class="divider"></div>

<div class="flex w-full">
    <div class="grid flex-grow card rounded-box place-items-center">
        <Tabs>
            <Tab label="Step 1: 数据标准化" />
            <Tab label="Step 2: 缺失填充" />
            <Tab label="Step 3: 离群值筛选" />
            <Tab label="Step 4: 下载代码" />
            <svelte:fragment slot="content">
              <TabContent>

                <div class="hero" style="background-image: url(http://pic.616pic.com/bg_w1180/00/00/44/AWmPutVSXZ.jpg);">
                    <div class="hero-overlay bg-opacity-60"></div>
                    <div class="hero-content text-center text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">数据标准化</h2>
                        <p class="mb-5">由于不同特征的数据的尺度、范围不同，为了消除特征的不齐性，我们需要将数据作标准化处理，使其scale到均值为0，方差为1的分布。</p>
                        <button class="btn btn-primary" on:click={handleZscoreData}>使用Z-Score标准化</button>
                      </div>
                    </div>
                  </div>

              </TabContent>
              <TabContent>
                <div class="hero" style="background-image: url(http://pic.616pic.com/bg_w1180/00/00/44/AWmPutVSXZ.jpg);">
                    <div class="hero-overlay bg-opacity-60"></div>
                    <div class="hero-content text-center text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">缺失值填充</h2>
                        <p class="mb-5">对于机器学习模型而言，我们必须为每一个特征赋上值，因此需要作补全处理。常用的补全方式有：均值填充以及中位数填充。</p>
                        <button class="btn btn-primary">开始填充缺失数据</button>
                      </div>
                    </div>
                  </div>
              </TabContent>
              <TabContent>
                <div class="hero" style="background-image: url(http://pic.616pic.com/bg_w1180/00/00/44/AWmPutVSXZ.jpg);">
                    <div class="hero-overlay bg-opacity-60"></div>
                    <div class="hero-content text-center text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">数据筛选</h2>
                        <p class="mb-5">很多时候，数据中会出现异常分布，极大或极小，这通常是因为错误输入等原因导致。我们可根据Z-Score值的大小作筛选。</p>
                        <button class="btn btn-primary">确定筛选方法</button>
                      </div>
                    </div>
                  </div>
              </TabContent>
              <TabContent>

                <div class="hero" style="background-image: url(http://pic.616pic.com/bg_w1180/00/00/44/AWmPutVSXZ.jpg);">
                    <div class="hero-overlay bg-opacity-60"></div>
                    <div class="hero-content text-center text-neutral-content">
                      <div class="max-w-md">
                        <h2 class="mb-5 text-5xl font-bold">代码下载</h2>
                        <p class="mb-5">我们为您提供了当前位置所有数据处理部分的代码，以Python Jupyter Notebook的形式呈现，便于您的调试。</p>
                        <button class="btn btn-primary">下载Jupyter代码</button>
                      </div>
                    </div>
                  </div>

              </TabContent>
            </svelte:fragment>
        </Tabs>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="grid flex-grow card rounded-box">

      <Tabs>
        <Tab label="初始态" />
        <Tab label="处理后" />
        <svelte:fragment slot="content">
          <TabContent>

            <h2>
              初始状态的数据统计信息
            </h2>

          </TabContent>
          <TabContent>
            <h2>
              处理后的数据的统计信息
            </h2>
          </TabContent>

        </svelte:fragment>
    </Tabs>

    </div>
 
  </div>