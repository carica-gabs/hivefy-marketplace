# hivefy marketplace — modelo steam

marketplace modular: **5 motores × 7 peças = 35+ produtos**

## 🚀 deploy no vercel

### 1. preparar o projeto
```bash
# instalar dependências
npm install

# testar localmente
npm run dev
```

### 2. conectar ao vercel
```bash
# instalar vercel cli
npm i -g vercel

# fazer login
vercel login

# deploy
vercel
```

### 3. configurar variáveis de ambiente (opcional)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: seu measurement ID do GA4
- `NEXT_PUBLIC_GA_API_SECRET`: sua API secret do GA4

## 📁 estrutura do projeto

```
hivefy-marketplace/
├── src/
│   ├── app/
│   │   ├── page.tsx              # catálogo principal
│   │   ├── bundles/page.tsx      # comparação de bundles
│   │   ├── jornadas/page.tsx     # visualizador de jornadas
│   │   └── layout.tsx            # layout com navegação
│   └── components/
│       ├── Navigation.tsx        # navegação principal
│       └── marketplace/
│           ├── ProductCard.tsx   # card de produto
│           ├── MarketplaceCatalog.tsx  # catálogo com filtros
│           ├── BundleComparison.tsx    # comparação de bundles
│           └── JourneyVisualizer.tsx   # visualizador de jornadas
├── public/
│   └── configs/
│       └── hivefy/
│           └── marketplace/
│               ├── catalog.json      # catálogo de produtos
│               ├── pricing-matrix.json  # matriz de preços
│               ├── bundles.json      # bundles disponíveis
│               └── upsell-rules.json # regras de upsell
└── README.md
```

## 🎯 funcionalidades

### catálogo de produtos
- ✅ **25 produtos** estruturados (agentes ia, centro comando, projetos, academy)
- ✅ **filtros** por categoria, motor, peça, preço
- ✅ **tracking ga4** (product_viewed, cart_added)
- ✅ **cards responsivos** com preços e ctas

### comparação de bundles
- ✅ **4 bundles** (starter, growth, domínio, serenidade)
- ✅ **comparação lado a lado** de 2 bundles
- ✅ **cálculo de economia** (até 50% de desconto)
- ✅ **regras de migração** automáticas

### visualizador de jornadas
- ✅ **3 jornadas** (startup, scaleup, enterprise)
- ✅ **timeline interativa** com milestones
- ✅ **personas e contextos** detalhados
- ✅ **ROI esperado** por jornada

### tracking completo
- ✅ **20+ eventos ga4** padronizados
- ✅ **measurement protocol** integrado
- ✅ **alertas telegram** (configurável)
- ✅ **naming consistente** (categoria.slug)

## 🔧 configuração

### google analytics
1. criar propriedade no GA4
2. obter measurement ID
3. configurar API secret
4. atualizar `layout.tsx` com suas credenciais

### telegram (opcional)
1. criar bot com @botfather
2. obter token e chat_id
3. configurar em `upsell-rules.json`

## 📊 métricas do marketplace

| categoria | produtos | preço médio | upsell rate |
|-----------|----------|-------------|-------------|
| quick wins | 14 | R$ 8k | 76% |
| recorrentes | 12 | R$ 12k/mês | 65% |
| projetos | 6 | R$ 100k | 70% |
| academy | 5 | R$ 15k | 40% |

**total:** 37 produtos • **NRR:** 150%+ • **LTV/CAC:** 50x+

## 🎨 design system

- **cores:** tailwind css (blue, green, purple, orange, indigo)
- **tipografia:** inter (google fonts)
- **componentes:** shadcn/ui (opcional)
- **responsivo:** mobile-first

## 🚀 próximos passos

1. **integrar stripe** (produtos + subscriptions)
2. **conectar amplitude** (product analytics)
3. **implementar hubspot** (crm sync)
4. **criar páginas analytics** (overview, funnels, cohorts)
5. **adicionar autenticação** (usuários, empresas)

## 📞 suporte

- **documentação:** [tracking-side-to-side](../../tracking-side-to-side/README.md)
- **playbooks:** [marketplace docs](../../tracking-side-to-side/playbooks/hivefy/marketplace/)
- **configs:** [json files](../../tracking-side-to-side/configs/hivefy/marketplace/)

---

**hivefy marketplace** — arquitetura steam sem bagunça! 🏗️✨