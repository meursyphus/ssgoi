import { CodeTabs } from '../code-tabs';

export function HierarchicalNavigation() {
  return (
    <CodeTabs
      react={`const config = {
  transitions: [
    // 목록 → 상세
    {
      from: "/products",
      to: "/products/*",
      transition: scale({ from: 0.95 }),
      symmetric: true, // 상세 → 목록도 자동 처리
    },

    // 탭 네비게이션
    { from: "/tab1", to: "/tab2", transition: slide({ direction: "left" }) },
    { from: "/tab2", to: "/tab3", transition: slide({ direction: "left" }) },
    { from: "/tab3", to: "/tab2", transition: slide({ direction: "right" }) },
    { from: "/tab2", to: "/tab1", transition: slide({ direction: "right" }) },
  ],
};`}
      svelte={`<script>
  import { scale, slide } from "@ssgoi/svelte/view-transitions";
  
  const config = {
    transitions: [
      // 목록 → 상세
      {
        from: "/products",
        to: "/products/*",
        transition: scale({ from: 0.95 }),
        symmetric: true, // 상세 → 목록도 자동 처리
      },

      // 탭 네비게이션
      { from: "/tab1", to: "/tab2", transition: slide({ direction: "left" }) },
      { from: "/tab2", to: "/tab3", transition: slide({ direction: "left" }) },
      { from: "/tab3", to: "/tab2", transition: slide({ direction: "right" }) },
      { from: "/tab2", to: "/tab1", transition: slide({ direction: "right" }) },
    ],
  };
</script>`}
    />
  );
}