'use client';

import React from 'react';

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

interface ProductCardProps {
  product: Product;
  onView: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onView, 
  onAddToCart 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getMotorColor = (motor: string) => {
    const colors = {
      'aquisicao': 'bg-blue-100 text-blue-800',
      'receita': 'bg-green-100 text-green-800',
      'operacao': 'bg-purple-100 text-purple-800',
      'retencao': 'bg-orange-100 text-orange-800',
      'orquestracao': 'bg-indigo-100 text-indigo-800'
    };
    return colors[motor as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleView = () => {
    // tracking: product_viewed
    if (typeof window !== 'undefined' && (window as { gtag?: Function }).gtag) {
      (window as { gtag: Function }).gtag('event', 'product_viewed', {
        product_id: product.id,
        product_name: product.nome,
        category: product.categoria,
        motor: product.motor,
        peca: product.peca
      });
    }
    onView(product.id);
  };

  const handleAddToCart = () => {
    // tracking: cart_added
    if (typeof window !== 'undefined' && (window as { gtag?: Function }).gtag) {
      (window as { gtag: Function }).gtag('event', 'cart_added', {
        product_id: product.id,
        product_name: product.nome,
        value: product.preco.mrr || product.preco.setup,
        currency: 'BRL'
      });
    }
    onAddToCart(product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{product.nome}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMotorColor(product.motor)}`}>
              {product.motor}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {product.peca}
            </span>
          </div>
        </div>
        <span className="text-sm text-gray-500">{product.categoria}</span>
      </div>

      {/* preço */}
      <div className="mb-4">
        {product.preco.mrr > 0 && (
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(product.preco.mrr)}/mês
          </div>
        )}
        {product.preco.setup > 0 && (
          <div className="text-sm text-gray-600">
            + {formatPrice(product.preco.setup)} setup
          </div>
        )}
        {product.preco.mrr === 0 && product.preco.setup === 0 && (
          <div className="text-lg font-semibold text-gray-900">sob consulta</div>
        )}
      </div>

      {/* duração */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">⏱️ {product.duracao}</span>
      </div>

      {/* ctas */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleView}
          className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          ver detalhes
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          adicionar
        </button>
      </div>

      {/* tracking events */}
      <div className="text-xs text-gray-500">
        <div className="font-medium mb-1">eventos de tracking:</div>
        <div className="flex flex-wrap gap-1">
          {product.trackingEvents.slice(0, 3).map((event, index) => (
            <span key={index} className="px-1 py-0.5 bg-gray-100 rounded text-xs">
              {event}
            </span>
          ))}
          {product.trackingEvents.length > 3 && (
            <span className="px-1 py-0.5 bg-gray-100 rounded text-xs">
              +{product.trackingEvents.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
