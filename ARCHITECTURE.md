# 🏗️ DECISÕES ARQUITETURAIS - Plataforma de Freelancers

**Documento:** Arquitetura Técnica v1.0  
**Última Atualização:** 16 de Julho de 2026  
**Status:** ⏳ Awaiting UI/UX Feedback

---

## 1️⃣ ARQUITETURA DE ALTO NÍVEL

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Frontend)                    │
│  React 18 + TypeScript | Tailwind CSS | Framer Motion          │
│  Browser | Desktop | (Mobile: Phase 2)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS + REST API + WebSocket
┌──────────────────────────▼──────────────────────────────────────┐
│                    API GATEWAY LAYER                            │
│  CloudFlare | Rate Limiting | Auth Validation | Routing       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                  APPLICATION SERVER LAYER                       │
│  NestJS Microservices (Containerized)                          │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │  Auth Service   │  │ Project Service │  │ Payment Service ││
│  │  (JWT + OAuth2) │  │ (CRUD + Search) │  │ (Stripe)        ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ Message Service │  │ Notification SVC│  │ Analytics SVC   ││
│  │ (Real-time)     │  │ (Email + Push)  │  │ (Events)        ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└──────────┬─────────────────┬────────────────────┬──────────────┘
           │                 │                    │
           │ ┌───────────────┼────────────────┐   │
           │ │               │                │   │
    ┌──────▼─┴──┐  ┌─────────▼─────┐  ┌──────┴───▼───┐
    │ PostgreSQL │  │ Redis Cache   │  │  S3/Storage │
    │ (OLTP)     │  │ + Sessions    │  │  + CDN      │
    └────────────┘  └───────────────┘  └─────────────┘

BACKGROUND LAYER:
    BullMQ Job Queue → Background Tasks (Email, Reports)
    Elasticsearch/Meilisearch → Full-Text Search Index
    DataDog/ELK → Logging & Monitoring
    Sentry → Error Tracking
```

---

## 2️⃣ BANCO DE DADOS - SCHEMA PRINCIPAL

### Entidades Principais:

```sql
-- Users (Unified)
users {
  id: UUID
  email: STRING (unique)
  password_hash: STRING
  role: ENUM(freelancer, client, admin)
  created_at: TIMESTAMP
  status: ENUM(active, suspended, deleted)
}

-- Freelancer Profile
freelancer_profiles {
  id: UUID
  user_id: FK(users)
  full_name: STRING
  bio: TEXT
  hourly_rate: DECIMAL
  avatar_url: STRING
  country: STRING
  skills: JSONB (array of skill objects)
  portfolio_projects: JSONB (array with links)
  total_earned: DECIMAL
  avg_rating: FLOAT (0-5)
  response_time_hours: INTEGER
  is_verified: BOOLEAN
  verification_data: JSONB
}

-- Client Profile
client_profiles {
  id: UUID
  user_id: FK(users)
  company_name: STRING
  company_size: STRING
  industry: STRING
  website: STRING
  logo_url: STRING
  total_spent: DECIMAL
  total_projects: INTEGER
  avg_rating: FLOAT
}

-- Projects
projects {
  id: UUID
  client_id: FK(client_profiles)
  title: STRING
  description: TEXT
  category: STRING
  budget_type: ENUM(fixed, hourly)
  budget_min: DECIMAL
  budget_max: DECIMAL
  deadline: TIMESTAMP
  required_skills: JSONB (array)
  attachments: JSONB (array with S3 URLs)
  status: ENUM(draft, open, in_progress, completed, archived)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
  visibility: ENUM(public, invite_only)
}

-- Proposals
proposals {
  id: UUID
  project_id: FK(projects)
  freelancer_id: FK(freelancer_profiles)
  cover_letter: TEXT
  proposed_rate: DECIMAL
  estimated_hours: INTEGER
  timeline_days: INTEGER
  status: ENUM(pending, accepted, rejected, withdrawn)
  submitted_at: TIMESTAMP
  reviewed_at: TIMESTAMP
}

