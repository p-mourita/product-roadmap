// src/App.tsx
import React, { useState } from "react";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

type Product = {
  id: string;
  name: string;
};

type RoadmapItem = {
  id: string;
  title: string;
  productId: string;
  year: number;
  quarter: Quarter;
};

const PRODUCTS: Product[] = [
  { id: "prod-1", name: "Core Platform" },
  { id: "prod-2", name: "Mobile App" },
  { id: "prod-3", name: "Admin Console" },
];

const SEED_ITEMS: RoadmapItem[] = [
  {
    id: "item-1",
    title: "Unified backlog governance",
    productId: "prod-1",
    year: new Date().getFullYear(),
    quarter: "Q1",
  },
  {
    id: "item-2",
    title: "New onboarding flow",
    productId: "prod-2",
    year: new Date().getFullYear(),
    quarter: "Q2",
  },
  {
    id: "item-3",
    title: "Usage analytics v2",
    productId: "prod-3",
    year: new Date().getFullYear(),
    quarter: "Q3",
  },
  {
    id: "item-4",
    title: "Enterprise SSO",
    productId: "prod-1",
    year: new Date().getFullYear() + 1,
    quarter: "Q1",
  },
];

const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

function App() {
  const currentYear = new Date().getFullYear();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    PRODUCTS[0].id
  );
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [items, setItems] = useState<RoadmapItem[]>(SEED_ITEMS);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const filteredItems = items.filter(
    (item) =>
      item.productId === selectedProductId && item.year === selectedYear
  );

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDropOnQuarter = (quarter: Quarter) => {
    if (!draggingId) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === draggingId
          ? { ...item, quarter, year: selectedYear, productId: selectedProductId }
          : item
      )
    );
    setDraggingId(null);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const addNewItem = () => {
    const title = window.prompt("Roadmap item title:");
    if (!title) return;
    const newItem: RoadmapItem = {
      id: `item-${Date.now()}`,
      title,
      productId: selectedProductId,
      year: selectedYear,
      quarter: "Q1",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const changeYear = (delta: number) => {
    setSelectedYear((prev) => prev + delta);
  };

  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId);

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Product Roadmap HQ</h1>
        <p className="app-subtitle">
          Drag & drop roadmap items across quarters. Switch products and years
          in one click.
        </p>
      </header>

      <section className="controls-bar">
        <div className="control-group">
          <label className="control-label">Product</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="control-select"
          >
            {PRODUCTS.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">Year</label>
          <div className="year-selector">
            <button
              className="year-btn"
              onClick={() => changeYear(-1)}
              aria-label="Previous year"
            >
              ◀
            </button>
            <span className="year-value">{selectedYear}</span>
            <button
              className="year-btn"
              onClick={() => changeYear(1)}
              aria-label="Next year"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="control-group">
          <button className="primary-btn" onClick={addNewItem}>
            + New Item
          </button>
        </div>
      </section>

      <section className="summary-bar">
        <span>
          Viewing roadmap for{" "}
          <strong>{currentProduct?.name ?? "Unknown product"}</strong> –{" "}
          <strong>{selectedYear}</strong>
        </span>
        <span>
          Total items: <strong>{filteredItems.length}</strong>
        </span>
      </section>

      <main className="board">
        {quarters.map((q) => {
          const columnItems = filteredItems.filter(
            (item) => item.quarter === q
          );
          return (
            <div
              key={q}
              className="column"
              onDragOver={handleDragOver}
              onDrop={() => handleDropOnQuarter(q)}
            >
              <div className="column-header">
                <span className="column-title">{q}</span>
                <span className="column-count">{columnItems.length}</span>
              </div>
              <div className="column-body">
                {columnItems.length === 0 && (
                  <div className="column-empty">
                    Drop items here for {q} {selectedYear}
                  </div>
                )}
                {columnItems.map((item) => (
                  <div
                    key={item.id}
                    className={
                      "card" + (draggingId === item.id ? " card-dragging" : "")
                    }
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                  >
                    <div className="card-title">{item.title}</div>
                    <div className="card-meta">
                      {item.productId === selectedProductId && (
                        <span className="card-tag">#{item.id}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;
