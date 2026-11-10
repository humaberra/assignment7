# Assignment 7 – Multi-Page Shop with Shared State

**Student:** Hüma Berra Kolukısa
**Student number:** 230408056
**Course:** Web Programming – Fall 2026

A small online shop built with React + Vite. It loads products from the DummyJSON API, lets visitors filter the catalogue through the URL, shows a detail page per product, keeps a persistent cart in a Zustand store, protects the cart page behind a simulated login, and remembers a light/dark theme.

## How to run

```bash
npm install
npm run dev
```

Demo account (simulated, see `src/api/authApi.js`):

| Username | Password |
| --- | --- |
| `230408056@st.biruni.edu.tr` | `demo123456` |

## File organization

```
src/
 ├─ api/
 │   ├─ productsApi.js     fetchProducts / fetchProduct (fetch + AbortSignal, non-2xx = error)
 │   └─ authApi.js         simulated login(), resolves after ~500 ms
 ├─ hooks/
 │   ├─ useFetch.js        loading / error / data with useReducer + AbortController cleanup
 │   └─ useLocalStorage.js useState-shaped hook that persists to localStorage (used for theme)
 ├─ context/
 │   └─ AuthContext.jsx    AuthProvider + useAuth (reducer: LOGGED_IN / LOGGED_OUT)
 ├─ store/
 │   └─ cartStore.js       Zustand cart store, derived selectors, persistence via subscribe
 ├─ components/
 │   ├─ Layout.jsx         navbar + <Outlet /> + footer, applies the theme class
 │   ├─ NavBar.jsx         NavLinks, cart count, theme toggle, login/logout
 │   ├─ ProductCard.jsx    one product in the grid, "Add to cart"
 │   └─ ProtectedRoute.jsx redirects to /login and remembers the target location
 ├─ pages/
 │   ├─ Home.jsx
 │   ├─ ProductList.jsx    filters stored in the query string (?q=&category=)
 │   ├─ ProductDetail.jsx  reads :id, loads it with useFetch, next/previous links
 │   ├─ Cart.jsx           quantity controls, remove, total, clear, empty state
 │   ├─ Login.jsx          controlled form, loading + error, redirect back
 │   └─ NotFound.jsx       404 page inside the layout
 ├─ App.jsx                route tree (nested /products routes, protected /cart, * route)
 ├─ main.jsx               BrowserRouter + AuthProvider + App
 └─ index.css              minimal styles and theme custom properties
```

## Reasoning questions

### 1. State choices

- **Signed-in user:** lives in `AuthContext` (Context + `useReducer`). It is needed by several distant components (NavBar, ProtectedRoute, Login), it changes rarely (only on login/logout), and the reducer makes the two possible transitions explicit.
- **Cart:** lives in the Zustand store `cartStore.js`. It changes often and is read by many components (NavBar count, cards, detail page, cart page), so each component should subscribe only to the slice it needs.
- **Filter values:** live in the URL query string (`useSearchParams`). This way the filtered view can be shared as a link, survives refresh, and works with the back button; copying them into `useState` would create two sources of truth.
- **Product list:** lives in local state inside `ProductList`, through `useFetch`. It is server data that only this page needs; filtered results and the category list are derived from it during render.
- **Theme:** lives in `Layout` through `useLocalStorage`. Only the layout wrapper needs the value (the NavBar receives it as a prop), and it has to survive reloads.
### 2. Context versus store

The user changes only on login/logout, so it is cheap for Context to re-render every consumer when it changes, and Context + reducer needs no extra library. The cart changes on every click; with Context, every component that calls `useContext` would re-render on each change, because Context has no selectors. Zustand lets the NavBar subscribe only to the item count and lets cards subscribe only to `addItem`, so they don't re-render when quantities change. If I swapped them, every "Add to cart" click would re-render all cart consumers (less efficient), and the user state would gain a global store with no real benefit; persisting/subscribing outside React would also be harder with Context.