-- Contracts (Active Project Engagement)
contracts {
  id: UUID
  project_id: FK(projects)
  freelancer_id: FK(freelancer_profiles)
  proposal_id: FK(proposals)
  status: ENUM(active, completed, terminated, disputed)
  total_budget: DECIMAL
  paid_amount: DECIMAL
  start_date: TIMESTAMP
  end_date: TIMESTAMP
  milestones: JSONB (array of milestone objects)
}

-- Payments & Transactions
transactions {
  id: UUID
  contract_id: FK(contracts)
  amount: DECIMAL
  type: ENUM(payment, refund, withdrawal, fee)
  status: ENUM(pending, completed, failed, disputed)
  stripe_transaction_id: STRING
  created_at: TIMESTAMP
  released_at: TIMESTAMP
  description: TEXT
}

-- Reviews & Ratings
reviews {
  id: UUID
  reviewer_id: FK(users)
  reviewed_user_id: FK(users)
  contract_id: FK(contracts)
  rating: INTEGER (1-5)
  comment: TEXT
  created_at: TIMESTAMP
}

-- Messages (Real-time Chat)
messages {
  id: UUID
  sender_id: FK(users)
  receiver_id: FK(users)
  contract_id: FK(contracts)
  content: TEXT
  attachments: JSONB (array)
  created_at: TIMESTAMP
  read_at: TIMESTAMP
}

-- Notifications
notifications {
  id: UUID
  user_id: FK(users)
  type: ENUM(message, proposal, review, payment, system)
  title: STRING
  body: TEXT
  related_id: UUID (project/proposal/contract id)
  is_read: BOOLEAN
  created_at: TIMESTAMP
}

-- Activity Log
activity_logs {
  id: UUID
  user_id: FK(users)
  action: STRING
  entity_type: STRING
  entity_id: UUID
  changes: JSONB
  ip_address: STRING
  created_at: TIMESTAMP
}
```

---

## 3️⃣ API DESIGN - REST Endpoints

### Authentication
```
POST   /api/v1/auth/register        - Create account
POST   /api/v1/auth/login           - Login (JWT)
POST   /api/v1/auth/refresh-token   - Refresh token
POST   /api/v1/auth/logout          - Logout
GET    /api/v1/auth/me              - Current user profile
POST   /api/v1/auth/oauth/google    - OAuth flow
```

### Freelancer Profile
```
GET    /api/v1/freelancers          - List freelancers (search + filters)
GET    /api/v1/freelancers/:id      - Get profile
POST   /api/v1/freelancers          - Create profile
PATCH  /api/v1/freelancers/:id      - Update profile
GET    /api/v1/freelancers/:id/portfolio - Portfolio items
POST   /api/v1/freelancers/:id/skills   - Add skill
DELETE /api/v1/freelancers/:id/skills/:skillId - Remove skill
```

### Projects
```
GET    /api/v1/projects             - List projects (search + filters)
POST   /api/v1/projects             - Create project (clients only)
GET    /api/v1/projects/:id         - Get project details
PATCH  /api/v1/projects/:id         - Update project
DELETE /api/v1/projects/:id         - Archive project
GET    /api/v1/projects/:id/proposals - Get proposals for project
```

### Proposals
```
POST   /api/v1/proposals            - Submit proposal
GET    /api/v1/proposals/:id        - Get proposal
PATCH  /api/v1/proposals/:id/accept - Accept proposal
PATCH  /api/v1/proposals/:id/reject - Reject proposal
GET    /api/v1/freelancers/:id/proposals - My proposals
```

### Contracts & Milestones
```
GET    /api/v1/contracts            - My contracts
GET    /api/v1/contracts/:id        - Contract details
POST   /api/v1/contracts/:id/milestones - Create milestone
PATCH  /api/v1/contracts/:id/milestones/:mId - Update milestone
POST   /api/v1/contracts/:id/complete-milestone - Mark complete
```

### Payments
```
GET    /api/v1/payments             - Transaction history
POST   /api/v1/payments/release     - Release payment
GET    /api/v1/earnings             - Freelancer earnings
POST   /api/v1/withdraw             - Request withdrawal
```

### Messaging (REST + WebSocket)
```
GET    /api/v1/messages/:contractId - Message history
POST   /api/v1/messages             - Send message
WS     /ws/chat/:contractId         - WebSocket connection
```

### Reviews
```
POST   /api/v1/reviews              - Leave review
GET    /api/v1/reviews/:userId      - User reviews
```

---

## 4️⃣ FLUXO DE AUTENTICAÇÃO

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /auth/login (email + pwd)
       ├────────────────────────────────────────┐
       │                                        │
       │ NestJS Auth Service                    │
       │ - Verify credentials (bcrypt)          │
       │ - Generate JWT (15min expire)          │
       │ - Generate Refresh Token (7d, httpOnly)
       │                                        │
       │ 2. Response: {accessToken, userId}    │
       └──────┬──────────────────────────────────┘
       │ 3. Store tokens (localStorage + cookies)
       ├─────────────────────────────────────┐
       │                                     │
       │ 4. All subsequent requests:         │
       │    Authorization: Bearer {JWT}      │
       │                                     │
       │ NestJS Middleware                   │
       │ - Verify JWT signature              │
       │ - Check token expiry                │
       │ - Validate user permissions         │
       │                                     │
       │ 5. If expired → Use refresh token   │
       │    POST /auth/refresh-token         │
       │                                     │
       └─────────────────────────────────────┘

OAuth2 Flow (Google):
1. Redirect to Google consent screen
2. Google returns authorization code
3. Backend exchanges code for access token
4. Upsert user in database
5. Generate our JWT
```

