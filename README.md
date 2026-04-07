# Fournisseur Service — Microservices Project

## Architecture

```
┌─────────────────┐       ┌──────────────────────┐       ┌───────────┐
│  Angular 18     │──────▶│  Spring Boot 3.2.5   │──────▶│  MySQL 8  │
│  (port 4200)    │  HTTP │  (port 8082)          │  JPA  │  (3306)   │
│  Frontend SPA   │       │  fournisseur-service  │       │           │
└─────────────────┘       └──────────────────────┘       └───────────┘
```

### Services présents
| Service | Technologie | Port | Rôle |
|---------|-------------|------|------|
| **fournisseur-service** | Spring Boot 3.2.5 / Java 17 | 8082 | API REST CRUD fournisseurs |
| **fournisseur-frontend** | Angular 18 / Material / Tailwind | 4200 | Interface utilisateur |

### Services référencés mais non inclus
- **Eureka Server** (port 8761) — Service Discovery (désactivé par défaut)
- **API Gateway** — Non présent
- **Auth/User Service** (port 3000) — Backend Node.js d'authentification (non présent)

---

## Prérequis

| Outil | Version | Installation |
|-------|---------|-------------|
| Java JDK | 17 | [Adoptium](https://adoptium.net/) |
| MySQL | 8.0+ | [MySQL Downloads](https://dev.mysql.com/downloads/) |
| Node.js | 18+ | [Node.js](https://nodejs.org/) |
| IntelliJ IDEA | 2023+ | [JetBrains](https://www.jetbrains.com/idea/) |

> Maven est inclus via le wrapper (`mvnw`), pas besoin de l'installer.

---

## Configuration

### 1. Base de données MySQL

```sql
mysql -u root -p

CREATE DATABASE IF NOT EXISTS fournisseur_db;
```

### 2. Configuration backend

Fichier : `src/main/resources/application.properties`

```properties
# Adapter si nécessaire :
spring.datasource.username=root
spring.datasource.password=          # <-- votre mot de passe MySQL ici
```

---

## Démarrage

### Ordre de lancement
1. **MySQL** (doit être en cours d'exécution)
2. **Backend** Spring Boot
3. **Frontend** Angular

### Backend (Spring Boot)

```bash
cd /Users/azizdouagi/Documents/esprit/microS

# Compiler
./mvnw clean compile -DskipTests

# Lancer
./mvnw spring-boot:run
```

Vérification : `http://localhost:8082/fournisseurs` → `[]`

### Frontend (Angular)

```bash
cd fournisseur-frontend

# Installer les dépendances (première fois uniquement)
npm install

# Lancer
npx ng serve
```

Vérification : `http://localhost:4200` → Interface fournisseurs

---

## IntelliJ IDEA — Guide de configuration

1. **File → Open** → sélectionner le dossier `microS`
2. IntelliJ détecte le `pom.xml` → cliquer **"Trust Project"**
3. **File → Project Structure → Project** → SDK = **Java 17**, Language level = **17**
4. Panneau Maven (droite) → cliquer **🔄 Reload All Maven Projects**
5. Ouvrir `FournisseurServiceApplication.java` → clic droit → **Run**
6. Terminal intégré : `cd fournisseur-frontend && npm install && npx ng serve`

---

## Endpoints API

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/fournisseurs` | Lister tous les fournisseurs |
| GET | `/fournisseurs/{id}` | Obtenir un fournisseur par ID |
| POST | `/fournisseurs` | Créer un fournisseur |
| PUT | `/fournisseurs/{id}` | Modifier un fournisseur |
| DELETE | `/fournisseurs/{id}` | Supprimer un fournisseur |
| GET | `/actuator/health` | Vérifier l'état du service |

### Exemple de création

```bash
curl -X POST http://localhost:8082/fournisseurs \
  -H "Content-Type: application/json" \
  -d '{"nom":"Fournisseur Test","email":"test@email.com","telephone":"12345678","adresse":"Tunis"}'
```

---

## Routes Frontend

| Route | Composant | Description |
|-------|-----------|-------------|
| `/fournisseurs` | FournisseurListComponent | Liste des fournisseurs |
| `/add` | FournisseurFormComponent | Ajouter un fournisseur |
| `/edit/:id` | FournisseurFormComponent | Modifier un fournisseur |
| `/login` | LoginComponent | Page de connexion* |
| `/register` | RegisterComponent | Page d'inscription* |
| `/admin` | AdminDashboardComponent | Dashboard admin* |
| `/users` | UserListComponent | Gestion utilisateurs* |

> *Ces pages nécessitent un backend d'authentification sur `localhost:3000` (non inclus).

---

## Problèmes fréquents et solutions

### Le backend ne démarre pas

| Problème | Solution |
|----------|----------|
| `Communications link failure` | Vérifier que MySQL est en cours d'exécution |
| `Access denied for user 'root'` | Vérifier le mot de passe dans `application.properties` |
| `Unknown database 'fournisseur_db'` | Exécuter `CREATE DATABASE fournisseur_db;` |
| Port 8082 déjà utilisé | `lsof -i :8082` puis `kill -9 <PID>` |

### Le frontend ne démarre pas

| Problème | Solution |
|----------|----------|
| `ng: command not found` | Utiliser `npx ng serve` au lieu de `ng serve` |
| Erreurs de compilation TS | Exécuter `npm install` puis réessayer |
| Port 4200 occupé | `npx ng serve --port 4201` |

### IntelliJ

| Problème | Solution |
|----------|----------|
| Imports non résolus | Maven → Reload All Maven Projects |
| JDK non trouvé | File → Project Structure → SDK → Add JDK 17 |
| Lombok non reconnu | Settings → Plugins → installer "Lombok" + activer Annotation Processing |
| `.mvnw` permission denied | Terminal : `chmod +x mvnw` |

---

## Stack technique

- **Backend** : Java 17, Spring Boot 3.2.5, Spring Data JPA, Hibernate, Lombok
- **Base de données** : MySQL 8, Hibernate DDL auto-update
- **Frontend** : Angular 18, Angular Material, Tailwind CSS, RxJS
- **Build** : Maven 3.9 (wrapper), npm
