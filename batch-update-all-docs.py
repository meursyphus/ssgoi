#!/usr/bin/env python3
"""
Comprehensive script to add Vue and Solid.js tabs to all MDX documentation files.
"""

import re
from pathlib import Path

def update_view_transition_file(filepath, transition_name):
    """Update view-transition files to add Vue and Solid.js tabs."""
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Update Tabs items arrays (add Vue and Solid.js if missing)
    content = re.sub(
        r'<Tabs items=\[\{ label: "React", value: "react" \}, \{ label: "Svelte", value: "svelte" \}, \{ label: "Angular", value: "angular" \}\]>',
        '<Tabs items={[{ label: "React", value: "react" }, { label: "Svelte", value: "svelte" }, { label: "Vue", value: "vue" }, { label: "Solid.js", value: "solid" }, { label: "Angular", value: "angular" }]}>',
        content
    )

    # Vue and Solid TabPanels for configuration examples
    vue_solid_panels = f'''  </TabPanel>
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
    ```'''

    # Add Vue and Solid panels before Angular panels
    # We need to be careful to only replace where we haven't already added them
    if '  <TabPanel value="vue">' not in content:
        # Find all places where we have Svelte </TabPanel> followed by Angular <TabPanel>
        content = re.sub(
            r'(    ```\n  </TabPanel>\n)(  <TabPanel value="angular">)',
            r'\1' + vue_solid_panels + '\n\\2',
            content
        )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def update_element_transition_file(filepath, transition_name):
    """Update element-transition files to add Solid.js tab."""
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Update Tabs items arrays (add Solid.js if missing)
    content = re.sub(
        r'<Tabs items=\[\{ label: "React", value: "react" \}, \{ label: "Svelte", value: "svelte" \}, \{ label: "Vue", value: "vue" \}, \{ label: "Angular", value: "angular" \}\]>',
        '<Tabs items={[{ label: "React", value: "react" }, { label: "Svelte", value: "svelte" }, { label: "Vue", value: "vue" }, { label: "Solid.js", value: "solid" }, { label: "Angular", value: "angular" }]}>',
        content
    )

    # Solid TabPanel for element transitions
    solid_panel = f'''  </TabPanel>
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
    ```'''

    # Add Solid panel before Angular panel (only in first Tabs section - Usage)
    if '  <TabPanel value="solid">' not in content:
        # Match the first occurrence (Usage section)
        content = re.sub(
            r'(## Usage.*?    ```\n  </TabPanel>\n)(  <TabPanel value="angular">)',
            r'\1' + solid_panel + '\n\\2',
            content,
            count=1,
            flags=re.DOTALL
        )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    base_path = Path('/Users/daeseungmoon/work/gimoring/ssgoi/apps/docs/content/en')

    # View transitions files (need Vue and Solid.js)
    view_transitions = [
        ('03.view-transitions/03-hero.mdx', 'hero'),
        ('03.view-transitions/04-pinterest.mdx', 'pinterest'),
        ('03.view-transitions/05-drill.mdx', 'drill'),
        ('03.view-transitions/06-slide.mdx', 'slide'),
        ('03.view-transitions/07-blind.mdx', 'blind'),
        ('03.view-transitions/08-film.mdx', 'film'),
        ('03.view-transitions/09-jaemin.mdx', 'jaemin'),
        ('03.view-transitions/09-strip.mdx', 'strip'),
        ('03.view-transitions/10-instagram.mdx', 'instagram'),
        ('03.view-transitions/11-rotate.mdx', 'rotate'),
    ]

    # Element transitions files (need Solid.js only)
    element_transitions = [
        ('04.transitions/02-scale.mdx', 'scale'),
        ('04.transitions/03-blur.mdx', 'blur'),
        ('04.transitions/04-slide.mdx', 'slide'),
        ('04.transitions/05-fly.mdx', 'fly'),
        ('04.transitions/06-rotate.mdx', 'rotate'),
        ('04.transitions/07-bounce.mdx', 'bounce'),
        ('04.transitions/08-mask.mdx', 'mask'),
    ]

    print("Updating view-transition files...")
    for file, name in view_transitions:
        filepath = base_path / file
        if filepath.exists():
            if update_view_transition_file(filepath, name):
                print(f"  ✓ {file}")
            else:
                print(f"  - {file} (already updated or no changes)")
        else:
            print(f"  ✗ {file} (not found)")

    print("\nUpdating element-transition files...")
    for file, name in element_transitions:
        filepath = base_path / file
        if filepath.exists():
            if update_element_transition_file(filepath, name):
                print(f"  ✓ {file}")
            else:
                print(f"  - {file} (already updated or no changes)")
        else:
            print(f"  ✗ {file} (not found)")

    print("\nDone!")

if __name__ == "__main__":
    main()