---

## 5️⃣ FLUXO DE ESCROW & PAGAMENTO

```
CLIENT              PLATFORM (Escrow)       FREELANCER
  │                      │                       │
  ├─ Create Project       │                       │
  │                       │                       │
  │                Freelancer Applied
  │                       ◄─────────────────────┤
  │                       │                       │
  ├─ Accept Proposal      │                       │
  │─────────────────────►│ Contract Active       │
  │                       │ Start Milestone      │
  │                       │                       │
  ├─ Release Payment ─►   │ Charge Card (Stripe) │
  │   (Stripe)            │ Hold funds in Escrow │
  │                       │                       │
  │                Freelancer Delivers Work
  │                       ◄─────────────────────┤
  │                       │                       │
  ├─ Approve Delivery ────┤                       │
  │                       │ Transfer to Freelancer Wallet
  │                       │ (minus platform fee: 10%)
  │                       ├─ Notify withdrawal   │
  │                       ├──────────────────────┤
  │                       │                       │
  │                       ├─ Freelancer withdraws
  │                       │  to bank account     │
  │                       ◄─────────────────────┤
  │                       │                       │
  │                   COMPLETE

Dispute Flow:
- If client disputes, funds held
- 14-day mediation period
- Platform review or arbitration
- Favor typically goes to whoever provides evidence
```

---

## 6️⃣ SEGURANÇA & COMPLIANCE

### Autenticação & Autorização
- ✅ JWT com RS256 (asymmetric)
- ✅ Refresh tokens armazenados em httpOnly cookies
- ✅ RBAC (Role-Based Access Control) em todas as rotas
- ✅ Rate limiting: 100 req/min por IP (Stripe: 10 req/min)
- ✅ 2FA opcional (TOTP)

### Data Protection
- ✅ Encrypting sensitive fields (SSN, payment info)
- ✅ GDPR compliance (data retention, deletion)
- ✅ PCI DSS compliance (nunca armazenar card numbers)
- ✅ HTTPS everywhere
- ✅ CORS configurado restritivamente

### Payment Security
- ✅ Stripe PCI Level 1 (nunca processamos cards directly)
- ✅ 3D Secure para pagamentos acima de US$100
- ✅ Fraud detection via Stripe Radar
- ✅ Tokenization de payments

### Monitoring & Auditing
- ✅ Activity logs (who did what when)
- ✅ Error tracking (Sentry)
- ✅ Uptime monitoring (Pingdom)
- ✅ DDoS protection (CloudFlare)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (CSP headers, sanitization)

