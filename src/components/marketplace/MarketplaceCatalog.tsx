'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  nome: string;
  categoria: string;
  motor: string;
  peca: string;
  preco: { mrr: number; setup: number };
  duracao: string;
  ctas: string[];
  trackingEvents: string[];
}

interface CatalogData {
  products: Product[];
}

export const MarketplaceCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    categoria: '',
    motor: '',
    peca: '',
    precoMax: 100000
  });
  const [loading, setLoading] = useState(true);

  // carregar catálogo
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetch('/configs/hivefy/marketplace/catalog.json');
        const data: CatalogData = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error('erro ao carregar catálogo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  // aplicar filtros
  useEffect(() => {
    let filtered = products;

    if (filters.categoria) {
      filtered = filtered.filter(p => p.categoria === filters.categoria);
    }
    if (filters.motor) {
      filtered = filtered.filter(p => p.motor === filters.motor);
    }
    if (filters.peca) {
      filtered = filtered.filter(p => p.peca === filters.peca);
    }
    if (filters.precoMax > 0) {
      filtered = filtered.filter(p => 
        (p.preco.mrr > 0 && p.preco.mrr <= filters.precoMax) ||
        (p.preco.setup > 0 && p.preco.setup <= filters.precoMax)
      );
    }

    setFilteredProducts(filtered);

    // tracking: filtros aplicados
    if (typeof window !== 'undefined' && (window as { gtag?: Function }).gtag) {
      (window as { gtag: Function }).gtag('event', 'catalog_filtered', {
        categoria: filters.categoria,
        motor: filters.motor,
        peca: filters.peca,
        preco_max: filters.precoMax,
        results_count: filtered.length
      });
    }
  }, [products, filters]);

  // obter opções únicas para filtros
  const categorias = [...new Set(products.map(p => p.categoria))];
  const motores = [...new Set(products.map(p => p.motor))];
  const pecas = [...new Set(products.map(p => p.peca))];

  const handleProductView = (productId: string) => {
    console.log('visualizando produto:', productId);
    // navegar para página de detalhes
  };

  const handleAddToCart = (productId: string) => {
    console.log('adicionando ao carrinho:', productId);
    // adicionar ao carrinho
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">carregando catálogo...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          marketplace hivefy
        </h1>
        <p className="text-gray-600">
          {products.length} produtos modulares • 5 motores × 7 peças
        </p>
      </div>

      {/* filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              categoria
            </label>
            <select
              value={filters.categoria}
              onChange={(e) => setFilters({...filters, categoria: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">todas</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* motor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              motor
            </label>
            <select
              value={filters.motor}
              onChange={(e) => setFilters({...filters, motor: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">todos</option>
              {motores.map(motor => (
                <option key={motor} value={motor}>{motor}</option>
              ))}
            </select>
          </div>

          {/* peça */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              peça
            </label>
            <select
              value={filters.peca}
              onChange={(e) => setFilters({...filters, peca: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">todas</option>
              {pecas.map(peca => (
                <option key={peca} value={peca}>{peca}</option>
              ))}
            </select>
          </div>

          {/* preço máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              preço máximo (R$)
            </label>
            <input
              type="number"
              value={filters.precoMax}
              onChange={(e) => setFilters({...filters, precoMax: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100000"
            />
          </div>
        </div>

        {/* limpar filtros */}
        <div className="mt-4">
          <button
            onClick={() => setFilters({categoria: '', motor: '', peca: '', precoMax: 100000})}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            limpar filtros
          </button>
        </div>
      </div>

      {/* resultados */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredProducts.length} produtos encontrados
        </p>
      </div>

      {/* grid de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onView={handleProductView}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            nenhum produto encontrado com os filtros aplicados
          </div>
          <button
            onClick={() => setFilters({categoria: '', motor: '', peca: '', precoMax: 100000})}
            className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};
