<script>
	import '../app.css';
	import 'carbon-components-svelte/css/white.css';
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SideNav,
		SideNavItems,
		SideNavLink,
		SkipToContent,
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

<Header persistentHamburgerMenu={false} href="{base}/" company="悟道" platformName="WuDao" bind:isSideNavOpen>
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
		<SideNavLink text="模型构建" href="{base}/model-development" />
		<SideNavLink text="可解释性" href="{base}/model-interpretable" />
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
