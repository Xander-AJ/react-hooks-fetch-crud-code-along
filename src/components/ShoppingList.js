import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import Item from "./Item";
import ItemForm from "./ItemForm";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  function fetchItems() {
    fetch("http://localhost:4000/items")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching data:", error));
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  function handleAddItem(newItem) {
    fetch("http://localhost:4000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        setItems([...items, data]);
      })
      .catch((error) => console.error("Error adding item:", error));
  }

  function handleUpdateItem(updatedItem) {
    fetch(`http://localhost:4000/items/${updatedItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedItems = items.map((item) =>
          item.id === updatedItem.id ? data : item
        );
        setItems(updatedItems);
      })
      .catch((error) => console.error("Error updating item:", error));
  }

  function handleDeleteItem(itemId) {
    fetch(`http://localhost:4000/items/${itemId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedItems = items.filter((item) => item.id !== itemId);
        setItems(updatedItems);
      })
      .catch((error) => console.error("Error deleting item:", error));
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item
            key={item.id}
            item={item}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;