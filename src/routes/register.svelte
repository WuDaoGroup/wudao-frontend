<script>
	import NavigationBar from '../components/NavigationBar.svelte';
	import { registerApi } from '../api/userApi';
	import { goto } from '$app/navigation';

	let username = '';
	let password1 = '';
	let password2 = '';

	function handleRegister() {
		registerApi(username, password1, password2).then((response) => {
			if (response.status == 200) {
				console.log('Succeesfully Registered');
				goto(`/login`);
			} else {
				console.log(response.data.detail);
			}
		});
	}
</script>

<div class="min-h-screen">
	<nav class="mb-10">
		<NavigationBar />
	</nav>

	<div class="sm:flex sm:flex-row mx-0 justify-center">
		<div class="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
			<div class="self-start hidden lg:flex flex-col  text-white">
				<img src="" class="mb-3" />
				<h1 class="mb-3 font-bold text-5xl">Hello~ 👋 Welcome</h1>
				<p class="pr-3">一起向未来 | Together for a Shared Future</p>
			</div>
		</div>
		<div class="flex justify-center self-center  z-10">
			<div class="p-12 bg-white mx-auto rounded-2xl w-100 ">
				<div class="mb-4">
					<h3 class="font-semibold text-2xl text-gray-800">注册 | Sign Up</h3>
					<p class="text-gray-500">Create your account</p>
				</div>
				<div class="space-y-5">
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 tracking-wide">Email</label>
						<input
							bind:value={username}
							class=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
							type="email"
							placeholder="mail@gmail.com"
						/>
					</div>
					<div class="space-y-2">
						<label class="mb-5 text-sm font-medium text-gray-700 tracking-wide"> Password </label>
						<input
							bind:value={password1}
							class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
							type="password"
							placeholder="Enter your password"
						/>
					</div>

					<div class="space-y-2">
						<label class="mb-5 text-sm font-medium text-gray-700 tracking-wide">
							Password Confirm
						</label>
						<input
							bind:value={password2}
							class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
							type="password"
							placeholder="Check your password"
						/>
					</div>

					<div>
						<button
							on:click={handleRegister}
							type="submit"
							class="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
						>
							Sign Up
						</button>
					</div>
				</div>
				<div class="pt-5 text-center text-gray-400 text-xs">
					<span> Copyright © 2022 Wudao </span>
				</div>
			</div>
		</div>
	</div>
</div>
