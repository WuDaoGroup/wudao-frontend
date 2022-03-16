<script>
	import '../app.css';
	import 'carbon-components-svelte/css/white.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	const options = {
		theme: {
			'--toastBackground': '#48BB78',
			'--toastBarBackground': '#2F855A'
		}
	};
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SideNav,
		SideNavItems,
		SideNavMenu,
    	SideNavMenuItem,
		SideNavLink,
		Content
	} from 'carbon-components-svelte';
	import UserAvatarFilledAlt20 from 'carbon-icons-svelte/lib/UserAvatarFilledAlt20';

	let isSideNavOpen = false;
	let isOpen1 = false;

	// show username in svelte/store
	import { base } from '$app/paths';
	import { user } from '../stores/userStore';
	let username;
	user.subscribe((value) => {
		username = value.username;
	});
</script>

<Header
	persistentHamburgerMenu={false}
	href="{base}/"
	company="悟道"
	platformName="WuDao"
	bind:isSideNavOpen
>
	<HeaderUtilities>
		<HeaderAction
			bind:isOpen={isOpen1}
			icon={UserAvatarFilledAlt20}
			closeIcon={UserAvatarFilledAlt20}
		>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Hi, {username}</HeaderPanelDivider>
				<HeaderPanelLink href="{base}/login">登录 | Sign In</HeaderPanelLink>
				<HeaderPanelLink href="{base}/login">登出 | Sign Out</HeaderPanelLink>
				<HeaderPanelLink href="{base}/register">注册 | Sign Up</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink text="数据导入" href="{base}/data-import" />
		<SideNavLink text="数据观察" href="{base}/data-observation" />
		<SideNavLink text="数据预处理" href="{base}/data-preprocessing" />
		<SideNavMenu text="分类预测">
			<SideNavMenuItem href="{base}/model-classification/svc" text="SVC" />
			<!-- <SideNavMenuItem href="/" text="Link 2" />
			<SideNavMenuItem href="/" text="Link 3" /> -->
		</SideNavMenu>
		<SideNavMenu text="回归预测">
			<SideNavMenuItem href="{base}/model-regression/xgboost" text="XGBoost" />
			<SideNavMenuItem href="{base}/model-regression/ordinaryLeastSquares" text="Ordinary Least Squares" />
			<!-- <SideNavMenuItem href="/" text="Link 2" />
			<SideNavMenuItem href="/" text="Link 3" /> -->
		</SideNavMenu>
		<SideNavLink text="可解释性" href="{base}/model-interpretable" />
		<SideNavLink text="因果推断" href="{base}/causal" />
	</SideNavItems>
</SideNav>

<Content>
	<SvelteToast {options} />
	<slot />
</Content>