---

## 7️⃣ PERFORMANCE & ESCALABILIDADE

### Caching Strategy
```
Layer 1: Browser Cache
  - Static assets: 365 days
  - API responses: 5min - 1hour
  
Layer 2: CDN (CloudFlare)
  - Static content cache
  - Image optimization
  
Layer 3: Redis Cache (Application)
  - Sessions: 24h
  - User profiles: 1h
  - Project listings: 5min
  - Search indexes: 30min
  - Rate limit counters: 1min
  
Layer 4: Database Query Cache
  - Materialized views for aggregations
  - Indexed columns on hot queries
```

### Database Optimization
```
PRIMARY INDEXES:
- users(email) - Fast login
- projects(client_id, status) - Client projects
- proposals(project_id, status) - Project proposals
- messages(sender_id, created_at) - Message history
- reviews(reviewed_user_id) - User ratings

PARTITIONING (if scale > 1M rows):
- transactions: by date (monthly)
- activity_logs: by date (monthly)
```

### API Optimization
```
Response Compression: gzip/brotli (90% reduction)
Pagination: cursor-based, 20-50 items/page
Lazy Loading: images, infinite scroll
GraphQL (optional phase 2): if n+1 queries become issue
```

### Load Testing Targets
```
✅ 1,000 concurrent users
✅ 10,000 requests/second (p95 response: <500ms)
✅ 99% uptime SLA
✅ Horizontal scaling: add servers, no downtime
```

---

## 8️⃣ MONITORAMENTO & OBSERVABILIDADE

### Métricas Críticas
```
Application Level:
- Request latency (p50, p95, p99)
- Error rate (5xx responses)
- 404 rate (broken links)
- JWT validation failures

Business Level:
- Projects created per day
- Proposals accepted rate
- Avg time to first proposal
- Revenue per project
- Freelancer utilization rate

Infrastructure Level:
- CPU usage (alert > 80%)
- Memory usage (alert > 85%)
- Disk space (alert > 90%)
- Database connection pool saturation
- Redis memory usage
```

### Alerting Rules
```
🔴 CRITICAL:
- Application down (health check fails)
- Error rate > 5%
- Response time p95 > 2000ms
- Database connection pool exhausted

🟡 WARNING:
- Response time p95 > 1000ms
- Error rate > 1%
- CPU > 80% for 5 minutes
```

---

## 9️⃣ DECISÕES PENDENTES - FEEDBACK NECESSÁRIO (Agent UI/UX)

### Design System Questions
- [ ] Cor primária? (recommend: #3B82F6 - Blue)
- [ ] Cor secundária? (recommend: #10B981 - Emerald)
- [ ] Fonte principal? (recommend: Inter)
- [ ] Dark mode support necessário?
- [ ] Animações esperadas? (recomendação: subtle, <300ms)

### UX Flow Priorities
- [ ] Qual persona critical path é mais importante?
  - Option A: Freelancer discovery → proposal → contract
  - Option B: Client posting → hiring → project execution
- [ ] Mobile responsiveness v1 ou v2?
- [ ] Acessibilidade (WCAG 2.1 AA) é mandatory?

### Component Library
- [ ] Usar Shadcn/ui ou custom components?
- [ ] Iconography system? (recommend: Heroicons ou Feather)

---

## 🔟 PRÓXIMAS AÇÕES CRÍTICAS

### Hoje (16 de Julho):
- [ ] ✅ Este documento criado
- [ ] ⏳ Enviado para revisão

### Amanhã (17 de Julho):
- [ ] Design System review com Agent UI/UX
- [ ] Tech stack approval
- [ ] Feedback loop integração

### Próxima Semana:
- [ ] Wireframes de 5 user journeys críticas
- [ ] Database schema inicial
- [ ] Repository setup (monorepo vs polyrepo decision)

---

**Pronto para fase de Design & Arquitetura!** 🚀  
**Aguardando aprovação e feedback do Agent UI/UX**
