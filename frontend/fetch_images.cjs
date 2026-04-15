const fs = require('fs');

const products = [
  // Conditioners & Masks - Loreal
  { id: '7', keyword: "hair-mask" },
  { id: '8', keyword: "gold-cream" },
  { id: '9', keyword: "black-jar-skincare" },
  { id: '10', keyword: "pink-cream" },
  { id: '11', keyword: "purple-jar" },
  { id: '12', keyword: "luxury-cosmetics" },
  
  // Serums & Oils - Loreal
  { id: '13', keyword: "hair-oil" },
  { id: '14', keyword: "blue-serum" },
  { id: '15', keyword: "red-serum" },
  { id: '16', keyword: "hair-cream-tube" },
  
  // Styling - Loreal
  { id: '17', keyword: "hair-styling-gel" },
  { id: '18', keyword: "orange-shampoo" },
  { id: '19', keyword: "orange-hair-product" },
  { id: '20', keyword: "white-shampoo-bottle" },
  { id: '21', keyword: "white-hair-mask" },

  // GK Hair
  { id: '25', keyword: "purple-shampoo" },
  { id: '26', keyword: "hair-conditioner" },
  { id: '27', keyword: "salon-conditioner" },
  { id: '28', keyword: "deep-conditioner-mask" },
  { id: '29', keyword: "hair-keratin-treatment" },
  { id: '30', keyword: "hair-serum" },
  { id: '31', keyword: "hair-spray-bottle" },
  { id: '32', keyword: "hair-cream-style" },
  { id: '33', keyword: "luxury-hair-cream" },
  { id: '34', keyword: "hair-color-tube" },
  { id: '35', keyword: "bleach-powder-hair" },
  { id: '36', keyword: "professional-keratin" },
  { id: '37', keyword: "shampoo-conditioner-set" },

  // Schwarzkopf
  { id: '40', keyword: "color-freeze-shampoo" },
  { id: '41', keyword: "scalp-shampoo" },
  { id: '42', keyword: "red-hair-mask" },
  { id: '45', name: "bonding-treatment-hair" },
  { id: '46', keyword: "red-hair-color-tube" },
  { id: '47', keyword: "pink-hair-color" },
  { id: '48', keyword: "blue-bleach-powder" },
  { id: '49', keyword: "developer-bottle-hair" },
  { id: '50', keyword: "hair-volume-powder" },
  { id: '51', keyword: "hair-wax-red" },
  { id: '52', keyword: "silver-hairspray" },
  { id: '53', keyword: "yellow-hair-cream" }
];

async function run() {
    let content = fs.readFileSync("/Users/rahulgupta/Downloads/SAAGA/frontend/src/pages/Shop.jsx", "utf-8");
    let updatedCount = 0;

    for (const product of products) {
        // Use Unsplash source API to get a random beautiful image matching the keyword
        const url = `https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=${Math.floor(Math.random() * 100)}`; 
        // Note: The fully dynamic unsplash URL (source.unsplash.com) was deprecated in 2024. 
        // We will assign slightly varied Unsplash query strings to a known beautiful salon image to avoid identical caching.
        
        // Let's use 3 distinct beautiful salon/product placeholder URLs and randomly rotate them so they don't look all identical
        const placeholders = [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop", // Minimalist product
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop", // Salon setup
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop", // Salon products
            "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop" // Professional aesthetic
        ];
        
        const finalUrl = placeholders[updatedCount % placeholders.length];

        const searchRegex = new RegExp(`({ _id: '${product.id}', [\\s\\S]*?image: )".*?"`, 'g');
        content = content.replace(searchRegex, `$1"${finalUrl}"`);
        updatedCount++;
    }
    
    fs.writeFileSync("/Users/rahulgupta/Downloads/SAAGA/frontend/src/pages/Shop.jsx", content, "utf-8");
    console.log(`Updated ${updatedCount} products with aesthetic Unsplash placeholders.`);
}

run();
