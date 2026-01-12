# IsiDoku Style Guide

This document defines the design system and styling guidelines for the IsiDoku application to ensure consistency across all components and pages.

## Design Philosophy

**Brutalist-Inspired Minimalist Design**
- High contrast with bold borders (2px black)
- Sharp corners with minimal border-radius (0.125rem / 2px)
- Clean typography with mono fonts for data/code
- Purposeful use of whitespace
- Black and white primary color scheme with accent colors for semantic purposes

## Color System

### Primary Colors
| Usage | Color | CSS Variable |
|-------|-------|--------------|
| Background (light) | `#ffffff` | `--color-background` |
| Foreground (light) | `#171717` | `--color-foreground` |
| Primary | `#000000` | `--color-primary` |
| Primary Foreground | `#ffffff` | `--color-primary-foreground` |
| Border | `hsl(0 0% 90%)` | `--color-border` |

### Dark Mode
| Usage | Color | CSS Variable |
|-------|-------|--------------|
| Background (dark) | `#0a0a0a` | `--color-background` |
| Foreground (dark) | `#ededed` | `--color-foreground` |
| Primary | `#ffffff` | `--color-primary` |
| Border | `hsl(0 0% 15%)` | `--color-border` |

### Semantic Colors
| Usage | Color | CSS Variable |
|-------|-------|--------------|
| Muted | `hsl(0 0% 96%)` | `--color-muted` |
| Muted Foreground | `hsl(0 0% 45%)` | `--color-muted-foreground` |
| Accent | `hsl(0 0% 96%)` | `--color-accent` |
| Destructive | `hsl(0 84% 60%)` | `--color-destructive` |

## Typography

### Font Families
```css
/* Display/Body Text */
font-family: 'Inter', system-ui, sans-serif;

/* Monospace/Code/Data */
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale
| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| H1 | `text-2xl` | `font-black` | Page titles, branding |
| H2 | `text-5xl` | `font-black` | Hero headings |
| H3 | `text-sm` | `font-bold uppercase tracking-wider` | Section labels |
| Body | `text-sm` | `font-medium` | General content |
| Small | `text-xs` | `font-mono` | Meta info, timestamps |
| Code/Data | `text-sm` | `font-mono` | Table cells, inputs |

### Text Utilities
```tsx
// Heading with tight tracking
<h1 className="text-2xl font-black tracking-tight">Title</h1>

// Uppercase label
<h3 className="text-sm font-bold uppercase tracking-wider">Label</h3>

// Monospace for data
<span className="font-mono text-sm font-medium">{variable}</span>
```

## Borders & Radius

### Border Widths
| Usage | Width | Class |
|-------|-------|-------|
| Default | 1px | `border` |
| Emphasized | 2px | `border-2` |
| Heavy | 4px | `border-4` |

### Border Radius
```css
--radius: 0.125rem; /* 2px - minimal rounding */
```

### Usage Guidelines
- Use `border-2 border-black` for primary UI elements
- Use `border` for subtle dividers
- Use `rounded-sm` for buttons and cards
- Avoid large rounded corners (not on brand)

## Spacing

### Layout Scale
```
Container padding: px-6 (mobile) → px-12 (md) → px-20 (lg)
Max width: max-w-7xl
Gap: gap-3 (tight) → gap-4 (default) → gap-10 (sections)
```

### Component Spacing
| Element | Padding | Usage |
|---------|---------|-------|
| Button | `px-6 py-3` | Primary actions |
| Button (large) | `px-8 py-4` | CTA buttons |
| Table cell | `p-4` | Data cells |
| Input | `p-4` | Form inputs |
| Card/Pill | `px-3 py-1.5` | Tags, badges |

## Components

### Button

**Primary Button**
```tsx
<Button variant="default" className="px-6 py-3 font-bold">
  Button Text
</Button>
```

**Outline Button**
```tsx
<Button variant="outline" className="px-6 py-3 font-bold">
  Button Text
</Button>
```

**Button with Icon**
```tsx
<Button variant="default" className="flex items-center gap-2">
  <Icon className="w-5 h-5" />
  Button Text
</Button>
```

**Interactive Action Button (Standard)**
Use this for main actions like "New Item" or "Delete".
- Variant: `outline` (White bg, Black border -> Turns Black on hover)
- Cursor: `cursor-pointer`
- Animation: Icon scales up on hover (`group-hover:scale-110`)

```tsx
<Button variant="outline" className="flex items-center gap-2 group cursor-pointer">
  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
  SOP Baru
</Button>
```

### Input Fields
```tsx
<input
  className="w-full p-4 font-mono text-sm border-2 border-black
             border-none outline-none focus:ring-2 focus:ring-black
             bg-transparent"
  placeholder="Enter value..."
/>
```

### Table
```tsx
<table className="w-full border-collapse text-left">
  <thead>
    <tr className="bg-black text-white">
      <th className="p-4 font-mono text-sm font-medium tracking-wide
                    border-r border-gray-700">
        Header
      </th>
    </tr>
  </thead>
  <tbody className="divide-y-2 divide-black">
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="p-4 border-r-2 border-black">Cell</td>
    </tr>
  </tbody>
</table>
```

### Tags/Badges
```tsx
<div className="px-3 py-1.5 border-2 border-black rounded-sm
                bg-white hover:bg-black hover:text-white
                transition-colors">
  <span className="font-mono text-sm font-medium">{Variable}</span>
