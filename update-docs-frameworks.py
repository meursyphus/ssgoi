#!/usr/bin/env python3
"""
Script to add Vue and Solid.js tabs to MDX documentation files.
"""

import re
import os
from pathlib import Path

def add_vue_solid_to_view_transitions(file_path):
    """Add Vue and Solid.js tabs to view-transitions files."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract transition name from file
    filename = Path(file_path).stem
    # Remove leading numbers like "02-scroll" -> "scroll"
    transition_name = re.sub(r'^\d+-', '', filename)

    # Pattern to match Tabs component with Angular but missing Vue/Solid
    tabs_pattern = r'<Tabs items=\[\{ label: "React", value: "react" \}, \{ label: "Svelte", value: "svelte" \}, \{ label: "Angular", value: "angular" \}\]>'
    tabs_replacement = '{ label: "React", value: "react" }, { label: "Svelte", value: "svelte" }, { label: "Vue", value: "vue" }, { label: "Solid.js", value: "solid" }, { label: "Angular", value: "angular" }'

    # Replace tabs items array
    content = re.sub(
        r'\{ label: "React", value: "react" \}, \{ label: "Svelte", value: "svelte" \}, \{ label: "Angular", value: "angular" \}',
        tabs_replacement,
        content
    )

    # Vue TabPanel template for view transitions
    vue_template = f'''  </TabPanel>
  <TabPanel value="vue">
    ```vue
    <script setup>
    import {{ Ssgoi }} from '@ssgoi/vue';
    import {{ {transition_name} }} from '@ssgoi/vue/view-transitions';

    const config = {{
      defaultTransition: {transition_name}()
    }};
    </script>

    <template>
      <Ssgoi :config="config">
        <slot />
      </Ssgoi>
    </template>
    ```
  </TabPanel>
  <TabPanel value="solid">
    ```tsx
    import {{ Ssgoi }} from '@ssgoi/solid';
    import {{ {transition_name} }} from '@ssgoi/solid/view-transitions';

    const config = {{
      defaultTransition: {transition_name}()
    }};

    export default function App() {{
      return (
        <Ssgoi config={{config}}>
          {{/* App content */}}
        </Ssgoi>
      );
    }}
    ```
  </TabPanel>
  <TabPanel value="angular">'''

    # Insert Vue and Solid panels before Angular
    content = re.sub(
        r'  </TabPanel>\n  <TabPanel value="angular">',
        vue_template,
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated {file_path}")

def add_solid_to_element_transitions(file_path):
    """Add Solid.js tab to element transitions files (already have React/Svelte/Vue/Angular)."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract transition name from file
    filename = Path(file_path).stem
    transition_name = re.sub(r'^\d+-', '', filename)

    # Replace tabs items array to add Solid.js
    content = re.sub(
        r'\{ label: "React", value: "react" \}, \{ label: "Svelte", value: "svelte" \}, \{ label: "Vue", value: "vue" \}, \{ label: "Angular", value: "angular" \}',
        '{ label: "React", value: "react" }, { label: "Svelte", value: "svelte" }, { label: "Vue", value: "vue" }, { label: "Solid.js", value: "solid" }, { label: "Angular", value: "angular" }',
        content
    )

    # Solid TabPanel template for element transitions
    solid_template = f'''  </TabPanel>
  <TabPanel value="solid">
    ```tsx
    import {{ transition }} from '@ssgoi/solid';
    import {{ {transition_name} }} from '@ssgoi/solid/transitions';

    function Component() {{
      return (
        <div ref={{transition({{
          key: 'my-element',
          ...{transition_name}()
        }})}}>{transition_name.capitalize()} me!</div>
      );
    }}
    ```
  </TabPanel>
  <TabPanel value="angular">'''

    # Insert Solid panel before Angular
    content = re.sub(
        r'  </TabPanel>\n  <TabPanel value="angular">',
        solid_template,
        content,
        count=1  # Only replace the first occurrence (Usage section)
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated {file_path}")

def main():
    base_path = Path("/Users/daeseungmoon/work/gimoring/ssgoi/apps/docs/content/en")

    # View transitions files (need Vue and Solid.js)
    view_transitions_files = [
        "03.view-transitions/02-scroll.mdx",  # Already started, skip
        "03.view-transitions/03-hero.mdx",
        "03.view-transitions/04-pinterest.mdx",
        "03.view-transitions/05-drill.mdx",
        "03.view-transitions/06-slide.mdx",
        "03.view-transitions/07-blind.mdx",
        "03.view-transitions/08-film.mdx",
        "03.view-transitions/09-jaemin.mdx",
        "03.view-transitions/09-strip.mdx",
        "03.view-transitions/10-instagram.mdx",
        "03.view-transitions/11-rotate.mdx",
    ]

    # Element transitions files (need Solid.js only)
    element_transitions_files = [
        "04.transitions/02-scale.mdx",
        "04.transitions/03-blur.mdx",
        "04.transitions/04-slide.mdx",
        "04.transitions/05-fly.mdx",
        "04.transitions/06-rotate.mdx",
        "04.transitions/07-bounce.mdx",
        "04.transitions/08-mask.mdx",
    ]

    # Process view transitions
    for file in view_transitions_files:
        filepath = base_path / file
        if filepath.exists():
            add_vue_solid_to_view_transitions(str(filepath))

    # Process element transitions
    for file in element_transitions_files:
        filepath = base_path / file
        if filepath.exists():
            add_solid_to_element_transitions(str(filepath))

if __name__ == "__main__":
    main()
