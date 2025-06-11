import React from 'react';
import Card from '../components/cards.jsx'; // Adjust the import path as necessary

const bestsellers = [
  {
    id: 1,
    imageSrc: 'https://via.placeholder.com/320',
    altText: 'Product 1',
    tags: [{ label: 'New', bgColorClass: 'bg-green-500' }],
    title: 'Awesome Product 1',
    oldPrice: 50,
    price: 35,
  },
  {
    id: 2,
    imageSrc: 'https://via.placeholder.com/320',
    altText: 'Product 2',
    tags: [{ label: 'Sale', bgColorClass: 'bg-red-500' }],
    title: 'Awesome Product 2',
    oldPrice: 80,
    price: 60,
  },
  {
    id: 3,
    imageSrc: 'https://via.placeholder.com/320',
    altText: 'Product 3',
    tags: [],
    title: 'Awesome Product 3',
    oldPrice: null,
    price: 45,
  },
];

const BestView = () => {
  return (
    <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {bestsellers.map(product => (
        <Card
          key={product.id}
          imageSrc={product.imageSrc}
          altText={product.altText}
          tags={product.tags}
          title={product.title}
          oldPrice={product.oldPrice}
          price={product.price}
        />
      ))}
    </div>
  );
};

export default BestView;