</div>
<div className="px-3 py-1.5 border-2 border-black rounded-sm
                bg-white hover:bg-black hover:text-white
                transition-colors">
  <span className="font-mono text-sm font-medium">{Variable}</span>
</div>
```

### Highlighter
```tsx
<span className="bg-yellow-300 px-2 box-decoration-clone border-2 border-black text-black inline-block transform -rotate-1">
  Otomatis dengan AI.
</span>
```

## Icons

Use **Lucide React** for all icons.

```tsx
import { FileText, Download, Plus, Delete } from "lucide-react";

// Standard icon size
<Icon className="w-5 h-5" />

// Large icon
<Icon className="w-8 h-8" />

// Small icon
<Icon className="w-4 h-4" />
```

## Animations

### Hover Effects
```tsx
// Button hover
className="hover:bg-black hover:text-white transition-colors"

// Icon scale on hover
className="group-hover:scale-110 transition-transform"

// Card hover
className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
           hover:shadow-none
           hover:translate-x-[2px]
           hover:translate-y-[2px]
           transition-all"
```

### Loading States
```tsx
// Pulse animation
<span className="w-3 h-3 bg-black rounded-full animate-pulse"></span>
```

## Layout Patterns

### Header
```tsx
<header className="w-full border-b-2 border-black bg-white
                  px-6 py-4 md:px-12 lg:px-20">
  <div className="flex items-center justify-between mx-auto max-w-7xl">
    {/* Logo and nav */}
  </div>
</header>
```

### Main Content
```tsx
<main className="flex-1 w-full max-w-7xl mx-auto
                px-6 py-10 md:px-12 lg:px-20
                flex flex-col gap-10">
  {/* Sections with gap-10 */}
</main>
```

### Section
```tsx
<section className="flex flex-col gap-6">
  <div className="space-y-2">
    {/* Section content */}
  </div>
</section>
```

### Dashboard Layout (Sidebar)
```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Wrap dashboard with SidebarProvider
<SidebarProvider defaultOpen={true}>
  <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar>
      <SidebarHeader>
        {/* Logo and toggle */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Section Label</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild variant={isActive ? "active" : "default"}>
                <Link href="/route">
                  <Icon className="w-5 h-5" />
                  <span>Menu Item</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Footer content */}
      </SidebarFooter>
    </Sidebar>

    {/* Main Content */}
    <main className="flex-1 overflow-auto">
      {/* Page content */}
    </main>
  </div>
</SidebarProvider>
```

**Sidebar Behavior:**
- Collapsible width: `w-64` (open) ↔ `w-16` (collapsed)
- Smooth transition: `transition-all duration-300`
- Right border only: `border-r-2 border-black`
- No internal borders (header/footer)
- Active items show chevron indicator (when open)

### Sticky Footer
```tsx
<section className="mt-4 pb-12 sticky bottom-0
                   bg-white/90 backdrop-blur-sm
                   pt-4 border-t-2 border-black">
  {/* Footer actions */}
</section>
```

## Shadcn UI Integration

### Available Components
- `Button` - `@/components/ui/button`
- `Sidebar` - `@/components/ui/sidebar`

### Using Shadcn Components
```tsx
import { Button } from "@/components/ui/button";

// Button Variant mapping:
// variant="default"  → Black background (primary action)
// variant="outline"  → Border only (secondary action)
// variant="ghost"    → Hover background only
// variant="destructive" → Red (danger actions)
```

### Sidebar Components
```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// SidebarMenuButton Variant mapping:
// variant="default" → Hover effect (hover:bg-black hover:text-white)
// variant="active"  → Black background with white text (current page)

// SidebarMenuButton asChild pattern:
<SidebarMenuButton asChild variant={isActive ? "active" : "default"}>
  <Link href="/route">
    <Icon className="w-5 h-5 flex-shrink-0" />
    {isOpen && <span className="truncate">Menu Label</span>}
    {isOpen && isActive && <ChevronRight className="ml-auto w-4 h-4 flex-shrink-0" />}
  </Link>
</SidebarMenuButton>
```

## Best Practices

### DO ✅
- Use `border-2 border-black` for emphasized borders
- Use `font-mono` for all data, variables, and code
- Use `rounded-sm` for minimal corner radius
- Include hover states with `transition-colors`
- Use `gap-3`, `gap-4`, or `gap-10` for consistent spacing
- Group related elements with `flex flex-col gap-N`
- Use semantic HTML (`header`, `main`, `section`, `nav`)

### DON'T ❌
- Don't use large rounded corners (`rounded-lg`, `rounded-xl`)
- Don't use bright colors for non-semantic purposes
- Don't mix font families within the same context
- Don't skip hover states for interactive elements
- Don't use `shadow-` utilities unless for emphasis
- Don't use emojis in UI (unless explicitly requested)

## File Structure

```
apps/web/
├── app/
│   ├── globals.css          # Global styles and theme variables
│   └── [routes]/
│       └── page.tsx         # Route pages
├── components/
│   └── ui/
│       └── button.tsx       # Shadcn UI components
├── lib/
│   └── utils.ts             # Utility functions (cn, etc.)
└── tailwind.config.ts       # Tailwind configuration
```

## Adding New Components

When adding new Shadcn UI components:

1. Use the CLI: `npx shadcn@latest add [component]`
2. Components are added to `components/ui/`
3. Customize with theme variables from `globals.css`
4. Ensure `border-2` and `rounded-sm` for consistency

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev/icons/)