### 3. Custom hooks

`useFetch` shares the **logic**: the reducer with loading/error/data, the effect that starts the request, the `AbortController` cleanup and ignoring `AbortError`. It deliberately does **not** share **state**: each call to a hook creates its own `useReducer` state, so `ProductList` and `ProductDetail` have independent loading/error/data. It also doesn't know what to fetch — the caller passes the fetching function and its dependencies.

### 4. Route parameters

`useParams()` always returns strings, so `id` is the string `"3"`, not the number `3`. It mattered in `ProductDetail.jsx` for the next/previous links: `id + 1` would give `"31"`, so I convert with `Number(id)` and check that it is a valid positive integer before building the links. It also matters for the cart, because cart items use the numeric `product.id` from the API response, not the string from the URL, so `item.id === product.id` comparisons work.

### 5. Protected routes

`ProtectedRoute` only hides a page in the browser: the JavaScript bundle (including the Cart page) and the hard-coded credentials are downloaded by everyone, and the user can change state in DevTools. It is a user-experience feature, **not security**. Real security needs a server that authenticates the user (e.g. hashed passwords, session cookie or signed token), and that checks the user's permission on every API request, so protected **data** is never sent to an unauthorized client.

### 6. Deep links

On a plain static file server, reloading `/products/3` makes the browser request a file at `/products/3`; it does not exist, so the server returns 404 and React never loads. Routing only exists inside the JavaScript app after `index.html` is loaded. The Vite dev server has an SPA fallback: for unknown paths that look like page requests it serves `index.html`, then React Router reads the URL and renders the correct page. In production you must configure the same fallback (rewrite all routes to `index.html`).

## Self-study notes

- **Updating one query parameter without losing the others.** From the React Router docs, `setSearchParams` accepts a function that receives the current `URLSearchParams`. In `ProductList.jsx` I copy them with `new URLSearchParams(prev)`, then `set` or `delete` only one key, so changing the category keeps `q`. I pass `{ replace: true }` so typing every letter does not add a new history entry, and I delete empty values to keep URLs clean.
- **Initialising the store safely from localStorage.** `loadItems()` in `cartStore.js` wraps `getItem` + `JSON.parse` in `try/catch`, returns `[]` when the key is missing, when the JSON is invalid, or when the value is not an array, and filters out items with the wrong shape. From the Zustand docs I used `useCartStore.subscribe((state, prevState) => …)`, which runs outside React; I save only when `state.items !== prevState.items`, which works because updates are immutable.
- **Light/dark theme.** The theme is applied with a class on the wrapper (`theme-light` / `theme-dark`). Each class defines CSS custom properties (`--bg`, `--text`, `--accent`, …) and all styles use `var(...)`, so changing one class changes all colours.
- **Zustand selectors.** Zustand compares the selector result with `Object.is`. A selector that returns a new object/array each time would re-render (or loop) on every change, so my selectors return primitives (item count, total) or existing references (`state.items`, actions).
- **Redirect after login.** `ProtectedRoute` passes the current location in `<Navigate state={{ from: location }} replace />`. `Login` reads it from `useLocation().state` and calls `navigate(from, { replace: true })`, so the login page is not left in history.

## Challenges

- While editing `index.css` I accidentally deleted most of the stylesheet; I noticed it when the product grid had no layout and restored the missing rules in a separate commit.
- Understanding why `fetch` doesn't reject on 404: I had to check `response.ok` myself so `/products/999999` shows "Product not found".
- In React StrictMode effects run twice in development, so the first request is aborted; I had to ignore `AbortError` in `useFetch` so it isn't shown as an error.
- Getting the product id types right (string from the URL vs number from the API).
- Making the NavBar re-render only when the item count changes, which required a selector that returns a number instead of the whole store.
- Keeping filters in the URL instead of in `useState`, and updating one parameter without deleting the other.

## Note

Client-side route protection in this project is a user-experience feature, not security.