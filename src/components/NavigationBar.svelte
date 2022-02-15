<script>
    import { base } from '$app/paths';
    import { user } from '../stores/userStore';
    let username;
    user.subscribe(value => {username = value.username})

</script>
  

<div class="flex justify-center">
<div class="navbar w-11/12 shadow-lg bg-neutral text-neutral-content rounded-box">

    <div class="flex-1 px-2 mx-2">
      <div class="items-stretch hidden lg:flex">
        <a class="btn btn-ghost btn-sm rounded-btn" href="{base}/">
                悟道-Home
              </a> 
        <a class="btn btn-ghost btn-sm rounded-btn" href="{base}/data-import">
                数据导入
              </a>
        <a class="btn btn-ghost btn-sm rounded-btn"  href="{base}/data-observation">
                数据观察
              </a>
        <a class="btn btn-ghost btn-sm rounded-btn"  href="{base}/data-preprocessing">
                数据预处理
              </a> 
        <a class="btn btn-ghost btn-sm rounded-btn"  href="{base}/model-development">
                模型构建
              </a>
        <a class="btn btn-ghost btn-sm rounded-btn"  href="{base}/model-interpretable">
                可解释性
              </a>
      </div>
    </div> 
    <div class="flex-none">
        <div class="dropdown dropdown-end dropdown-hover">
            <div tabindex="0" class="m-1 btn">{username}</div> 
            <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-40">
              <li>
                <a href="{base}/login"><center>登录</center></a>
              </li> 
              <li>
                <a href="{base}/login">登出</a>
              </li> 
              <li>
                <a href="{base}/register">注册</a>
              </li>
            </ul>
          </div>
    </div> 
    <div class="flex-none">
        <div class="avatar">
          <div class="rounded-full w-10 h-10 m-1">
            <img src="https://i.pravatar.cc/500?img=32">
          </div>
        </div>
      </div>
  </div>
</div>