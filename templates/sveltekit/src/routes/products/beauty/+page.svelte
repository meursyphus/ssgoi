<script lang="ts">
	import ProductGrid from '$lib/components/product-grid.svelte';
	import { getProductsByCategory } from '$lib/data/products';

	const products = getProductsByCategory('beauty');
</script>

<ProductGrid {products} category="beauty" />
