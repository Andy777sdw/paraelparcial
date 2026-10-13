instalar dependencias
npm install @angular/material @angular/cdk @ngx-translate/core @ngx-translate/http-loader
npx ng add @angular/material

npm install -D json-server@0.17.4
npx json-server --watch server/db.json

Agregar componentes
npx ng g c shared/presentation/components/layout --skip-tests

terminal 1:
npm run server

terminal 2:
npm start

# GitHub CI/CD Node & Repository Management Platform (eanrcu20241e417)

Enterprise-grade frontend web application designed and developed for **GitHub, Inc.** to monitor regional Continuous Integration and Continuous Deployment (CI/CD) nodes and manage open-source repository manifests across worldwide datacenters.

The project strictly follows **Domain-Driven Design (DDD)** and software architecture guidelines specified by **Universidad Peruana de Ciencias Aplicadas (UPC)** for the **Desarrollo de Aplicaciones Open Source (DAOS)** academic curriculum.

---

## Authorship Information

- **Student Author**: Andy Alfredo Hipolito Salcedo Muñoz
- **Student Code**: `u20241e417`
- **Institution**: Universidad Peruana de Ciencias Aplicadas (UPC)
- **Course**: Desarrollo de Aplicaciones Open Source (DAOS)
- **Private GitHub Repository**: [https://github.com/AndyHipolito/eanrcu20241e417](https://github.com/AndyHipolito/eanrcu20241e417)

---

## Technology Stack

- **Framework**: Angular v19+ (Angular 22) with 100% Standalone Components (`standalone: true`).
- **UI Library**: Angular Material (`@angular/material`, `@angular/cdk`) styled with GitHub's monochromatic dark mode palette (`#0d1117`, `#161b22`, border `#30363d`).
- **Reactive State Management**: Angular Signals (`signal()`, `computed()`, `effect()`).
- **HTTP Client**: Angular `HttpClient` configured with native fetch engine (`provideHttpClient(withFetch())`).
- **Internationalization (i18n)**: `@ngx-translate/core` & `@ngx-translate/http-loader` with real-time runtime language switching (English `en` default, Spanish `es` alternative).
- **Backend Mocking**: `json-server` (serving `server/db.json` on port 3000).
- **Documentation**: Standard TSDoc conventions with `@summary` and `@author` tags on all classes, interfaces, and methods.

---

## Domain-Driven Design (DDD) Layered Architecture

The solution is divided into three bounded contexts (`shared`, `cinodes`, and `topics`). Each bounded context strictly implements four primary architectural layers:

```
src/
├── environments/
│   └── environment.ts
└── app/
    ├── environments/
    │   └── environment.ts
    ├── shared/
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   └── presentation/
    │       ├── components/
    │       │   ├── toolbar/          # GitHub branding & language switcher
    │       │   └── sidenav/          # Responsive navigation drawer & layout
    │       └── views/
    │           └── page-not-found/   # Semantic 404 handler with attempted URL
    ├── cinodes/
    │   ├── domain/
    │   │   └── model/
    │   │       ├── ci-node.entity.ts
    │   │       └── repository-manifest.entity.ts
    │   ├── application/
    │   │   └── cinodes.store.ts      # Reactive Signals store & business calculations
    │   ├── infrastructure/
    │   │   ├── resources/            # DTOs (CINodeResource, RepositoryManifestResource, CreateManifestRequest)
    │   │   ├── assemblers/           # Pure mappers (CINodeAssembler, RepositoryManifestAssembler)
    │   │   └── services/             # HttpClient services (CINodesApiService, RepositoryManifestsApiService)
    │   └── presentation/
    │       ├── components/
    │       │   └── ci-node-summary-card/ # Reusable 2-column card with metrics & utilization status
    │       └── views/
    │           ├── home/             # Regional CI Nodes dashboard grid
    │           └── manifest-new/     # Reactive form with cross-field capacity validation
    └── topics/
        ├── domain/
        │   └── model/
        │       └── github-repo.entity.ts
        ├── application/
        │   └── topics.store.ts       # GitHub topics state management
        ├── infrastructure/
        │   ├── resources/            # GitHubRepoResource, GitHubSearchResponseResource
        │   ├── assemblers/           # GitHubRepoAssembler (decouples snake_case fields)
        │   └── services/             # GitHubApiService (queries public GitHub search API)
        └── presentation/
```

### Architectural Design Patterns Applied

1. **Signals Store Pattern**: Encapsulates state (`nodes`, `manifests`, `isLoading`) and exposes derived business metrics using reactive `computed()` signals.
2. **Assembler Pattern**: Pure mapping classes (`toEntityFromResource`, `toResourceFromEntity`) ensuring zero coupling between domain entities and backend transport DTOs (e.g., GitHub API's `snake_case` attributes).
3. **Resource & Request/Response Patterns**: Strict typing for incoming API payloads (`CINodeResource`, `RepositoryManifestResource`) and outbound mutations (`CreateManifestRequest`).
4. **Api / Service Pattern**: Separation of HTTP concerns within `@Injectable` infrastructure services.
5. **Cross-Field Reactive Validation Pattern**: Validates that allocated repository size (`allocatedSizeGb`) does not exceed the dynamically computed available capacity of the selected CI node.

---

## Functional Requirements & Views

### 1. Toolbar & Sidenav
- **Toolbar**: GitHub mark logo, platform title `"GitHub CI/CD Node & Repository Management Platform"`, and real-time language toggles (`EN` / `ES`). Includes accessible ARIA banner landmark (`role="banner"`).
- **Sidenav**: Navigation container routing to `/home` and `/repositories/manifests/new` with active route visual highlighting and ARIA navigation landmark (`role="navigation"`).

### 2. Home Dashboard (`/home`)
- Header with title `"Home"` and subtitle `"Advanced CI/CD Node and Open Source Repository Management Platform."`.
- Two-column card grid list (`ci-node-summary-card`) displaying:
  - **Header**: Node name and geographic datacenter location.
  - **Content**: List of allocated open-source repository manifests (`repositoryName`, `fullName`, `allocatedSizeGb`, and formatted date via `DatePipe`).
  - **Footer with Metrics**:
    - **Total Allocated Storage**: Dynamic sum of all repositories assigned to the node.
    - **Available Capacity**: Node maximum capacity minus total allocated storage.
    - **Utilization Status Indicator**:
      - `< 75%`: `"Normal"` (Green indicator)
      - `75% - 99%`: `"Warning"` (Yellow/Amber indicator)
      - `100%+`: `"Critical"` (Red indicator)

### 3. New Repository Manifest (`/repositories/manifests/new`)
- Title: `"New Repository Manifest"` / Subtitle: `"Register Open Source Repository to Regional CI/CD Node"`.
- Form Controls:
  - `topic`: `mat-select` with options (`angular`, `typescript`, `node`, `react`). Queries GitHub REST API in real time upon selection.
  - `repositoryId`: `mat-select` populated dynamically with GitHub repositories (`id`, `name`, `full_name`, `stargazers_count`).
  - `nodeId`: `mat-select` listing active CI nodes with their current available capacities.
  - `allocatedSizeGb`: Numeric input with cross-field validation against the selected node's available capacity.
- **Cross-Field Validation**: Blocks submission if `allocatedSizeGb > Available Capacity`, displaying reactive error: `"Allocated size exceeds available CI node capacity"`.
- Automatically assigns `registeredAt` with current timestamp (`new Date().toISOString()`).
- Saves via HTTP POST to `http://localhost:3000/repository-manifests`, updates store state, and navigates back to `/home`.

### 4. Page Not Found (`**`)
- Semantic 404 view displaying the exact requested URL (`router.url`), an explanatory message, and a button to return to `/home`.

---

## Installation and Execution Guide

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Fake API (json-server)
Run the simulated REST API on port `3000`:
```bash
npm run server
```
*Alternatively, from the `server/` directory:*
```bash
cd server
npx json-server --watch db.json --port 3000
```
Endpoints provided:
- CI Nodes: `http://localhost:3000/ci-nodes`
- Repository Manifests: `http://localhost:3000/repository-manifests`

### Step 3: Run the Angular Application
In a separate terminal window, launch the Angular development server:
```bash
npm start
```
*Or with Angular CLI:*
```bash
ng serve
```

Access the application in your browser at:
```
http://localhost:4200
```

### Step 4: Build for Production
```bash
npm run build
```
Build artifacts will be generated in `dist/untitled1/browser/`.

---

## Academic Integrity & Standards Checklist

- [x] Full DDD layer separation (`domain`, `application`, `infrastructure`, `presentation`).
- [x] All components are standalone (`standalone: true`).
- [x] Angular Signals for state management (`signal`, `computed`, `effect`).
- [x] Angular Material with monochromatic GitHub Dark Theme (`#0d1117`, `#161b22`, `#30363d`).
- [x] Complete i18n support with `@ngx-translate` (kebab-case keys in `en.json` and `es.json`).
- [x] GitHub REST API integration for dynamic repository discovery by topic.
- [x] Cross-field reactive form validation with dynamic capacity bounds.
- [x] Pure Assembler mapping patterns separating DTOs and entities.
- [x] Standard TSDoc documentation with `@summary` and `@author` across the entire codebase.
- [x] Accessible HTML markup with ARIA landmarks and descriptive labels.















### Fase 1: Entorno, Configuración y Fake API (La Base)

Antes de escribir código Angular, debes garantizar que las librerías, los datos simulados y los textos existan.

1. package.json:
   • Definir el nombre del proyecto (eanrcu20241e417).
   • Instalar dependencias requeridas (@angular/material, @angular/cdk, @ngx-translate/core, @ngx-translate/http-
   loader, json-server).
   • Crear el script "server": "json-server --watch server/db.json --port 3000".
2. server/db.json:
   • Crear la Fake API con los datos iniciales de ci-nodes y repository-manifests para poder probar endpoints antes
   de armar interfaces.
3. src/environments/environment.ts:
   • Definir las URLs (ciNodesApiUrl, manifestsApiUrl, githubSearchApiUrl).
4. src/assets/i18n/en.json y es.json:
   • Escribir los diccionarios con claves en estricto kebab-case (toolbar.*, ci-nodes.*, manifests.*, etc.).

──────
### Fase 2: Capa domain/ (El Núcleo del Negocio)

El dominio no depende de nadie (ni de Angular, ni de HTTP, ni de Material). Son clases TypeScript puras.

1. cinodes/domain/model/:
   • ci-node.entity.ts: Clase CINode (id, name, location, maxStorageCapacityGb).
   • repository-manifest.entity.ts: Clase RepositoryManifest (id, repositoryId, repositoryName, fullName, nodeId,
   allocatedSizeGb, registeredAt).
2. topics/domain/model/:
   • github-repo.entity.ts: Clase GitHubRepo (id, name, fullName, stargazersCount, etc.).

──────
### Fase 3: Capa infrastructure/ (Comunicación Externa y Mapeos)

Esta capa se encarga de hablar con las APIs externas (Fake API y GitHub API) y transformar sus datos hacia el
dominio.

1. Resources (DTOs / Request / Response):
   • cinodes/infrastructure/resources/ci-node.resource.ts
   • cinodes/infrastructure/resources/repository-manifest.resource.ts
   • cinodes/infrastructure/resources/create-manifest.request.ts
   • topics/infrastructure/resources/github-repo.resource.ts (con atributos snake_case como full_name)
   • topics/infrastructure/resources/github-search-response.resource.ts
2. Assemblers (Mapeadores Puros):
   • cinodes/infrastructure/assemblers/ci-node.assembler.ts
   • cinodes/infrastructure/assemblers/repository-manifest.assembler.ts
   • topics/infrastructure/assemblers/github-repo.assembler.ts (convierte snake_case a camelCase de la entidad de
   dominio)
3. Services API (HttpClient):
   • cinodes/infrastructure/services/ci-nodes-api.service.ts
   • cinodes/infrastructure/services/repository-manifests-api.service.ts
   • topics/infrastructure/services/github-api.service.ts

──────
### Fase 4: Capa application/ (Manejo de Estado con Signals)

Orquesta la lógica de negocio y mantiene el estado reactivo que consumirá la UI.

1. cinodes/application/cinodes.store.ts:
   • Signals: nodes, manifests, isLoading, errorMessage.
   • Computed: cálculos de getManifestsForNode(), getTotalAllocatedStorageForNode(), getAvailableCapacityForNode()
   y getUtilizationStatusForNode() (Normal, Warning, Critical).
   • Actions: loadAll(), createManifest().
2. topics/application/topics.store.ts:
   • Signals: repositories, selectedTopic, isLoading.
   • Actions: searchRepositories(topic).

──────
### Fase 5: Capa presentation/ (Componentes y Vistas)

Una vez que el Store y los modelos existen, la UI solo se encarga de enlazar datos y reaccionar.

1. shared/presentation/components/:
   • toolbar/ (toolbar.component.ts, .html, .css): Logo GitHub, título y switcher EN/ES con TranslateService.
   • sidenav/ (sidenav.component.ts, .html, .css): Contenedor con mat-sidenav-container y enlaces de navegación.
2. cinodes/presentation/components/:
   • ci-node-summary-card/ (ci-node-summary-card.component.ts, .html, .css): Tarjeta reutilizable con métricas
   calculadas y DatePipe.
3. cinodes/presentation/views/ (Vistas ligadas a rutas):
   • home/ (home.component.ts, .html, .css): Dashboard con grid de 2 tarjetas por fila.
   • manifest-new/ (manifest-new.component.ts, .html, .css): Formulario reactivo con la validación cruzada
   (allocatedSizeGb <= availableCapacity) y búsqueda en GitHub API.
4. shared/presentation/views/:
   • page-not-found/ (page-not-found.component.ts, .html, .css): Vista 404 que muestra la URL intentada y botón
   hacia /home.

──────
### Fase 6: Shell, Enrutamiento y Estilos Globales (El Ensamble)

1. src/app/app.routes.ts:
   • Redirección '' -> '/home', ruta /home, ruta /repositories/manifests/new y comodín '**' ->
   PageNotFoundComponent.
2. src/app/app.config.ts:
   • Registrar provideHttpClient(withFetch()), provideRouter(routes), provideAnimationsAsync() y configuración de
   @ngx-translate.
3. src/app/app.ts y app.html:
   • Shell principal que renderiza <app-sidenav></app-sidenav>.
4. src/styles.css e index.html:
   • Tipografía Roboto e íconos Material Icons.
   • Variables CSS del GitHub Dark Theme (#0d1117, #161b22, #30363d).

──────
### Fase 7: Validación, TSDoc y README.md (El Cierre Académico)

1. Verificación funcional:
   • Probar con npm run server y npm start.
   • Validar switching de idiomas (EN/ES).
   • Validar búsqueda de repositorios por topics en GitHub.
   • Validar bloqueo reactivo si el tamaño supera la capacidad del nodo.
2. Compilación estricta:
   • Ejecutar npm run build para asegurar 0 errores de TypeScript y plantillas.
3. Documentación TSDoc:
   • Revisar que cada clase, interfaz y método tenga su bloque @summary y @author Andy Alfredo Hipolito Salcedo
   Muñoz.
4. README.md:
   • Redactar en inglés el resumen arquitectónico, guía de ejecución y sección de autoría con código u20241e417.
