'use client';

import React, { useState, useEffect } from 'react';

interface Bundle {
  id: string;
  name: string;
  description: string;
  mrr: number;
  setup: number;
  products: string[];
  savings: number;
  upgradePath: string | null;
}

interface BundleData {
  bundles: Bundle[];
  migrationRules: {
    a_la_carte_to_bundle: { trigger: string; discount: number };
    bundle_upgrade: { trigger: string; discount: number };
  };
}

export const BundleComparison: React.FC = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBundles = async () => {
      try {
        const response = await fetch('/configs/hivefy/marketplace/bundles.json');
        const data: BundleData = await response.json();
        setBundles(data.bundles);
        setSelectedBundles([data.bundles[0].id, data.bundles[1].id]); // starter vs growth por padrão
      } catch (error) {
        console.error('erro ao carregar bundles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBundles();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleBundleSelect = (bundleId: string) => {
    setSelectedBundles(prev => {
      if (prev.includes(bundleId)) {
        return prev.filter(id => id !== bundleId);
      } else if (prev.length < 2) {
        return [...prev, bundleId];
      } else {
        return [prev[1], bundleId]; // substitui o primeiro
      }
    });

    // tracking: bundle comparison
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'bundle_compared', {
        bundle_id: bundleId,
        selected_bundles: selectedBundles
      });
    }
  };

  const handleBundleMigration = (fromBundle: string, toBundle: string) => {
    // tracking: bundle migration
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'bundle_migration', {
        from_bundle: fromBundle,
        to_bundle: toBundle,
        reason: 'comparison_page'
      });
    }
    
    console.log(`migração: ${fromBundle} → ${toBundle}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">carregando bundles...</div>
      </div>
    );
  }

  const selectedBundlesData = bundles.filter(b => selectedBundles.includes(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          comparação de bundles
        </h1>
        <p className="text-gray-600">
          economize até 50% com nossos pacotes modulares
        </p>
      </div>

      {/* seleção de bundles */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">selecione 2 bundles para comparar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bundles.map(bundle => (
            <button
              key={bundle.id}
              onClick={() => handleBundleSelect(bundle.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedBundles.includes(bundle.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-lg">{bundle.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {formatPrice(bundle.mrr)}/mês
                </div>
                {bundle.savings > 0 && (
                  <div className="text-xs text-green-600 mt-1">
                    economiza {formatPrice(bundle.savings)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* comparação */}
      {selectedBundlesData.length === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {selectedBundlesData.map((bundle, index) => (
            <div key={bundle.id} className="bg-white rounded-lg shadow-md p-6">
              {/* header do bundle */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{bundle.name}</h3>
                <p className="text-gray-600 mt-2">{bundle.description}</p>
                
                {/* preço */}
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatPrice(bundle.mrr)}/mês
                  </div>
                  {bundle.setup > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      + {formatPrice(bundle.setup)} setup
                    </div>
                  )}
                  {bundle.savings > 0 && (
                    <div className="text-sm text-green-600 mt-1">
                      💰 economiza {formatPrice(bundle.savings)}
                    </div>
                  )}
                </div>
              </div>

              {/* produtos incluídos */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  produtos incluídos ({bundle.products.length})
                </h4>
                <div className="space-y-2">
                  {bundle.products.map(productId => (
                    <div key={productId} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {productId.replace('recorrente.', '')}
                    </div>
                  ))}
                </div>
              </div>

              {/* upgrade path */}
              {bundle.upgradePath && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">próximo passo</h4>
                  <p className="text-sm text-gray-600">
                    upgrade para: <span className="font-medium">{bundle.upgradePath.replace('bundle.', '')}</span>
                  </p>
                </div>
              )}

              {/* cta */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'bundle_selected', {
                        bundle_id: bundle.id,
                        bundle_name: bundle.name,
                        value: bundle.mrr
                      });
                    }
                  }}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  escolher {bundle.name}
                </button>
                
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'bundle_demo_requested', {
                        bundle_id: bundle.id,
                        bundle_name: bundle.name
                      });
                    }
                  }}
                  className="w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  agendar demo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* migração entre bundles */}
      {selectedBundlesData.length === 2 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">migração entre bundles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleBundleMigration(selectedBundlesData[0].id, selectedBundlesData[1].id)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="text-center">
                <div className="font-medium">
                  {selectedBundlesData[0].name} → {selectedBundlesData[1].name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  upgrade com desconto
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleBundleMigration(selectedBundlesData[1].id, selectedBundlesData[0].id)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="text-center">
                <div className="font-medium">
                  {selectedBundlesData[1].name} → {selectedBundlesData[0].name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  downgrade (sem desconto)
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* regras de migração */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">regras de migração</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900">à la carte → bundle</h4>
            <p className="text-gray-600">
              quando ROI comprovado: desconto de 20%
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">upgrade de bundle</h4>
            <p className="text-gray-600">
              quando uso &gt; 80%: desconto de 10%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
