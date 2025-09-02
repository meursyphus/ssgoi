/*
Language: Vue.js
Requires: xml.js, javascript.js, css.js
Author: SSGOI Team
Description: Vue 3 Single File Components
*/

export default function hljsDefineVue(hljs: any) {
  return {
    subLanguage: "xml",
    contains: [
      hljs.COMMENT("<!--", "-->", {
        relevance: 10,
      }),
      {
        begin: /^(\s*)(<script(\s+(setup|lang="ts"|lang="js"))*>)/gm,
        end: /^(\s*)(<\/script>)/gm,
        subLanguage: "javascript",
        excludeBegin: true,
        excludeEnd: true,
        contains: [
          {
            begin:
              /^(\s*)(import|export|const|let|var|function|async|await|ref|computed|watch|onMounted|onUnmounted|defineProps|defineEmits|defineExpose)/gm,
            className: "keyword",
          },
        ],
      },
      {
        begin:
          /^(\s*)(<style(\s+(scoped|lang="css"|lang="scss"|lang="less"))*>)/gm,
        end: /^(\s*)(<\/style>)/gm,
        subLanguage: "css",
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /\{\{/gm,
        end: /\}\}/gm,
        subLanguage: "javascript",
        contains: [
          {
            begin: /[\{]/,
            end: /[\}]/,
            skip: true,
          },
        ],
      },
      {
        begin:
          /(v-)(if|else|else-if|for|show|model|on|bind|slot|html|text|transition)/gm,
        className: "keyword",
        relevance: 10,
      },
      {
        begin: /(:)(key|id|class|style|ref|is)/gm,
        className: "keyword",
        relevance: 10,
      },
      {
        begin:
          /(@)(click|change|input|submit|keyup|keydown|mouseenter|mouseleave|focus|blur)/gm,
        className: "keyword",
        relevance: 10,
      },
      {
        begin: /(#)(default|[a-zA-Z]+)/gm,
        className: "keyword",
        relevance: 10,
      },
    ],
  };
}
