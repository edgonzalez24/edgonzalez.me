# generate-changelog

Generate a CHANGELOG entry based on my changes in **ready-to-copy markdown format**:

## 1. Analyze git diff
- Identify modified files
- Understand what functionality changed/added/removed
- Identify breaking changes
- Understand component/store/router changes

## 2. Categorize changes
- **Added:** New components, features, routes, store modules
- **Changed:** Changes to existing components, props, events, behavior
- **Fixed:** Bug fixes
- **Removed:** Removed components, features, deprecated code
- **Security:** XSS fixes, authentication improvements
- **Performance:** Bundle size, render performance, memory optimizations
- **Deprecated:** Functionality marked for future removal

## 3. Add diagrams ONLY when truly helpful
**Be selective** - Only include Mermaid diagrams when they genuinely add value:

**Include diagrams when:**
- ✅ Complex new flow/process in component communication
- ✅ Significant Vuex store architecture change
- ✅ New authentication/permission flow
- ✅ Complex route guard logic
- ✅ Multi-step user interaction flow

**Skip diagrams when:**
- ❌ Simple component changes (add prop, fix styling)
- ❌ Configuration changes
- ❌ Bug fixes without flow changes
- ❌ Documentation updates
- ❌ Single component additions

**When you DO include diagrams:**
- Use 4 backticks for outer markdown block: \`\`\`\`markdown
- Use 3 backticks for inner mermaid blocks: \`\`\`mermaid
- This prevents nesting issues and keeps everything copyable

## 4. Generate entry following this exact format

Output the complete markdown block ready to copy (use 4 backticks for outer block):

\`\`\`\`markdown
## [Unreleased]

### Added
- **UserProfile component** - New user profile page with avatar upload
- **Dark mode toggle** - User preference persisted to localStorage
- **Route guard** - Authentication check on `/dashboard` routes
- **Vuex module** `notifications` - Manages app notifications state

### Changed
- **BookingCard component** - Added `showActions` prop (optional, defaults to `false`)
- **User store** - `fetchUser` action now accepts optional `includeProfile` parameter
- **API service** - Increased timeout from 15s to 30s for large requests
- ⚠️ **BREAKING**: `UserCard` component event `click` renamed to `user-clicked`

### Fixed
- **ProductList** - Fixed memory leak from event listener not cleaned up
- **LoginForm** - Fixed double-submit on Enter key press
- **Navigation** - Fixed router guard infinite loop on 401 response
- **Vuex** - Fixed reactivity issue when adding new user properties

### Performance
- **Bundle size** - Reduced by 125KB by lazy-loading heavy components
- **ProductList** - Implemented virtual scrolling for 1000+ items
- **Images** - Added lazy loading to product images
- **Lodash** - Switched from full import to specific function imports (-50KB)

### Security
- **v-html sanitization** - Added DOMPurify to all user-generated content
- **API tokens** - Moved from localStorage to httpOnly cookies
- **XSS prevention** - Sanitized all dynamic content in CommentCard

### Deprecated
- **formatDate utility** - Use dayjs directly instead (will be removed in v2.0)
- **EventBus** - Use Vuex for state management (will be removed in v2.0)

---

**Impact:**
- Breaking changes: Update `UserCard` event handlers from `@click` to `@user-clicked`
- Environment variables: None
- Dependencies: Added `dompurify` and `dayjs`, removed `moment`
- Migration: Run `yarn install` to update dependencies

**Technical Details:**
- Files modified: 14 components, 2 store modules, 3 services
- Tests added: 28 new test cases, 100% coverage on new components
- Bundle impact: -175KB gzipped
\`\`\`\`

## 5. Vue.js Specific Considerations

**Component Changes:**
```markdown
- **UserCard component**:
  - Added prop: `showActions` (Boolean, default: false)
  - Changed event: `click` → `user-clicked` (BREAKING)
  - New slot: `actions` for custom action buttons
```

**Vuex Changes:**
```markdown
- **store/modules/user**:
  - New getter: `fullUserProfile` - combines user + profile data
  - Changed action: `fetchUser` now returns Promise
  - New mutation: `SET_USER_PREFERENCES`
```

**Router Changes:**
```markdown
- **New routes**:
  - `/profile/:id` - User profile page
  - `/settings/notifications` - Notification preferences
- **Updated guards**:
  - `/dashboard/*` now requires authentication
  - `/admin/*` requires admin role
```

**Props/Events:**
```markdown
- Components with prop changes need parent components updated
- Components with event name changes need event handlers updated
- List all breaking changes explicitly
```

## 6. Example with Diagram

When diagram is needed:

\`\`\`\`markdown
## [Unreleased]

### Added
- **Multi-step checkout flow** - New wizard-style checkout process

\`\`\`mermaid
flowchart LR
    A[Cart] --> B[Shipping Info]
    B --> C[Payment Method]
    C --> D[Review]
    D --> E[Confirmation]

    B -.->|Save Draft| F[(Local Storage)]
    C -.->|Save Draft| F
    D -->|Submit| G[API]
    G -->|Success| E
    G -->|Error| C
\`\`\`

### Changed
- **CheckoutFlow** - Converted from single page to multi-step wizard
- ⚠️ **BREAKING**: Removed `onCheckoutComplete` prop, use router navigation instead

---

**Migration Guide:**

Before:
\`\`\`vue
<CheckoutFlow @checkout-complete="handleComplete" />
\`\`\`

After:
\`\`\`vue
<!-- Component now handles navigation internally -->
<CheckoutFlow />

<!-- Listen for completion in mounted hook -->
mounted() {
  // Check route query param for success
  if (this.$route.query.checkout === 'success') {
    this.handleComplete()
  }
}
\`\`\`
\`\`\`\`

## 7. Important rules

- Write from perspective of developer using the code
- Be specific but concise
- Use ⚠️ **BREAKING** for breaking changes with migration guide
- Include component/store/route names
- Mention prop/event changes explicitly
- Use clear, non-technical language for features
- Add technical details in separate section
- **Output must be valid markdown ready to copy and paste**
- For Vue components, specify prop types and defaults
- For Vuex, specify module/getter/mutation/action names
- For Router, specify route paths and guard changes

## 8. Output format

**CRITICAL**: Output the markdown inside a code block using 4 backticks so user can copy it easily.

Format your entire response like this:

\`\`\`\`markdown
## [Unreleased]

### Added
- Feature with details

### Changed
- ⚠️ **BREAKING**: Breaking change with migration guide

\`\`\`mermaid
flowchart LR
    A --> B
\`\`\`

---

**Impact:**
- Breaking changes: List migration steps
- Dependencies: List new/removed packages
\`\`\`\`

Use 4 backticks (\`\`\`\`) for the outer block and 3 backticks (\`\`\`) for inner mermaid blocks. This ensures everything is copyable.

Nothing before the code block, nothing after. User will copy the entire content inside.
