import React, { useState } from "react";
import toast from "react-hot-toast";

const CATEGORIES = ["Vêtements", "Chaussures", "Accessoires", "Beauté", "Épicerie Fine"];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Robe Midi Fleurie", boutique: "Sandro Paris", category: "Vêtements", price: 490, stock: 22, active: true },
  { id: 2, name: "Trench Camel", boutique: "Sandro Paris", category: "Vêtements", price: 890, stock: 5, active: true },
  { id: 3, name: "Sac Cuir Camel", boutique: "AMI Paris", category: "Accessoires", price: 890, stock: 8, active: true },
  { id: 4, name: "Sneakers Cuir Blanc", boutique: "Isabel Marant", category: "Chaussures", price: 450, stock: 14, active: true },
  { id: 5, name: "Parfum Oud 50ml", boutique: "By Terry", category: "Beauté", price: 280, stock: 20, active: true },
  { id: 6, name: "Mules Dorées", boutique: "Isabel Marant", category: "Chaussures", price: 380, stock: 0, active: false },
];

export default function Produits() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const toggleProduct = (id) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
    toast.success("Visibilité mise à jour");
  };

  const filtered = products
    .filter((p) => filterCat === "all" || p.category === filterCat)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.boutique.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px" }}>Catalogue Global</h1>
          <p style={{ color: "var(--gray)", fontSize: "14px" }}>{products.length} produits sur la plateforme</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input className="input-field" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: "220px", marginBottom: 0 }} />
        {["Tous", ...CATEGORIES].map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat === "Tous" ? "all" : cat)}
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", background: filterCat === (cat === "Tous" ? "all" : cat) ? "var(--noir)" : "#fff", color: filterCat === (cat === "Tous" ? "all" : cat) ? "#fff" : "var(--gray)", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>PRODUIT</th><th>BOUTIQUE</th><th>CATÉGORIE</th><th>PRIX</th><th>STOCK</th><th>VISIBLE</th></tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ opacity: p.active ? 1 : 0.5 }}>
                <td style={{ fontWeight: "700" }}>{p.name}</td>
                <td style={{ fontSize: "13px", color: "var(--gray)" }}>{p.boutique}</td>
                <td><span className="badge badge-gray">{p.category}</span></td>
                <td style={{ fontWeight: "700" }}>{p.price} €</td>
                <td style={{ fontWeight: "700", color: p.stock === 0 ? "var(--error)" : p.stock < 5 ? "var(--warning)" : "var(--success)" }}>
                  {p.stock === 0 ? "Rupture" : `${p.stock} pcs`}
                </td>
                <td>
                  <div onClick={() => toggleProduct(p.id)} style={{ width: "40px", height: "22px", borderRadius: "11px", background: p.active ? "var(--success)" : "#ccc", position: "relative", transition: "var(--transition)", cursor: "pointer" }}>
                    <div style={{ position: "absolute", top: "3px", left: p.active ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "var(--transition)" }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
