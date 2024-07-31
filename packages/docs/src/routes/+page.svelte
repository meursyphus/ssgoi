<script lang="ts">
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';

	export let data;
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="flex flex-col min-h-[100dvh]">
	<main class="flex-1">
		<section
			class="flex flex-col justify-center w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-size-200% bg-pos-0 animate-gradient-x"
		>
			<div class="container px-4 md:px-6 text-center">
				<div
					class="text-4xl font-bold tracking-tighter text-primary-foreground sm:text-5xl md:text-6xl"
				>
					SGGOI: Turning Your Site into Supermodels!
				</div>
				<p class="max-w-[700px] mx-auto mt-4 text-lg text-primary-foreground/90 md:text-xl">
					Because your pages deserve to strut their stuff
				</p>
				<div class="mt-8 flex justify-center gap-4">
					<button class="px-6 py-3">Join the Show</button>
					<a
						href="#"
						class="inline-flex items-center justify-center rounded-md bg-primary-foreground/10 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-foreground"
					>
						<div class="w-5 h-5 bg-gray-400 mr-2"></div>
						Watch Demo
					</a>
				</div>
				<div class="mt-12 flex justify-center">
					<div class="relative w-full max-w-2xl overflow-hidden rounded-lg bg-background shadow-lg">
						<div
							class="absolute inset-0 z-10 bg-gradient-to-r from-[#6366F1]/50 to-[#EC4899]/50 blur-[100px]"
						/>
						<div class="relative z-20 flex items-center justify-center p-8">
							<div class="grid grid-cols-2 gap-4">
								<div
									class="flex items-center justify-center rounded-md bg-primary-foreground/10 p-4 transition-transform hover:scale-105"
								>
									<div class="w-8 h-8 bg-gray-400"></div>
								</div>
								<div
									class="flex items-center justify-center rounded-md bg-primary-foreground/10 p-4 transition-transform hover:scale-105"
								>
									<div class="w-8 h-8 bg-gray-400"></div>
								</div>
								<div
									class="flex items-center justify-center rounded-md bg-primary-foreground/10 p-4 transition-transform hover:scale-105"
								>
									<div class="w-8 h-8 bg-gray-400"></div>
								</div>
								<div
									class="flex items-center justify-center rounded-md bg-primary-foreground/10 p-4 transition-transform hover:scale-105"
								>
									<div class="w-8 h-8 bg-gray-400"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="w-full py-12 md:py-24 lg:py-32">
			<div class="container px-4 md:px-6">
				<div class="text-center">
					<h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
						Watch Your Page is Moving!
					</h2>
					<p class="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-xl">
						Discover the key features that make SGGOI the ultimate page transition library for your
						Svelte applications.
					</p>
				</div>
				<div class="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
					<div class="rounded-lg bg-background p-6 shadow-sm transition-transform hover:scale-105">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
						>
							<div class="w-6 h-6 bg-gray-400"></div>
						</div>
						<h3 class="mt-4 text-lg font-semibold">Smooth</h3>
						<p class="mt-2 text-muted-foreground">
							Effortless transitions that captivate your audience
						</p>
					</div>
					<div class="rounded-lg bg-background p-6 shadow-sm transition-transform hover:scale-105">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
						>
							<div class="w-6 h-6 bg-gray-400"></div>
						</div>
						<h3 class="mt-4 text-lg font-semibold">Stylish</h3>
						<p class="mt-2 text-muted-foreground">
							Elevate your brand with custom-tailored transitions
						</p>
					</div>
					<div class="rounded-lg bg-background p-6 shadow-sm transition-transform hover:scale-105">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
						>
							<div class="w-6 h-6 bg-gray-400"></div>
						</div>
						<h3 class="mt-4 text-lg font-semibold">Engaging</h3>
						<p class="mt-2 text-muted-foreground">
							Keep your users captivated with seamless navigation
						</p>
					</div>
					<div class="rounded-lg bg-background p-6 shadow-sm transition-transform hover:scale-105">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
						>
							<div class="w-6 h-6 bg-gray-400"></div>
						</div>
						<h3 class="mt-4 text-lg font-semibold">Delightful</h3>
						<p class="mt-2 text-muted-foreground">
							Delight your developers with easy-to-use transitions
						</p>
					</div>
				</div>
			</div>
		</section>
	</main>

</div>
