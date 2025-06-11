import React, { useEffect, useState } from "react";
import Card from "../components/cards.jsx";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.escuelajs.co/api/v1/products")
      .then((res) => {
        const validProducts = res.data.filter(
          (product) => product.images && product.images.length > 0
        );
        setProducts(validProducts.slice(0, 12)); // Show 12 products
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {products.map((product) => (
        <Card
          key={product.id}
          imageSrc={product.images[0]}
          altText={product.title}
          title={product.title}
          price={product.price}
          oldPrice={Math.round(product.price * 1.2)}
          tags={[
            {
              label: product.category?.name || "tag",
              bgColorClass: "bg-indigo-500",
            },
          ]}
        />
      ))}
    </div>
  );
};

export default ProductList;
